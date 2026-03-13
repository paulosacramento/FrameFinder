import { NextRequest, NextResponse } from 'next/server'
import { getGeminiClient, SYSTEM_PROMPT } from '@/lib/gemini'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { image, mimeType } = await req.json()

    if (!image || !mimeType) {
      return NextResponse.json({ error: 'Missing image or mimeType' }, { status: 400 })
    }

    const genAI = getGeminiClient()
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite-preview',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0,
        topP: 1,
        topK: 1,
        maxOutputTokens: 1024,
        candidateCount: 1,
        responseMimeType: 'application/json',
        mediaResolution: 'HIGH' as any,
        thinkingConfig: { thinkingBudget: -1 } as any,
      },
    })

    const result = await model.generateContent([
      {
        inlineData: {
          data: image,
          mimeType,
        },
      },
      'Analyze this photograph and return the JSON as instructed.',
    ])

    const parsed = JSON.parse(result.response.text())

    return NextResponse.json(parsed)
  } catch (err: unknown) {
    console.error('[analyze]', err)
    const message = err instanceof Error ? err.message : 'Analysis failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
