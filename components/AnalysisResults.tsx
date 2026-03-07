'use client'

import { MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export interface Location {
  location: string
  confidence: 'Very High' | 'High' | 'Medium' | 'Low' | 'Very Low'
  clues: {
    numbered: string[]
    summary: string
  }
}

interface AnalysisResultsProps {
  locations: Location[]
  imagePreview: string | null
}

const CONFIDENCE_CONFIG: Record<
  Location['confidence'],
  { variant: BadgeProps['variant']; label: string; bar: string }
> = {
  'Very High': { variant: 'success', label: 'Very High', bar: 'w-full bg-emerald-500' },
  'High':      { variant: 'info',    label: 'High',      bar: 'w-4/5 bg-blue-500' },
  'Medium':    { variant: 'warning', label: 'Medium',    bar: 'w-3/5 bg-amber-500' },
  'Low':       { variant: 'danger',  label: 'Low',       bar: 'w-2/5 bg-orange-500' },
  'Very Low':  { variant: 'muted',   label: 'Very Low',  bar: 'w-1/5 bg-red-500' },
}

const RANK_LABELS = ['#1 Most Likely', '#2', '#3']

export function AnalysisResults({ locations, imagePreview }: AnalysisResultsProps) {
  return (
    <div className="space-y-6">
      {imagePreview && (
        <div className="rounded-xl overflow-hidden border max-h-64 flex items-center justify-center bg-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagePreview} alt="Analyzed photo" className="max-h-64 object-contain" />
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          Location Analysis
        </h2>

        <div className="grid gap-4">
          {locations.map((loc, i) => {
            const conf = CONFIDENCE_CONFIG[loc.confidence] ?? CONFIDENCE_CONFIG['Very Low']
            return (
              <Card key={i} className={i === 0 ? 'ring-2 ring-primary/20' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        {RANK_LABELS[i]}
                      </p>
                      <CardTitle className="text-lg">{loc.location}</CardTitle>
                    </div>
                    <Badge variant={conf.variant} className="shrink-0 mt-1">
                      {conf.label}
                    </Badge>
                  </div>

                  {/* Confidence bar */}
                  <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${conf.bar}`} />
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="pt-4 space-y-3">
                  <ul className="space-y-1.5">
                    {loc.clues.numbered.map((clue, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground">•</span>
                        <span>{clue.replace(/^\d+\.\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                  {loc.clues.summary && (
                    <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                      {loc.clues.summary}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
