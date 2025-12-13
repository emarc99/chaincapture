const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ChainCaptureNFT", function () {
    let nftContract;
    let owner;
    let user1;
    let user2;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        const ChainCaptureNFT = await ethers.getContractFactory("ChainCaptureNFT");
        nftContract = await ChainCaptureNFT.deploy();
        await nftContract.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the correct name and symbol", async function () {
            expect(await nftContract.name()).to.equal("ChainCapture");
            expect(await nftContract.symbol()).to.equal("CCAP");
        });

        it("Should set the deployer as owner", async function () {
            expect(await nftContract.owner()).to.equal(owner.address);
        });

        it("Should start with token ID counter at 0", async function () {
            expect(await nftContract.getCurrentTokenId()).to.equal(0);
        });
    });

    describe("Minting", function () {
        const testURI = "ipfs://QmTest123";

        it("Should mint a new NFT with correct token ID", async function () {
            const tx = await nftContract.mint(user1.address, testURI);
            await tx.wait();

            expect(await nftContract.ownerOf(0)).to.equal(user1.address);
            expect(await nftContract.tokenURI(0)).to.equal(testURI);
        });

        it("Should increment token ID counter", async function () {
            await nftContract.mint(user1.address, testURI);
            expect(await nftContract.getCurrentTokenId()).to.equal(1);

            await nftContract.mint(user1.address, "ipfs://QmTest456");
            expect(await nftContract.getCurrentTokenId()).to.equal(2);
        });

        it("Should track creator correctly", async function () {
            await nftContract.mint(user1.address, testURI);
            expect(await nftContract.creatorOf(0)).to.equal(user1.address);
        });

        it("Should emit MediaMinted event", async function () {
            await expect(nftContract.mint(user1.address, testURI))
                .to.emit(nftContract, "MediaMinted")
                .withArgs(0, user1.address, testURI, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));
        });

        it("Should fail with empty token URI", async function () {
            await expect(nftContract.mint(user1.address, ""))
                .to.be.revertedWith("Token URI cannot be empty");
        });
    });

    describe("Batch Minting", function () {
        it("Should mint multiple NFTs in one transaction", async function () {
            const uris = [
                "ipfs://QmTest1",
                "ipfs://QmTest2",
                "ipfs://QmTest3",
            ];

            const tx = await nftContract.mintBatch(user1.address, uris);
            await tx.wait();

            expect(await nftContract.balanceOf(user1.address)).to.equal(3);
            expect(await nftContract.ownerOf(0)).to.equal(user1.address);
            expect(await nftContract.ownerOf(1)).to.equal(user1.address);
            expect(await nftContract.ownerOf(2)).to.equal(user1.address);
        });

        it("Should set correct token URIs for batch mint", async function () {
            const uris = ["ipfs://QmTest1", "ipfs://QmTest2"];
            await nftContract.mintBatch(user1.address, uris);

            expect(await nftContract.tokenURI(0)).to.equal(uris[0]);
            expect(await nftContract.tokenURI(1)).to.equal(uris[1]);
        });
    });

    describe("Creator Tracking", function () {
        it("Should return correct creator", async function () {
            await nftContract.mint(user1.address, "ipfs://QmTest1");
            await nftContract.mint(user2.address, "ipfs://QmTest2");

            expect(await nftContract.creatorOf(0)).to.equal(user1.address);
            expect(await nftContract.creatorOf(1)).to.equal(user2.address);
        });

        it("Should fail for non-existent token", async function () {
            await expect(nftContract.creatorOf(999))
                .to.be.revertedWith("Token does not exist");
        });
    });
});
