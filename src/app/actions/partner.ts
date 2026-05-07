'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function connectPartner(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const inviteCode = (formData.get('invite_code') as string).trim().toUpperCase()

  // 내 프로필 조회
  const { data: myProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!myProfile) return { error: '프로필을 찾을 수 없습니다.' }
  if (myProfile.partner_id) return { error: '이미 연결된 파트너가 있습니다.' }
  if (myProfile.invite_code === inviteCode) return { error: '본인의 초대 코드는 사용할 수 없습니다.' }

  // 상대방 프로필 조회
  const { data: partner } = await supabase
    .from('profiles')
    .select('*')
    .eq('invite_code', inviteCode)
    .single()

  if (!partner) return { error: '유효하지 않은 초대 코드입니다.' }
  if (partner.partner_id) return { error: '이미 다른 사람과 연결된 코드입니다.' }

  // 양쪽 모두 연결
  const { error: myError } = await supabase
    .from('profiles')
    .update({
      partner_id: partner.id,
      relation_type: myProfile.relation_type ?? partner.relation_type,
      system_type: myProfile.system_type ?? partner.system_type,
    })
    .eq('id', user.id)

  const { error: partnerError } = await supabase
    .from('profiles')
    .update({
      partner_id: user.id,
      relation_type: partner.relation_type ?? myProfile.relation_type,
      system_type: partner.system_type ?? myProfile.system_type,
    })
    .eq('id', partner.id)

  if (myError || partnerError) return { error: '연결에 실패했습니다.' }

  redirect('/dashboard')
}

export async function getMyInviteCode() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('invite_code, nickname')
    .eq('id', user.id)
    .single()

  return data
}
