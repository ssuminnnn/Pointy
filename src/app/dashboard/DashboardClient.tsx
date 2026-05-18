'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Minus, Bell, User, ArrowUpRight, ArrowDownRight, Crown, X, Check } from 'lucide-react'
import { PCoinLogo, GrapeBunch, Btn, FInput, PhoneFrame, C, AVATARS } from '@/components/ui/pointy'
import { BottomNav } from '@/components/BottomNav'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

interface Profile { id: string; nickname: string; invite_code: string; partner_id: string|null; relation_type: string|null; system_type: string|null; is_admin: boolean }
interface Record  { id: string; amount: number; reason: string; created_at: string; from_user: { nickname: string }|null; to_user: { nickname: string }|null }

function ScoreModal({ systemType, partnerName, onClose, onSave }: {
  systemType: string; partnerName: string; onClose: () => void; onSave: (delta: number, reason: string) => void
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
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold" style={{ color: C.text, fontFamily: 'Noto Serif KR, serif' }}>{isGrape ? '포도알 변경' : '점수 변경'}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.muted }}>
            <X className="w-4 h-4" style={{ color: C.sub }} />
          </button>
        </div>
        <p className="text-xs mb-3" style={{ color: C.sub }}>대상: <span className="font-semibold" style={{ color: C.text }}>{partnerName}</span></p>
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
          <Btn style={{ flex: 1 }} disabled={!reason.trim()} onClick={() => { onSave(isGrape ? val : (type === 'plus' ? val : -val), reason); onClose() }}>저장</Btn>
        </div>
      </div>
    </div>
  )
}

export default function DashboardClient({ profile, partner, currentScore, recentRecords }: {
  profile: Profile; partner: Profile|null; currentScore: number; recentRecords: Record[]
}) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [score, setScore] = useState(currentScore)
  const [records, setRecords] = useState(recentRecords)
  const systemType = profile.system_type ?? 'score_increase'
  const isGrape = systemType === 'sticker'
  const maxScore = systemType === 'score_decrease' ? 100 : Math.max(score, 100)

  async function saveScore(delta: number, reason: string) {
    const supabase = createClient()
    const targetId = profile.is_admin ? profile.partner_id : profile.id
    if (!targetId) return
    await supabase.from('records').insert({ from_user_id: profile.id, to_user_id: targetId, amount: delta, reason })
    setScore(s => isGrape ? Math.max(0, Math.min(30, s + delta)) : s + delta)
    setRecords(r => [{ id: Date.now().toString(), amount: delta, reason, created_at: new Date().toISOString(), from_user: { nickname: profile.nickname }, to_user: partner ? { nickname: partner.nickname } : null }, ...r.slice(0, 4)])
    router.refresh()
  }

  const partnerName = partner?.nickname ?? '파트너'

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
              <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.muted }}><Bell className="w-4 h-4" style={{ color: C.sub }} /></button>
              <Link href="/settings" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.muted }}><User className="w-4 h-4" style={{ color: C.sub }} /></Link>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-[390px] mx-auto w-full px-5 py-5 space-y-4">
          {/* 파트너 정보 */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white" style={{ background: AVATARS[0], color: C.text }}>{profile.nickname[0]}</div>
              {partner && <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white" style={{ background: AVATARS[1], color: C.text }}>{partner.nickname[0]}</div>}
            </div>
            <span className="text-sm" style={{ color: C.sub }}>{profile.nickname}{partner ? `, ${partner.nickname}` : ''}</span>
            <div className="ml-auto flex items-center gap-1 text-xs font-medium" style={{ color: C.positive }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.positive }} />
              {partner ? '연결됨' : '미연결'}
            </div>
          </div>

          {/* 점수 카드 */}
          <div className="rounded-3xl border p-5 shadow-sm" style={{ background: C.card, borderColor: C.border }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: C.sub }}>점수 현황</p>
            {isGrape ? (
              <div className="flex flex-col items-center gap-2">
                <GrapeBunch filled={score} total={30} size="md" />
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold" style={{ color: '#7B4DAA', fontFamily: 'Noto Serif KR, serif' }}>{score}</span>
                  <span className="text-base font-medium" style={{ color: '#a07880' }}>/ 30알</span>
                </div>
                <p className="text-xs mb-1" style={{ color: C.sub }}>
                  {score === 0 ? '아직 포도알이 없어요 🍇' : score >= 30 ? '🎉 포도송이 완성!' : `${30 - score}알 더 모으면 완성!`}
                </p>
                <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: C.muted }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(score / 30) * 100}%`, background: 'linear-gradient(90deg,#9b6dca,#7B4DAA)' }} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex -space-x-2 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white" style={{ background: AVATARS[0], color: C.text }}>{profile.nickname[0]}</div>
                  {partner && <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white" style={{ background: AVATARS[1], color: C.text }}>{partner.nickname[0]}</div>}
                </div>
                <p className="text-5xl font-bold mb-2" style={{ color: C.text, fontFamily: 'Noto Serif KR, serif' }}>{score}</p>
                <p className="text-xs mb-3" style={{ color: C.sub }}>{profile.is_admin ? partnerName : profile.nickname}의 점수</p>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: C.muted }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min((score / maxScore) * 100, 100)}%`, background: `linear-gradient(90deg,${C.rose},${C.primary})` }} />
                </div>
                {partner && (
                  <div className="mt-3 flex items-center gap-1" style={{ color: C.sub }}>
                    <Crown className="w-3.5 h-3.5" style={{ color: '#e4a820' }} />
                    <span className="text-xs font-semibold" style={{ color: C.text }}>{score >= 0 ? profile.nickname : partnerName} 리드 중</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 버튼 */}
          {profile.is_admin && partner && (
            <div className="flex gap-2">
              <button onClick={() => setShowModal(true)} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold" style={{ background: C.mint, color: '#3a7a50' }}>
                <Plus className="w-4 h-4" />{isGrape ? '포도알 추가' : '칭찬 추가'}
              </button>
              {!isGrape && (
                <button onClick={() => setShowModal(true)} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold" style={{ background: '#ffeaea', color: C.negative }}>
                  <Minus className="w-4 h-4" /> 점수 차감
                </button>
              )}
            </div>
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
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: item.amount > 0 ? '#e6f7ec' : '#ffeaea' }}>
                    {item.amount > 0 ? <ArrowUpRight className="w-4 h-4" style={{ color: C.positive }} /> : <ArrowDownRight className="w-4 h-4" style={{ color: C.negative }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ color: C.text }}>{item.reason}</p>
                    <p className="text-xs" style={{ color: C.sub }}>{new Date(item.created_at).toLocaleDateString('ko-KR')} · {item.from_user?.nickname}</p>
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
        {showModal && <ScoreModal systemType={systemType} partnerName={partnerName} onClose={() => setShowModal(false)} onSave={saveScore} />}
      </div>
    </PhoneFrame>
  )
}
