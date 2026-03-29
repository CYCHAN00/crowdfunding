import web3 from "./web3";
import CrowdfundingFactory from "@/ethereum/build/CrowdfundingFactory.json";

const FACTORY_ADDRESS = "0x484D60e58C88e7A4FE0370c2D3C3F0ca67E9137F";

const factory = new web3.eth.Contract(
  CrowdfundingFactory.abi,
  FACTORY_ADDRESS,
);

export default factory;
