import { ethers } from 'ethers'
import ChainCaptureNFTArtifact from '../../artifacts/contracts/ChainCaptureNFT.sol/ChainCaptureNFT.json'
import { NFT_CONTRACT_ADDRESS } from '@/utils/constants'

/**
 * Mint an NFT on the ChainCapture contract
 * This should be called from a server-side API route for security
 */
export async function mintNFT(
    to: string,
    tokenURI: string
): Promise<{ tokenId: string; txHash: string }> {
    try {
        const privateKey = process.env.WALLET_PRIVATE_KEY
        if (!privateKey) {
            throw new Error('WALLET_PRIVATE_KEY not configured')
        }

        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_STORY_RPC)
        const wallet = new ethers.Wallet(privateKey, provider)

        const nftContract = new ethers.Contract(
            NFT_CONTRACT_ADDRESS,
            ChainCaptureNFTArtifact.abi,
            wallet
        )

        // Mint the NFT
        const tx = await nftContract.mint(to, tokenURI)
        const receipt = await tx.wait()

        // Get the token ID from the event
        const mintEvent = receipt.logs.find((log: any) => {
            try {
                const parsed = nftContract.interface.parseLog(log)
                return parsed?.name === 'MediaMinted'
            } catch {
                return false
            }
        })

        if (!mintEvent) {
            throw new Error('MediaMinted event not found')
        }

        const parsedEvent = nftContract.interface.parseLog(mintEvent)
        const tokenId = parsedEvent?.args[0].toString()

        return {
            tokenId,
            txHash: receipt.hash,
        }
    } catch (error) {
        console.error('Error minting NFT:', error)
        throw new Error(`Failed to mint NFT: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

/**
 * Get NFT contract instance (client-side)
 */
export function getNFTContract(signerOrProvider: any) {
    return new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        ChainCaptureNFTArtifact.abi,
        signerOrProvider
    )
}

/**
 * Get all NFTs owned by an address
 */
export async function getUserNFTs(ownerAddress: string): Promise<any[]> {
    try {
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_STORY_RPC)
        const nftContract = new ethers.Contract(
            NFT_CONTRACT_ADDRESS,
            ChainCaptureNFTArtifact.abi,
            provider
        )

        const balance = await nftContract.balanceOf(ownerAddress)
        const nfts = []

        // This is a simple implementation - in production you'd use events or indexer
        const currentTokenId = await nftContract.getCurrentTokenId()

        for (let i = 0; i < Number(currentTokenId); i++) {
            try {
                const owner = await nftContract.ownerOf(i)
                if (owner.toLowerCase() === ownerAddress.toLowerCase()) {
                    const tokenURI = await nftContract.tokenURI(i)
                    const creator = await nftContract.creatorOf(i)

                    nfts.push({
                        tokenId: i,
                        tokenURI,
                        creator,
                        owner,
                    })
                }
            } catch {
                // Token doesn't exist or was burned
                continue
            }
        }

        return nfts
    } catch (error) {
        console.error('Error fetching user NFTs:', error)
        return []
    }
}
