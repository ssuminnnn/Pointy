'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function changeScore(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const amount = parseInt(formData.get('amount') as string)
  const reason = (formData.get('reason') as string).trim()

  if (!reason) return { error: '이유를 입력해주세요.' }
  if (isNaN(amount) || amount === 0) return { error: '올바른 점수를 입력해주세요.' }

  // 관리자 여부 확인
  const { data: myProfile } = await supabase
    .from('profiles')
    .select('is_admin, partner_id, system_type')
    .eq('id', user.id)
    .single()

  if (!myProfile) return { error: '프로필을 찾을 수 없습니다.' }
  if (!myProfile.is_admin) return { error: '점수 변경 권한이 없습니다.' }
  if (!myProfile.partner_id) return { error: '연결된 파트너가 없습니다.' }

  const { error } = await supabase.from('records').insert({
    from_user_id: user.id,
    to_user_id: myProfile.partner_id,
    amount,
    reason,
  })

  if (error) return { error: '점수 변경에 실패했습니다.' }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function getCurrentScore(userId: string, systemType: string): Promise<number> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('records')
    .select('amount')
    .eq('to_user_id', userId)

  const total = (data ?? []).reduce((sum, r) => sum + r.amount, 0)

  if (systemType === 'score_decrease') {
    return 100 + total
  }
  return total
}
