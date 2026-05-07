import Link from 'next/link'

export default function ConnectPreview() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#FFF0F5' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: '#C75B7A' }}>파트너 연결</h1>
          <p className="text-sm mt-1" style={{ color: '#E8A0B0' }}>코드를 공유해서 연결해요</p>
        </div>

        <div className="bg-white rounded-3xl p-8 space-y-6" style={{ boxShadow: '0 8px 40px rgba(255, 182, 197, 0.25)' }}>
          <div>
            <p className="text-sm font-medium mb-3" style={{ color: '#9B6B7A' }}>내 초대 코드</p>
            <div className="rounded-2xl p-5 text-center" style={{ background: '#FFF5F8', border: '2px dashed #FFB7C5' }}>
              <p className="text-3xl font-bold tracking-[0.3em]" style={{ color: '#FF8FAB' }}>A3K9XP</p>
              <button className="mt-3 text-xs font-medium px-4 py-1.5 rounded-full bg-white" style={{ color: '#FF8FAB', border: '1px solid #FFB7C5' }}>
                복사하기 📋
              </button>
            </div>
            <p className="text-xs text-center mt-2" style={{ color: '#E8A0B0' }}>이 코드를 파트너에게 공유하세요</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: '#FFE4EE' }} />
            <span className="text-sm" style={{ color: '#E8A0B0' }}>또는</span>
            <div className="flex-1 h-px" style={{ background: '#FFE4EE' }} />
          </div>

          <div>
            <p className="text-sm font-medium mb-3" style={{ color: '#9B6B7A' }}>파트너 코드 입력</p>
            <input
              type="text"
              placeholder="코드 6자리 입력"
              maxLength={6}
              className="w-full px-4 py-3 rounded-2xl text-center text-xl font-bold tracking-widest outline-none uppercase"
              style={{ background: '#FFF5F8', border: '1.5px solid #FFD6E4', color: '#3D2030' }}
            />
            <Link href="/preview/dashboard">
              <button
                className="w-full mt-3 py-3.5 text-white font-semibold rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #FFB7C5, #FF8FAB)' }}
              >
                연결하기
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
