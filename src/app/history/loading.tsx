import { PhoneFrame, C } from '@/components/ui/pointy'

function Skeleton({ w = 'w-full', h = 'h-4', rounded = 'rounded-xl' }: { w?: string; h?: string; rounded?: string }) {
  return <div className={`${w} ${h} ${rounded} animate-pulse`} style={{ background: C.muted }} />
}

export default function HistoryLoading() {
  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-screen pb-24" style={{ background: C.page }}>
        <header className="sticky top-0 z-20 border-b" style={{ background: 'rgba(255,255,255,0.94)', borderColor: C.border }}>
          <div className="max-w-[390px] mx-auto px-5 py-3.5 flex items-center gap-3">
            <Skeleton w="w-9" h="h-9" rounded="rounded-full" />
            <Skeleton w="w-24" h="h-5" />
          </div>
        </header>

        <main className="flex-1 max-w-[390px] mx-auto w-full px-5 py-5 space-y-5">
          {[1,2].map(group => (
            <div key={group}>
              <Skeleton w="w-28" h="h-3" rounded="rounded-full" />
              <div className="mt-3 rounded-3xl border overflow-hidden shadow-sm" style={{ background: C.card, borderColor: C.border }}>
                {[1,2,3].map((item, i) => (
                  <div key={item} className="flex items-center gap-3 px-5 py-4"
                    style={{ borderTop: i > 0 ? `1px solid ${C.muted}` : undefined }}>
                    <Skeleton w="w-9" h="h-9" rounded="rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton h="h-3" />
                      <Skeleton w="w-28" h="h-3" />
                    </div>
                    <Skeleton w="w-10" h="h-4" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </PhoneFrame>
  )
}
