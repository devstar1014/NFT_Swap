import { InfuraProvider } from '@ethersproject/providers';
import { NftSwap, SwappableAsset } from '../src';
import { NULL_ADDRESS } from '../src/utils/eth';

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

    const nftSdk = new NftSwap(rpcProvider, chainId);

    const order = nftSdk.buildOrder(
      [testNft1], // maker assets
      [testNft2], // taker assets
      nft1Owner // maker wallet address
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
  });
});
