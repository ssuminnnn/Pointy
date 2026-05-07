'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, Check, QrCode, UserPlus } from 'lucide-react'
import { Btn, FInput, PhoneFrame, C, AVATARS } from '@/components/ui/pointy'
import { createClient } from '@/utils/supabase/client'

function FakeQR({ value = 'PNTY-4827', size = 150 }: { value?: string; size?: number }) {
  const cells = 19, cell = size / cells
  const hash  = value.split('').reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) | 0, 0)
  function bit(r: number, c: number) {
    if ((r<7&&c<7)||(r<7&&c>cells-8)||(r>cells-8&&c<7)) return true
    if (r===6||c===6) return (r+c)%2===0
    return Math.abs((r*19+c*7+hash)%3)===0
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" rx="10"/>
      {Array.from({length:cells}).flatMap((_,r)=>
        Array.from({length:cells}).map((_,c)=>
          bit(r,c) ? (
            <rect key={`${r}-${c}`} x={c*cell+0.5} y={r*cell+0.5} width={cell-1} height={cell-1} rx={cell*.2}
              fill={r<7&&c<7?C.primary:r<7&&c>cells-8?C.rose:r>cells-8&&c<7?C.mint:C.text}/>
          ) : null
        )
      )}
    </svg>
  )
}

export default function ConnectPage() {
  const router = useRouter()
  const [myCode, setMyCode] = useState('')
  const [code, setCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadCode() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('invite_code').eq('id', user.id).single()
      if (data) setMyCode(data.invite_code)
    }
    loadCode()
  }, [])

  async function handleConnect() {
    if (code.trim().length < 4) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const inputCode = code.trim().toUpperCase()
    const { data: myProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (!myProfile) { setError('프로필을 찾을 수 없어요'); setLoading(false); return }
    if (myProfile.invite_code === inputCode) { setError('본인의 코드는 사용할 수 없어요'); setLoading(false); return }

    const { data: partner } = await supabase.from('profiles').select('*').eq('invite_code', inputCode).single()
    if (!partner) { setError('유효하지 않은 코드예요'); setLoading(false); return }
    if (partner.partner_id) { setError('이미 연결된 코드예요'); setLoading(false); return }

    await supabase.from('profiles').update({ partner_id: partner.id }).eq('id', user.id)
    await supabase.from('profiles').update({ partner_id: user.id }).eq('id', partner.id)

    router.push('/dashboard')
  }

  function copyCode() {
    navigator.clipboard.writeText(myCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-screen px-6 py-10" style={{ background: C.bg }}>
        <div className="mt-4 mb-6">
          <h2 className="text-2xl font-bold" style={{ color: C.text, fontFamily: 'Noto Serif KR, serif' }}>파트너와 연결하기</h2>
          <p className="text-sm mt-2" style={{ color: C.sub }}>상대방과 코드를 교환해요</p>
        </div>

        <div className="rounded-3xl border p-5 shadow-sm mb-4" style={{ background: C.card, borderColor: C.border }}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: C.sub }}>내 초대 코드</p>
          {showQR ? (
            <div className="flex flex-col items-center gap-3">
              <FakeQR value={myCode} size={150} />
              <p className="text-sm font-bold tracking-[0.14em]" style={{ color: C.text }}>{myCode}</p>
              <button onClick={() => setShowQR(false)} className="text-xs hover:underline" style={{ color: C.sub }}>코드로 보기</button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <p className="text-4xl font-bold tracking-[0.14em]" style={{ color: C.text, fontFamily: 'Noto Serif KR, serif' }}>{myCode || '------'}</p>
              <div className="flex gap-2">
                <Btn variant="secondary" onClick={copyCode}>
                  {copied ? <><Check className="w-4 h-4" style={{ color: C.positive }} />복사됨</> : <><Copy className="w-4 h-4" />복사</>}
                </Btn>
                <Btn variant="secondary" onClick={() => setShowQR(true)}><QrCode className="w-4 h-4" /> QR코드</Btn>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: C.border }} />
          <span className="text-xs font-medium" style={{ color: C.sub }}>또는</span>
          <div className="flex-1 h-px" style={{ background: C.border }} />
        </div>

        <div className="flex gap-2 mb-2">
          <div className="flex-1">
            <FInput placeholder="코드 입력 (예: A3K9XP)" value={code} onChange={setCode} error={error} />
          </div>
          <Btn disabled={code.length < 4 || loading} onClick={handleConnect} style={{ flexShrink: 0 }}>
            <UserPlus className="w-4 h-4" />
          </Btn>
        </div>

        <div className="mt-auto pt-8">
          <button onClick={() => router.push('/dashboard')} className="w-full text-center text-sm" style={{ color: C.sub }}>
            나중에 연결할게요
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}
