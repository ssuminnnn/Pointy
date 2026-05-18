import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/')
  if (!profile.relation_type && !profile.partner_id && !profile.group_id) redirect('/onboarding')

  const systemType = profile.system_type ?? 'score_increase'
  const isDecreasing = systemType === 'score_decrease'

  // 그룹 멤버 가져오기
  let otherMembers: any[] = []
  if (profile.group_id) {
    const { data } = await supabase
      .from('profiles').select('*')
      .eq('group_id', profile.group_id)
      .neq('id', user.id)
    otherMembers = data ?? []
  } else if (profile.partner_id) {
    const { data } = await supabase.from('profiles').select('*').eq('id', profile.partner_id).single()
    if (data) otherMembers = [data]
  }

  const allMembers = [profile, ...otherMembers]

  // 각 멤버 점수 계산
  const memberScores = await Promise.all(allMembers.map(async (member) => {
    const { data: recs } = await supabase.from('records').select('amount').eq('to_user_id', member.id)
    const total = (recs ?? []).reduce((s: number, r: { amount: number }) => s + r.amount, 0)
    const score = isDecreasing ? 100 + total : total
    return { ...member, score }
  }))

  // 최근 기록
  const { data: recentRecords } = await supabase
    .from('records')
    .select(`*, from_user:profiles!records_from_user_id_fkey(id, nickname), to_user:profiles!records_to_user_id_fkey(id, nickname)`)
    .in('to_user_id', allMembers.map(m => m.id))
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <DashboardClient
      profile={profile}
      memberScores={memberScores}
      systemType={systemType}
      recentRecords={recentRecords ?? []}
    />
  )
}
