import Link from 'next/link'

const historyData = [
  {
    date: '오늘',
    items: [
      { amount: 5, reason: '데이트 잘 준비함', time: '14:30', positive: true },
      { amount: -3, reason: '연락 늦음', time: '10:15', positive: false },
    ],
  },
  {
    date: '어제',
    items: [
      { amount: 10, reason: '생일 깜짝 이벤트', time: '18:00', positive: true },
      { amount: -2, reason: '약속 늦음', time: '12:00', positive: false },
    ],
  },
  {
    date: '5월 3일',
    items: [
      { amount: 5, reason: '청소 도움', time: '20:00', positive: true },
      { amount: 3, reason: '요리 해줌', time: '19:00', positive: true },
      { amount: -5, reason: '약속 취소', time: '11:00', positive: false },
    ],
  },
]

export default function HistoryPreview() {
  return (
    <div className="min-h-screen" style={{ background: '#FFF0F5' }}>
      <header className="bg-white px-6 py-4 flex items-center gap-4 sticky top-0 z-10" style={{ borderBottom: '1px solid #FFE4EE' }}>
        <Link href="/preview/dashboard" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#FFF0F5' }}>
          <span style={{ color: '#C75B7A' }}>←</span>
        </Link>
        <h1 className="font-bold text-lg" style={{ color: '#3D2030' }}>히스토리</h1>
      </header>

      <main className="max-w-sm mx-auto px-4 py-6 space-y-6">
        {historyData.map((group) => (
          <div key={group.date}>
            <p className="text-xs font-semibold mb-2 px-1" style={{ color: '#E8A0B0' }}>{group.date}</p>
            <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(255, 182, 197, 0.15)' }}>
              {group.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 py-4"
                  style={{ borderBottom: i !== group.items.length - 1 ? '1px solid #FFF0F5' : 'none' }}
                >
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm"
                    style={{ background: item.positive ? '#F0FDF4' : '#FFF5F5', color: item.positive ? '#16A34A' : '#DC2626' }}>
                    {item.positive ? `+${item.amount}` : item.amount}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#3D2030' }}>{item.reason}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#C4A0AC' }}>{item.time}</p>
                  </div>
                  <span className="text-sm font-bold" style={{ color: item.positive ? '#16A34A' : '#DC2626' }}>
                    {item.positive ? `+${item.amount}` : item.amount}점
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
