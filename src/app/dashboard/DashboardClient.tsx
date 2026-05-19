'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Minus, Bell, User, ArrowUpRight, ArrowDownRight, Crown, X, Pencil, Gift } from 'lucide-react'
import { PCoinLogo, GrapeBunch, Btn, FInput, PhoneFrame, C, AVATARS } from '@/components/ui/pointy'
import { BottomNav } from '@/components/BottomNav'
import { createClient } from '@/utils/supabase/client'
import { saveRewardTextAction } from '@/app/actions/group'
import Link from 'next/link'

interface Profile {
  id: string; nickname: string; invite_code: string
  partner_id: string|null; group_id: string|null
  relation_type: string|null; system_type: string|null; is_admin: boolean
}
interface MemberScore extends Profile { score: number }
interface RecordItem {
  id: string; amount: number; reason: string; created_at: string
  from_user: { nickname: string }|null; to_user: { nickname: string }|null
}

function ScoreModal({ systemType, target, onClose, onSave }: {
  systemType: string
  target: MemberScore
  onClose: () => void
  onSave: (targetId: string, delta: number, reason: string) => void
}) {
  const [val, setVal] = useState(systemType === 'sticker' ? 1 : 5)
  const [type, setType] = useState<'plus'|'minus'>('plus')
  const [reason, setReason] = useState('')
  const isGrape = systemType === 'sticker'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'rgba(46,31,36,0.28)' }} onClick={onClose} />
      <div className="relative z-10 w-full max-w-[390px] mx-auto rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl px-6 pt-5 pb-10" style={{ background: C.card }}>
        <div className="w-10 h-1.5 rounded-full mx-auto mb-5 sm:hidden" style={{ background: C.border }} />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: C.text, fontFamily: 'Noto Serif KR, serif' }}>
            {isGrape ? '포도알 변경' : '점수 변경'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.muted }}>
            <X className="w-4 h-4" style={{ color: C.sub }} />
          </button>
        </div>
        <p className="text-xs mb-4" style={{ color: C.sub }}>
          대상: <span className="font-semibold" style={{ color: C.text }}>{target.nickname}</span>
        </p>
        {!isGrape && (
          <div className="flex gap-2 mb-5">
            {(['plus', 'minus'] as const).map(t => (
              <button key={t} onClick={() => setType(t)}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all"
                style={{ background: t === type ? (t === 'plus' ? C.mint : '#ffeaea') : C.muted, color: t === type ? (t === 'plus' ? '#3a7a50' : C.negative) : C.sub }}>
                {t === 'plus' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                {t === 'plus' ? '칭찬' : '차감'}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center justify-center gap-6 mb-5">
          <button onClick={() => setVal(Math.max(1, val - 1))} className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: C.muted }}>
            <Minus className="w-5 h-5" style={{ color: C.text }} />
          </button>
          <div className="text-center">
            <span className="text-5xl font-bold" style={{ color: isGrape ? '#7B4DAA' : type === 'plus' ? '#3a7a50' : C.negative, fontFamily: 'Noto Serif KR, serif' }}>
              {isGrape || type === 'plus' ? '+' : '-'}{val}
            </span>
            <p className="text-xs mt-1" style={{ color: C.sub }}>{isGrape ? '포도알' : '점'}</p>
          </div>
          <button onClick={() => setVal(val + 1)} className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: C.muted }}>
            <Plus className="w-5 h-5" style={{ color: C.text }} />
          </button>
        </div>
        <div className="mb-5">
          <FInput label="이유 (필수)" placeholder="이유를 입력해주세요" value={reason} onChange={setReason} />
        </div>
        <div className="flex gap-2">
          <Btn variant="secondary" style={{ flex: 1 }} onClick={onClose}>취소</Btn>
          <Btn style={{ flex: 1 }} disabled={!reason.trim()} onClick={() => {
            onSave(target.id, isGrape ? val : (type === 'plus' ? val : -val), reason)
            onClose()
          }}>저장</Btn>
        </div>
      </div>
    </div>
  )
}

function RewardModal({ current, onClose, onSave }: {
  current: string
  onClose: () => void
  onSave: (text: string) => void
}) {
  const [text, setText] = useState(current)
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'rgba(46,31,36,0.28)' }} onClick={onClose} />
      <div className="relative z-10 w-full max-w-[390px] mx-auto rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl px-6 pt-5 pb-10" style={{ background: C.card }}>
        <div className="w-10 h-1.5 rounded-full mx-auto mb-5 sm:hidden" style={{ background: C.border }} />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: C.text, fontFamily: 'Noto Serif KR, serif' }}>보상 문구 설정</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.muted }}>
            <X className="w-4 h-4" style={{ color: C.sub }} />
          </button>
        </div>
        <p className="text-xs mb-4" style={{ color: C.sub }}>목표 달성 시 표시될 보상을 입력해요 🎁</p>
        <div className="mb-5">
          <FInput
            label="보상 문구"
            placeholder="예: 치킨 사주기 🍗, 영화 보러 가기 🎬"
            value={text}
            onChange={setText}
          />
        </div>
        <div className="flex gap-2">
          <Btn variant="secondary" style={{ flex: 1 }} onClick={onClose}>취소</Btn>
          <Btn style={{ flex: 1 }} onClick={() => { onSave(text); onClose() }}>저장</Btn>
        </div>
      </div>
    </div>
  )
}

