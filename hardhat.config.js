require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        // Story Protocol Aeneid Testnet
        storyTestnet: {
            url: process.env.NEXT_PUBLIC_STORY_RPC || "https://aeneid-testnet.storyrpc.io",
            accounts: process.env.WALLET_PRIVATE_KEY ? [process.env.WALLET_PRIVATE_KEY] : [],
            chainId: 1315,
            gasPrice: "auto",
        },
        // Story Protocol Mainnet (when available)
        storyMainnet: {
            url: process.env.STORY_MAINNET_RPC || "https://rpc.story.foundation",
            accounts: process.env.WALLET_PRIVATE_KEY ? [process.env.WALLET_PRIVATE_KEY] : [],
            chainId: 1514,
            gasPrice: "auto",
        },
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
    etherscan: {
        apiKey: {
            storyTestnet: "no-api-key-needed", // Story testnet doesn't require API key
        },
        customChains: [
            {
                network: "storyTestnet",
                chainId: 1315,
                urls: {
                    apiURL: "https://aeneid.explorer.story.foundation/api",
                    browserURL: "https://aeneid.explorer.story.foundation",
                },
            },
        ],
    },
};
