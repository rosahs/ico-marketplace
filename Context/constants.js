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

// // NETWORKS
// const network = {
//   polygon_amoy: {
//     chainId: `0x${Number(80002).toString(16)}`,
//     chainName: "Polygon Amoy",
//     nativeCurrencty: {
//       name: "MATIC",
//       Symbol: "MATIC",
//       decimals: 18,
//     },
//     rpcUrls: ["https://rpc-amoy.polygon.technology/"],
//     blockExplorerUrls: ["https://www.oklink.com/amoy"],
//   },
// };

const network = {
  sepolia: {
    chainId: `0x${Number(11155111).toString(16)}`,
    chainName: "Sepolia Testnet",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [
      "https://sepolia.infura.io/v3/",
      "https://rpc.sepolia.org",
      "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
    ],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
  ethereum: {
    chainId: `0x${Number(1).toString(16)}`,
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

const changeNetwork = async ({ networkName }) => {
  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found");
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          ...networkName[networkName],
        },
      ],
    });
  } catch (err) {
    console.log(err);
  }
};

export const handleNetworkSwitch = async () => {
  const networkName = "sepolia";
  await changeNetwork({ networkName });
};

export const shortenAddress = (address) =>
  `${address?.slice(0, 5)}...${address?.length - 4}`;

// CONTRACT

const fetchContract = (address, abi, signer) => {
  new ethers.Contract(address, abi, signer);
};

export const ICO_MARKETPLACE_contract = async () => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(
      connection
    );

    const signer = provider.getSigner();

    const contract = fetchContract(
      ICO_MARKETPLACE_ADDRESS,
      ICO_MARKETPLACE_ABI,
      signer
    );

    return contract;
  } catch (error) {
    console.log(error);
  }
};

//TOKEN CONTRACT

export const TOKEN_contract = async (TOKEN_ADDRESS) => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(
      connection
    );

    const signer = provider.getSigner();

    const contract = fetchContract(
      TOKEN_ADDRESS,
      ERC20Generator_ABI,
      signer
    );

    return contract;
  } catch (error) {
    console.log(error);
  }
};