export default function DashboardClient({ profile, memberScores, systemType, recentRecords, rewardText: initialRewardText, groupId }: {
  profile: Profile
  memberScores: MemberScore[]
  systemType: string
  recentRecords: RecordItem[]
  rewardText: string
  groupId: string
}) {
  const router = useRouter()
  const [modalTarget, setModalTarget] = useState<MemberScore | null>(null)
  const [showRewardModal, setShowRewardModal] = useState(false)
  const [rewardText, setRewardText] = useState(initialRewardText)
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(memberScores.map(m => [m.id, m.score]))
  )
  const [records, setRecords] = useState(recentRecords)
  const isGrape = systemType === 'sticker'
  const isDecreasing = systemType === 'score_decrease'
  const showReward = isGrape || systemType === 'score_increase'

  const otherMembers = memberScores.filter(m => m.id !== profile.id)
  const hasPartner = otherMembers.length > 0

  // 모두 관리자인지 확인
  const allAreAdmin = memberScores.every(m => m.is_admin)
  // 모두 관리자면 전체 카드, 아니면 비관리자 카드만
  const allDisplayMembers = allAreAdmin
    ? memberScores
    : memberScores.filter(m => !m.is_admin)

  async function saveScore(targetId: string, delta: number, reason: string) {
    const supabase = createClient()
    await supabase.from('records').insert({
      from_user_id: profile.id,
      to_user_id: targetId,
      amount: delta,
      reason
    })
    setScores(prev => {
      const current = prev[targetId] ?? 0
      const newScore = isGrape ? Math.max(0, Math.min(30, current + delta)) : current + delta
      return { ...prev, [targetId]: newScore }
    })
    const targetMember = memberScores.find(m => m.id === targetId)
    setRecords(r => [{
      id: Date.now().toString(),
      amount: delta,
      reason,
      created_at: new Date().toISOString(),
      from_user: { nickname: profile.nickname },
      to_user: targetMember ? { nickname: targetMember.nickname } : null
    }, ...r.slice(0, 4)])
    router.refresh()
  }

  async function saveRewardText(text: string) {
    setRewardText(text)
    if (!groupId) return
    await saveRewardTextAction(groupId, text)
    router.refresh()
  }

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-screen pb-24" style={{ background: C.page }}>
        <header className="sticky top-0 z-20 border-b" style={{ background: 'rgba(255,255,255,0.94)', borderColor: C.border, backdropFilter: 'blur(12px)' }}>
          <div className="max-w-[390px] mx-auto px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PCoinLogo size={28} />
              <span className="text-lg font-bold" style={{ color: C.text, fontFamily: 'Noto Serif KR, serif' }}>포인티</span>
            </div>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.muted }}>
                <Bell className="w-4 h-4" style={{ color: C.sub }} />
              </button>
              <Link href="/settings" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.muted }}>
                <User className="w-4 h-4" style={{ color: C.sub }} />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-[390px] mx-auto w-full px-5 py-5 space-y-4">
          {/* 연결 상태 */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {memberScores.slice(0, 5).map((m, i) => (
                <div key={m.id} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white"
                  style={{ background: AVATARS[i % AVATARS.length], color: C.text }}>
                  {m.nickname[0]}
                </div>
              ))}
            </div>
            <span className="text-sm truncate max-w-[160px]" style={{ color: C.sub }}>
              {memberScores.map(m => m.nickname).join(', ')}
            </span>
            <div className="ml-auto flex items-center gap-1 text-xs font-medium flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: hasPartner ? C.positive : C.border }} />
              <span style={{ color: hasPartner ? C.positive : C.sub }}>{hasPartner ? '연결됨' : '미연결'}</span>
            </div>
          </div>

          {/* 보상 문구 배너 (칭찬형/포도알만) */}
          {showReward && hasPartner && (
            <div className="rounded-2xl px-4 py-3 flex items-center gap-2"
              style={{ background: isGrape ? '#f3eeff' : '#fff5f7', border: `1px solid ${isGrape ? '#e0d0f5' : C.border}` }}>
              <Gift className="w-4 h-4 flex-shrink-0" style={{ color: isGrape ? '#7B4DAA' : '#d4607a' }} />
              <span className="text-sm flex-1 font-medium" style={{ color: isGrape ? '#7B4DAA' : '#d4607a' }}>
                {rewardText || '목표 달성 보상을 설정해보세요 🎁'}
              </span>
              {profile.is_admin && (
                <button onClick={() => setShowRewardModal(true)}
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: isGrape ? '#e0d0f5' : C.border }}>
                  <Pencil className="w-3 h-3" style={{ color: isGrape ? '#7B4DAA' : '#d4607a' }} />
                </button>
              )}
            </div>
          )}

          {/* 각 멤버 점수 카드 */}
          {allDisplayMembers.map((member, i) => {
            const isSelf = member.id === profile.id
            // 모두 관리자면 자기 자신 제외 편집 가능, 아니면 관리자만 비관리자 편집 가능
            const canEdit = allAreAdmin ? (profile.is_admin && !isSelf) : (profile.is_admin && !member.is_admin)
            const score = scores[member.id] ?? member.score
            const maxScore = isDecreasing ? 100 : Math.max(score, 100)
            const memberIdx = memberScores.findIndex(m => m.id === member.id)

            return (
              <div key={member.id} className="rounded-3xl border p-5 shadow-sm"
                style={{ background: C.card, borderColor: isSelf ? C.primary : C.border, borderWidth: isSelf ? 2 : 1 }}>
                {/* 카드 헤더 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: AVATARS[memberIdx % AVATARS.length], color: C.text }}>
                      {member.nickname[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold" style={{ color: C.text }}>{member.nickname}</span>
                        {isSelf && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                            style={{ background: C.muted, color: C.sub }}>나</span>
                        )}
                        {member.is_admin && <Crown className="w-3 h-3" style={{ color: '#e4a820' }} />}
                      </div>
                      <span className="text-[10px]" style={{ color: C.sub }}>
                        {member.is_admin ? '관리자' : '일반'}
                      </span>
                    </div>
                  </div>
                  {canEdit && (
                    <button
                      onClick={() => setModalTarget({ ...member, score })}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1"
                      style={{ background: isGrape ? '#f3eeff' : C.mint, color: isGrape ? '#7B4DAA' : '#3a7a50' }}>
                      <Plus className="w-3 h-3" />
                      {isGrape ? '포도알' : '점수'}
                    </button>
                  )}
                </div>

                {/* 점수 표시 */}
                {isGrape ? (
                  <div className="flex flex-col items-center gap-2">
                    <GrapeBunch filled={score} total={30} size="sm" />
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold" style={{ color: '#7B4DAA', fontFamily: 'Noto Serif KR, serif' }}>{score}</span>
                      <span className="text-sm" style={{ color: C.sub }}>/ 30알</span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: C.muted }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(score / 30) * 100}%`, background: 'linear-gradient(90deg,#9b6dca,#7B4DAA)' }} />
                    </div>
                    {/* 30개 완료 시 보상 문구 강조 */}
                    {score >= 30 && rewardText && (
                      <div className="mt-1 w-full rounded-xl px-3 py-2 text-center text-sm font-semibold"
                        style={{ background: '#f3eeff', color: '#7B4DAA' }}>
                        🎉 {rewardText}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-4xl font-bold" style={{ color: C.text, fontFamily: 'Noto Serif KR, serif' }}>{score}</p>
                    <p className="text-xs mt-1 mb-2" style={{ color: C.sub }}>점</p>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: C.muted }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(Math.max((score / maxScore) * 100, 0), 100)}%`, background: `linear-gradient(90deg,${C.rose},${C.primary})` }} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* 미연결 시 안내 */}
          {!hasPartner && (
            <Link href="/connect" className="flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold"
              style={{ background: C.muted, color: C.sub }}>
              파트너를 연결해보세요 →
            </Link>
          )}

          {/* 최근 기록 */}
          <div className="rounded-3xl border p-5 shadow-sm" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold" style={{ color: C.text }}>최근 기록</p>
              <Link href="/history" className="text-xs font-medium hover:underline" style={{ color: '#d4607a' }}>전체 보기</Link>
            </div>
            <div className="space-y-3">
              {records.length === 0 && <p className="text-xs text-center py-2" style={{ color: C.sub }}>아직 기록이 없어요</p>}
              {records.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: item.amount > 0 ? '#e6f7ec' : '#ffeaea' }}>
                    {item.amount > 0
                      ? <ArrowUpRight className="w-4 h-4" style={{ color: C.positive }} />
                      : <ArrowDownRight className="w-4 h-4" style={{ color: C.negative }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ color: C.text }}>{item.reason}</p>
                    <p className="text-xs" style={{ color: C.sub }}>
                      {new Date(item.created_at).toLocaleDateString('ko-KR')} · {item.from_user?.nickname} → {item.to_user?.nickname}
                    </p>
                  </div>
                  <span className="text-sm font-bold flex-shrink-0" style={{ color: item.amount > 0 ? C.positive : C.negative }}>
                    {item.amount > 0 ? '+' : ''}{item.amount}{isGrape ? '알' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>

        <BottomNav active="dashboard" />

        {modalTarget && (
          <ScoreModal
            systemType={systemType}
            target={modalTarget}
            onClose={() => setModalTarget(null)}
            onSave={saveScore}
          />
        )}
        {showRewardModal && (
          <RewardModal
            current={rewardText}
            onClose={() => setShowRewardModal(false)}
            onSave={saveRewardText}
          />
        )}
      </div>
    </PhoneFrame>
  )
}
