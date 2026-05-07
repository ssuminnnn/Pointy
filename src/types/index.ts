export type RelationType = 'couple' | 'parent_child'
export type SystemType = 'score_decrease' | 'score_increase' | 'sticker'

export interface Profile {
  id: string
  nickname: string
  invite_code: string
  partner_id: string | null
  relation_type: RelationType | null
  system_type: SystemType | null
  is_admin: boolean
  created_at: string
}

export interface Record {
  id: string
  from_user_id: string
  to_user_id: string
  amount: number
  reason: string
  created_at: string
  from_user?: Profile
  to_user?: Profile
}

export interface DashboardData {
  profile: Profile
  partner: Profile | null
  currentScore: number
  recentRecords: Record[]
}
