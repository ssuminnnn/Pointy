'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { FInput, Btn, PhoneFrame, C } from '@/components/ui/pointy'
import { signupAction } from '@/app/actions/auth'

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [nick, setNick] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const mismatch = pw2.length > 0 && pw !== pw2

  function handleSignup() {
    if (!username.trim()) { setError('아이디를 입력해주세요'); return }
    if (!nick.trim()) { setError('닉네임을 입력해주세요'); return }
    if (pw.length < 6) { setError('비밀번호는 6자 이상이어야 해요'); return }
    if (mismatch) return
    setError('')
    startTransition(async () => {
      const err = await signupAction(username, nick, pw)
      if (err) setError(err)
    })
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
          <Btn full disabled={mismatch || isPending} onClick={handleSignup}>
            {isPending ? '가입 중...' : '회원가입'}
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
