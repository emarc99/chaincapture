import { NFTStorage, File as NFTFile, Blob as NFTBlob } from 'nft.storage'
import { IPFS_CONFIG } from '@/utils/constants'
import { IPMetadata } from '@/types'

// Initialize NFT.Storage client (lazy - only when needed)
let nftStorageClient: NFTStorage | null = null

const getNFTStorageClient = () => {
    if (!IPFS_CONFIG.nftStorageKey) {
        throw new Error(
            'NFT.Storage API key is not configured. ' +
            'Please add NEXT_PUBLIC_NFT_STORAGE_KEY to your .env.local file. ' +
            'Get a free API key at https://nft.storage'
        )
    }

    if (!nftStorageClient) {
        nftStorageClient = new NFTStorage({ token: IPFS_CONFIG.nftStorageKey })
    }

    return nftStorageClient
}

/**
 * Upload a media file (image or video) to IPFS
 */
export async function uploadMediaToIPFS(file: Blob, filename: string): Promise<string> {
    try {
        const client = getNFTStorageClient()

        // Convert Blob to NFT.Storage File
        const nftFile = new NFTFile([file], filename, { type: file.type })

        // Store the file
        const cid = await client.storeBlob(nftFile)

        return `ipfs://${cid}`
    } catch (error) {
        console.error('Error uploading media to IPFS:', error)
        throw new Error('Failed to upload media to IPFS')
    }
}

/**
 * Upload IP metadata as JSON to IPFS
 */
export async function uploadMetadataToIPFS(metadata: IPMetadata): Promise<string> {
    try {
        const client = getNFTStorageClient()

        // Create JSON blob
        const metadataJSON = JSON.stringify(metadata, null, 2)
        const blob = new Blob([metadataJSON], { type: 'application/json' })
        const nftBlob = new NFTBlob([blob])

        // Store the metadata
        const cid = await client.storeBlob(nftBlob)

        return `ipfs://${cid}`
    } catch (error) {
        console.error('Error uploading metadata to IPFS:', error)
        throw new Error('Failed to upload metadata to IPFS')
    }
}

/**
 * Upload both media and metadata, return URIs
 */
export async function uploadToIPFS(
    mediaBlob: Blob,
    filename: string,
    metadata: IPMetadata
): Promise<{ mediaUri: string; metadataUri: string }> {
    try {
        // Upload media and metadata in parallel
        const [mediaUri, metadataUri] = await Promise.all([
            uploadMediaToIPFS(mediaBlob, filename),
            uploadMetadataToIPFS(metadata),
        ])

        return { mediaUri, metadataUri }
    } catch (error) {
        console.error('Error uploading to IPFS:', error)
        throw error
    }
}

/**
 * Convert IPFS URI to HTTP gateway URL for display
 */
export function ipfsToHttp(ipfsUri: string): string {
    if (ipfsUri.startsWith('ipfs://')) {
        const cid = ipfsUri.replace('ipfs://', '')
        return `https://nftstorage.link/ipfs/${cid}`
    }
    return ipfsUri
}

/**
 * Generate a hash of the metadata for Story Protocol
 */
export async function hashMetadata(metadata: IPMetadata): Promise<string> {
    const metadataString = JSON.stringify(metadata)
    const encoder = new TextEncoder()
    const data = encoder.encode(metadataString)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
}
