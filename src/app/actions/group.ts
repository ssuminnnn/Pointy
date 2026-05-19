'use server'

import { createClient } from '@/utils/supabase/server'

export async function saveRewardTextAction(groupId: string, text: string): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return '로그인이 필요해요'

  const { error } = await supabase
    .from('groups')
    .update({ reward_text: text })
    .eq('id', groupId)

  if (error) return '저장에 실패했어요'
  return null
}
