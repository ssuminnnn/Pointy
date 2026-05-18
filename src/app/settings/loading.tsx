import { PhoneFrame, C } from '@/components/ui/pointy'

function Skeleton({ w = 'w-full', h = 'h-4', rounded = 'rounded-xl' }: { w?: string; h?: string; rounded?: string }) {
  return <div className={`${w} ${h} ${rounded} animate-pulse`} style={{ background: C.muted }} />
}

export default function SettingsLoading() {
  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-screen pb-24" style={{ background: C.page }}>
        <header className="sticky top-0 z-20 border-b" style={{ background: 'rgba(255,255,255,0.94)', borderColor: C.border }}>
          <div className="max-w-[390px] mx-auto px-5 py-3.5 flex items-center gap-3">
            <Skeleton w="w-9" h="h-9" rounded="rounded-full" />
            <Skeleton w="w-16" h="h-5" />
          </div>
        </header>

        <main className="flex-1 max-w-[390px] mx-auto w-full px-5 py-5 space-y-4">
          {/* 프로필 */}
          <div className="flex items-center gap-4 rounded-3xl border p-5 shadow-sm" style={{ background: C.card, borderColor: C.border }}>
            <Skeleton w="w-14" h="h-14" rounded="rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton w="w-24" h="h-4" />
              <Skeleton w="w-36" h="h-3" />
            </div>
          </div>

          {/* 관계 설정 */}
          <div className="rounded-3xl border overflow-hidden shadow-sm" style={{ background: C.card, borderColor: C.border }}>
            {[1,2,3].map((i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4"
                style={{ borderTop: i > 1 ? `1px solid ${C.muted}` : undefined }}>
                <Skeleton w="w-12" h="h-3" />
                <Skeleton w="w-16" h="h-3" />
              </div>
            ))}
          </div>

          {/* 초대 코드 */}
          <div className="rounded-3xl border p-5 shadow-sm" style={{ background: C.card, borderColor: C.border }}>
            <Skeleton w="w-20" h="h-3" rounded="rounded-full" />
            <div className="mt-3 rounded-2xl px-4 py-3" style={{ background: C.muted }}>
              <Skeleton w="w-32" h="h-6" />
            </div>
          </div>

          {/* 멤버 */}
          <div className="rounded-3xl border p-5 shadow-sm space-y-3" style={{ background: C.card, borderColor: C.border }}>
            <Skeleton w="w-24" h="h-3" />
            {[1,2].map(i => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton w="w-9" h="h-9" rounded="rounded-full" />
                <Skeleton w="w-24" h="h-4" />
              </div>
            ))}
          </div>

          <Skeleton h="h-12" rounded="rounded-2xl" />
        </main>
      </div>
    </PhoneFrame>
  )
}
