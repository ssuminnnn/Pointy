'use client'

import Link from 'next/link'
import { Home, History, Settings } from 'lucide-react'
import { C } from './ui/pointy'

type Tab = 'dashboard' | 'history' | 'settings'

export function BottomNav({ active }: { active: Tab }) {
  const tabs = [
    { icon: Home,     label: '홈',       href: '/dashboard',  key: 'dashboard' as Tab },
    { icon: History,  label: '히스토리',  href: '/history',    key: 'history'   as Tab },
    { icon: Settings, label: '설정',      href: '/settings',   key: 'settings'  as Tab },
  ]

  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 border-t"
      style={{ background: 'rgba(255,255,255,0.95)', borderColor: C.border, backdropFilter: 'blur(12px)' }}>
      <div className="max-w-[390px] mx-auto flex">
        {tabs.map(({ icon: Icon, label, href, key }) => (
          <Link key={key} href={href}
            className="flex-1 flex flex-col items-center gap-1 py-3.5 transition-colors"
            style={{ color: active === key ? '#d4607a' : '#d4b0b8' }}>
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
