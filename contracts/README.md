# @kleros/curate-v2-contracts

Smart contracts for CurateV2

## Deployments

Refresh the list of deployed contracts by running `./scripts/generateDeploymentsMarkdown.sh` or `./scripts/populateReadme.sh`.

### Official Testnet

#### Arbitrum Sepolia

#### Sepolia

### Devnet

#### Arbitrum Sepolia

- [CurateFactory](https://sepolia.arbiscan.io/address/0x6f824A72d67bcF76f6F55C12F6E8FcAF531818bD)
- [CurateV2](https://sepolia.arbiscan.io/address/0xed1f06a9963D2B2D5f2176b2dFFaaf03FC909531)
- [CurateView](https://sepolia.arbiscan.io/address/0x61DAadc87f1e0889407d2Fd725eAEB79E2B5cF80)

#### Sepolia

## Getting Started

### Install the Dependencies

```bash
yarn install
```

### Run Tests

```bash
yarn test
```

### Compile the Contracts

```bash
yarn build
```

### Run Linter on Files

```bash
yarn lint
```

### Fix Linter Issues on Files

```bash
yarn fix
```

### Deploy Instructions

**NOTICE:** the commands below work only if you are inside the `contracts/` directory.

#### 0. Set the Environment Variables

Copy `.env.example` file as `.env` and edit it accordingly.

```bash
cp .env.example .env
```

The following env vars are required:

- `PRIVATE_KEY`: the private key of the deployer account used for the testnets.
- `MAINNET_PRIVATE_KEY`: the private key of the deployer account used for Mainnet.
- `INFURA_API_KEY`: the API key for infura.

The ones below are optional:

- `ETHERSCAN_API_KEY`: to verify the source of the newly deployed contracts on **Etherscan**.
- `ARBISCAN_API_KEY`: to verify the source of the newly deployed contracts on **Arbitrum**.
- `GNOSISSCAN_API_KEY`: to verify the source of the newly deployed contracts on **Gnosis chain**.

#### 1. Deploy to a Local Network

:warning: There is no mocks deployed for the kleros-v2 contracts currently so this would fail. For now consider deploying to a testnet fork (next section).

**Shell 1: the node**

```bash
yarn hardhat node --tags nothing
```

**Shell 2: the deploy script**

```bash
yarn deploy --network localhost --tags CurateV2
```

#### 2. Deploy to a Public Network Fork

**Shell 1: the node**

```bash
yarn start-devnet-fork
# or
yarn start-testnet-fork
```

**Shell 2: the deploy script**

```bash
yarn deploy-devnet-fork
# or
yarn deploy-testnet-fork
```

#### 3. Deploy to Public Testnets

```bash
yarn deploy --network arbitrumSepolia --tags CurateV2
```

The deployed addresses should be displayed to the screen after the deployment is complete. If you missed them, you can always go to the `deployments/<network>` directory and look for the respective file.

#### 4. Deploy a Devnet on Public Testnets

Same steps as above but append `Devnet` to the `--network` parameter.

#### Running Test Fixtures

**Shell 1: the node**

```bash
yarn hardhat node --tags CurateV2
```

**Shell 2: the test scripts**

```bash
yarn test --network localhost
```

#### 4. Verify the Source Code

This must be done for each network separately.

```bash
# explorer
yarn etherscan-verify --network arbitrumSepolia
yarn etherscan-verify-proxies

# sourcify
yarn sourcify --network arbitrumSepolia

```

## Ad-hoc procedures

### Generate deployment artifacts for existing contracts

#### Usage

```bash
scripts/generateDeploymentArtifact.sh <network> <address>
```

#### Example: WETH on Gnosis chain

```bash
scripts/generateDeploymentArtifact.sh gnosischain 0xf8d1677c8a0c961938bf2f9adc3f3cfda759a9d9 > deployments/gnosischain/WETH.json
```

### Push the contracts to a Tenderly project

Ensure that your `$TENDERLY_PROJECT` and `$TENDERLY_USERNAME` is set correctly in `.env`.

```bash
yarn tenderly-verify --network sepolia
yarn tenderly-verify --network arbitrumSepolia
```
