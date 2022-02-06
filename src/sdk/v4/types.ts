import type { Signer } from '@ethersproject/abstract-signer';
import type { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import type { BytesLike } from '@ethersproject/bytes';
import type { IZeroEx } from '../../contracts';

export type FeeStruct = {
  recipient: string;
  amount: BigNumberish;
  feeData: BytesLike;
};

export type FeeStructSerialized = {
  recipient: string;
  amount: string;
  feeData: string;
};

export type PropertyStruct = {
  propertyValidator: string;
  propertyData: BytesLike;
};

export type PropertyStructSerialized = {
  propertyValidator: string;
  propertyData: string;
};

export type ERC1155OrderStruct = {
  direction: BigNumberish;
  maker: string;
  taker: string;
  expiry: BigNumberish;
  nonce: BigNumberish;
  erc20Token: string;
  erc20TokenAmount: BigNumberish;
  fees: FeeStruct[];
  erc1155Token: string;
  erc1155TokenId: BigNumberish;
  erc1155TokenProperties: PropertyStruct[];
  erc1155TokenAmount: BigNumberish;
};

export type ERC1155OrderStructSerialized = {
  direction: string;
  maker: string;
  taker: string;
  expiry: string;
  nonce: string;
  erc20Token: string;
  erc20TokenAmount: string;
  fees: FeeStructSerialized[];
  erc1155Token: string;
  erc1155TokenId: string;
  erc1155TokenProperties: PropertyStructSerialized[];
  erc1155TokenAmount: string;
};

export type ERC721OrderStruct = {
  direction: BigNumberish;
  maker: string;
  taker: string;
  expiry: BigNumberish;
  nonce: BigNumberish;
  erc20Token: string;
  erc20TokenAmount: BigNumberish;
  fees: FeeStruct[];
  erc721Token: string;
  erc721TokenId: BigNumberish;
  erc721TokenProperties: PropertyStruct[];
};

export type ERC721OrderStructSerialized = {
  direction: string;
  maker: string;
  taker: string;
  expiry: string;
  nonce: string;
  erc20Token: string;
  erc20TokenAmount: string;
  fees: FeeStructSerialized[];
  erc721Token: string;
  erc721TokenId: string;
  erc721TokenProperties: PropertyStructSerialized[];
};

export type UserFacingFeeStruct = {
  recipient: string;
  amount: BigNumberish;
  // Make fee data optional for devx (most folks don't use the feeData arg and it _needs_ to be '0x' if not being used).
  // automatically defaults to '0x'
  feeData?: BytesLike;
};

export interface OrderStructOptionsCommon {
  direction: BigNumberish;
  maker: string;
  taker: string;
  expiry: Date | number;
  nonce: BigNumberish;
  // erc20Token: string;
  // erc20TokenAmount: BigNumberish;
  fees: UserFacingFeeStruct[];
  tokenProperties: PropertyStruct[];
}

export interface OrderStructOptionsCommonStrict {
  direction: BigNumberish;
  // erc20Token: string;
  // erc20TokenAmount: BigNumberish;
  maker: string;
  taker?: string;
  expiry?: Date | number;
  nonce?: BigNumberish;
  fees?: UserFacingFeeStruct[];
  tokenProperties?: PropertyStruct[];
}

export interface Fee {
  recipient: string;
  amount: BigNumber;
  feeData: string;
}

export interface Property {
  propertyValidator: string;
  propertyData: string;
}

export type NftOrderV4 = ERC1155OrderStruct | ERC721OrderStruct;

export type NftOrderV4Serialized =
  | ERC1155OrderStructSerialized
  | ERC721OrderStructSerialized;

export interface SignedERC721OrderStruct extends ERC721OrderStruct {
  signature: SignatureStruct;
}

export interface SignedERC1155OrderStruct extends ERC1155OrderStruct {
  signature: SignatureStruct;
}

export interface SignedERC721OrderStructSerialized
  extends ERC721OrderStructSerialized {
  signature: SignatureStructSerialized;
}

export interface SignedERC1155OrderStructSerialized
  extends ERC1155OrderStructSerialized {
  signature: SignatureStructSerialized;
}

export type SignedNftOrderV4 =
  | SignedERC721OrderStruct
  | SignedERC1155OrderStruct;

export type SignedNftOrderV4Serialized =
  | SignedERC721OrderStructSerialized
  | SignedERC1155OrderStructSerialized;

export type ECSignature = {
  v: BigNumberish;
  r: BytesLike;
  s: BytesLike;
};

export type SignatureStruct = {
  signatureType: BigNumberish; // 2 for EIP-712
  v: BigNumberish;
  r: BytesLike;
  s: BytesLike;
};

export type SignatureStructSerialized = {
  signatureType: number; // 2 for EIP-712
  v: string;
  r: string;
  s: string;
};

export interface ApprovalOverrides {
  signer: Signer;
  approve: boolean;
  exchangeContractAddress: string;
  chainId: number;
}

export interface FillOrderOverrides {
  signer: Signer;
  exchangeContract: IZeroEx;
  tokenIdToSellForCollectionOrder?: BigNumberish;
  /**
   * Fill order with native token if possible
   * e.g. If taker asset is WETH, allows order to be filled with ETH
   */
  fillOrderWithNativeTokenInsteadOfWrappedToken: boolean;
}

export interface BuildOrderAdditionalConfig {
  direction: BigNumberish;
  maker: string;
  taker: string;
  expiry: BigNumberish;
  nonce: BigNumberish;
}

export type AvailableSignatureTypes = 'eoa'; // No EIP-1271 / preSign yet (soon though)

export interface SigningOptions {
  signatureType: AvailableSignatureTypes; // | 'autodetect' ? and remove autodetectSignatureType maybe?
  autodetectSignatureType: boolean;
}

// Typings for addresses.json file
export interface AddressesForChain {
  exchange: string;
  wrappedNativeToken: string;
}
