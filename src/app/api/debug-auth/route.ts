import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const result: Record<string, any> = {}

  // 환경변수 확인 (값은 숨기고 존재 여부만)
  result.env = {
    SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_URL_value: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
    ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ANON_KEY_used: !!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
  }

  try {
    const supabase = await createClient()

    // 유저 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    result.auth = {
      user_id: user?.id ?? null,
      user_email: user?.email ?? null,
      error: userError?.message ?? null,
    }

    // 프로필 확인
    if (user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles').select('id, nickname, group_id, partner_id, relation_type')
        .eq('id', user.id).single()
      result.profile = {
        found: !!profile,
        data: profile,
        error: profileError?.message ?? null,
      }
    }
  } catch (e: any) {
    result.error = e.message
  }

  return NextResponse.json(result)
}
