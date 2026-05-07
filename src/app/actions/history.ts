'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function getHistory(page = 1, limit = 20) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('partner_id')
    .eq('id', user.id)
    .single()

  if (!profile?.partner_id) return { records: [], total: 0 }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await supabase
    .from('records')
    .select(`
      *,
      from_user:profiles!records_from_user_id_fkey(id, nickname),
      to_user:profiles!records_to_user_id_fkey(id, nickname)
    `, { count: 'exact' })
    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) return { records: [], total: 0 }

  return { records: data ?? [], total: count ?? 0 }
}

export async function getDashboardData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  // 온보딩 미완료
  if (!profile.relation_type) redirect('/onboarding')

  // 파트너 미연결
  if (!profile.partner_id) redirect('/connect')

  const { data: partner } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profile.partner_id)
    .single()

  // 점수 계산 대상: 관리자가 아닌 쪽 (피관리자)
  const managedUserId = profile.is_admin ? profile.partner_id : user.id

  const { data: records } = await supabase
    .from('records')
    .select('amount')
    .eq('to_user_id', managedUserId)

  const total = (records ?? []).reduce((sum, r) => sum + r.amount, 0)
  const currentScore = profile.system_type === 'score_decrease' ? 100 + total : total

  const { data: recentRecords } = await supabase
    .from('records')
    .select(`
      *,
      from_user:profiles!records_from_user_id_fkey(id, nickname),
      to_user:profiles!records_to_user_id_fkey(id, nickname)
    `)
    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    profile,
    partner,
    currentScore,
    recentRecords: recentRecords ?? [],
  }
}
