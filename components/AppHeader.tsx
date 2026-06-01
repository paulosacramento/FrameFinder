'use client'

import Link from 'next/link'
import { Satellite } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface AppHeaderProps {
  onHomeClick?: () => void
  showAiBadge?: boolean
}

export function AppHeader({ onHomeClick, showAiBadge = false }: AppHeaderProps) {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            onClick={onHomeClick}
            className="flex items-center gap-2 rounded-md hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Satellite className="h-5 w-5 text-primary" />
            <span className="font-semibold text-base">FrameFinder</span>
          </Link>
          {showAiBadge && (
            <Badge variant="outline" className="text-xs hidden sm:inline-flex">
              AI
            </Badge>
          )}
        </div>
      </div>
    </header>
  )
}
