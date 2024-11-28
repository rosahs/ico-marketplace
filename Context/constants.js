import { ethers } from "ethers";
import Web3Modal from "web3modal";

import ERC20Generator from "./ERC20Generator.json";
import icoMarketplace from "./icoMarketplace.json";

export const ERC20Generator_ABI = ERC20Generator.abi;
export const ERC20Generator_BYTECODE =
  ERC20Generator.bytecode;

export const ICO_MARKETPLACE_ABI = icoMarketplace.abi;
export const ICO_MARKETPLACE_BYTECODE =
  icoMarketplace.bytecode;

export const ICO_MARKETPLACE_ADDRESS =
  process.env.NEXT_PUBLIC_ICO_MARKETPLACE_ADDRESS;

export const PINATA_API_KEY =
  process.env.NEXT_PUBLIC_PINATA_API_KEY;
export const PINATA_SECRET_KEY =
  process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

// NETWORK CONFIGURATION
// Define network parameters for Sepolia Testnet and Ethereum Mainnet
const network = {
  sepolia: {
    chainId: `0x${Number(11155111).toString(16)}`, // Convert chainId to hexadecimal
    chainName: "Sepolia Testnet",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [
      "https://sepolia.infura.io/v3/", // RPC URL for Infura
      "https://rpc.sepolia.org",
      "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
    ],
    blockExplorerUrls: ["https://sepolia.etherscan.io"], // Block explorer URL
  },
  ethereum: {
    chainId: `0x${Number(1).toString(16)}`, // Mainnet chainId in hexadecimal
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [
      "https://mainnet.infura.io/v3/",
      "https://eth.llamarpc.com",
      "https://ethereum.blockpi.network/v1/rpc/public",
    ],
    blockExplorerUrls: ["https://etherscan.io"],
  },
};

// Function to change network using `wallet_addEthereumChain`
const changeNetwork = async ({ networkName }) => {
  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found");

    const chainId = network[networkName].chainId;
    // First try to switch to the network
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    });
  } catch (switchError) {
    // If the network is not added, add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              ...network[networkName],
            },
          ],
        });
      } catch (addError) {
        console.error(addError);
      }
    } else {
      console.error(switchError);
    }
  }
};

// Handles switching to a specific network (e.g., Sepolia)
export const handleNetworkSwitch = async () => {
  const networkName = "sepolia"; // Currently set to Sepolia
  await changeNetwork({ networkName }); // Call changeNetwork with the network name
};

// Utility function to shorten Ethereum addresses for UI display
export const shortenAddress = (address) =>
  `${address?.slice(0, 5)}...${address?.slice(-4)}`; // Example: 0x123...ABCD

// Fetch a smart contract instance using ethers.js
const fetchContract = (address, abi, signer) => {
  return new ethers.Contract(address, abi, signer); // Create a contract instance
};

// Returns an instance of the ICO Marketplace contract
export const ICO_MARKETPLACE_contract = async () => {
  try {
    const web3Modal = new Web3Modal(); // Create a new Web3Modal instance for wallet connection
    const connection = await web3Modal.connect(); // Connect to user's wallet

    const provider = new ethers.providers.Web3Provider(
      connection
    ); // Create a provider using the connected wallet
    const signer = provider.getSigner(); // Get the signer (wallet user)

    const contract = fetchContract(
      ICO_MARKETPLACE_ADDRESS,
      ICO_MARKETPLACE_ABI,
      signer
    ); // Fetch the contract instance
    return contract; // Return the contract instance
  } catch (error) {
    console.log(error); // Log any errors
  }
};

// Returns an instance of a specific ERC20 token contract
export const TOKEN_contract = async (TOKEN_ADDRESS) => {
  try {
    const web3Modal = new Web3Modal(); // Initialize Web3Modal for wallet connection
    const connection = await web3Modal.connect(); // Connect to the wallet

    const provider = new ethers.providers.Web3Provider(
      connection
    ); // Get the Web3 provider
    const signer = provider.getSigner(); // Get the wallet signer

    const contract = fetchContract(
      TOKEN_ADDRESS,
      ERC20Generator_ABI,
      signer
    ); // Get the ERC20 token contract instance
    return contract; // Return the contract instance
  } catch (error) {
    console.log(error); // Log any errors
  }
};
