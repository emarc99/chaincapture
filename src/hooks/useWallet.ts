'use client'

import { useState, useEffect } from 'react'
import { WalletState } from '@/types'

export function useWallet() {
    const [walletState, setWalletState] = useState<WalletState>({
        isConnected: false,
    })
    const [isConnecting, setIsConnecting] = useState(false)

    /**
     * Check if wallet is already connected
     */
    useEffect(() => {
        checkConnection()
    }, [])

    const checkConnection = async () => {
        if (typeof window === 'undefined' || !window.ethereum) return

        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' })
            if (accounts.length > 0) {
                const chainId = await window.ethereum.request({ method: 'eth_chainId' })
                setWalletState({
                    isConnected: true,
                    address: accounts[0],
                    chainId: parseInt(chainId, 16),
                })
            }
        } catch (error) {
            console.error('Error checking wallet connection:', error)
        }
    }

    /**
     * Connect wallet
     */
    const connect = async () => {
        if (typeof window === 'undefined' || !window.ethereum) {
            alert('Please install MetaMask or another Web3 wallet')
            return
        }

        setIsConnecting(true)
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            })

            const chainId = await window.ethereum.request({ method: 'eth_chainId' })

            setWalletState({
                isConnected: true,
                address: accounts[0],
                chainId: parseInt(chainId, 16),
            })
        } catch (error) {
            console.error('Error connecting wallet:', error)
        } finally {
            setIsConnecting(false)
        }
    }

    /**
     * Disconnect wallet
     */
    const disconnect = () => {
        setWalletState({ isConnected: false })
    }

    /**
     * Switch to Story Protocol network
     */
    const switchToStoryNetwork = async () => {
        if (typeof window === 'undefined' || !window.ethereum) return

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x523' }], // 1315 in hex for Story testnet
            })
        } catch (error: any) {
            // Chain not added, add it
            if (error.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x523',
                            chainName: 'Story Aeneid Testnet',
                            nativeCurrency: {
                                name: 'IP',
                                symbol: 'IP',
                                decimals: 18,
                            },
                            rpcUrls: ['https://aeneid-testnet.storyrpc.io'],
                            blockExplorerUrls: ['https://aeneid.explorer.story.foundation'],
                        }],
                    })
                } catch (addError) {
                    console.error('Error adding Story network:', addError)
                }
            }
        }
    }

    /**
     * Listen for account and chain changes
     */
    useEffect(() => {
        if (typeof window === 'undefined' || !window.ethereum) return

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                setWalletState({ isConnected: false })
            } else {
                setWalletState(prev => ({ ...prev, address: accounts[0] }))
            }
        }

        const handleChainChanged = (chainId: string) => {
            setWalletState(prev => ({ ...prev, chainId: parseInt(chainId, 16) }))
        }

        window.ethereum.on('accountsChanged', handleAccountsChanged)
        window.ethereum.on('chainChanged', handleChainChanged)

        return () => {
            window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
            window.ethereum?.removeListener('chainChanged', handleChainChanged)
        }
    }, [])

    return {
        ...walletState,
        isConnecting,
        connect,
        disconnect,
        switchToStoryNetwork,
    }
}

// Extend Window interface for ethereum
declare global {
    interface Window {
        ethereum?: any
    }
}
