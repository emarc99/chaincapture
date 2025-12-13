'use client'

import { useWallet } from '@/hooks/useWallet'

export function WalletConnect() {
    const { isConnected, address, chainId, isConnecting, connect, disconnect, switchToStoryNetwork } = useWallet()

    const isStoryNetwork = chainId === 1315

    return (
        <div className="flex items-center gap-3">
            {!isConnected ? (
                <button
                    onClick={connect}
                    disabled={isConnecting}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
                >
                    {isConnecting ? 'Connecting...' : '🔗 Connect Wallet'}
                </button>
            ) : (
                <div className="flex items-center gap-3">
                    {!isStoryNetwork && (
                        <button
                            onClick={switchToStoryNetwork}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200"
                        >
                            ⚠️ Switch to Story Network
                        </button>
                    )}

                    <div className="bg-gradient-to-r from-purple-900 to-blue-900 px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-white font-mono text-sm">
                            {address?.slice(0, 6)}...{address?.slice(-4)}
                        </span>
                    </div>

                    <button
                        onClick={disconnect}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200"
                    >
                        Disconnect
                    </button>
                </div>
            )}
        </div>
    )
}
