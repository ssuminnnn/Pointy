'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nickname = formData.get('nickname') as string

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error || !data.user) {
    return { error: error?.message ?? '회원가입에 실패했습니다.' }
  }

  const inviteCode = await generateUniqueInviteCode(supabase)

  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    nickname,
    invite_code: inviteCode,
  })

  if (profileError) {
    return { error: '프로필 생성에 실패했습니다.' }
  }

  redirect('/onboarding')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
  }

  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

async function generateUniqueInviteCode(supabase: Awaited<ReturnType<typeof createClient>>) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  while (true) {
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    const { data } = await supabase
      .from('profiles')
      .select('invite_code')
      .eq('invite_code', code)
      .single()

    if (!data) return code
  }
}
