'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, Check, QrCode, UserPlus } from 'lucide-react'
import { Btn, FInput, SelectCard, PhoneFrame, C } from '@/components/ui/pointy'
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
  const [isAdmin, setIsAdmin] = useState<boolean|null>(null)
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadCode() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('invite_code, partner_id, group_id').eq('id', user.id).single()
      if (data) {
        setMyCode(data.invite_code)
        if (data.group_id || data.partner_id) router.push('/dashboard')
      }
    }
    loadCode()
  }, [])

  async function handleConnect() {
    if (code.trim().length < 4 || isAdmin === null) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error: rpcError } = await supabase.rpc('connect_partners', {
      my_id: user.id,
      partner_code: code.trim().toUpperCase(),
      my_role: isAdmin,
    })

    if (rpcError || data !== 'success') {
      const msgs: Record<string, string> = {
        invalid_code: '유효하지 않은 코드예요',
        self_connect: '본인 코드는 사용할 수 없어요',
        already_connected: '이미 연결된 코드예요',
      }
      setError(msgs[data] ?? '연결에 실패했어요')
      setLoading(false)
      return
    }

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
          <p className="text-sm mt-2" style={{ color: C.sub }}>코드를 공유하거나 상대방 코드를 입력해요</p>
        </div>

        {/* 내 코드 */}
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
          <span className="text-xs font-medium" style={{ color: C.sub }}>파트너 코드로 연결</span>
          <div className="flex-1 h-px" style={{ background: C.border }} />
        </div>

        {/* 코드 입력 */}
        <FInput placeholder="코드 입력 (예: A3K9XP)" value={code} onChange={v => setCode(v.toUpperCase())} error={error} />

        {/* 역할 선택 */}
        <div className="mt-4 space-y-3">
          <p className="text-xs font-semibold" style={{ color: C.text }}>내 역할 선택</p>
          <SelectCard icon="👑" title="관리자"
            desc={'점수를 주거나 빼는 역할'}
            selected={isAdmin === true} onClick={() => setIsAdmin(true)} />
          <SelectCard icon="🌸" title="일반"
            desc={'점수를 받는 역할'}
            selected={isAdmin === false} onClick={() => setIsAdmin(false)} />
        </div>

        <Btn full disabled={code.length < 4 || isAdmin === null || loading}
          style={{ marginTop: 16 }} onClick={handleConnect}>
          {loading ? '연결 중...' : <><UserPlus className="w-4 h-4" /> 연결하기</>}
        </Btn>

        <button onClick={() => router.push('/dashboard')} className="w-full text-center text-sm mt-4" style={{ color: C.sub }}>
          나중에 연결할게요
        </button>
      </div>
    </PhoneFrame>
  )
}
