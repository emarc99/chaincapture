import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { http, Address } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { STORY_CHAIN_CONFIG } from '@/utils/constants'
import { IPMetadata } from '@/types'
import { createHash } from 'crypto'

// Custom chain definition for Story Protocol
const storyChain = {
    id: STORY_CHAIN_CONFIG.chainId,
    name: STORY_CHAIN_CONFIG.chainName,
    nativeCurrency: STORY_CHAIN_CONFIG.nativeCurrency,
    rpcUrls: {
        default: { http: [STORY_CHAIN_CONFIG.rpcUrl] },
        public: { http: [STORY_CHAIN_CONFIG.rpcUrl] },
    },
    blockExplorers: {
        default: { name: 'Explorer', url: STORY_CHAIN_CONFIG.blockExplorerUrl },
    },
}

let storyClient: StoryClient | null = null

/**
 * Initialize Story Protocol client (server-side only)
 */
export async function getStoryClient(): Promise<StoryClient> {
    if (storyClient) return storyClient

    const privateKey = process.env.WALLET_PRIVATE_KEY
    if (!privateKey) {
        throw new Error('WALLET_PRIVATE_KEY not configured in environment variables')
    }

    const account = privateKeyToAccount(privateKey as `0x${string}`)

    const config: StoryConfig = {
        account,
        transport: http(STORY_CHAIN_CONFIG.rpcUrl),
        chainId: 'aeneid', // Story Aeneid Testnet
    }

    storyClient = StoryClient.newClient(config)
    return storyClient
}

/**
 * Mint NFT and Register IP Asset in ONE transaction using SPG
 * This is the recommended approach per Story Protocol docs
 */
export async function mintAndRegisterIP(
    metadata: IPMetadata,
    mediaIpfsUri: string,
    metadataIpfsUri: string
): Promise<{ ipId: string; tokenId: string; txHash: string }> {
    try {
        const client = await getStoryClient()

        const spgNftContract = process.env.NEXT_PUBLIC_SPG_NFT_CONTRACT
        if (!spgNftContract) {
            throw new Error('NEXT_PUBLIC_SPG_NFT_CONTRACT not configured. Run: npm run create:spg')
        }

        // Create metadata hashes as required by Story Protocol
        const ipMetadataHash = createHash('sha256')
            .update(JSON.stringify(metadata))
            .digest('hex')

        const nftMetadata = {
            name: metadata.title,
            description: metadata.description,
            image: mediaIpfsUri,
        }

        const nftMetadataHash = createHash('sha256')
            .update(JSON.stringify(nftMetadata))
            .digest('hex')

        console.log('Registering IP Asset with SPG...')
        console.log('  SPG Contract:', spgNftContract)
        console.log('  Media URI:', mediaIpfsUri)
        console.log('  Metadata URI:', metadataIpfsUri)

        // Mint NFT + Register IP + Attach License in ONE transaction
        const response = await client.ipAsset.registerIpAsset({
            nft: {
                type: 'mint',
                spgNftContract: spgNftContract as Address,
            },
            ipMetadata: {
                ipMetadataURI: metadataIpfsUri,
                ipMetadataHash: `0x${ipMetadataHash}` as `0x${string}`,
                nftMetadataURI: mediaIpfsUri,
                nftMetadataHash: `0x${nftMetadataHash}` as `0x${string}`,
            },
            deadline: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
        })

        if (!response.ipId || !response.tokenId || !response.txHash) {
            throw new Error('Incomplete response from Story Protocol')
        }

        console.log('✅ IP Asset registered successfully!')
        console.log('  IP ID:', response.ipId)
        console.log('  Token ID:', response.tokenId.toString())
        console.log('  Tx Hash:', response.txHash)

        return {
            ipId: response.ipId,
            tokenId: response.tokenId.toString(),
            txHash: response.txHash,
        }
    } catch (error) {
        console.error('Error in mintAndRegisterIP:', error)
        throw new Error(
            `Failed to mint and register IP: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
    }
}

/**
 * Attach license terms to an IP Asset
 * Note: With SPG, you can also attach license during registration
 */
export async function attachLicenseTerms(
    ipId: Address,
    licenseTermsId: string
): Promise<string> {
    try {
        const client = await getStoryClient()

        const response = await client.license.attachLicenseTerms({
            ipId,
            licenseTermsId: BigInt(licenseTermsId),
        })

        return response.txHash || ''
    } catch (error) {
        console.error('Error attaching license:', error)
        throw new Error(
            `Failed to attach license: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
    }
}

/**
 * Register a derivative IP Asset (for AI remixes)
 */
export async function registerDerivative(
    parentIpIds: Address[],
    mediaIpfsUri: string,
    metadataIpfsUri: string,
    metadata: IPMetadata,
    licenseTermsIds: string[]
): Promise<{ ipId: string; tokenId: string; txHash: string }> {
    try {
        const client = await getStoryClient()

        const spgNftContract = process.env.NEXT_PUBLIC_SPG_NFT_CONTRACT
        if (!spgNftContract) {
            throw new Error('NEXT_PUBLIC_SPG_NFT_CONTRACT not configured')
        }

        // Create hashes
        const ipMetadataHash = createHash('sha256')
            .update(JSON.stringify(metadata))
            .digest('hex')

        const nftMetadata = {
            name: metadata.title,
            description: metadata.description,
            image: mediaIpfsUri,
        }

        const nftMetadataHash = createHash('sha256')
            .update(JSON.stringify(nftMetadata))
            .digest('hex')

        // Register derivative IP
        const response = await client.ipAsset.registerDerivativeIp({
            nft: {
                type: 'mint',
                spgNftContract: spgNftContract as Address,
            },
            ipMetadata: {
                ipMetadataURI: metadataIpfsUri,
                ipMetadataHash: `0x${ipMetadataHash}` as `0x${string}`,
                nftMetadataURI: mediaIpfsUri,
                nftMetadataHash: `0x${nftMetadataHash}` as `0x${string}`,
            },
            derivData: {
                parentIpIds,
                licenseTermsIds: licenseTermsIds.map(id => BigInt(id)),
            },
            deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
        })

        if (!response.ipId || !response.tokenId || !response.txHash) {
            throw new Error('Incomplete response from Story Protocol')
        }

        return {
            ipId: response.ipId,
            tokenId: response.tokenId.toString(),
            txHash: response.txHash,
        }
    } catch (error) {
        console.error('Error registering derivative:', error)
        throw new Error(
            `Failed to register derivative: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
    }
}

/**
 * Get IP Asset details
 */
export async function getIPAsset(ipId: Address): Promise<any> {
    try {
        const client = await getStoryClient()
        return await client.ipAsset.get({ ipId })
    } catch (error) {
        console.error('Error fetching IP Asset:', error)
        throw error
    }
}
