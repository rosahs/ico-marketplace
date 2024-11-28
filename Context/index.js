import { ethers } from "ethers";
import {
  Component,
  createContext,
  useContext,
  useState,
} from "react";

import toast from "react-hot-toast";
import Web3Modal from "web3modal";

import ERC20Generator from "./ERC20Generator.json";
import icoMarketplace from "./icoMarketplace.json";

// Internal Import
import {
  ERC20Generator_ABI,
  ERC20Generator_BYTECODE,
  ICO_MARKETPLACE_ABI,
  ICO_MARKETPLACE_BYTECODE,
  ICO_MARKETPLACE_ADDRESS,
  PINATA_API_KEY,
  PINATA_SECRET_KEY,
  handleNetworkSwitch,
  shortenAddress,
  ICO_MARKETPLACE_contract,
  TOKEN_contract,
} from "./constants";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [address, setAddress] = useState();
  const [accountBalance, setAccountBalance] =
    useState(null);
  const [loader, setLoader] = useState(false);
  const [reCall, setReCall] = useState(0);
  const [currency, setCurrency] = useState("ETH");

  // Component

  const [openBuyToken, setOpenBuyToken] = useState(false);
  const [openWithdrawToken, setOpenWithdrawToken] =
    useState(false);
  const [openTransferToken, setOpenTransferToken] =
    useState(false);
  const [openTokenCreator, setOpenTokenCreator] =
    useState(false);
  const [openCreateICO, setOpenCreateICO] = useState(false);

  const notifySuccess = (msg) =>
    toast.success(msg, { duration: 200 });
  const notifyError = (msg) =>
    toast.error(msg, { duration: 200 });

  // Function to check if a wallet is connected to the DApp
  const checkIfWalletConnected = async () => {
    try {
      // Check if the user has MetaMask (or any Ethereum-compatible wallet) installed
      if (!window.ethereum)
        return notifyError("No account found");

      // Request the list of accounts connected to the DApp from the user's wallet
      // 'eth_accounts' is a JSON-RPC method provided by Ethereum wallets like MetaMask
      // It returns an array of accounts that are currently authorized to interact with the DApp
      // If no accounts are connected, the array will be empty
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      // If there are connected accounts, set the first account (address) in state
      if (accounts.length) {
        setAddress(accounts[0]); // Set the first account as the active address

        const provider = new ethers.providers.Web3Provider(
          connection
        ); // Get the Web3 provider

        const getBalance = await provider.getBalance(
          accounts[0]
        );

        const bal = ethers.utils.formatEther(getBalance);
        setAccountBalance(bal);

        return accounts[0];
      } else {
        notifyError("no account found");
      }
    } catch (error) {
      console.log(error); // Log any errors that occur during the process
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum)
        return notifyError("No account found");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length) {
        setAddress(accounts[0]); // Set the first account as the active address
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();

        const provider = new ethers.providers.Web3Provider(
          connection
        );

        const getBalance = await provider.getBalance(
          accounts[0]
        );
        const bal = ethers.utils.formatEther(getBalance);
        setAccountBalance(bal);

        return accounts[0];
      } else {
        notifyError("no account found");
      }
    } catch (error) {
      console.log(error); // Log any errors that occur during the process
    }
  };

  // main functions

  const _deployedContract = async (
    signer,
    account,
    name,
    symbol,
    supply,
    imageURL
  ) => {
    try {
      // Create a new ContractFactory instance with ABI, Bytecode, and Signe
      const factory = new ethers.ContractFactory(
        ERC20Generator_ABI, // ABI defines the contract's functions and events
        ERC20Generator_BYTECODE, // Bytecode is the compiled contract code
        signer
      );

      const totalSupply = Number(supply);

      const _initialSupply = ethers.utils.parseEther(
        totalSupply.toString(),
        "ether"
      );

      let contract = await factory.deploy(
        _initialSupply,
        name,
        symbol
      );

      const transaction = await contract.deployed();

      if (contract.address) {
        const today = Date.now();
        let date = new Date(today);
        const _tokenCreatedDate =
          date.toLocaleDateString("en-US");

        const _token = {
          account: account,
          supply: supply.toString(),
          name: name,
          symbol: symbol,
          tokenAddress: contract.address,
          transactionHash: contract.deployTransaction.hash,
          createdAt: _tokenCreatedDate,
          logo: imageURL,
        };

        let tokenHistoy = [];

        const history =
          localStorage.getItem("TOKEN_HISTORY");

        if (history) {
          tokenHistoy = JSON.parse(
            localStorage.getItem("TOKEN_HISTORY")
          );
          tokenHistoy.push(_token);

          localStorage.setItem(
            "TOKEN_HISTORY",
            tokenHistoy
          );

          setLoader(false);
          setReCall(reCall + 1);
          setOpenTokenCreator(false);
        } else {
          tokenHistoy.push(_token);
          localStorage.setItem(
            "TOKEN_HISTORY",
            tokenHistoy
          );

          setLoader(false);
          setReCall(reCall + 1);
          setOpenTokenCreator(false);
        }
      }
    } catch (error) {
      setLoader(false);
      notifyError("Something went wrong");
      console.log(error);
    }
  };

  const createERC20 = async (token, account, imageURL) => {
    const { name, symbol, supply } = token;

    try {
      setLoader(true);
      notifySuccess("creating token...");
      if (!name || !symbol || !supply) {
        notifyError("Data Missing");
      } else {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect(); // Connect to the wallet
        const provider = new ethers.providers.Web3Provider(
          connection
        ); // Get the Web3 provider
        const signer = provider.getSigner();

        _deployedContract(
          signer,
          account,
          name,
          symbol,
          supply,
          imageURL
        );
      }
    } catch (error) {
      setLoader(false);
      notifyError("Something went wrong");
      console.log(error);
    }
  };

  const createICOSALE = async (icoSale) => {
    try {
      const { address, price } = icoSale;
      if (!address || !price)
        return notifyError("Data is missing");
      setLoader(true);
      notifySuccess("Creating ICO sales...");
      await connectWallet();

      const contract = await ICO_MARKETPLACE_contract();
      const payAmount = ethers.utils.parseUnits(
        price.toString(),
        "ethers"
      );

      const transaction = await contract.createICOSALE(
        address,
        payAmount,
        {
          gasLimit: ethers.utils.hexlify(800000),
        }
      );

      await transaction.wait();

      if (transaction.hash) {
        setLoader(false);
        setOpenCreateICO(false);
        setReCall(reCall + 1);
      }
    } catch (error) {
      setLoader(false);
      setOpenCreateICO(false);
      notifyError("Something went wrong");
      console.log(error);
    }
  };

  const GET_ALL_ICOSALE_TOKEN = async () => {
    try {
      setLoader(true);
      const address = await connectWallet();
      const contract = await ICO_MARKETPLACE_contract();

      if (address) {
        const allICOSellToken =
          await contract.getAllTokens();

        const _tokenArr = Promise.all(
          allICOSellToken.map(async (token) => {
            const tokenContract = await TOKEN_contract(
              token?.token
            );

            const balance = await tokenContract.balanceOf(
              ICO_MARKETPLACE_ADDRESS
            );

            return {
              creator: token.creator,
              token: token.token,
              price: ethers.utils.formatEther(
                token?.price.toString()
              ),
              name: token.name,
              symbol: token.symbol,
              supported: token.supported,
              icoSaleBal: ethers.utils.formatEther(
                balance.toString()
              ),
            };
          })
        );

        setLoader(false);
        return _tokenArr;
      }
    } catch (error) {
      setLoader(false);
      notifyError("Something went wrong");
      console.log(error);
    }
  };

  const GET_ALL_USER_ICOSALE_TOKEN = async () => {
    try {
      setLoader(true);
      const address = await connectWallet();
      const contract = await ICO_MARKETPLACE_contract();

      if (address) {
        const allICOSellToken =
          await contract.getTokenCreatedBy(address);

        const _tokenArr = Promise.all(
          allICOSellToken.map(async (token) => {
            const tokenContract = await TOKEN_contract(
              token?.token
            );

            const balance = await tokenContract.balanceOf(
              ICO_MARKETPLACE_ADDRESS
            );

            return {
              creator: token.creator,
              token: token.token,
              price: ethers.utils.formatEther(
                token?.price.toString()
              ),
              name: token.name,
              symbol: token.symbol,
              supported: token.supported,
              icoSaleBal: ethers.utils.formatEther(
                balance.toString()
              ),
            };
          })
        );

        setLoader(false);
        return _tokenArr;
      }
    } catch (error) {
      setLoader(false);
      notifyError("Something went wrong");
      console.log(error);
    }
  };

  const buyToken = async (tokenAddress, tokenQuantity) => {
    try {
      setLoader(true);
      notifySuccess("Purchasing token...");

      const address = await connectWallet();
      const contract = await ICO_MARKETPLACE_contract();

      const _tokenBal = await contract.getBalance(
        tokenAddress
      );
      const _tokenDetails = await contract.getTokenDetails(
        tokenAddress
      );

      const availableToken = ethers.utils.formatEther(
        _tokenBal.toString()
      );

      if (availableToken > 0) {
        const price =
          ethers.utils.formatEther(
            _tokenDetails.price.toString()
          ) * Number(tokenQuantity);

        const payAmount = ethers.utils.parseUnits(
          price.toString(),
          "ether"
        );

        const transaction = await contract.buyToken(
          tokenAddress,
          Number(tokenQuantity),
          {
            value: payAmount.toString(),
            gasLimit: ethers.utils.hexlify(800000),
          }
        );

        await transaction.wait();
        setLoader(false);
        setReCall(reCall + 1);
        setOpenBuyToken(false);
        notifySuccess("transaction completed successfully");
      } else {
        setLoader(false);
        setOpenBuyToken(false);
        notifyError("Your token balance is 0");
      }
    } catch (error) {
      setLoader(false);
      setOpenBuyToken(false);
      notifyError("Something went wrong");
      console.log(error);
    }
  };

  const transferTokens = async (transferTokenData) => {
    try {
      if (
        !transferTokenData.address ||
        !transferTokenData.amount ||
        !transferTokenData.tokenAddress
      )
        return notifyError("Data is missing");

      setLoader(true);
      notifySuccess("Transaction is processing...");

      const address = await connectWallet();

      const contract = await TOKEN_contract(
        transferTokenData.tokenAddress
      );

      // Check token balance
      const balance = await contract.balanceOf(address);
      const tokenAmount = ethers.utils.parseUnits(
        transferTokenData.amount.toString(),
        "ether"
      );

      // Compare available balance with transfer amount
      if (balance.lt(tokenAmount)) {
        setLoader(false);
        setOpenTransferToken(false);
        return notifyError("Insufficient token balance");
      }

      const transaction = await contract.transfer(
        transferTokenData.address,
        tokenAmount,
        {
          gasLimit: ethers.utils.hexlify(8000000),
        }
      );

      await transaction.wait();

      setLoader(false);
      setOpenTransferToken(false);
      setReCall(reCall + 1);
      notifySuccess(
        "Token transfer completed successfully"
      );
    } catch (error) {
      setLoader(false);
      setOpenTransferToken(false);
      notifyError("Token transfer failed");

      // More specific error handling
      if (error.code === 4001) {
        notifyError("Transaction was rejected by user");
      } else if (
        error.message.includes("insufficient funds")
      ) {
        notifyError("Insufficient funds for gas");
      } else {
        notifyError("Token transfer failed");
      }

      console.log(error);
    }
  };

  const withdrawToken = async (withdrawQuantity) => {
    try {
      if (
        !withdrawQuantity.amount ||
        !withdrawQuantity.token
      )
        return notifyError("Data is missing");

      setLoader(true);
      notifySuccess("Transaction is processing...");

      const address = await connectWallet();

      const contract = await ICO_MARKETPLACE_contract();

      // Check token balance
      const payAmount = ethers.utils.parseUnits(
        withdrawQuantity.amount.toString(),
        "ether"
      );

      const transaction = await contract.withdrawToken(
        withdrawQuantity.token,
        payAmount,
        {
          gasLimit: ethers.utils.hexlify(8000000),
        }
      );

      await transaction.wait();

      setLoader(false);
      setOpenWithdrawToken(false);
      setReCall(reCall + 1);
      notifySuccess(
        "Token transfer completed successfully"
      );
    } catch (error) {
      setLoader(false);
      setOpenWithdrawToken(false);
      notifyError("Token transfer failed");
      console.log(error);
    }
  };

  return (
    <StateContext.Provider value={{}}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () =>
  useContext(StateContext);
