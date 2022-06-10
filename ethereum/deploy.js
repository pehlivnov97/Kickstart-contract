const walletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new walletProvider(
    'wild amateur power juice blade word ill sight sadness network mail universe',
    'https://rinkeby.infura.io/v3/b9e4aeff05244c4eb20a196eac80ac42'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    const res = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({
            data: compiledFactory.evm.bytecode.object
        })
        .send({
            from: accounts[0],
            gas: '5000000'
        });

    console.log('Contract deployed to ', res.options.address);
    provider.engine.stop();
};

deploy();
//Contract deployed to  0xD6cF9Dc01C4E941De64BE0a3e60bce783a11830A