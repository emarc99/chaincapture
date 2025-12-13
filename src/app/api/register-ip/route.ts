import { NextRequest, NextResponse } from 'next/server'
import { mintAndRegisterIP } from '@/services/storyProtocolService'
import type { IPMetadata } from '@/types'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { mediaUri, metadataUri, metadata } = body

        // Validate required fields
        if (!mediaUri || !metadataUri || !metadata) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields: mediaUri, metadataUri, metadata'
                },
                { status: 400 }
            )
        }

        // Validate SPG contract is configured
        if (!process.env.NEXT_PUBLIC_SPG_NFT_CONTRACT) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'SPG NFT Contract not configured. Please run: npm run create:spg',
                },
                { status: 500 }
            )
        }

        console.log('📝 IP Registration Request:')
        console.log('  Media URI:', mediaUri)
        console.log('  Metadata URI:', metadataUri)
        console.log('  Title:', metadata.title)

        // Mint NFT + Register IP in ONE transaction using SPG
        const { ipId, tokenId, txHash } = await mintAndRegisterIP(
            metadata as IPMetadata,
            mediaUri,
            metadataUri
        )

        console.log('✅ IP Registration Complete:')
        console.log('  IP ID:', ipId)
        console.log('  Token ID:', tokenId)
        console.log('  Tx Hash:', txHash)

        return NextResponse.json({
            success: true,
            ipId,
            tokenId,
            txHash,
            message: 'IP Asset registered successfully!',
            explorerUrl: `https://aeneid.explorer.story.foundation/ipa/${ipId}`,
        })
    } catch (error) {
        console.error('❌ IP Registration error:', error)

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to register IP Asset',
                details: error instanceof Error ? error.stack : undefined,
            },
            { status: 500 }
        )
    }
}
