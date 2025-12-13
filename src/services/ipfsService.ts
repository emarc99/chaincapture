import { PinataSDK } from 'pinata-web3'
import { IPFS_CONFIG } from '@/utils/constants'
import { IPMetadata } from '@/types'

// Initialize Pinata client (lazy - only when needed)
let pinataClient: PinataSDK | null = null

const getPinataClient = () => {
    if (!IPFS_CONFIG.pinataApiKey) {
        throw new Error(
            'Pinata API key is not configured. ' +
            'Please add PINATA_JWT to your .env.local file. ' +
            'Get a free API key at https://pinata.cloud (1GB free tier)'
        )
    }

    if (!pinataClient) {
        pinataClient = new PinataSDK({
            pinataJwt: IPFS_CONFIG.pinataApiKey,
        })
    }

    return pinataClient
}

/**
 * Upload a media file (image or video) to IPFS via Pinata
 */
export async function uploadMediaToIPFS(file: Blob, filename: string): Promise<string> {
    try {
        const client = getPinataClient()

        console.log('Uploading media to Pinata IPFS...', { filename, size: file.size })

        // Convert Blob to File
        const mediaFile = new File([file], filename, { type: file.type })

        // Upload to Pinata
        const upload = await client.upload.file(mediaFile)

        const ipfsHash = upload.IpfsHash
        console.log('✅ Media uploaded to IPFS:', ipfsHash)

        return `ipfs://${ipfsHash}`
    } catch (error) {
        console.error('Error uploading media to IPFS:', error)
        throw new Error('Failed to upload media to IPFS: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
}

/**
 * Upload IP metadata as JSON to IPFS via Pinata
 */
export async function uploadMetadataToIPFS(metadata: IPMetadata): Promise<string> {
    try {
        const client = getPinataClient()

        console.log('Uploading metadata to Pinata IPFS...', { title: metadata.title })

        // Upload JSON directly
        const upload = await client.upload.json(metadata)

        const ipfsHash = upload.IpfsHash
        console.log('✅ Metadata uploaded to IPFS:', ipfsHash)

        return `ipfs://${ipfsHash}`
    } catch (error) {
        console.error('Error uploading metadata to IPFS:', error)
        throw new Error('Failed to upload metadata to IPFS: ' + (error instanceof Error ? error.message : 'Unknown error'))
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
        console.log('Starting IPFS upload process...')

        // Upload media and metadata in parallel
        const [mediaUri, metadataUri] = await Promise.all([
            uploadMediaToIPFS(mediaBlob, filename),
            uploadMetadataToIPFS(metadata),
        ])

        console.log('✅ IPFS upload complete:', { mediaUri, metadataUri })

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
        // Use Pinata's gateway for fast access
        return `https://gateway.pinata.cloud/ipfs/${cid}`
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
