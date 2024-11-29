import axios from "axios";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import UploadICON from "./SVG/UploadICON";

const UploadLogo = ({
  imageURL,
  setImageURL,
  setLoader,
  PINATA_API_KEY,
  PINATA_SECRET_KEY,
}) => {
  const notifySuccess = (msg) =>
    toast.success(msg, { duration: 200 });
  const notifyError = (msg) =>
    toast.error(msg, { duration: 200 });

  const uploadToIPFS = async (file) => {
    if (file) {
      try {
        setLoader(true);
        const formData = new FormData();
        formData.append("file", file);

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

        const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

        setImageURL(url);
        setLoader(false);
        notifySuccess("Logo uploaded successfully");
      } catch (error) {
        setLoader(false);
        notifyError("Check your pinata keys");
        console.log(error);
      }
    }
  };

  const onDrop = useCallback(async (acceptedFile) => {
    await uploadToIPFS(acceptedFile[0]);
  });

  const { getInputProps, getRootProps } = useDropzone({
    onDrop,
    maxSize: 500000000000,
  });

  return (
    <>
      {imageURL ? (
        <div>
          {" "}
          <img
            src={imageURL}
            style={{ width: "200px", height: "auto" }}
            alt=""
          />
        </div>
      ) : (
        <div {...getRootProps()}>
          <label
            htmlFor="file"
            className="custum-file-upload"
          >
            <div className="icon">
              <UploadICON />
            </div>
            <div className="text">
              <span>Click to upload Logo</span>
            </div>
            <input
              type="file"
              id="file"
              {...getInputProps()}
            />
          </label>
        </div>
      )}
    </>
  );
};

export default UploadLogo;
