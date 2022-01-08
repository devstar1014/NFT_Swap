import { hexDataLength, hexDataSlice } from '@ethersproject/bytes';
import { ethers } from 'ethers';
import { NftSwap, SwappableAsset } from '../src';
import { signOrderWithEoaWallet, verifyOrderSignature } from '../src/sdk/pure';
import { normalizeOrder } from '../src/utils/order';

jest.setTimeout(60 * 1000);

const MAKER_WALLET_ADDRESS = '0xabc23F70Df4F45dD3Df4EC6DA6827CB05853eC9b';
const MAKER_PRIVATE_KEY =
  'fc5db508b0a52da8fbcac3ab698088715595f8de9cccf2467d51952eec564ec9';
// NOTE(johnrjj) - NEVER use these private keys for anything of value, testnets only!

// TODO(johnrjj) - When Rinkeby faucet is working, separate out swap into two accounts.
// Right now we'll just trade between the same account (it works for testing purposes)
// const TAKER_WALLET_ADDRESS = "0xaaa1388cD71e88Ae3D8432f16bed3c603a58aD34";
// const TAKER_PRIVATE_KEY =
//   "a8d6d0643c732663bf5221f83df806a59ed54dbd9be02e226b1a11ff4de83de8";

const WMATIC_TOKEN_ADDRESS_TESTNET =
  '0x9c3c9283d3e44854697cd22d3faa240cfb032889';
const DAI_TOKEN_ADDRESS_TESTNET = '0x001b3b4d0f3714ca98ba10f6042daebf0b1b7b6f';

const RPC_TESTNET =
  'https://polygon-mumbai.g.alchemy.com/v2/VMBpFqjMYv2w-MWnc9df92w3R2TpMvSG';

const MAKER_WALLET = new ethers.Wallet(MAKER_PRIVATE_KEY);
// const TAKER_WALLET = new ethers.Wallet(TAKER_PRIVATE_KEY);

const PROVIDER = new ethers.providers.StaticJsonRpcProvider(RPC_TESTNET);

const MAKER_SIGNER = MAKER_WALLET.connect(PROVIDER);
// const TAKER_PROVIDER = TAKER_WALLET.connect(PROVIDER);

const nftSwapperMaker = new NftSwap(MAKER_SIGNER as any, MAKER_SIGNER, 80001);
// const nftSwapperTaker = new NftSwap(TAKER_PROVIDER as any, 4);

const TAKER_ASSET: SwappableAsset = {
  type: 'ERC20',
  tokenAddress: WMATIC_TOKEN_ADDRESS_TESTNET,
  amount: '10000000000000000', // 1 WMATIC
};
const MAKER_ASSET: SwappableAsset = {
  type: 'ERC20',
  tokenAddress: DAI_TOKEN_ADDRESS_TESTNET,
  amount: '10000000000000000', // 1 DAI
};

describe('NFTSwap', () => {
  it('eoa signatures correctly', async () => {
    // NOTE(johnrjj) - Assumes USDC and DAI are already approved w/ the ExchangeProxy

    const order = nftSwapperMaker.buildOrder(
      [MAKER_ASSET],
      [TAKER_ASSET],
      MAKER_WALLET_ADDRESS,
      {
        // Fix dates and salt so we have reproducible tests
        expiration: new Date(3000, 10, 1),
      }
    );

    const normalizedOrder = normalizeOrder(order);
    const signedOrder = await nftSwapperMaker.signOrder(
      normalizedOrder,
      MAKER_WALLET_ADDRESS,
      MAKER_SIGNER
    );

    const normalizedSignedOrder = normalizeOrder(signedOrder);

    expect(normalizedSignedOrder.makerAddress.toLowerCase()).toBe(
      MAKER_WALLET_ADDRESS.toLowerCase()
    );

    const rawSignature = await signOrderWithEoaWallet(
      order,
      nftSwapperMaker.signer as any,
      nftSwapperMaker.chainId,
      nftSwapperMaker.exchangeContractAddress
    );

    const length = hexDataLength(signedOrder.signature);
    const signatureType = hexDataSlice(signedOrder.signature, length - 1);

    expect(signatureType).toBe('0x02');

    const isValidSignature = await verifyOrderSignature(
      normalizedSignedOrder,
      rawSignature,
      80001,
      nftSwapperMaker.exchangeContract.address
    );
    expect(isValidSignature).toBe(true);
  });
});

// https://polygon-mumbai.g.alchemy.com/v2/VMBpFqjMYv2w-MWnc9df92w3R2TpMvSG
