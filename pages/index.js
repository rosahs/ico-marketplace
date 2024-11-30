import React, { useEffect, useState } from "react";

import { useStateContext } from "../Context/index";
import Header from "../Components/Header";
import Input from "../Components/Input";
import Button from "../Components/Button";
import Table from "../Components/Table";
import PreSaleList from "../Components/PreSaleList";
import UploadLogo from "../Components/UploadLogo";
import Loader from "../Components/Loader";
import Footer from "../Components/Footer";
import ICOMarket from "../Components/ICOMarket";
import TokenCreator from "../Components/TokenCreator";
import TokenHistory from "../Components/TokenHistory";
import Marketplace from "../Components/Marketplace";
import CreateICO from "../Components/CreateICO";
import Card from "../Components/Card";
import BuyToken from "../Components/BuyToken";
import WithdrawToken from "../Components/WithdrawToken";
import TokenTransfer from "../Components/TokenTransfer";

const index = () => {
  const {
    withdrawToken,
    transferTokens,
    buyToken,
    createICOSALE,
    GET_ALL_ICOSALE_TOKEN,
    GET_ALL_USER_ICOSALE_TOKEN,
    createERC20,
    connectWallet,
    openBuyToken,
    setOpenBuyToken,
    openWithdrawToken,
    setOpenWithdrawToken,
    openTransferToken,
    setOpenTransferToken,
    openTokenCreator,
    setOpenTokenCreator,
    openCreateICO,
    setOpenCreateICO,
    address,
    setAddress,
    accountBalance,
    loader,
    setLoader,
    currency,
    ICO_MARKETPLACE_ADDRESS,
    PINATA_API_KEY,
    PINATA_SECRET_KEY,
    shortenAddress,
    reCall,
  } = useStateContext();

  const notifySuccess = (msg) =>
    toast.success(msg, { duration: 200 });
  const notifyError = (msg) =>
    toast.error(msg, { duration: 200 });

  const [allICOs, setAllICOs] = useState();
  const [allUserICOs, setAllUserICOs] = useState();

  //component open
  const [OpenAllICOs, setOpenAllICOs] = useState();
  const [openTokenHistory, setOpenTokenHistory] =
    useState();
  const [openICOMarketPlace, setOpenICOMarketPlace] =
    useState();

  // buy ico token
  const [buyICO, setBuyICO] = useState();

  const copyAddress = () => {
    navigator.clipboard.writeText(ICO_MARKETPLACE_ADDRESS);
    notifySuccess("copied succefully");
  };

  useEffect(() => {
    if (address) {
      GET_ALL_ICOSALE_TOKEN().then((token) => {
        console.log("all", token);
        setAllICOs(token);
      });

      GET_ALL_USER_ICOSALE_TOKEN().then((token) => {
        console.log("user", token);
        setAllUserICOs(token);
      });
    }
  }, [address, reCall]);

  return (
    <div>
      <Header
        accountBalance={accountBalance}
        setAddress={setAddress}
        address={address}
        connectWallet={connectWallet}
        ICO_MARKETPLACE_ADDRESS={ICO_MARKETPLACE_ADDRESS}
        shortenAddress={shortenAddress}
        setOpenAllICOs={setOpenAllICOs}
        OpenAllICOs={OpenAllICOs}
        setOpenTokenCreator={setOpenTokenCreator}
        openTokenCreator={openTokenCreator}
        setOpenTokenHistory={setOpenTokenHistory}
        openTokenHistory={openTokenHistory}
        setOpenICOMarketPlace={setOpenICOMarketPlace}
        openICOMarketPlace={openICOMarketPlace}
      />

      {OpenAllICOs && (
        <ICOMarket
          array={allUserICOs}
          shortenAddress={shortenAddress}
          handleClick={setOpenAllICOs}
          currency={currency}
        />
      )}

      {openTokenCreator && (
        <TokenCreator
          createERC20={createERC20}
          shortenAddress={shortenAddress}
          setOpenTokenCreator={setOpenTokenCreator}
          setLoader={setLoader}
          address={address}
          connectWallet={connectWallet}
          PINATA_API_KEY={PINATA_API_KEY}
          PINATA_SECRET_KEY={PINATA_SECRET_KEY}
        />
      )}

      {openTokenHistory && (
        <TokenHistory
          shortenAddress={shortenAddress}
          setOpenTokenHistory={setOpenTokenHistory}
        />
      )}

      {openCreateICO && (
        <CreateICO
          shortenAddress={shortenAddress}
          setOpenCreateICO={setOpenCreateICO}
          connectWallet={connectWallet}
          address={address}
          createICOSALE={createICOSALE}
        />
      )}

      {openICOMarketPlace && (
        <ICOMarket
          array={allICOs}
          shortenAddress={shortenAddress}
          handleClick={setOpenICOMarketPlace}
          currency={currency}
        />
      )}

      {openBuyToken && <BuyToken />}
      {openTransferToken && <TokenTransfer />}
      {openWithdrawToken && <WithdrawToken />}

      <Footer />

      {loader && <Loader />}
    </div>
  );
};

export default index;
