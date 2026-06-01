'use client'

import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ImagePreviewProps {
  src: string
  alt: string
  fileName?: string | null
  size?: 'sm' | 'md'
  analyzing?: boolean
  onClear?: () => void
}

export function ImagePreview({
  src,
  alt,
  fileName,
  size = 'md',
  analyzing = false,
  onClear,
}: ImagePreviewProps) {
  const maxH = size === 'sm' ? 'max-h-64' : 'max-h-96'

  return (
    <div className="relative rounded-xl overflow-hidden border bg-card transition-all duration-500 ease-in-out">
      <div
        className={cn(
          'relative flex items-center justify-center bg-black/5 transition-all duration-500 ease-in-out',
          maxH
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={cn('w-full object-contain transition-all duration-500 ease-in-out', maxH)}
        />
        {analyzing && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px]">
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-primary/20 to-transparent animate-scan-sweep" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-2 border-primary/40 animate-pulse" />
            </div>
          </div>
        )}
        {fileName && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 max-w-[calc(100%-1.5rem)] z-10">
            <Badge
              variant="secondary"
              className="max-w-full truncate bg-background/90 backdrop-blur-sm shadow-sm"
              title={fileName}
            >
              {fileName}
            </Badge>
          </div>
        )}
      </div>
      {onClear && !analyzing && (
        <button
          onClick={onClear}
          className="absolute top-2 right-2 bg-background/80 hover:bg-background rounded-full p-1 shadow transition-colors z-10"
          aria-label="Remove image"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
