import { defaultAbiCoder } from '@ethersproject/abi';
import { hexDataSlice } from '@ethersproject/bytes';
import { InfuraProvider } from '@ethersproject/providers';
import { NftSwap, SwappableAsset } from '../src';
import { hashOrder } from '../src/sdk/pure';
import { NULL_ADDRESS } from '../src/utils/eth';
import { INFINITE_TIMESTAMP_SEC } from '../src/utils/order';

describe('NFTSwap', () => {
  const chainId = 4;
  const rpcProvider = new InfuraProvider(4);
  it('builds order correctly', async () => {
    // https://testnets.opensea.io/assets/0x72d391648c4fe374dea6ed5244a306060453364b/1
    const nft1Owner = '0x72d391648c4fe374dea6ed5244a306060453364b';
    const testNft1: SwappableAsset = {
      type: 'ERC721',
      tokenAddress: nft1Owner,
      tokenId: '1',
    };

    // https://testnets.opensea.io/assets/0xfa85acaaff1d2fd159aa8454222da76bdf8fa956/3
    const nft2Owner = '0xfa85acaaff1d2fd159aa8454222da76bdf8fa956';
    const testNft2: SwappableAsset = {
      type: 'ERC721',
      tokenAddress: nft2Owner,
      tokenId: '3',
    };

    const nftSdk = new NftSwap(rpcProvider, rpcProvider as any, chainId);

    const order = nftSdk.buildOrder(
      [testNft1], // maker assets
      [testNft2], // taker assets
      nft1Owner, // maker wallet address
      {
        expiration: new Date(3000, 10),
        salt: '16067189784881358057906593238688655078558518561185118904709866293383414615588',
      }
    );

    expect(order.makerAddress).toBe(nft1Owner);
    expect(order.makerAssetAmount.toString()).toEqual('1');
    expect(order.makerAssetData).toBe(
      '0x94cfcdd700000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000440257179200000000000000000000000072d391648c4fe374dea6ed5244a306060453364b000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000'
    );
    expect(order.takerAddress).toBe(NULL_ADDRESS);
    expect(order.takerAssetAmount.toString()).toEqual('1');
    expect(order.takerAssetData).toBe(
      '0x94cfcdd7000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004402571792000000000000000000000000fa85acaaff1d2fd159aa8454222da76bdf8fa956000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000'
    );

    // Ensure doesn't exceed 256 bit number
    expect(order.salt.length).toBeLessThanOrEqual(78);
    // Ensure we always have more than 32 bits of randomness
    expect(order.salt.length).toBeGreaterThanOrEqual(32);
    // Ensure salt is always a string
    expect(typeof order.salt).toBe('string');

    const orderHash = hashOrder(
      order,
      chainId,
      nftSdk.exchangeContract.address
    );
    expect(orderHash.length).toEqual(66);
    expect(orderHash.slice(0, 2)).toBe('0x');
  });

  fit('builds order erc1155 with amounts > 1 correctly', async () => {
    const walletAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';
    // https://testnets.opensea.io/assets/0x72d391648c4fe374dea6ed5244a306060453364b/1
    const nft1Address = '0x631998e91476da5b870d741192fc5cbc55f5a52e';
    const testNft1: SwappableAsset = {
      type: 'ERC1155',
      tokenAddress: nft1Address,
      tokenId: '65638',
      amount: '14',
    };

    // https://testnets.opensea.io/assets/0xfa85acaaff1d2fd159aa8454222da76bdf8fa956/3
    const erc20Address = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';
    const testErc20: SwappableAsset = {
      type: 'ERC20',
      tokenAddress: erc20Address,
      amount: '100000',
    };

    const nftSdk = new NftSwap(rpcProvider, rpcProvider as any, chainId);

    const order = nftSdk.buildOrder(
      [testNft1], // maker assets
      [testErc20], // taker assets
      '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // maker wallet address
      {
        expiration: new Date(3000, 10),
        salt: '16067189784881358057906593238688655078558518561185118904709866293383414615588',
      }
    );

    expect(order.makerAddress).toBe(walletAddress);
    expect(order.makerAssetAmount.toString()).toEqual('1');
    expect(order.makerAssetData).toBe(
      '0x94cfcdd70000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000124a7cb5fb7000000000000000000000000631998e91476da5b870d741192fc5cbc55f5a52e000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000001006600000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
    );
    expect(order.takerAddress).toBe(NULL_ADDRESS);
    expect(order.takerAssetAmount.toString()).toEqual('1');
    expect(order.takerAssetData).toBe(
      '0x94cfcdd7000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000d000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000024f47261b00000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400000000000000000000000000000000000000000000000000000000'
    );

    // Ensure doesn't exceed 256 bit number
    expect(order.salt.length).toBeLessThanOrEqual(78);
    // Ensure we always have more than 32 bits of randomness
    expect(order.salt.length).toBeGreaterThanOrEqual(32);
    // Ensure salt is always a string
    expect(typeof order.salt).toBe('string');

    const orderHash = hashOrder(
      order,
      chainId,
      nftSdk.exchangeContract.address
    );
    expect(orderHash.length).toEqual(66);
    expect(orderHash.slice(0, 2)).toBe('0x');
  });
});
