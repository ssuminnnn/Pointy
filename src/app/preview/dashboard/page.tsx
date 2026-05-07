import Link from 'next/link'

export default function DashboardPreview() {
  return (
    <div className="min-h-screen pb-24" style={{ background: '#FFF0F5' }}>
      {/* 헤더 */}
      <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10" style={{ borderBottom: '1px solid #FFE4EE' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFB7C5, #FF8FAB)' }}>
            <span className="text-lg">🌸</span>
          </div>
          <span className="font-bold" style={{ color: '#C75B7A' }}>포인티</span>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer" style={{ background: '#FFF0F5' }}>
          <span className="text-lg">👤</span>
        </div>
      </header>

      <main className="max-w-sm mx-auto px-4 py-6 space-y-4">
        {/* 파트너 정보 */}
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: '#E8A0B0' }}>파트너</span>
          <span className="font-semibold" style={{ color: '#C75B7A' }}>민지 💕</span>
        </div>

        {/* 점수 카드 */}
        <div className="rounded-3xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #FFB7C5 0%, #FF8FAB 60%, #FF6B9D 100%)', boxShadow: '0 12px 40px rgba(255, 143, 171, 0.4)' }}>
          <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.75)' }}>민지의 현재 점수</p>
          <div className="flex items-end gap-2 mb-5">
            <span className="text-6xl font-bold">87</span>
            <span className="text-xl mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>점</span>
          </div>
          <div className="rounded-full h-2" style={{ background: 'rgba(255,255,255,0.25)' }}>
            <div className="rounded-full h-2" style={{ width: '87%', background: 'white' }} />
          </div>
          <div className="flex justify-between text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <span>0점</span>
            <span>100점</span>
          </div>
        </div>

        {/* +/- 버튼 */}
        <div className="grid grid-cols-2 gap-3">
          <button className="py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2" style={{ background: '#F0FDF4', border: '2px solid #BBF7D0', color: '#16A34A' }}>
            <span className="text-lg">＋</span> 칭찬하기
          </button>
          <button className="py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2" style={{ background: '#FFF5F5', border: '2px solid #FECACA', color: '#DC2626' }}>
            <span className="text-lg">－</span> 벌점주기
          </button>
        </div>

        {/* 최근 기록 */}
        <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 20px rgba(255, 182, 197, 0.15)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ color: '#3D2030' }}>최근 기록</h3>
            <Link href="/preview/history" className="text-xs font-medium" style={{ color: '#FF8FAB' }}>전체보기</Link>
          </div>
          <div className="space-y-3">
            {[
              { amount: '+5', reason: '데이트 잘 준비함', time: '오늘 14:30', positive: true },
              { amount: '-3', reason: '연락 늦음', time: '오늘 10:15', positive: false },
              { amount: '+10', reason: '생일 깜짝 이벤트', time: '어제 18:00', positive: true },
              { amount: '-2', reason: '약속 늦음', time: '어제 12:00', positive: false },
              { amount: '+5', reason: '청소 도움', time: '2일 전', positive: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold"
                  style={{ background: item.positive ? '#F0FDF4' : '#FFF5F5', color: item.positive ? '#16A34A' : '#DC2626' }}>
                  {item.amount}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#3D2030' }}>{item.reason}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#C4A0AC' }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 하단 탭바 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white px-6 py-3" style={{ borderTop: '1px solid #FFE4EE' }}>
        <div className="max-w-sm mx-auto flex justify-around">
          <button className="flex flex-col items-center gap-1">
            <span className="text-xl">🏠</span>
            <span className="text-xs font-semibold" style={{ color: '#FF8FAB' }}>홈</span>
          </button>
          <Link href="/preview/history" className="flex flex-col items-center gap-1">
            <span className="text-xl">📋</span>
            <span className="text-xs" style={{ color: '#C4A0AC' }}>히스토리</span>
          </Link>
          <button className="flex flex-col items-center gap-1">
            <span className="text-xl">⚙️</span>
            <span className="text-xs" style={{ color: '#C4A0AC' }}>설정</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
