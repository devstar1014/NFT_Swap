import type { BigNumberish } from '@ethersproject/bignumber';

// Ensures consistent surface area, but doesn't perscribe arguments as they vary from protocol version
export interface BaseNftSwap {
  signOrder: Function;
  buildOrder: Function;
  loadApprovalStatus: Function;
  approveTokenOrNftByAsset: Function;
  fillSignedOrder: Function;
  awaitTransactionHash: Function;
  cancelOrder: Function;
  waitUntilOrderFilledOrCancelled: Function;
  getOrderStatus: Function;
  getOrderInfo: Function;
  getOrderHash: Function;
  getTypedData: Function;
  normalizeSignedOrder: Function;
  normalizeOrder: Function;
  checkIfOrderCanBeFilledWithNativeToken: Function;
}

// User facing
export interface UserFacingERC20AssetDataSerialized {
  tokenAddress: string;
  type: 'ERC20';
  amount: string;
}

export interface UserFacingERC721AssetDataSerialized {
  tokenAddress: string;
  tokenId: string;
  type: 'ERC721';
}
/**
 * Mimic the erc721 duck type
 */
export interface UserFacingERC1155AssetDataSerializedNormalizedSingle {
  tokenAddress: string;
  tokenId: string;
  type: 'ERC1155';
  amount?: string; // Will default to '1'
}

export type SwappableAsset =
  | UserFacingERC20AssetDataSerialized
  | UserFacingERC721AssetDataSerialized
  | UserFacingERC1155AssetDataSerializedNormalizedSingle;

/**
 * Approval status of an ERC20, ERC721, or ERC1155 asset/item.
 * The default approval spending address is the ExchangeProxy adapter specific to ERC type.
 */
export type ApprovalStatus = {
  /**
   * contractApproved is the standard approval check.
   * Equivalent to 'isApprovedForAll' for ERC721 and ERC1155, and is the normal allowance for ERC20
   */
  contractApproved: boolean;
  /**
   * Only exists for ERC721, tokenIdApproved checks if tokenId is approved. You can be in a state where tokenId is approved but isApprovedForAll is false
   * In this case, you do not need to approve. ERC1155 does not have support for individual tokenId approvals. Not applicable for ERC20s since they are fungible
   */
  tokenIdApproved?: boolean;
};

export interface PayableOverrides extends TransactionOverrides {
  value?: BigNumberish | Promise<BigNumberish>;
}

export interface TransactionOverrides {
  gasLimit?: BigNumberish | Promise<BigNumberish>;
  gasPrice?: BigNumberish | Promise<BigNumberish>;
  maxFeePerGas?: BigNumberish | Promise<BigNumberish>;
  maxPriorityFeePerGas?: BigNumberish | Promise<BigNumberish>;
  nonce?: BigNumberish | Promise<BigNumberish>;
  type?: number;
  accessList?: any;
  customData?: Record<string, any>;
}

export type AvailableSignatureTypes = 'eoa' | 'eip1271';

export interface SigningOptions {
  signatureType: AvailableSignatureTypes; // | 'autodetect' ? and remove autodetectSignatureType maybe?
  autodetectSignatureType: boolean;
}
