import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: '펫파인더 - 완벽한 반려동물을 찾아보세요',
  description: '전국의 신뢰할 수 있는 펫샵에서 사랑스러운 강아지와 고양이를 발견하세요',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
