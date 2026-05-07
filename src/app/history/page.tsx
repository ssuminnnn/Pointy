import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import HistoryClient from './HistoryClient'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/')

  const { data: records } = await supabase
    .from('records')
    .select(`*, from_user:profiles!records_from_user_id_fkey(id, nickname), to_user:profiles!records_to_user_id_fkey(id, nickname)`)
    .or(profile.partner_id ? `from_user_id.eq.${user.id},to_user_id.eq.${user.id}` : `from_user_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(50)

  return <HistoryClient records={records ?? []} systemType={profile.system_type ?? 'score_increase'} />
}
