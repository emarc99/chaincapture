import { ABVClient } from '@abvdev/client'
import { ABV_CONFIG } from '@/utils/constants'
import { RemixRequest, RemixResponse } from '@/types'

// Initialize ABV client
let abvClient: ABVClient | null = null

const getABVClient = (): ABVClient => {
    if (!abvClient) {
        if (!ABV_CONFIG.apiKey) {
            throw new Error('ABV API key is not configured')
        }

        abvClient = new ABVClient({
            apiKey: ABV_CONFIG.apiKey,
            baseUrl: ABV_CONFIG.baseUrl,
        })
    }
    return abvClient
}

/**
 * Generate AI remix of media using ABV.dev gateway
 * ABV.dev automatically registers the output as IP on Story Protocol
 */
export async function generateAIRemix(request: RemixRequest): Promise<RemixResponse> {
    try {
        const client = getABVClient()

        // Use ABV gateway for AI generation
        // This automatically creates traces and can register as IP on Story Protocol
        const response = await client.gateway.chat.completions.create({
            provider: request.model || 'openai',
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You are an AI that creates detailed descriptions for video/image remixes based on user prompts.',
                },
                {
                    role: 'user',
                    content: `Create a detailed remix description for the following:
Original Media: ${request.sourceMediaUrl}
Remix Style: ${request.style || 'creative transformation'}
User Prompt: ${request.remixPrompt}

Generate a comprehensive description that can be used to create the remixed version.`,
                },
            ],
            // Metadata for Story Protocol integration
            metadata: {
                sourceIPId: request.sourceIPId,
                contentType: 'remix',
                attribution: 'ChainCapture AI Remix',
                parentIP: request.sourceIPId,
            },
        })

        // Extract the remix description
        const remixDescription = response.choices[0].message.content

        // In a full implementation, you would:
        // 1. Use the description to call an image/video gen eration API
        // 2. ABV.dev would track the IP registration automatically
        // 3. Return the generated media URL and IP Asset ID

        // For now, return the description as proof of concept
        return {
            success: true,
            mediaUrl: remixDescription || '', // In production, this would be the actual generated media URL
            traceId: response.id,
            cost: response.usage?.total_tokens ? response.usage.total_tokens * 0.00001 : undefined,
        }
    } catch (error) {
        console.error('Error generating AI remix:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate AI remix',
        }
    }
}

/**
 * Generate image using ABV.dev gateway (if image generation is available)
 */
export async function generateRemixImage(
    description: string,
    parentIPId: string
): Promise<RemixResponse> {
    try {
        const client = getABVClient()

        // Note: This assumes ABV.dev supports image generation
        // You may need to check ABV.dev's actual API for image generation support
        // For now, using text completion as example

        const response = await client.gateway.chat.completions.create({
            provider: 'openai',
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: `Generate an image description for: ${description}`,
                },
            ],
            metadata: {
                parentIPAsset: parentIPId,
                registrationEnabled: true,
                contentType: 'image-remix',
            },
        })

        return {
            success: true,
            mediaUrl: response.choices[0].message.content || '',
            traceId: response.id,
        }
    } catch (error) {
        console.error('Error generating remix image:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate image',
        }
    }
}

/**
 * Check ABV.dev API status and connectivity
 */
export async function checkABVStatus(): Promise<boolean> {
    try {
        const client = getABVClient()

        // Make a simple test request
        const response = await client.gateway.chat.completions.create({
            provider: 'openai',
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: 'test' }],
        })

        return !!response
    } catch (error) {
        console.error('ABV.dev API check failed:', error)
        return false
    }
}
