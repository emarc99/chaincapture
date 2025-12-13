import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { zeroAddress } from 'viem'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function main() {
    console.log("🚀 Creating ChainCapture SPG NFT Collection...")
    console.log("=".repeat(60))

    // Verify environment variables
    if (!process.env.WALLET_PRIVATE_KEY) {
        throw new Error("WALLET_PRIVATE_KEY not found in .env.local")
    }
    if (!process.env.NEXT_PUBLIC_STORY_RPC) {
        throw new Error("NEXT_PUBLIC_STORY_RPC not found in .env.local")
    }

    // Initialize Story Protocol client
    const config: StoryConfig = {
        account: privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`),
        transport: http(process.env.NEXT_PUBLIC_STORY_RPC),
        chainId: 'aeneid', // Story Aeneid Testnet
    }

    const client = StoryClient.newClient(config)

    console.log("\n📝 Collection Details:")
    console.log("  Name: ChainCapture")
    console.log("  Symbol: CCAP")
    console.log("  Public Minting: Disabled (only backend can mint)")
    console.log("  Network: Story Aeneid Testnet")
    console.log("\n⏳ Submitting transaction...")

    try {
        // Create the SPG NFT Collection
        const response = await client.nftClient.createNFTCollection({
            name: "ChainCapture",
            symbol: "CCAP",
            isPublicMinting: false,  // Only your backend can mint
            mintOpen: true,
            mintFeeRecipient: zeroAddress,
            contractURI: "", // Optional: can add collection metadata later
        })

        console.log("\n" + "=".repeat(60))
        console.log("✅ ChainCapture SPG Collection Created Successfully!")
        console.log("=".repeat(60))
        console.log("\n📋 Collection Information:")
        console.log("  SPG NFT Contract: ", response.spgNftContract)
        console.log("  Transaction Hash: ", response.txHash)
        console.log("\n🔗 View on Explorer:")
        console.log(`  https://aeneid.explorer.story.foundation/address/${response.spgNftContract}`)

        console.log("\n⚙️  IMPORTANT: Update your .env.local file:")
        console.log("=".repeat(60))
        console.log(`NEXT_PUBLIC_SPG_NFT_CONTRACT=${response.spgNftContract}`)
        console.log("=".repeat(60))

        console.log("\n✨ Next Steps:")
        console.log("  1. Copy the line above to your .env.local file")
        console.log("  2. Restart your dev server (npm run dev)")
        console.log("  3. Test IP registration at http://localhost:3000/capture")
        console.log("\n🎉 Collection setup complete!")

    } catch (error) {
        console.error("\n❌ Error creating SPG collection:", error)
        if (error instanceof Error) {
            console.error("   Message:", error.message)
        }
        process.exit(1)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Fatal error:", error)
        process.exit(1)
    })
