import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '포인티',
  description: '우리만의 칭찬 점수 관리',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Noto+Serif+KR:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Noto Sans KR', sans-serif", background: '#F0E8EA', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
