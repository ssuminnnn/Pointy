import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ConnectClient from './ConnectClient'

export default async function ConnectPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('invite_code, partner_id').eq('id', user.id).single()

  // 이미 연결됐으면 대시보드로
  if (profile?.partner_id) redirect('/dashboard')

  return <ConnectClient myCode={profile?.invite_code ?? ''} />
}
