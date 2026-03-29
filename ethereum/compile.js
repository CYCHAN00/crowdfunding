const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const crowdfundingPath = path.resolve(__dirname, 'contracts', 'Crowdfunding.sol');
const source = fs.readFileSync(crowdfundingPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'Crowdfunding.sol': { content: source },
  },
  settings: {
    evmVersion: 'paris',
    outputSelection: {
      '*': { '*': ['abi', 'evm.bytecode'] },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  const errors = output.errors.filter((e) => e.severity === 'error');
  if (errors.length > 0) {
    errors.forEach((e) => console.error(e.formattedMessage));
    throw new Error('Compilation failed');
  }
  output.errors
    .filter((e) => e.severity === 'warning')
    .forEach((e) => console.warn(e.formattedMessage));
}

fs.ensureDirSync(buildPath);

const contracts = output.contracts['Crowdfunding.sol'];
for (let contract in contracts) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract + '.json'),
    contracts[contract]
  );
}
