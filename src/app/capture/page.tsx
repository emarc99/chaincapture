'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CameraCapture } from '@/components/CameraCapture'
import { MediaPreview } from '@/components/MediaPreview'
import { WalletConnect } from '@/components/WalletConnect'
import { CapturedMedia, IPMetadata } from '@/types'

export default function CapturePage() {
    const [capturedMedia, setCapturedMedia] = useState<CapturedMedia | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState<string>('')

    const handleMediaCapture = (media: CapturedMedia) => {
        setCapturedMedia(media)
    }

    const handleRegister = async (media: CapturedMedia, metadata: IPMetadata) => {
        setIsUploading(true)
        setUploadStatus('Uploading to IPFS...')

        try {
            // 1. Upload media and metadata to IPFS via API route
            const formData = new FormData()
            formData.append('file', media.blob, `${metadata.title.replace(/\s+/g, '-')}.${media.type === 'image' ? 'jpg' : 'webm'}`)
            formData.append('metadata', JSON.stringify(metadata))

            const ipfsResponse = await fetch('/api/upload-ipfs', {
                method: 'POST',
                body: formData,
            })

            const ipfsResult = await ipfsResponse.json()

            if (!ipfsResult.success) {
                throw new Error(ipfsResult.error || 'Failed to upload to IPFS')
            }

            const { mediaUri, metadataUri } = ipfsResult

            setUploadStatus('Minting NFT and registering IP...')

            // 2. Call API to mint NFT and register IP on Story Protocol
            const response = await fetch('/api/register-ip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mediaUri,
                    metadataUri,
                    metadata,
                }),
            })

            const result = await response.json()

            if (result.success) {
                setUploadStatus(
                    `✅ Success! IP Asset registered!\n\n` +
                    `IP Asset ID: ${result.ipId}\n` +
                    `View on Explorer: ${result.explorerUrl || `https://aeneid.explorer.story.foundation/ipa/${result.ipId}`}`
                )

                // Open explorer in new tab
                const explorerUrl = result.explorerUrl || `https://aeneid.explorer.story.foundation/ipa/${result.ipId}`
                console.log('🔗 View your IP Asset:', explorerUrl)

                // Copy IP ID to clipboard for easy access
                navigator.clipboard.writeText(result.ipId).catch(() => { })

                // Wait longer so user can see the link
                setTimeout(() => {
                    window.location.href = '/dashboard'
                }, 8000)
            } else {
                throw new Error(result.error || 'Failed to register IP')
            }
        } catch (error) {
            console.error('Registration error:', error)
            setUploadStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setIsUploading(false)
        }
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
                            <Link
                                href="/dashboard"
                                className="text-gray-300 hover:text-white transition-colors font-semibold"
                            >
                                📊 Dashboard
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
                            Capture & Register IP
                        </h1>
                        <p className="text-gray-400 text-lg">
                            {capturedMedia ? 'Add metadata and register your creation' : 'Use your camera to capture photos or videos'}
                        </p>
                    </div>

                    {/* Upload Status */}
                    {uploadStatus && (
                        <div className={`max-w-2xl mx-auto p-4 rounded-xl ${uploadStatus.includes('❌') ? 'bg-red-500/20 border border-red-500' :
                            uploadStatus.includes('✅') ? 'bg-green-500/20 border border-green-500' :
                                'bg-blue-500/20 border border-blue-500'
                            }`}>
                            <p className="text-center text-white font-semibold whitespace-pre-wrap break-all">{uploadStatus}</p>
                        </div>
                    )}

                    {/* Camera or Preview */}
                    {!capturedMedia ? (
                        <CameraCapture
                            onPhotoCapture={handleMediaCapture}
                            onVideoCapture={handleMediaCapture}
                        />
                    ) : (
                        <MediaPreview
                            media={capturedMedia}
                            onSubmit={handleRegister}
                            onCancel={() => {
                                setCapturedMedia(null)
                                setUploadStatus('')
                            }}
                        />
                    )}

                    {/* Instructions */}
                    {!capturedMedia && (
                        <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">📝 How it Works</h3>
                            <ol className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center font-bold">1</span>
                                    <span>Connect your wallet and ensure you're on the Story Protocol network</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center font-bold">2</span>
                                    <span>Capture a photo or record a video using your device's camera</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center font-bold">3</span>
                                    <span>Add title, description, and tags for your IP metadata</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center font-bold">4</span>
                                    <span>Your creation is uploaded to IPFS and automatically registered as IP on Story Protocol</span>
                                </li>
                            </ol>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
