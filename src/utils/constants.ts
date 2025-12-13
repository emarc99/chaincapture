// Chain Configuration
export const STORY_CHAIN_CONFIG = {
  chainId: parseInt(process.env.NEXT_PUBLIC_STORY_CHAIN_ID || '1315'),
  rpcUrl: process.env.NEXT_PUBLIC_STORY_RPC || 'https://aeneid-testnet.storyrpc.io',
  chainName: 'Story Aeneid Testnet',
  nativeCurrency: {
    name: 'IP',
    symbol: 'IP',
    decimals: 18,
  },
  blockExplorerUrl: 'https://aeneid.explorer.story.foundation',
}

// SPG NFT Contract Address (Story Protocol Gateway)
export const SPG_NFT_CONTRACT = process.env.NEXT_PUBLIC_SPG_NFT_CONTRACT || ''

// Legacy: Custom NFT Contract (kept for reference)
export const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || ''

// ABV.dev Configuration
export const ABV_CONFIG = {
  apiKey: process.env.ABV_API_KEY || '',
  baseUrl: process.env.ABV_BASE_URL || 'https://api.abv.dev',
}

// IPFS Configuration
export const IPFS_CONFIG = {
  nftStorageKey: process.env.NEXT_PUBLIC_NFT_STORAGE_KEY || '',
  pinataApiKey: process.env.PINATA_API_KEY || '',
  pinataSecretKey: process.env.PINATA_SECRET_KEY || '',
}

// PIL (Programmable IP License) Terms
// Note: These are default license term IDs on Story Protocol
export const PIL_TERMS = {
  COMMERCIAL_USE: '1',
  NON_COMMERCIAL: '2',
  COMMERCIAL_REMIX: '3',
}

// Royalty Configuration
export const DEFAULT_ROYALTY_PERCENTAGE = 10 // 10% royalty for derivatives

// Media Types
export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
} as const

export type MediaType = typeof MEDIA_TYPES[keyof typeof MEDIA_TYPES]
