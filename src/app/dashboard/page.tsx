'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { WalletConnect } from '@/components/WalletConnect'
import { useWallet } from '@/hooks/useWallet'

interface IPAsset {
    tokenId: string
    tokenURI: string
    ipId: string
    owner: string
    nftContract: string
    metadata?: {
        title?: string
        description?: string
        image?: string
    }
}

export default function DashboardPage() {
    const { address, isConnected } = useWallet()
    const [ipAssets, setIpAssets] = useState<IPAsset[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        if (isConnected && address) {
            fetchIPAssets(address)
        }
    }, [isConnected, address])

    const fetchIPAssets = async (walletAddress: string) => {
        setIsLoading(true)
        setError('')

        try {
            console.log('🔍 Fetching IP assets for:', walletAddress)

            const response = await fetch(`/api/get-ip-assets?address=${walletAddress}`)
            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch IP assets')
            }

            console.log('✅ Found', data.count, 'IP assets')

            // Fetch metadata for each IP asset
            const assetsWithMetadata = await Promise.all(
                data.ipAssets.map(async (asset: IPAsset) => {
                    try {
                        // Convert IPFS URI to HTTP gateway
                        let metadataUrl = asset.tokenURI
                        if (metadataUrl.startsWith('ipfs://')) {
                            metadataUrl = metadataUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
                        }

                        const metadataResponse = await fetch(metadataUrl)
                        const metadata = await metadataResponse.json()

                        return { ...asset, metadata }
                    } catch (err) {
                        console.warn('Failed to fetch metadata for token', asset.tokenId, err)
                        return asset
                    }
                })
            )

            setIpAssets(assetsWithMetadata)
        } catch (err) {
            console.error('Error fetching IP assets:', err)
            setError(err instanceof Error ? err.message : 'Failed to load IP assets')
        } finally {
            setIsLoading(false)
        }
    }

    const getImageUrl = (uri?: string) => {
        if (!uri) return '/placeholder-image.png'
        if (uri.startsWith('ipfs://')) {
            return uri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
        }
        return uri
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            ⛓️ ChainCapture
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/capture" className="text-gray-300 hover:text-white transition-colors font-semibold">
                                📷 Capture
                            </Link>
                            <Link href="/remix" className="text-gray-300 hover:text-white transition-colors font-semibold">
                                🤖 AI Remix
                            </Link>
                            <WalletConnect />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-12">
                <div className="space-y-8">
                    {/* Page Title */}
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            📊 Your IP Assets
                        </h1>
                        <p className="text-gray-400 text-lg">
                            {isConnected
                                ? `View and manage your registered IP on Story Protocol`
                                : 'Connect your wallet to view your IP assets'}
                        </p>
                    </div>

                    {/* Wallet Not Connected */}
                    {!isConnected && (
                        <div className="max-w-2xl mx-auto bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 rounded-2xl p-8 text-center">
                            <h2 className="text-2xl font-bold text-white mb-4">🔒 Connect Your Wallet</h2>
                            <p className="text-gray-300 mb-6">
                                Connect your wallet to view all the IP assets you've registered on Story Protocol.
                            </p>
                            <WalletConnect />
                        </div>
                    )}

                    {/* Loading State */}
                    {isConnected && isLoading && (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                            <p className="text-gray-400 mt-4">Loading your IP assets...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="max-w-2xl mx-auto bg-red-500/20 border border-red-500 rounded-xl p-4">
                            <p className="text-red-200 text-center">❌ {error}</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {isConnected && !isLoading && !error && ipAssets.length === 0 && (
                        <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center">
                            <div className="text-6xl mb-4">📸</div>
                            <h2 className="text-2xl font-bold text-white mb-4">No IP Assets Yet</h2>
                            <p className="text-gray-300 mb-6">
                                Start capturing and registering your creative works as IP on Story Protocol!
                            </p>
                            <Link
                                href="/capture"
                                className="inline-block bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                            >
                                🚀 Capture Your First IP
                            </Link>
                        </div>
                    )}

                    {/* IP Assets Gallery */}
                    {isConnected && !isLoading && ipAssets.length > 0 && (
                        <>
                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
                                    <div className="text-purple-300 text-sm font-semibold mb-1">Total IP Assets</div>
                                    <div className="text-white text-3xl font-bold">{ipAssets.length}</div>
                                </div>
                                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6">
                                    <div className="text-blue-300 text-sm font-semibold mb-1">Testnet Address</div>
                                    <div className="text-white text-sm font-mono truncate">{address}</div>
                                </div>
                                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
                                    <div className="text-green-300 text-sm font-semibold mb-1">Network</div>
                                    <div className="text-white text-lg font-bold">Story Aeneid</div>
                                </div>
                            </div>

                            {/* Gallery Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {ipAssets.map((asset) => (
                                    <div
                                        key={asset.tokenId}
                                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20"
                                    >
                                        {/* Image/Video */}
                                        <div className="aspect-square bg-gray-700 relative">
                                            {asset.metadata?.image ? (
                                                <img
                                                    src={getImageUrl(asset.metadata.image)}
                                                    alt={asset.metadata.title || `Token #${asset.tokenId}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        ; (e.target as HTMLImageElement).src = '/placeholder-image.png'
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                    <span className="text-4xl">🖼️</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-4 space-y-3">
                                            <h3 className="text-white font-bold text-lg truncate">
                                                {asset.metadata?.title || `IP Asset #${asset.tokenId}`}
                                            </h3>

                                            {asset.metadata?.description && (
                                                <p className="text-gray-400 text-sm line-clamp-2">
                                                    {asset.metadata.description}
                                                </p>
                                            )}

                                            <div className="pt-2 border-t border-white/10 space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-500">Token ID</span>
                                                    <span className="text-gray-300 font-mono">{asset.tokenId}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-500">IP Asset ID</span>
                                                    <span className="text-gray-300 font-mono truncate ml-2">{asset.ipId.slice(0, 10)}...</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 pt-2">
                                                <a
                                                    href={`https://aeneid.explorer.story.foundation/ipa/${asset.ipId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 px-4 rounded-lg text-center transition-colors"
                                                >
                                                    🔗 View on Explorer
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
