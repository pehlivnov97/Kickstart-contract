import web3 from './web3';
import Campaing from './build/Campaign.json';


const getCampaign = (address) => {
    const instance = new web3.eth.Contract(
        Campaing.abi,
        address
    );

    return instance;
}

export default getCampaign;

