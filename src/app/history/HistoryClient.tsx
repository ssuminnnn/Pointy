'use client'

import Link from 'next/link'
import { ChevronLeft, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { PhoneFrame, C } from '@/components/ui/pointy'
import { BottomNav } from '@/components/BottomNav'

interface HistoryRecord { id: string; amount: number; reason: string; created_at: string; from_user: { nickname: string }|null }

export default function HistoryClient({ records, systemType }: { records: HistoryRecord[]; systemType: string }) {
  const isGrape = systemType === 'sticker'

  const grouped = records.reduce<Record<string, HistoryRecord[]>>((acc, r) => {
    const date = new Date(r.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    ;(acc[date] ??= []).push(r)
    return acc
  }, {})

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-screen pb-24" style={{ background: C.page }}>
        <header className="sticky top-0 z-20 border-b" style={{ background: 'rgba(255,255,255,0.94)', borderColor: C.border, backdropFilter: 'blur(12px)' }}>
          <div className="max-w-[390px] mx-auto px-5 py-3.5 flex items-center gap-3">
            <Link href="/dashboard" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.muted }}>
              <ChevronLeft className="w-4 h-4" style={{ color: C.text }} />
            </Link>
            <h2 className="text-lg font-bold" style={{ color: C.text, fontFamily: 'Noto Serif KR, serif' }}>기록 히스토리</h2>
          </div>
        </header>

        <main className="flex-1 max-w-[390px] mx-auto w-full px-5 py-5 space-y-5">
          {Object.keys(grouped).length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <span className="text-4xl">📋</span>
              <p className="text-sm" style={{ color: C.sub }}>아직 기록이 없어요</p>
            </div>
          )}
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <p className="text-xs font-semibold mb-3" style={{ color: C.sub }}>{date}</p>
              <div className="rounded-3xl border overflow-hidden shadow-sm" style={{ background: C.card, borderColor: C.border }}>
                {(items as HistoryRecord[]).map((item, i) => (
                  <div key={item.id} className="flex items-center gap-3 px-5 py-4"
                    style={{ borderTop: i > 0 ? `1px solid ${C.muted}` : undefined }}>
                    <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: item.amount > 0 ? '#e6f7ec' : '#ffeaea' }}>
                      {item.amount > 0
                        ? <ArrowUpRight className="w-4 h-4" style={{ color: C.positive }} />
                        : <ArrowDownRight className="w-4 h-4" style={{ color: C.negative }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: C.text }}>{item.reason}</p>
                      <p className="text-xs mt-0.5" style={{ color: C.sub }}>
                        {new Date(item.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} · {item.from_user?.nickname}
                      </p>
                    </div>
                    <span className="text-sm font-bold flex-shrink-0"
                      style={{ color: item.amount > 0 ? C.positive : C.negative }}>
                      {item.amount > 0 ? '+' : ''}{item.amount}{isGrape ? '알' : '점'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>

        <BottomNav active="history" />
      </div>
    </PhoneFrame>
  )
}
