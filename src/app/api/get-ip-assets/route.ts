import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { STORY_CHAIN_CONFIG, SPG_NFT_CONTRACT } from '@/utils/constants'

// Story Protocol Aeneid Testnet config
const storyChain = {
    id: STORY_CHAIN_CONFIG.chainId,
    name: STORY_CHAIN_CONFIG.chainName,
    nativeCurrency: STORY_CHAIN_CONFIG.nativeCurrency,
    rpcUrls: {
        default: { http: [STORY_CHAIN_CONFIG.rpcUrl] },
        public: { http: [STORY_CHAIN_CONFIG.rpcUrl] },
    },
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const walletAddress = searchParams.get('address')

        if (!walletAddress) {
            return NextResponse.json(
                { success: false, error: 'Wallet address required' },
                { status: 400 }
            )
        }

        if (!SPG_NFT_CONTRACT) {
            return NextResponse.json(
                { success: false, error: 'SPG NFT Contract not configured' },
                { status: 500 }
            )
        }

        // Create public client to query blockchain
        const publicClient = createPublicClient({
            chain: storyChain,
            transport: http(STORY_CHAIN_CONFIG.rpcUrl),
        })

        // ERC-721 balanceOf and tokenOfOwnerByIndex ABI
        const erc721Abi = [
            {
                inputs: [{ name: 'owner', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ name: 'tokenId', type: 'uint256' }],
                name: 'tokenURI',
                outputs: [{ name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ name: 'tokenId', type: 'uint256' }],
                name: 'ownerOf',
                outputs: [{ name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
        ]

        console.log('📊 Fetching IP assets for:', walletAddress)
        console.log('  NFT Contract:', SPG_NFT_CONTRACT)

        // Get user's NFT balance
        const balance = await publicClient.readContract({
            address: SPG_NFT_CONTRACT as `0x${string}`,
            abi: erc721Abi,
            functionName: 'balanceOf',
            args: [walletAddress as `0x${string}`],
        })

        console.log('  Balance:', balance.toString(), 'NFTs')

        if (Number(balance) === 0) {
            return NextResponse.json({
                success: true,
                ipAssets: [],
                count: 0,
            })
        }

        // Fetch all tokenIds owned by this address
        // Note: This is a simplified approach - in production, use events or an indexer
        const ipAssets = []
        let foundCount = 0

        // Check first 100 token IDs (simple approach for MVP)
        for (let tokenId = 0; tokenId < 100 && foundCount < Number(balance); tokenId++) {
            try {
                const owner = await publicClient.readContract({
                    address: SPG_NFT_CONTRACT as `0x${string}`,
                    abi: erc721Abi,
                    functionName: 'ownerOf',
                    args: [BigInt(tokenId)],
                })

                if (owner.toLowerCase() === walletAddress.toLowerCase()) {
                    foundCount++

                    // Get token URI
                    const tokenURI = await publicClient.readContract({
                        address: SPG_NFT_CONTRACT as `0x${string}`,
                        abi: erc721Abi,
                        functionName: 'tokenURI',
                        args: [BigInt(tokenId)],
                    })

                    // Generate IP Asset ID (deterministic based on contract + tokenId)
                    // Note: This is a simplified calculation - actual IP ID might differ
                    const ipId = `0x${tokenId.toString(16).padStart(40, '0')}`

                    ipAssets.push({
                        tokenId: tokenId.toString(),
                        tokenURI,
                        ipId,
                        owner,
                        nftContract: SPG_NFT_CONTRACT,
                    })
                }
            } catch (error) {
                // Token doesn't exist or was burned, continue
                continue
            }
        }

        console.log('✅ Found', ipAssets.length, 'IP assets')

        return NextResponse.json({
            success: true,
            ipAssets,
            count: ipAssets.length,
        })
    } catch (error) {
        console.error('❌ Error fetching IP assets:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch IP assets',
            },
            { status: 500 }
        )
    }
}
