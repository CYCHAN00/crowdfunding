import { Web3 } from "web3";

function getWeb3() {
  const infuraUrl = process.env.INFURA_PROJECT_ID;
  if (!infuraUrl) {
    throw new Error("INFURA_PROJECT_ID env variable is not set");
  }
  return new Web3(infuraUrl);
}

export default getWeb3();
