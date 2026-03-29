require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const compiledCrowdfundingFactory = require('./build/CrowdfundingFactory.json');

const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    process.env.INFURA_PROJECT_ID
);

const web3 = new Web3(provider);

const deploy = async () => {
    try {
        const accounts = await web3.eth.getAccounts();

        console.log('Attempting to deploy from account', accounts[0]);

        const result = await new web3.eth.Contract(compiledCrowdfundingFactory.abi)
            .deploy({ data: compiledCrowdfundingFactory.evm.bytecode.object })
            .send({ from: accounts[0], gas: '3000000' });

        console.log('Contract deployed to', result.options.address);
    } catch (error) {
        console.error('Deploy failed:', error.message || error);
    }
    provider.engine.stop();
};

deploy();