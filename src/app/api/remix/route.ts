import { NextRequest, NextResponse } from 'next/server'
import { generateAIRemix } from '@/services/aiService'
import { RemixRequest } from '@/types'

export async function POST(request: NextRequest) {
    try {
        const body: RemixRequest = await request.json()

        const { sourceIPId, remixPrompt, style, model } = body

        if (!sourceIPId || !remixPrompt) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: sourceIPId, remixPrompt' },
                { status: 400 }
            )
        }

        // Generate AI remix using ABV.dev
        const result = await generateAIRemix({
            sourceIPId,
            sourceMediaUrl: '', // In production, fetch this from IP Asset
            remixPrompt,
            style,
            model: model || 'openai',
        })

        if (result.success) {
            return NextResponse.json({
                success: true,
                description: result.mediaUrl,
                traceId: result.traceId,
                cost: result.cost,
                message: 'AI remix generated and registered as IP Asset',
            })
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            )
        }
    } catch (error) {
        console.error('Remix API error:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to generate remix',
            },
            { status: 500 }
        )
    }
}
