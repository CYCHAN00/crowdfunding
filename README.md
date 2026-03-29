# CrowdCrypto — Decentralized Crowdfunding Platform

A full-stack Web3 crowdfunding dApp where anyone can launch campaigns, contribute crypto, and collectively govern fund disbursement through on-chain voting.

## Features

- **Smart Contract–Powered Campaigns** — A factory contract deploys isolated campaign contracts, each with its own funding pool and governance.
- **Contributor Voting** — Fund release requests require majority approval from contributors before execution, preventing misuse.
- **On-Chain Transparency** — Every contribution, request, and approval is recorded on the Ethereum blockchain.
- **Borderless Access** — No banks, no borders. Anyone with a wallet can create or back a campaign.
- **Modern Frontend** — Animated landing page with Aurora backgrounds, split-text reveals, and smooth transitions.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui |
| Animations | GSAP, Motion (Framer Motion) |
| Blockchain | Solidity ^0.8.19, Web3.js 4 |
| Provider | Infura |
| Testing | Mocha, Ganache |

## Smart Contracts

- **CrowdfundingFactory** — Deploys new campaign contracts and tracks all deployed campaigns.
- **Crowdfunding** — Handles contributions, spending requests, contributor approvals, and fund finalization with majority voting.

## How It Works

1. **Create** — Set up a campaign with a minimum contribution threshold.
2. **Contribute** — Backers send ETH to the campaign contract.
3. **Request** — The campaign manager creates a spending request (description, amount, recipient).
4. **Approve & Finalize** — Contributors vote; once >50% approve, funds are released to the recipient.

## Getting Started

### Prerequisites

- Node.js 18+
- An [Infura](https://infura.io/) project ID

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
INFURA_PROJECT_ID=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

### Compile Contracts

```bash
node ethereum/compile.js
```

### Deploy Contracts

```bash
node ethereum/deploy.js
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Run Tests

```bash
npm test
```

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Landing page
│   └── explore/          # Campaign explorer
├── components/           # React components (Navbar, Hero, Features, etc.)
├── ethereum/
│   ├── contracts/        # Solidity smart contracts
│   ├── build/            # Compiled contract ABIs
│   ├── compile.js        # Contract compilation script
│   └── deploy.js         # Contract deployment script
└── lib/                  # Web3 utilities (web3 instance, factory, campaign)
```

## License

This project is unlicensed.
