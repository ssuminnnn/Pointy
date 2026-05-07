import Link from 'next/link'

export default function OnboardingPreview() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#FFF0F5' }}>
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-2 rounded-full" style={{ background: '#FF8FAB' }} />
          <div className="w-8 h-2 rounded-full" style={{ background: '#FFD6E4' }} />
          <div className="w-8 h-2 rounded-full" style={{ background: '#FFD6E4' }} />
        </div>

        <div className="bg-white rounded-3xl p-8" style={{ boxShadow: '0 8px 40px rgba(255, 182, 197, 0.25)' }}>
          <h2 className="text-xl font-bold mb-1" style={{ color: '#3D2030' }}>어떤 관계인가요?</h2>
          <p className="text-sm mb-6" style={{ color: '#C4A0AC' }}>관계 유형에 따라 최적화된 경험을 제공해요</p>

          <div className="space-y-3">
            <div className="rounded-2xl p-5 cursor-pointer" style={{ border: '2px solid #FF8FAB', background: '#FFF5F8' }}>
              <div className="flex items-center gap-4">
                <span className="text-3xl">💑</span>
                <div>
                  <p className="font-semibold" style={{ color: '#3D2030' }}>커플</p>
                  <p className="text-xs mt-0.5" style={{ color: '#C4A0AC' }}>연인 사이에서 사용해요</p>
                </div>
                <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#FF8FAB' }}>
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-5 cursor-pointer" style={{ border: '2px solid #FFE4EE', background: '#FAFAFA' }}>
              <div className="flex items-center gap-4">
                <span className="text-3xl">👨‍👧</span>
                <div>
                  <p className="font-semibold" style={{ color: '#3D2030' }}>부모-자녀</p>
                  <p className="text-xs mt-0.5" style={{ color: '#C4A0AC' }}>자녀 칭찬/상벌점 관리에 좋아요</p>
                </div>
              </div>
            </div>
          </div>

          <Link href="/preview/dashboard">
            <button
              className="w-full mt-8 py-3.5 text-white font-semibold rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #FFB7C5, #FF8FAB)' }}
            >
              다음
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
