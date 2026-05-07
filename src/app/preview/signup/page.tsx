import Link from 'next/link'

export default function SignupPreview() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#FFF0F5' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #FFB7C5, #FF8FAB)' }}>
            <span className="text-3xl">🌸</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#C75B7A' }}>포인티</h1>
        </div>

        <div className="bg-white rounded-3xl p-8" style={{ boxShadow: '0 8px 40px rgba(255, 182, 197, 0.25)' }}>
          <h2 className="text-xl font-bold mb-6" style={{ color: '#3D2030' }}>회원가입</h2>

          <div className="space-y-4">
            {[
              { label: '닉네임', type: 'text', placeholder: '닉네임을 입력하세요' },
              { label: '이메일', type: 'email', placeholder: '이메일을 입력하세요' },
              { label: '비밀번호', type: 'password', placeholder: '비밀번호를 입력하세요' },
              { label: '비밀번호 확인', type: 'password', placeholder: '비밀번호를 다시 입력하세요' },
            ].map(({ label, type, placeholder }) => (
              <div key={label}>
                <label className="text-sm font-medium mb-1 block" style={{ color: '#9B6B7A' }}>{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-2xl outline-none transition"
                  style={{ background: '#FFF5F8', border: '1.5px solid #FFD6E4', color: '#3D2030' }}
                />
              </div>
            ))}
          </div>

          <button
            className="w-full mt-6 py-3.5 text-white font-semibold rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #FFB7C5, #FF8FAB)' }}
          >
            회원가입
          </button>

          <p className="text-center text-sm mt-4" style={{ color: '#C4A0AC' }}>
            이미 계정이 있으신가요?{' '}
            <Link href="/" className="font-semibold" style={{ color: '#FF8FAB' }}>로그인</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
