import web3 from "./web3";
import campaignFactory from "./build/CampaignFactory.json";

const contract = new web3.eth.Contract(
    campaignFactory.abi,
    '0x452AF19d31E5D4c97417077c12b1285E3F65c5ad'
);

export default contract;