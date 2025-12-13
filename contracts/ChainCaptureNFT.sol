// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ChainCaptureNFT
 * @dev NFT contract for ChainCapture IP Assets
 * This contract is designed to work with Story Protocol for IP registration
 */
contract ChainCaptureNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    
    // Mapping from token ID to creator address
    mapping(uint256 => address) private _creators;
    
    // Events
    event MediaMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string tokenURI,
        uint256 timestamp
    );
    
    constructor() ERC721("ChainCapture", "CCAP") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }
    
    /**
     * @dev Mint a new NFT with media URI
     * @param to Address to mint the NFT to
     * @param tokenURI IPFS URI of the media
     * @return tokenId The ID of the newly minted token
     */
    function mint(address to, string memory tokenURI) public returns (uint256) {
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _creators[tokenId] = to;
        
        emit MediaMinted(tokenId, to, tokenURI, block.timestamp);
        
        return tokenId;
    }
    
    /**
     * @dev Batch mint multiple NFTs
     * @param to Address to mint the NFTs to
     * @param tokenURIs Array of IPFS URIs
     * @return tokenIds Array of newly minted token IDs
     */
    function mintBatch(address to, string[] memory tokenURIs) public returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](tokenURIs.length);
        
        for (uint256 i = 0; i < tokenURIs.length; i++) {
            tokenIds[i] = mint(to, tokenURIs[i]);
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Get the creator of a token
     * @param tokenId The token ID to query
     * @return creator The address of the creator
     */
    function creatorOf(uint256 tokenId) public view returns (address) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _creators[tokenId];
    }
    
    /**
     * @dev Get the current token ID counter
     * @return The next token ID that will be minted
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    /**
     * @dev Override supportsInterface to support Story Protocol
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
