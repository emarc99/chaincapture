const hre = require("hardhat");

async function main() {
    console.log("Deploying ChainCaptureNFT contract to Story Protocol Testnet...");

    // Get the contract factory
    const ChainCaptureNFT = await hre.ethers.getContractFactory("ChainCaptureNFT");

    // Deploy the contract
    console.log("Deploying contract...");
    const nftContract = await ChainCaptureNFT.deploy();

    // Wait for deployment to complete
    await nftContract.waitForDeployment();

    const contractAddress = await nftContract.getAddress();

    console.log("\n✅ ChainCaptureNFT deployed successfully!");
    console.log("📝 Contract Address:", contractAddress);
    console.log("\n🔗 View on Explorer:");
    console.log(`https://aeneid.explorer.story.foundation/address/${contractAddress}`);

    console.log("\n⚙️  Next Steps:");
    console.log("1. Update .env.local with:");
    console.log(`   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=${contractAddress}`);
    console.log("2. Verify the contract (optional):");
    console.log(`   npx hardhat verify --network storyTestnet ${contractAddress}`);
    console.log("3. Test minting from the frontend");

    // Save deployment info
    const fs = require("fs");
    const deploymentInfo = {
        network: "Story Aeneid Testnet",
        chainId: 1315,
        contractAddress: contractAddress,
        deploymentTime: new Date().toISOString(),
        deployer: (await hre.ethers.getSigners())[0].address,
    };

    fs.writeFileSync(
        "deployment-info.json",
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\n📄 Deployment info saved to deployment-info.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
