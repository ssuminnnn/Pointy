'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { PCoinLogo, FInput, Btn, PhoneFrame, C } from '@/components/ui/pointy'
import { loginAction } from '@/app/actions/auth'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleLogin() {
    if (!username.trim()) { setError('아이디를 입력해주세요'); return }
    setError('')
    startTransition(async () => {
      const err = await loginAction(username, pw)
      if (err) setError(err)
    })
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
          <Btn full disabled={isPending} onClick={handleLogin}>
            {isPending ? '로그인 중...' : '로그인'}
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
