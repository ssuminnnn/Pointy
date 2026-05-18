'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Copy, Check, UserPlus, LogOut, Unlink, RotateCcw, X } from 'lucide-react'
import { PhoneFrame, C, AVATARS, Btn } from '@/components/ui/pointy'
import { BottomNav } from '@/components/BottomNav'
import { createClient } from '@/utils/supabase/client'

interface Profile { id: string; nickname: string; invite_code: string; partner_id: string|null; group_id: string|null; relation_type: string|null; system_type: string|null; is_admin: boolean }

const REL_LABELS: Record<string, string> = { couple: '연인', married: '부부', child: '자녀', friend: '친구', family: '가족', other: '기타' }
const SYS_LABELS: Record<string, string> = { score_decrease: '차감형', score_increase: '증가형', sticker: '포도알' }

function ConfirmModal({ title, desc, confirmLabel, onConfirm, onClose, danger = true }: {
  title: string; desc: string; confirmLabel: string; onConfirm: () => void; onClose: () => void; danger?: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'rgba(46,31,36,0.28)' }} onClick={onClose} />
      <div className="relative z-10 w-full max-w-[390px] mx-auto rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl px-6 pt-5 pb-10" style={{ background: C.card }}>
        <div className="w-10 h-1.5 rounded-full mx-auto mb-5 sm:hidden" style={{ background: C.border }} />
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold" style={{ color: C.text }}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.muted }}>
            <X className="w-4 h-4" style={{ color: C.sub }} />
          </button>
        </div>
        <p className="text-sm mb-6" style={{ color: C.sub }}>{desc}</p>
        <div className="flex gap-2">
          <Btn variant="secondary" style={{ flex: 1 }} onClick={onClose}>취소</Btn>
          <Btn style={{ flex: 1, background: danger ? '#ffeaea' : C.primary, color: danger ? C.negative : C.text }} onClick={() => { onConfirm(); onClose() }}>
            {confirmLabel}
          </Btn>
        </div>
      </div>
    </div>
  )
}

