import React, { useEffect, useState } from "react";
import Button from "./Button";

const Header = ({
  accountBalance,
  setAddress,
  address,
  connectWallet,
  ICO_MARKETPLACE_ADDRESS,
  shortenAddress,
  setOpenAllICOs,
  OpenAllICOs,
  setOpenTokenCreator,
  openTokenCreator,
  setOpenTokenHistory,
  openTokenHistory,
  setOpenICOMarketPlace,
  openICOMarketPlace,
}) => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] =
    useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setIsMetaMaskInstalled(true);
      window.ethereum.on(
        "accountsChanged",
        handleAccontsChanged
      );
    }

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccontsChanged
        );
      }
    };
  }, [address]);

  function handleAccontsChanged(accounts) {
    setAddress(accounts[0]);
  }

  return (
    <div className="header">
      <nav>
        <div className="logo">
          <a href="/">ICO Market</a>
        </div>

        <input type="checkbox" name="" id="menu-toggle" />
        <label htmlFor="menu-toggle" className="menu-icon">
          &#9776;
        </label>

        <ul className="menu">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a
              onClick={() =>
                openICOMarketPlace
                  ? setOpenICOMarketPlace(false)
                  : setOpenICOMarketPlace(true)
              }
            >
              ICO Marketplace
            </a>
          </li>
          <li>
            <a
              onClick={() =>
                OpenAllICOs
                  ? setOpenAllICOs(false)
                  : setOpenAllICOs(true)
              }
            >
              Created ICO
            </a>
          </li>

          <li>
            <a
              onClick={() =>
                openTokenHistory
                  ? setOpenTokenHistory(false)
                  : setOpenTokenHistory(true)
              }
            >
              History
            </a>
          </li>

          <li>
            <a
              onClick={() =>
                openTokenCreator
                  ? setOpenTokenCreator(false)
                  : setOpenTokenCreator(true)
              }
            >
              create token
            </a>
          </li>

          {address ? (
            <li>
              <Button
                name={`${shortenAddress(
                  address
                )}: ${accountBalance?.slice(0, 5)}`}
              />
            </li>
          ) : (
            <li>
              <Button
                name="Connect wallet"
                handleClick={connectWallet}
              />
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Header;
