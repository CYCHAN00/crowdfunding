import web3 from "./web3";
import Crowdfunding from "@/ethereum/build/Crowdfunding.json";

export default function getCampaign(address: string) {
  return new web3.eth.Contract(Crowdfunding.abi, address);
}
