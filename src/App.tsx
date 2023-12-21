import "./App.css";
import Web3 from "web3";
import PoolV3Artifact from "@aave/core-v3/artifacts/contracts/protocol/pool/Pool.sol/Pool.json";
import ERC20Abi from "./abi/erc20.json";

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  const erc20 = "0xd6a7b61367078781149cfdc80dbc15718f33ae8f"; //self-deployed TASK2 ERC20 token
  const poolContract = "0x0562453c3DAFBB5e625483af58f4E6D668c44e19"; //Aave's Ethereum Sepolia's pool contract address
  const amountToApprove = 10000000000000;
  const supplyAmount = 1000;

  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        return new Web3(window.ethereum);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask not found. Please install MetaMask.");
    }
  };

  const approveErc20 = async () => {
    const web3 = await connectToMetaMask();
    if (!web3) return;
    const userAddress = (await web3.eth.getAccounts())[0];
    const erc20TokenContract = new web3.eth.Contract(ERC20Abi, erc20) as any;
    const result = erc20TokenContract.methods
      .approve(erc20, amountToApprove)
      .send({ from: userAddress });
    console.log("Approve Result:::", result);
  };

  const supplyHandler = async () => {
    const web3 = await connectToMetaMask();
    if (!web3) return;
    const userAddress = (await web3.eth.getAccounts())[0];
    const supplyContract = new web3.eth.Contract(
      PoolV3Artifact.abi,
      poolContract
    ) as any;
    const result = supplyContract.methods
      .supply(poolContract, supplyAmount, userAddress, 0)
      .send({ from: userAddress });
    console.log("Transaction Result:::", result);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <h1>TASK 2</h1>
      <button onClick={connectToMetaMask}>Connect to MetaMask</button>
      <button onClick={approveErc20}>Approve</button>
      <button onClick={supplyHandler}>Supply</button>
    </div>
  );
}

export default App;