export default function SettingsClient({ profile, groupMembers, email }: { profile: Profile; groupMembers: Profile[]; email: string }) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [showDisconnect, setShowDisconnect] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [loading, setLoading] = useState(false)
  const isGrape = profile.system_type === 'sticker'
  const partner = groupMembers[0] ?? null
  const hasPartner = groupMembers.length > 0

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  function copyCode() {
    navigator.clipboard.writeText(profile.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleDisconnect() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.rpc('disconnect_partners', { my_id: user.id })
    router.push('/onboarding')
    router.refresh()
  }

  async function handleResetGrapes() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.rpc('reset_grapes', { my_id: user.id })
    setLoading(false)
    router.refresh()
  }

  const relLabel = profile.relation_type ? REL_LABELS[profile.relation_type] ?? profile.relation_type : '미설정'
  const sysLabel = profile.system_type ? SYS_LABELS[profile.system_type] ?? profile.system_type : '미설정'

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-screen pb-24" style={{ background: C.page }}>
        <header className="sticky top-0 z-20 border-b" style={{ background: 'rgba(255,255,255,0.94)', borderColor: C.border, backdropFilter: 'blur(12px)' }}>
          <div className="max-w-[390px] mx-auto px-5 py-3.5 flex items-center gap-3">
            <Link href="/dashboard" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.muted }}>
              <ChevronLeft className="w-4 h-4" style={{ color: C.text }} />
            </Link>
            <h2 className="text-lg font-bold" style={{ color: C.text, fontFamily: 'Noto Serif KR, serif' }}>설정</h2>
          </div>
        </header>

        <main className="flex-1 max-w-[390px] mx-auto w-full px-5 py-5 space-y-4">
          {/* 프로필 */}
          <div className="flex items-center gap-4 rounded-3xl border p-5 shadow-sm" style={{ background: C.card, borderColor: C.border }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: C.primary, color: C.text }}>
              {profile.nickname[0]}
            </div>
            <div>
              <p className="text-base font-bold" style={{ color: C.text }}>{profile.nickname}</p>
              <p className="text-xs" style={{ color: C.sub }}>{email}</p>
            </div>
          </div>

          {/* 관계 설정 */}
          <div className="rounded-3xl border overflow-hidden shadow-sm" style={{ background: C.card, borderColor: C.border }}>
            {[{ label: '관계', value: relLabel }, { label: '방식', value: sysLabel }, { label: '역할', value: profile.is_admin ? '관리자' : '일반' }].map((r, i) => (
              <div key={r.label} className="flex items-center justify-between px-5 py-4"
                style={{ borderTop: i > 0 ? `1px solid ${C.muted}` : undefined }}>
                <span className="text-xs font-medium" style={{ color: C.sub }}>{r.label}</span>
                <span className="text-sm font-semibold" style={{ color: C.text }}>{r.value}</span>
              </div>
            ))}
          </div>

          {/* 초대 코드 */}
          <div className="rounded-3xl border p-5 shadow-sm" style={{ background: C.card, borderColor: C.border }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: C.sub }}>내 초대 코드</p>
            <div className="flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: C.muted }}>
              <span className="text-lg font-bold tracking-widest" style={{ color: C.text }}>{profile.invite_code}</span>
              <button onClick={copyCode} className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#d4607a' }}>
                {copied ? <><Check className="w-3.5 h-3.5" />복사됨</> : <><Copy className="w-3.5 h-3.5" />복사</>}
              </button>
            </div>
          </div>

          {/* 연결된 멤버 */}
          <div className="rounded-3xl border p-5 shadow-sm" style={{ background: C.card, borderColor: C.border }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: C.sub }}>
              연결된 멤버 {groupMembers.length + 1}명
            </p>
            <div className="space-y-2.5">
              {[profile, ...groupMembers].map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: AVATARS[i % AVATARS.length], color: C.text }}>
                    {p.nickname[0]}
                  </div>
                  <span className="text-sm font-semibold flex-1" style={{ color: C.text }}>
                    {p.nickname} {p.id === profile.id && <span className="text-xs font-normal" style={{ color: C.sub }}>(나)</span>}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: p.is_admin ? '#FFE0E8' : C.border, color: p.is_admin ? '#d4607a' : C.sub }}>
                    {p.is_admin ? '관리자' : '멤버'}
                  </span>
                </div>
              ))}
            </div>
            {!hasPartner && (
              <Link href="/connect" className="mt-4 flex items-center gap-1 text-xs font-semibold hover:underline" style={{ color: C.primary }}>
                <UserPlus className="w-3.5 h-3.5" /> 파트너 연결하기
              </Link>
            )}
          </div>

          {/* 포도알 초기화 (포도알 시스템 + 관리자만) */}
          {isGrape && profile.is_admin && hasPartner && (
            <button onClick={() => setShowReset(true)} disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold"
              style={{ background: '#f3eeff', color: '#7B4DAA' }}>
              <RotateCcw className="w-4 h-4" /> 포도알 초기화
            </button>
          )}

          {/* 연결 해제 */}
          {hasPartner && (
            <button onClick={() => setShowDisconnect(true)} disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold"
              style={{ background: '#ffeaea', color: C.negative }}>
              <Unlink className="w-4 h-4" /> 파트너 연결 해제
            </button>
          )}

          {/* 로그아웃 */}
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold"
            style={{ background: C.muted, color: C.sub }}>
            <LogOut className="w-4 h-4" /> 로그아웃
          </button>
        </main>

        <BottomNav active="settings" />

        {showReset && (
          <ConfirmModal
            title="포도알 초기화"
            desc="모든 포도알 기록이 삭제되고 0개로 초기화돼요. 이 작업은 되돌릴 수 없어요."
            confirmLabel="초기화"
            onConfirm={handleResetGrapes}
            onClose={() => setShowReset(false)}
          />
        )}

        {showDisconnect && (
          <ConfirmModal
            title="그룹 연결 해제"
            desc="그룹에서 나갈까요? 기록은 유지되지만 연결이 끊어져요."
            confirmLabel="나가기"
            onConfirm={handleDisconnect}
            onClose={() => setShowDisconnect(false)}
          />
        )}
      </div>
    </PhoneFrame>
  )
}
