'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { OBProgress, SelectCard, Btn, GrapeBunch, PhoneFrame, C } from '@/components/ui/pointy'
import { createClient } from '@/utils/supabase/client'

type RelationType = 'couple'|'married'|'child'|'friend'|'family'|'other'
type SystemType   = 'subtract'|'add'|'grape'
type PermType     = 'admin'|'all'

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
  const [step, setStep] = useState(0)
  const [relType, setRelType] = useState<RelationType|null>(null)
  const [sysType, setSysType] = useState<SystemType|null>(null)
  const [permType, setPermType] = useState<PermType|null>(null)
  const [scoreOpen, setScoreOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function finishOnboarding() {
    if (!relType || !sysType || !permType) return
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/'); return }

    const systemMap: Record<SystemType, string> = { subtract: 'score_decrease', add: 'score_increase', grape: 'sticker' }
    await supabase.from('profiles').update({
      relation_type: relType,
      system_type: systemMap[sysType],
      is_admin: permType === 'admin',
    }).eq('id', user.id)

    router.push('/connect')
  }

  return (
    <PhoneFrame>
      {/* Step 1: 관계 선택 */}
      {step === 0 && (
        <div className="flex flex-col min-h-screen px-6 py-10" style={{ background: C.bg }}>
          <OBProgress step={0} />
          <div className="mt-8 mb-6">
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
                {r.multi && <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: C.mint, color: '#3a7a50' }}>다인 연결</span>}
              </button>
            ))}
          </div>
          <Btn full disabled={!relType} style={{ marginTop: 24 }} onClick={() => setStep(1)}>다음</Btn>
        </div>
      )}

      {/* Step 2: 방식 선택 */}
      {step === 1 && (
        <div className="flex flex-col min-h-screen px-6 py-10" style={{ background: C.bg }}>
          <OBProgress step={1} />
          <div className="mt-8 mb-6">
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
                <p className="text-xs mt-0.5" style={{ color: C.sub }}>30개를 채워보세요! 달성하면 보상이 생겨요</p>
              </div>
              {sysType === 'grape' && <Check className="w-4 h-4" style={{ color: C.primary }} />}
            </button>
            {sysType && (
              <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: C.muted }}>
                {sysType === 'grape'
                  ? <GrapeBunch filled={8} total={30} size="sm" />
                  : <div className="text-center w-16">
                      <p className="text-3xl font-bold" style={{ color: C.text, fontFamily: 'Noto Serif KR, serif' }}>{sysType === 'subtract' ? '100' : '0'}</p>
                      <p className="text-xs" style={{ color: C.sub }}>시작 점수</p>
                    </div>
                }
                <div>
                  <p className="text-sm font-semibold" style={{ color: C.text }}>
                    {sysType === 'subtract' && '100점에서 시작해요'}
                    {sysType === 'add' && '0점에서 시작해요'}
                    {sysType === 'grape' && '포도알 30개를 모아요'}
                  </p>
                  <p className="text-xs mt-1" style={{ color: C.sub }}>
                    {sysType === 'subtract' && '감점이 쌓이면 점수가 줄어들어요'}
                    {sysType === 'add' && '칭찬받을수록 점수가 올라가요'}
                    {sysType === 'grape' && '다 채우면 특별 보상이 생겨요!'}
                  </p>
                </div>
              </div>
            )}
          </div>
          <Btn full disabled={!sysType} style={{ marginTop: 24 }} onClick={() => setStep(2)}>다음</Btn>
        </div>
      )}

      {/* Step 3: 권한 선택 */}
      {step === 2 && (
        <div className="flex flex-col min-h-screen px-6 py-10" style={{ background: C.bg }}>
          <OBProgress step={2} />
          <div className="mt-8 mb-6">
            <h2 className="text-2xl font-bold" style={{ color: C.text, fontFamily: 'Noto Serif KR, serif' }}>누가 점수를 줄 수 있나요?</h2>
            <p className="text-sm mt-2" style={{ color: C.sub }}>포인트 권한을 설정해요</p>
          </div>
          <div className="space-y-3 flex-1">
            <SelectCard icon="👑" title="관리자형" badge="추천"
              desc={'관리자만 점수를 주거나 빼요\n책임감 있는 포인트 관리!'}
              selected={permType === 'admin'} onClick={() => setPermType('admin')} />
            <SelectCard icon="🤝" title="자유형"
              desc={'모든 멤버가 서로 점수를 주고받을 수 있어요\n활발한 칭찬 문화!'}
              selected={permType === 'all'} onClick={() => setPermType('all')} />
          </div>
          <Btn full disabled={!permType || loading} style={{ marginTop: 24 }} onClick={finishOnboarding}>
            {loading ? '저장 중...' : '완료'}
          </Btn>
        </div>
      )}
    </PhoneFrame>
  )
}
