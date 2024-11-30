import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
const WidthdrawToken = ({
  address,
  withdrawToken,
  connectWallet,
  setOpenWithdrawToken,
}) => {
  const [withdrawQuantity, setwithdrawQuantity] = useState({
    token: "",
    amount: "",
  });

  return (
    <div className="modal">
      <div className="modal-content">
        <span
          onClick={() => setOpenWithdrawToken(false)}
          className="close"
        >
          &times;
        </span>
        <h2>Withdraw Token</h2>
        <div
          className="input-Container"
          style={{ marginTop: "1rem" }}
        >
          <Input
            placeholder="Token Address"
            handleChange={(e) =>
              setwithdrawQuantity({
                ...withdrawQuantity,
                token: e.target.value,
              })
            }
          />

          <Input
            placeholder="Amount"
            handleChange={(e) =>
              setwithdrawQuantity({
                ...withdrawQuantity,
                amount: e.target.value,
              })
            }
          />
        </div>
        <div
          className="button-box"
          style={{ marginTop: "1rem" }}
        >
          {address ? (
            <Button
              name="Token"
              handleClick={() =>
                withdrawToken(withdrawQuantity)
              }
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

export default WidthdrawToken;
