import React, { useState } from "react";
import UploadLogo from "./UploadLogo";
import Input from "./Input";
import Button from "./Button";
import axios from "axios";

const TokenCreator = ({
  createERC20,
  shortenAddress,
  setOpenTokenCreator,
  setLoader,
  address,
  connectWallet,
  PINATA_API_KEY,
  PINATA_SECRET_KEY,
}) => {
  const [imageFile, setImageFile] = useState(null);
  const [token, setToken] = useState({
    name: "",
    symbol: "",
    supply: "",
  });

  const handleCreateToken = async () => {
    try {
      setLoader(true);
      let imageURL = null;

      // Upload image to IPFS if file exists
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const response = await axios({
          method: "POST",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          maxBodyLength: "Infinity",
          headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY,
            "Content-Type": "multipart/form-data",
          },
        });
        imageURL = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      }

      // Create token with or without image
      createERC20(token, address, imageURL);
    } catch (error) {
      console.error("Token creation error:", error);
      setLoader(false);
    }
  };

  return (
    <div id="myModal" className="modal">
      <div className="modal-content">
        <span
          onClick={() => setOpenTokenCreator(false)}
          className="close"
        >
          &times;
        </span>
        <h2 style={{ marginBottom: "1rem" }}>
          Create token
        </h2>
        <UploadLogo
          imageFile={imageFile}
          setImageFile={setImageFile}
          PINATA_API_KEY={PINATA_API_KEY}
          PINATA_SECRET_KEY={PINATA_SECRET_KEY}
        />
        <div className="input-Container">
          <Input
            placeholder="Name"
            handleChange={(e) =>
              setToken({ ...token, name: e.target.value })
            }
          />
          <Input
            placeholder="Symbol"
            handleChange={(e) =>
              setToken({ ...token, symbol: e.target.value })
            }
          />
          <Input
            placeholder="Supply"
            handleChange={(e) =>
              setToken({ ...token, supply: e.target.value })
            }
          />
        </div>
        <div
          className="button-box"
          style={{ marginTop: "1rem" }}
        >
          {address ? (
            <Button
              name="Create Token"
              handleClick={handleCreateToken}
            />
          ) : (
            <Button
              name="Connect Wallet"
              handleClick={() => connectWallet()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenCreator;
