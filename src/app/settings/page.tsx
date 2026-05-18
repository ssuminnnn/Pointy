import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/')

  // 그룹 멤버 가져오기
  let groupMembers: any[] = []
  if (profile.group_id) {
    const { data } = await supabase
      .from('profiles').select('*')
      .eq('group_id', profile.group_id)
      .neq('id', user.id)
    groupMembers = data ?? []
  } else if (profile.partner_id) {
    const { data } = await supabase.from('profiles').select('*').eq('id', profile.partner_id).single()
    if (data) groupMembers = [data]
  }

  return <SettingsClient profile={profile} groupMembers={groupMembers} email={user.email ?? ''} />
}
