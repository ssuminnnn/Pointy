import sharp from 'sharp'
import { writeFileSync } from 'fs'

const SIZE = 1024
const R = 224 // 아이콘 모서리 반경

const svg = `
<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="40%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#FFD6DF"/>
      <stop offset="100%" stop-color="#F4879E"/>
    </radialGradient>
    <radialGradient id="coinGrad" cx="38%" cy="32%" r="65%">
      <stop offset="0%" stop-color="#fff8fa"/>
      <stop offset="100%" stop-color="#FFD0DB"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="28" flood-color="#c45070" flood-opacity="0.28"/>
    </filter>
    <filter id="innerGlow">
      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    <clipPath id="rounded">
      <rect width="${SIZE}" height="${SIZE}" rx="${R}" ry="${R}"/>
    </clipPath>
  </defs>

  <!-- 배경 -->
  <rect width="${SIZE}" height="${SIZE}" rx="${R}" ry="${R}" fill="url(#bg)"/>

  <!-- 은은한 광택 원 -->
  <ellipse cx="380" cy="280" rx="340" ry="260" fill="white" opacity="0.12"/>

  <!-- 코인 원 (그림자) -->
  <circle cx="512" cy="516" r="310" fill="#c45070" opacity="0.25" filter="url(#shadow)"/>

  <!-- 코인 원 (메인) -->
  <circle cx="512" cy="504" r="310" fill="url(#coinGrad)"/>

  <!-- 코인 테두리 링 -->
  <circle cx="512" cy="504" r="284" fill="none" stroke="white" stroke-width="8" opacity="0.55"/>
  <circle cx="512" cy="504" r="260" fill="none" stroke="white" stroke-width="3" opacity="0.25"/>

  <!-- P 글자 -->
  <text
    x="528"
    y="620"
    text-anchor="middle"
    font-size="400"
    font-weight="800"
    font-family="Georgia, 'Noto Serif KR', serif"
    fill="#d4607a"
    opacity="0.92"
    letter-spacing="-8"
  >P</text>

  <!-- 하단 앱 이름 -->
  <text
    x="512"
    y="900"
    text-anchor="middle"
    font-size="72"
    font-weight="700"
    font-family="Georgia, serif"
    fill="white"
    opacity="0.90"
    letter-spacing="8"
  >POINTY</text>

  <!-- 하단 장식 점 -->
  <circle cx="372" cy="938" r="6" fill="white" opacity="0.45"/>
  <circle cx="512" cy="938" r="6" fill="white" opacity="0.45"/>
  <circle cx="652" cy="938" r="6" fill="white" opacity="0.45"/>
</svg>
`

const outPath = '/Users/kimsumin/Desktop/pointy-icon-1024.png'

await sharp(Buffer.from(svg))
  .png()
  .toFile(outPath)

console.log('✅ 아이콘 저장됨:', outPath)
