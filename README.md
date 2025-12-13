# ChainCapture 📷⛓️

Transform any camera device into an instant IP registration tool. Capture photos and videos that are automatically minted and protected on Story Protocol, establishing cryptographic provenance at the moment of creation.

🏆 **Built for [Encode Club's Surreal World Assets Buildathon](https://www.encodeclub.com/programmes/surreal-world-assets-buildathon-2)**

## Features

✨ **Instant IP Registration**
- Capture photos and videos with your device camera
- Automatic upload to IPFS for decentralized storage
- One-click IP registration on Story Protocol
- Cryptographic provenance from moment of creation

🤖 **AI-Powered Remix Engine** (via ABV.dev)
- Generate derivative content using AI models (OpenAI, Anthropic, Gemini)
- Automatic parent IP linkage and attribution
- Built-in royalty distribution for original creators

💰 **Automated Royalty Distribution**
- Smart contracts track derivative works
- Transparent attribution across IP graph
- Automatic royalty splits to all creators in chain

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Blockchain**: Story Protocol (Aeneid Testnet)
- **AI Platform**: ABV.dev (with built-in Story Protocol integration)
- **Storage**: IPFS via NFT.Storage
- **Web3**: viem + ethers.js
- **Camera**: Browser MediaDevices API + MediaRecorder API

## Getting Started

### Prerequisites

1. **Node.js 18+** installed ([Download](https://nodejs.org/))
2. **MetaMask** or compatible Web3 wallet
3. **API Keys**:
   - ABV.dev API key ([Sign up](https://app.abv.dev))
   - NFT.Storage API key ([Get free key](https://nft.storage))
   - Story Protocol testnet tokens ([Discord faucet](https://discord.gg/storybuilders))

### Installation

1. **Clone the repository**
   ```bash
   cd C:\Users\LENOVO\Documents\encode-projects\chaincapture
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `env.example` to `.env.local` and fill in your values:
   ```bash
   # ABV.dev
   ABV_API_KEY=your_abv_api_key
   ABV_BASE_URL=https://api.abv.dev

   # Story Protocol
   NEXT_PUBLIC_STORY_CHAIN_ID=1315
   NEXT_PUBLIC_STORY_RPC=https://aeneid-testnet.storyrpc.io
   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x... # Deploy NFT contract first

   # IPFS Storage
   NEXT_PUBLIC_NFT_STORAGE_KEY=your_nft_storage_api_key
   PINATA_API_KEY=your_pinata_api_key
   PINATA_SECRET_KEY=your_pinata_secret

   # Private key for server-side transactions
   WALLET_PRIVATE_KEY=0x...
   ```

4. **Add Story Protocol Network to MetaMask**
   - Network Name: Story Aeneid Testnet
   - RPC URL: https://aeneid-testnet.storyrpc.io
   - Chain ID: 1315
   - Currency Symbol: IP
   - Explorer: https://aeneid.explorer.story.foundation

   Or visit: https://chainid.network/chain/1315

5. **Get Testnet Tokens**
   
   Join Story Discord and request testnet tokens: https://discord.gg/storybuilders

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Connect Wallet**
   - Click "Connect Wallet" and approve in MetaMask
   - Ensure you're on Story Protocol network (auto-switch available)

2. **Capture Media**
   - Navigate to the Capture page
   - Grant camera permission when prompted
   - Take a photo or record a video

3. **Add Metadata**
   - Provide title and description for your creation
   - Add relevant tags (max 5)
   - Click "Register as IP"

4. **View Dashboard**
   - See your registered IP assets
   - Track royalty earnings
   - Explore derivative relationships

## Project Structure

```
chaincapture/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Landing page
│   │   ├── capture/page.tsx   # Camera capture interface
│   │   ├── dashboard/page.tsx # User dashboard
│   │   └── api/               # API routes
│   │       └── register-ip/   # IP registration endpoint
│   ├── components/            # React components
│   │   ├── CameraCapture.tsx  # Camera interface
│   │   ├── MediaPreview.tsx   # Preview & metadata form
│   │   └── WalletConnect.tsx  # Wallet connection
│   ├── hooks/                 # Custom React hooks
│   │   ├── useCamera.ts       # Camera access hook
│   │   └── useWallet.ts       # Wallet connection hook
│   ├── services/              # Service modules
│   │   ├── ipfsService.ts     # IPFS uploads
│   │   ├── aiService.ts       # ABV.dev AI integration
│   │   └── storyProtocolService.ts # Story Protocol integration
│   ├── types/                 # TypeScript types
│   └── utils/                 # Constants & helpers
├── env.example                # Environment variables template
└── README.md                  # This file
```

## 🏆 Hackathon Bounty - GenAI IP Registration Challenge

This project qualifies for the **ABV.dev GenAI IP Registration Challenge**:

**Requirements Met:**
- ✅ Uses ABV.dev platform for AI generation
- ✅ Registers AI outputs as IP assets on Story Protocol
- ✅ Leverages ABV.dev's built-in Story Protocol integration

**Prize Tiers:**
- 1st place: $250 USDC + lifetime ABV Enterprise Lite + $500 in credits
- 2nd place: $100 USDC + lifetime ABV Enterprise Lite + $250 in credits
- 3rd place: $50 USDC + lifetime ABV Enterprise Lite + $100 in credits

## Roadmap

### MVP (Current)
- [x] Camera capture (photo & video)
- [x] IPFS upload
- [x] Story Protocol IP registration
- [x] Wallet integration
- [x] Basic UI/UX

### Phase 2 (Next Steps)
- [ ] NFT contract deployment
- [ ] AI remix interface with ABV.dev
- [ ] Derivative IP registration
- [ ] IP asset gallery
- [ ] Royalty tracking dashboard

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] IoT device integration
- [ ] Multi-chain support
- [ ] IP marketplace
- [ ] Advanced analytics

## Resources

- **Story Protocol**
  - [Documentation](https://docs.story.foundation/)
  - [Discord](https://discord.gg/storybuilders)
  - [Explorer](https://aeneid.explorer.story.foundation)

- **ABV.dev**
  - [Documentation](https://docs.abv.dev/)
  - [Dashboard](https://app.abv.dev)

- **Encode Club**
  - [Buildathon Page](https://www.encodeclub.com/programmes/surreal-world-assets-buildathon-2)

## License

MIT License - see LICENSE file for details

## Contributing

This is a hackathon project built for learning and demonstration. Contributions, issues, and feature requests are welcome!

---

**Built with ❤️ for the Encode Club Surreal World Assets Buildathon**

Powered by [Story Protocol](https://www.story.foundation) • [ABV.dev](https://abv.dev) • [IPFS](https://ipfs.tech)
