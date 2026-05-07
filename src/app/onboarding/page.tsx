'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, UserPlus } from 'lucide-react'
import { OBProgress, SelectCard, Btn, FInput, GrapeBunch, PhoneFrame, C } from '@/components/ui/pointy'
import { createClient } from '@/utils/supabase/client'

type RelationType = 'couple'|'married'|'child'|'friend'|'family'|'other'
type SystemType   = 'subtract'|'add'|'grape'

const RELATIONS = [
  { id: 'couple'  as RelationType, icon: '💑', label: '연인',  desc: '둘이서 함께',    multi: false },
  { id: 'married' as RelationType, icon: '💍', label: '부부',  desc: '두 사람의 약속', multi: false },
  { id: 'child'   as RelationType, icon: '👨‍👧', label: '자녀',  desc: '부모와 자녀',    multi: true  },
  { id: 'friend'  as RelationType, icon: '🫂', label: '친구',  desc: '여러 명도 OK',   multi: true  },
  { id: 'family'  as RelationType, icon: '🏠', label: '가족',  desc: '온 가족 함께',   multi: true  },
  { id: 'other'   as RelationType, icon: '✨', label: '기타',  desc: '자유롭게',       multi: true  },
]

export default function OnboardingPage() {
  const router = useRouter()

  // 흐름 분기
  const [hasCode, setHasCode] = useState<boolean|null>(null)

  // 코드 있는 경우
  const [code, setCode] = useState('')
  const [isAdmin, setIsAdmin] = useState<boolean|null>(null)
  const [codeError, setCodeError] = useState('')
  const [connecting, setConnecting] = useState(false)

  // 코드 없는 경우 (새로 만들기)
  const [step, setStep] = useState(0)
  const [relType, setRelType] = useState<RelationType|null>(null)
  const [sysType, setSysType] = useState<SystemType|null>(null)
  const [myRole, setMyRole] = useState<boolean|null>(null)
  const [scoreOpen, setScoreOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // 코드로 연결 (있는 경우)
  async function handleConnect() {
    if (!code.trim() || isAdmin === null) return
    setConnecting(true)
    setCodeError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/'); return }

    const { data, error } = await supabase.rpc('connect_partners', {
      my_id: user.id,
      partner_code: code.trim().toUpperCase(),
      my_role: isAdmin,
    })

    if (error || data !== 'success') {
      const msgs: Record<string, string> = {
        invalid_code: '유효하지 않은 코드예요',
        self_connect: '본인 코드는 사용할 수 없어요',
        already_connected: '이미 연결된 코드예요',
      }
      setCodeError(msgs[data] ?? '연결에 실패했어요')
      setConnecting(false)
      return
    }
    router.push('/dashboard')
  }

  // 새로 만들기 완료
  async function finishOnboarding() {
    if (!relType || !sysType || myRole === null) return
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/'); return }

    const systemMap: Record<SystemType, string> = {
      subtract: 'score_decrease',
      add: 'score_increase',
      grape: 'sticker',
    }

    await supabase.from('profiles').update({
      relation_type: relType,
      system_type: systemMap[sysType],
      is_admin: myRole,
    }).eq('id', user.id)

    router.push('/connect')
  }

  // ── 초기 선택 화면 ──────────────────────────────
  if (hasCode === null) {
    return (
      <PhoneFrame>
        <div className="flex flex-col min-h-screen px-6 py-10" style={{ background: C.bg }}>
          <div className="mt-8 mb-10 flex flex-col items-center gap-2 text-center">
            <span className="text-5xl mb-2">🌸</span>
            <h2 className="text-2xl font-bold" style={{ color: C.text, fontFamily: 'Noto Serif KR, serif' }}>
              초대 코드가 있나요?
            </h2>
            <p className="text-sm" style={{ color: C.sub }}>
              파트너가 먼저 가입했다면 코드로 바로 연결할 수 있어요
            </p>
          </div>
          <div className="space-y-3 flex-1">
            <button onClick={() => setHasCode(true)}
              className="w-full rounded-2xl p-5 border-2 text-left transition-all"
              style={{ borderColor: C.primary, background: '#FFF5F7' }}>
              <div className="flex items-center gap-4">
                <span className="text-3xl">🔑</span>
                <div>
                  <p className="text-sm font-bold" style={{ color: C.text }}>네, 코드가 있어요</p>
                  <p className="text-xs mt-0.5" style={{ color: C.sub }}>파트너 코드로 바로 연결할게요</p>
                </div>
              </div>
            </button>
            <button onClick={() => setHasCode(false)}
              className="w-full rounded-2xl p-5 border-2 text-left transition-all"
              style={{ borderColor: C.border, background: C.card }}>
              <div className="flex items-center gap-4">
                <span className="text-3xl">✨</span>
                <div>
                  <p className="text-sm font-bold" style={{ color: C.text }}>아니요, 새로 만들게요</p>
                  <p className="text-xs mt-0.5" style={{ color: C.sub }}>설정하고 파트너에게 코드를 보내요</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </PhoneFrame>
    )
  }

  // ── 코드 있는 경우 ──────────────────────────────
  if (hasCode) {
    return (
      <PhoneFrame>
        <div className="flex flex-col min-h-screen px-6 py-10" style={{ background: C.bg }}>
          <button onClick={() => setHasCode(null)} className="text-sm mb-6" style={{ color: C.sub }}>← 뒤로</button>
          <h2 className="text-2xl font-bold mb-1" style={{ color: C.text, fontFamily: 'Noto Serif KR, serif' }}>파트너 코드 입력</h2>
          <p className="text-sm mb-8" style={{ color: C.sub }}>파트너에게 받은 초대 코드를 입력해주세요</p>

          <div className="space-y-6 flex-1">
            <FInput
              label="초대 코드"
              placeholder="예: A3K9XP"
              value={code}
              onChange={v => setCode(v.toUpperCase())}
              error={codeError}
            />

            <div>
              <p className="text-xs font-semibold mb-3" style={{ color: C.text }}>내 역할을 선택해주세요</p>
              <div className="space-y-3">
                <SelectCard icon="👑" title="관리자"
                  desc={'점수를 주거나 빼는 역할\n파트너의 점수를 관리해요'}
                  selected={isAdmin === true} onClick={() => setIsAdmin(true)} />
                <SelectCard icon="🌸" title="일반"
                  desc={'점수를 받는 역할\n파트너가 점수를 관리해줘요'}
                  selected={isAdmin === false} onClick={() => setIsAdmin(false)} />
              </div>
            </div>
          </div>

          <Btn full disabled={!code.trim() || isAdmin === null || connecting}
            style={{ marginTop: 24 }} onClick={handleConnect}>
            {connecting ? '연결 중...' : '연결하기 🌸'}
          </Btn>
        </div>
      </PhoneFrame>
    )
  }

  // ── 코드 없는 경우 (새로 만들기) ────────────────
  return (
    <PhoneFrame>
      {/* Step 0: 관계 선택 */}
      {step === 0 && (
        <div className="flex flex-col min-h-screen px-6 py-10" style={{ background: C.bg }}>
          <OBProgress step={0} />
          <button onClick={() => setHasCode(null)} className="text-sm mt-4 mb-2" style={{ color: C.sub }}>← 뒤로</button>
          <div className="mt-4 mb-6">
            <h2 className="text-2xl font-bold" style={{ color: C.text, fontFamily: 'Noto Serif KR, serif' }}>누구와 함께 사용하실 건가요?</h2>
            <p className="text-sm mt-2" style={{ color: C.sub }}>관계에 맞는 설정을 제안해드려요</p>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1 content-start">
            {RELATIONS.map(r => (
              <button key={r.id} onClick={() => setRelType(r.id)}
                className="rounded-2xl p-4 border-2 text-left transition-all relative"
                style={{ borderColor: relType === r.id ? C.primary : C.border, background: relType === r.id ? '#FFF5F7' : C.card }}>
                {relType === r.id && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: C.primary }}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <span className="text-3xl block mb-2">{r.icon}</span>
                <p className="text-sm font-bold" style={{ color: C.text }}>{r.label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: C.sub }}>{r.desc}</p>
              </button>
            ))}
          </div>
          <Btn full disabled={!relType} style={{ marginTop: 24 }} onClick={() => setStep(1)}>다음</Btn>
        </div>
      )}

      {/* Step 1: 시스템 선택 */}
      {step === 1 && (
        <div className="flex flex-col min-h-screen px-6 py-10" style={{ background: C.bg }}>
          <OBProgress step={1} />
          <button onClick={() => setStep(0)} className="text-sm mt-4 mb-2" style={{ color: C.sub }}>← 뒤로</button>
          <div className="mt-4 mb-6">
            <h2 className="text-2xl font-bold" style={{ color: C.text, fontFamily: 'Noto Serif KR, serif' }}>방식을 선택해주세요</h2>
            <p className="text-sm mt-2" style={{ color: C.sub }}>나중에 설정에서 변경할 수 있어요</p>
          </div>
          <div className="space-y-3 flex-1">
            <div className="rounded-2xl border-2 overflow-hidden transition-all"
              style={{ borderColor: (sysType === 'subtract' || sysType === 'add') ? C.primary : C.border }}>
              <button className="w-full px-4 py-4 flex items-center gap-3 text-left"
                style={{ background: (sysType === 'subtract' || sysType === 'add') ? '#FFF5F7' : C.card }}
                onClick={() => setScoreOpen(v => !v)}>
                <span className="text-2xl">🎯</span>
                <div className="flex-1">
                  <p className="text-sm font-bold" style={{ color: C.text }}>점수형</p>
                  <p className="text-xs mt-0.5" style={{ color: C.sub }}>숫자 점수로 관리해요</p>
                </div>
                <span className="text-xs" style={{ color: C.sub }}>{scoreOpen ? '▲' : '▼'}</span>
              </button>
              {scoreOpen && (
                <div className="border-t px-3 pb-3 pt-2 space-y-2" style={{ borderColor: C.border, background: '#fffbfc' }}>
                  {[
                    { id: 'subtract' as SystemType, icon: '📉', label: '차감형', desc: '100점 시작 · 잘못하면 줄어들어요' },
                    { id: 'add'      as SystemType, icon: '📈', label: '증가형', desc: '0점 시작 · 칭찬받을수록 쌓여요' },
                  ].map(o => (
                    <button key={o.id} onClick={() => setSysType(o.id)}
                      className="w-full rounded-xl p-3 border-2 text-left flex items-center gap-3 transition-all"
                      style={{ borderColor: sysType === o.id ? C.primary : C.border, background: sysType === o.id ? '#FFF5F7' : C.card }}>
                      <span className="text-xl">{o.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: C.text }}>{o.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: C.sub }}>{o.desc}</p>
                      </div>
                      {sysType === o.id && <Check className="w-4 h-4" style={{ color: C.primary }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => { setSysType('grape'); setScoreOpen(false) }}
              className="w-full rounded-2xl border-2 p-4 flex items-center gap-3 text-left transition-all"
              style={{ borderColor: sysType === 'grape' ? C.primary : C.border, background: sysType === 'grape' ? '#FFF5F7' : C.card }}>
              <span className="text-2xl">🍇</span>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: C.text }}>포도알</p>
                <p className="text-xs mt-0.5" style={{ color: C.sub }}>30개를 채워보세요!</p>
              </div>
              {sysType === 'grape' && <Check className="w-4 h-4" style={{ color: C.primary }} />}
            </button>
            {sysType && (
              <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: C.muted }}>
                {sysType === 'grape'
                  ? <GrapeBunch filled={8} total={30} size="sm" />
                  : <div className="text-center w-16">
                      <p className="text-3xl font-bold" style={{ color: C.text }}>{sysType === 'subtract' ? '100' : '0'}</p>
                      <p className="text-xs" style={{ color: C.sub }}>시작 점수</p>
                    </div>
                }
                <div>
                  <p className="text-sm font-semibold" style={{ color: C.text }}>
                    {sysType === 'subtract' && '100점에서 시작해요'}
                    {sysType === 'add' && '0점에서 시작해요'}
                    {sysType === 'grape' && '포도알 30개를 모아요'}
                  </p>
                </div>
              </div>
            )}
          </div>
          <Btn full disabled={!sysType} style={{ marginTop: 24 }} onClick={() => setStep(2)}>다음</Btn>
        </div>
      )}

      {/* Step 2: 역할 선택 */}
      {step === 2 && (
        <div className="flex flex-col min-h-screen px-6 py-10" style={{ background: C.bg }}>
          <OBProgress step={2} />
          <button onClick={() => setStep(1)} className="text-sm mt-4 mb-2" style={{ color: C.sub }}>← 뒤로</button>
          <div className="mt-4 mb-6">
            <h2 className="text-2xl font-bold" style={{ color: C.text, fontFamily: 'Noto Serif KR, serif' }}>내 역할을 선택해주세요</h2>
            <p className="text-sm mt-2" style={{ color: C.sub }}>파트너는 반대 역할로 자동 설정돼요</p>
          </div>
          <div className="space-y-3 flex-1">
            <SelectCard icon="👑" title="관리자"
              desc={'점수를 주거나 빼는 역할\n파트너의 점수를 관리해요'}
              selected={myRole === true} onClick={() => setMyRole(true)} />
            <SelectCard icon="🌸" title="일반"
              desc={'점수를 받는 역할\n파트너가 점수를 관리해줘요'}
              selected={myRole === false} onClick={() => setMyRole(false)} />
          </div>
          <Btn full disabled={myRole === null || saving} style={{ marginTop: 24 }} onClick={finishOnboarding}>
            {saving ? '저장 중...' : '완료 →  코드 공유하기'}
          </Btn>
        </div>
      )}
    </PhoneFrame>
  )
}
