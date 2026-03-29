const assert = require('assert');
const { Web3 } = require('web3');
const ganache = require('ganache');
const web3 = new Web3(ganache.provider());

const compiledCrowdfundingFactory = require('../ethereum/build/CrowdfundingFactory.json');
const compiledCrowdfunding = require('../ethereum/build/Crowdfunding.json');

let accounts;
let factory;
let crowdfunding;
let crowdfundingAddress;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(compiledCrowdfundingFactory.abi)
        .deploy({ data: compiledCrowdfundingFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas: '3000000' });

    await factory.methods.createCrowdfunding('100').send({ from: accounts[0], gas: '3000000' });
    [crowdfundingAddress] = await factory.methods.getDeployedCrowdfunding().call();
    crowdfunding = await new web3.eth.Contract(compiledCrowdfunding.abi, crowdfundingAddress);
});

describe('Crowdfunding', () => {
    it('should deploy a factory and a crowdfunding contract', async () => {
        assert.ok(factory.options.address);
        assert.ok(crowdfunding.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        assert.equal(await crowdfunding.methods.manager().call(), accounts[0]);
    });

    it('allows contributions to the campaign and mark the as an approver', async () => {
        await crowdfunding.methods.contribute().send({ from: accounts[1], value: '200' });
        const isContributor = await crowdfunding.methods.approvers(accounts[1]);
        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await crowdfunding.methods.contribute().send({ from: accounts[1], value: '5' });
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    it('allows a manager to make a payment request', async () => {
        await crowdfunding.methods.createRequest('description', '100', accounts[1]).send({ from: accounts[0], gas: '3000000' });
        const request = await crowdfunding.methods.requests(0).call();
        assert.equal(request.description, 'description');
        assert.equal(request.value, '100');
        assert.equal(request.recipient, accounts[1]);
        assert.equal(request.complete, false);
        assert.equal(request.approvalCount, 0);
    });

    it('processes a request to complete a payment', async () => {
        await campaign.methods.contribute().send({ from: accounts[0], value: web3.utils.toWei('5', 'ether') });
        await campaign.methods.createRequest('description', web3.utils.toWei('1', 'ether'), accounts[1]).send({ from: accounts[0], gas: '3000000' });
        await campaign.methods.approveRequest(0).send({ from: accounts[0], gas: '3000000' });
        await campaign.methods.finalizeRequest(0).send({ from: accounts[0], gas: '3000000' });
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        assert(balance > 104);
    });
});