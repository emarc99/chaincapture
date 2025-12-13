'use client'

import Link from 'next/link'
import { WalletConnect } from '@/components/WalletConnect'

export default function DashboardPage() {
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
                                href="/capture"
                                className="text-gray-300 hover:text-white transition-colors font-semibold"
                            >
                                📷 Capture
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
                            Your IP Dashboard
                        </h1>
                        <p className="text-gray-400 text-lg">
                            View your registered IP assets and track royalty earnings
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-6">
                            <div className="text-sm text-gray-400 mb-1">Total IP Assets</div>
                            <div className="text-4xl font-bold text-white">0</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-2xl p-6">
                            <div className="text-sm text-gray-400 mb-1">Derivatives Created</div>
                            <div className="text-4xl font-bold text-white">0</div>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6">
                            <div className="text-sm text-gray-400 mb-1">Royalties Earned</div>
                            <div className="text-4xl font-bold text-white">0 IP</div>
                        </div>
                    </div>

                    {/* Empty State */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded -2xl p-12 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No IP Assets Yet</h3>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">
                            Get started by capturing and registering your first creation as an IP asset on Story Protocol
                        </p>
                        <Link
                            href="/capture"
                            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                            📷 Start Capturing
                        </Link>
                    </div>

                    {/* Features Coming Soon */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-white mb-6">🚧 Coming Soon</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 text-gray-300">
                                <span>✨</span>
                                <div>
                                    <div className="font-semibold text-white">IP Asset Gallery</div>
                                    <div className="text-sm">View all your registered photos and videos</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-gray-300">
                                <span>🌳</span>
                                <div>
                                    <div className="font-semibold text-white">Derivative Tree View</div>
                                    <div className="text-sm">Visualize parent-child IP relationships</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-gray-300">
                                <span>🤖</span>
                                <div>
                                    <div className="font-semibold text-white">AI Remix Studio</div>
                                    <div className="text-sm">Create derivatives with ABV.dev AI</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-gray-300">
                                <span>💰</span>
                                <div>
                                    <div className="font-semibold text-white">Royalty Analytics</div>
                                    <div className="text-sm">Track earnings from derivative works</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
