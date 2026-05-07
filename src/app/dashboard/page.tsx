import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/')
  if (!profile.relation_type && !profile.partner_id) redirect('/onboarding')

  let partner = null
  if (profile.partner_id) {
    const { data } = await supabase.from('profiles').select('*').eq('id', profile.partner_id).single()
    partner = data
  }

  // 점수 계산
  const managedUserId = profile.is_admin ? profile.partner_id : user.id
  let currentScore = profile.system_type === 'score_decrease' ? 100 : 0

  if (managedUserId) {
    const { data: records } = await supabase.from('records').select('amount').eq('to_user_id', managedUserId)
    const total = (records ?? []).reduce((s: number, r: { amount: number }) => s + r.amount, 0)
    currentScore = profile.system_type === 'score_decrease' ? 100 + total : total
  }

  const { data: recentRecords } = await supabase
    .from('records')
    .select(`*, from_user:profiles!records_from_user_id_fkey(id, nickname), to_user:profiles!records_to_user_id_fkey(id, nickname)`)
    .or(profile.partner_id ? `from_user_id.eq.${user.id},to_user_id.eq.${user.id}` : `from_user_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <DashboardClient
      profile={profile}
      partner={partner}
      currentScore={currentScore}
      recentRecords={recentRecords ?? []}
    />
  )
}
