'use client'

import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ImagePreviewProps {
  src: string
  alt: string
  fileName?: string | null
  size?: 'sm' | 'md'
  onClear?: () => void
}

export function ImagePreview({
  src,
  alt,
  fileName,
  size = 'md',
  onClear,
}: ImagePreviewProps) {
  const maxH = size === 'sm' ? 'max-h-64' : 'max-h-96'

  return (
    <div className="relative rounded-xl overflow-hidden border bg-card">
      <div className={cn('relative flex items-center justify-center bg-black/5', maxH)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={cn('w-full object-contain', maxH)} />
        {fileName && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 max-w-[calc(100%-1.5rem)]">
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
      {onClear && (
        <button
          onClick={onClear}
          className="absolute top-2 right-2 bg-background/80 hover:bg-background rounded-full p-1 shadow transition-colors"
          aria-label="Remove image"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
