'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

export const C = {
  bg:       '#ffffff',
  page:     '#fdf9fa',
  card:     '#ffffff',
  primary:  '#FFB7C5',
  rose:     '#F2C7C7',
  mint:     '#D5F3D8',
  border:   '#F0D5DA',
  text:     '#2e1f24',
  sub:      '#a07880',
  muted:    '#FFF0F3',
  positive: '#5aaa78',
  negative: '#E87070',
} as const

export const AVATARS = ['#FFB7C5','#F2C7C7','#D5F3D8','#C7D8F2','#E8C7F2','#F2ECC7']

export function PCoinLogo({ size = 40, bg = C.primary }: { size?: number; bg?: string }) {
  const c = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="포인티 로고">
      <circle cx={c} cy={c} r={c} fill={bg} />
      <circle cx={c} cy={c} r={c * 0.82} fill="none" stroke="white" strokeWidth={size * 0.03} opacity={0.35} />
      <text x={c + size * 0.03} y={c + size * 0.15} textAnchor="middle" fontSize={size * 0.5} fontWeight="800" fill="white" fontFamily="Noto Serif KR, Georgia, serif">P</text>
    </svg>
  )
}

export function GrapeBunch({ filled, total = 30, size = 'md' }: { filled: number; total?: number; size?: 'sm'|'md'|'lg' }) {
  const dim = size === 'sm' ? 64 : size === 'lg' ? 180 : 120
  const r   = size === 'sm' ? 5  : size === 'lg' ? 13  : 9
  const gap = r * 2.35
  // 1+2+3+4+5+5+4+3+2+1 = 30 (정확히 30칸)
  const layout = [1,2,3,4,5,5,4,3,2,1]
  const contentH = Math.ceil(17 + (layout.length - 1) * gap * 0.86 + r * 2 + 6)
  let idx = 0
  return (
    <svg viewBox={`0 0 ${dim} ${contentH}`} width={dim} height={contentH} aria-label="포도송이">
      <rect x={dim/2-2} y="1" width="4" height="13" rx="2" fill="#7fc47f" />
      <ellipse cx={dim/2+8} cy="8" rx="8" ry="5" fill="#9de09d" transform={`rotate(-28 ${dim/2+8} 8)`}/>
      <ellipse cx={dim/2-8} cy="7" rx="6" ry="4" fill="#9de09d" transform={`rotate(22 ${dim/2-8} 7)`}/>
      {(() => {
        const nodes: React.ReactNode[] = []
        let y = 17
        for (const count of layout) {
          const startX = dim/2 - (count-1)*(gap/2)
          for (let c2 = 0; c2 < count; c2++) {
            if (idx >= total) break
            const x = startX + c2 * gap
            const on = idx < filled
            nodes.push(
              <g key={idx}>
                <circle cx={x} cy={y} r={r}
                  fill={on ? '#7B4DAA' : 'rgba(216,200,236,0.25)'}
                  stroke={on ? '#5e3585' : '#d8c8ec'}
                  strokeWidth={on ? '0.8' : '1.2'}
                />
                {on && <circle cx={x-r*.28} cy={y-r*.28} r={r*.28} fill="rgba(255,255,255,.4)"/>}
              </g>
            )
            idx++
          }
          if (idx >= total) break
          y += gap * 0.86
        }
        return nodes
      })()}
    </svg>
  )
}

export function Btn({ children, onClick, variant = 'primary', full = false, disabled = false, style = {}, type = 'button' }: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary'|'secondary'|'ghost'|'danger'
  full?: boolean
  disabled?: boolean
  style?: React.CSSProperties
  type?: 'button'|'submit'
}) {
  const base = `inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed${full ? ' w-full' : ''}`
  const vs: Record<string, React.CSSProperties> = {
    primary:   { background: C.primary, color: C.text },
    secondary: { background: C.muted, color: C.text },
    ghost:     { background: 'transparent', color: C.sub },
    danger:    { background: '#ffeaea', color: C.negative },
  }
  return (
    <button type={type} className={base} style={{ ...vs[variant], ...style }} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export function FInput({ label, type = 'text', placeholder, value, onChange, error, name, defaultValue }: {
  label?: string; type?: string; placeholder?: string
  value?: string; onChange?: (v: string) => void
  error?: string; name?: string; defaultValue?: string
}) {
  const [focus, setFocus] = useState(false)
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-semibold" style={{ color: C.text }}>{label}</label>}
      <input
        type={type} name={name} value={value} defaultValue={defaultValue}
        onChange={e => onChange?.(e.target.value)} placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none transition-all border-2 placeholder:opacity-40"
        style={{ background: C.muted, color: C.text, borderColor: error ? C.negative : focus ? C.primary : 'transparent' }}
      />
      {error && <p className="text-xs" style={{ color: C.negative }}>{error}</p>}
    </div>
  )
}

export function OBProgress({ step, total = 3 }: { step: number; total?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="rounded-full transition-all duration-300"
          style={{ width: i <= step ? 24 : 8, height: 8, background: i <= step ? C.primary : C.border }} />
      ))}
      <span className="ml-2 text-xs font-medium" style={{ color: C.sub }}>{step + 1}/{total}</span>
    </div>
  )
}

export function SelectCard({ icon, title, desc, selected, onClick, badge }: {
  icon: string; title: string; desc?: string; selected: boolean; onClick: () => void; badge?: string
}) {
  return (
    <button onClick={onClick} className="w-full text-left rounded-2xl p-4 border-2 transition-all relative"
      style={{ borderColor: selected ? C.primary : C.border, background: selected ? '#FFF5F7' : C.card }}>
      {badge && <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: C.primary, color: C.text }}>{badge}</span>}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: C.text }}>{title}</p>
          {desc && <p className="text-xs mt-0.5 leading-relaxed whitespace-pre-line" style={{ color: C.sub }}>{desc}</p>}
        </div>
        {selected && <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: C.primary }}><Check className="w-3 h-3 text-white" /></div>}
      </div>
    </button>
  )
}

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen sm:flex sm:items-start sm:justify-center sm:py-10" style={{ background: '#F0E8EA' }}>
      <div className="sm:w-[390px] sm:rounded-[44px] sm:shadow-2xl sm:overflow-hidden sm:border relative"
        style={{ borderColor: C.border, background: C.bg }}>
        {children}
      </div>
    </div>
  )
}
