import { ethers } from 'ethers';

export interface RoyaltyShare {
  recipient: string;
  bps: number; // basis points
}

export const distributeRoyalties = async (
  shares: RoyaltyShare[],
  amountEth: string,
  providerRpcUrl?: string
) => {
  // This is a stub: In production, call a deployed smart contract that splits payments
  const total = ethers.parseEther(amountEth);
  return shares.map((s) => ({ recipient: s.recipient, amountWei: total * BigInt(s.bps) / BigInt(10000) }));
};