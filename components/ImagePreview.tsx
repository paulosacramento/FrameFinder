'use client'

import { X } from 'lucide-react'
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
      <div className={cn('flex items-center justify-center bg-black/5', maxH)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={cn('w-full object-contain', maxH)} />
      </div>
      {fileName && (
        <p
          className="px-3 py-2 text-sm text-muted-foreground truncate border-t bg-card"
          title={fileName}
        >
          {fileName}
        </p>
      )}
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
