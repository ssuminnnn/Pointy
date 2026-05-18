import { PhoneFrame, C } from '@/components/ui/pointy'

function Skeleton({ w = 'w-full', h = 'h-4', rounded = 'rounded-xl' }: { w?: string; h?: string; rounded?: string }) {
  return <div className={`${w} ${h} ${rounded} animate-pulse`} style={{ background: C.muted }} />
}

export default function DashboardLoading() {
  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-screen pb-24" style={{ background: C.page }}>
        <header className="sticky top-0 z-20 border-b" style={{ background: 'rgba(255,255,255,0.94)', borderColor: C.border }}>
          <div className="max-w-[390px] mx-auto px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton w="w-7" h="h-7" rounded="rounded-full" />
              <Skeleton w="w-16" h="h-5" />
            </div>
            <div className="flex gap-2">
              <Skeleton w="w-9" h="h-9" rounded="rounded-full" />
              <Skeleton w="w-9" h="h-9" rounded="rounded-full" />
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-[390px] mx-auto w-full px-5 py-5 space-y-4">
          <Skeleton w="w-40" h="h-5" />

          {/* 점수 카드 */}
          <div className="rounded-3xl border p-5 shadow-sm" style={{ background: C.card, borderColor: C.border }}>
            <Skeleton w="w-20" h="h-3" rounded="rounded-full" />
            <div className="flex flex-col items-center gap-3 mt-4">
              <Skeleton w="w-24" h="h-24" rounded="rounded-full" />
              <Skeleton w="w-32" h="h-10" rounded="rounded-2xl" />
              <Skeleton w="w-full" h="h-2" rounded="rounded-full" />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2">
            <Skeleton h="h-12" rounded="rounded-2xl" />
            <Skeleton h="h-12" rounded="rounded-2xl" />
          </div>

          {/* 최근 기록 */}
          <div className="rounded-3xl border p-5 shadow-sm space-y-4" style={{ background: C.card, borderColor: C.border }}>
            <Skeleton w="w-24" h="h-4" />
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton w="w-9" h="h-9" rounded="rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton h="h-3" />
                  <Skeleton w="w-24" h="h-3" />
                </div>
                <Skeleton w="w-10" h="h-4" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </PhoneFrame>
  )
}
