'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { FInput, Btn, PhoneFrame, C } from '@/components/ui/pointy'
import { createClient } from '@/utils/supabase/client'

function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function SignupPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [nick, setNick] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const mismatch = pw2.length > 0 && pw !== pw2

  async function handleSignup() {
    if (!username.trim()) { setError('아이디를 입력해주세요'); return }
    if (!nick.trim()) { setError('닉네임을 입력해주세요'); return }
    if (pw.length < 6) { setError('비밀번호는 6자 이상이어야 해요'); return }
    if (mismatch) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const email = `${username.trim().toLowerCase()}@pointy.app`

    // 아이디 중복 확인
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username.trim().toLowerCase())
      .single()

    if (existing) {
      setError('이미 사용 중인 아이디예요')
      setLoading(false)
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password: pw })
    if (signUpError || !data.user) {
      setError(signUpError?.message ?? '회원가입에 실패했어요')
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: username.trim().toLowerCase(),
      nickname: nick.trim(),
      invite_code: generateInviteCode(),
    })

    if (profileError) {
      setError('프로필 생성에 실패했어요')
      setLoading(false)
      return
    }

    router.push('/onboarding')
  }

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-screen px-6 py-10" style={{ background: C.bg }}>
        <Link href="/" className="flex items-center gap-1 mb-6 text-sm" style={{ color: C.sub }}>
          <ChevronLeft className="w-4 h-4" /> 로그인으로
        </Link>
        <h1 className="text-2xl font-bold mb-1" style={{ color: C.text, fontFamily: 'Noto Serif KR, serif' }}>회원가입</h1>
        <p className="text-sm mb-8" style={{ color: C.sub }}>포인티와 함께 시작해요 🌸</p>
        <div className="space-y-4">
          <FInput label="아이디" placeholder="영문, 숫자 조합" value={username} onChange={v => setUsername(v.toLowerCase())} />
          <FInput label="닉네임" placeholder="상대방에게 보여질 이름" value={nick} onChange={setNick} />
          <FInput label="비밀번호" type="password" placeholder="6자 이상" value={pw} onChange={setPw} />
          <FInput label="비밀번호 확인" type="password" placeholder="비밀번호 재입력" value={pw2} onChange={setPw2}
            error={mismatch ? '비밀번호가 일치하지 않아요' : error || undefined} />
          <Btn full disabled={mismatch || loading} onClick={handleSignup}>
            {loading ? '가입 중...' : '회원가입'}
          </Btn>
          <p className="text-center text-xs" style={{ color: C.sub }}>
            이미 계정이 있으신가요?{' '}
            <Link href="/" className="font-semibold hover:underline" style={{ color: '#d4607a' }}>로그인</Link>
          </p>
        </div>
      </div>
    </PhoneFrame>
  )
}
