'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import type { RelationType, SystemType } from '@/types'

export async function saveOnboarding(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const relation_type = formData.get('relation_type') as RelationType
  const system_type = formData.get('system_type') as SystemType
  const is_admin = formData.get('is_admin') === 'true'

  const { error } = await supabase
    .from('profiles')
    .update({ relation_type, system_type, is_admin })
    .eq('id', user.id)

  if (error) {
    return { error: '설정 저장에 실패했습니다.' }
  }

  redirect('/connect')
}
