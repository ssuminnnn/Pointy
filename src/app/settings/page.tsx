import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/')

  let partner = null
  if (profile.partner_id) {
    const { data } = await supabase.from('profiles').select('*').eq('id', profile.partner_id).single()
    partner = data
  }

  return <SettingsClient profile={profile} partner={partner} email={user.email ?? ''} />
}
