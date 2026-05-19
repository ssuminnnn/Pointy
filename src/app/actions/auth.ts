'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function loginAction(username: string, password: string): Promise<string | null> {
  const supabase = await createClient()
  const email = `${username.trim().toLowerCase()}@pointy.app`
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return '아이디 또는 비밀번호가 올바르지 않아요'
  redirect('/dashboard')
}

export async function signupAction(
  username: string, nickname: string, password: string
): Promise<string | null> {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('profiles').select('id')
    .eq('username', username.trim().toLowerCase()).single()
  if (existing) return '이미 사용 중인 아이디예요'

  const email = `${username.trim().toLowerCase()}@pointy.app`
  const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
  if (signUpError || !data.user) return signUpError?.message ?? '회원가입에 실패했어요'

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const inviteCode = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * 36)]).join('')

  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    username: username.trim().toLowerCase(),
    nickname: nickname.trim(),
    invite_code: inviteCode,
  })
  if (profileError) return '프로필 생성에 실패했어요'

  redirect('/onboarding')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
