'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PCoinLogo, FInput, Btn, PhoneFrame, C } from '@/components/ui/pointy'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!username.trim()) { setError('아이디를 입력해주세요'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const email = `${username.trim().toLowerCase()}@pointy.app`
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw })
    if (error) {
      setError('아이디 또는 비밀번호가 올바르지 않아요')
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <PhoneFrame>
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12" style={{ background: C.bg }}>
        <div className="mb-10 flex flex-col items-center gap-3">
          <PCoinLogo size={80} />
          <h1 className="text-2xl font-bold" style={{ color: C.text, fontFamily: 'Noto Serif KR, serif' }}>포인티</h1>
          <p className="text-sm" style={{ color: C.sub }}>우리만의 칭찬 점수 관리</p>
        </div>
        <div className="w-full max-w-sm space-y-4">
          <FInput label="아이디" placeholder="아이디를 입력하세요" value={username} onChange={setUsername} />
          <FInput label="비밀번호" type="password" placeholder="비밀번호를 입력해주세요" value={pw} onChange={setPw} error={error} />
          <Btn full disabled={loading} onClick={handleLogin}>
            {loading ? '로그인 중...' : '로그인'}
          </Btn>
          <p className="text-center text-xs" style={{ color: C.sub }}>
            아직 계정이 없으신가요?{' '}
            <Link href="/signup" className="font-semibold hover:underline" style={{ color: '#d4607a' }}>회원가입</Link>
          </p>
        </div>
      </div>
    </PhoneFrame>
  )
}
