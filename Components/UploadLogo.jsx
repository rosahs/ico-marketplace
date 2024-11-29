import axios from "axios";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import UploadICON from "./SVG/UploadICON";

const UploadLogo = ({ imageFile, setImageFile }) => {
  const onDrop = useCallback(
    async (acceptedFile) => {
      setImageFile(acceptedFile[0]);
    },
    [setImageFile]
  );

  const { getInputProps, getRootProps } = useDropzone({
    onDrop,
    maxSize: 500000000000,
  });

  return (
    <>
      {imageFile ? (
        <div>
          <img
            src={URL.createObjectURL(imageFile)}
            style={{ width: "200px", height: "auto" }}
            alt="Preview"
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
