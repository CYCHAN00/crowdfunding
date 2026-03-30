import web3 from "./web3";
import { FACTORY_ADDRESS, FACTORY_ABI } from "./constants";

const factory = new web3.eth.Contract(FACTORY_ABI, FACTORY_ADDRESS);

export default factory;
