import { MediaType } from '@/utils/constants'

// IP Asset Metadata
export interface IPMetadata {
    title: string
    description: string
    ipType: MediaType
    creators: string[]
    captureDate: string
    deviceInfo?: string
    location?: string
    tags?: string[]
}

// Captured Media
export interface CapturedMedia {
    id: string
    type: MediaType
    blob: Blob
    url: string
    thumbnail?: string
    timestamp: number
    metadata?: Partial<IPMetadata>
}

// Registered IP Asset
export interface IPAsset {
    ipId: string
    nftContractAddress: string
    tokenId: string
    owner: string
    metadata: IPMetadata
    ipfsUri: string
    txHash: string
    registeredAt: number
    licenseTermsId?: string
    royaltyPercentage?: number
}

// Derivative IP Asset
export interface DerivativeIPAsset extends IPAsset {
    parentIpIds: string[]
    remixPrompt?: string
    aiModel?: string
}

// AI Remix Request
export interface RemixRequest {
    sourceIPId: string
    sourceMediaUrl: string
    remixPrompt: string
    style?: string
    model?: 'openai' | 'anthropic' | 'gemini'
}

// AI Remix Response
export interface RemixResponse {
    success: boolean
    mediaUrl?: string
    ipAssetId?: string
    error?: string
    traceId?: string
    cost?: number
}

// Wallet Connection State
export interface WalletState {
    isConnected: boolean
    address?: string
    chainId?: number
    balance?: string
}

// Transaction Status
export interface TransactionStatus {
    status: 'pending' | 'success' | 'error'
    txHash?: string
    error?: string
}
