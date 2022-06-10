const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compiledFactory.abi)
                            .deploy({
                                data: compiledFactory.evm.bytecode.object
                            })
                            .send({
                                from: accounts[0],
                                gas: '5000000'
                            });

    await factory.methods.createCampaign('100', 'test')
                .send({
                    from: accounts[0],
                    gas: '5000000'
                });
    const addresses = await factory.methods.fetchAllCampaigns().call();
    campaignAddress = addresses[0];

    campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe('Campaigns', () => {
    it('deploys factory and campaing successfully', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async() => {
        const manager = await campaign.methods.manager().call();
        assert.equal(manager, accounts[0]);
    });

    it('allows people to contribute money and make them approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });

        const isContributer = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributer);
    });

    it('allows a manager to create payment request', async () => {
        await campaign.methods.createRequest('Buy cabels', '100', accounts[2])
        .send({
            from: accounts[0],
            gas: '5000000'
        });

        const request = await campaign.methods.requests(0).call();

        assert.equal('Buy cabels', request.description);
    });


});