import { PublicKey } from '@solana/web3.js';

export interface EstablishedSessionState {
  walletPublicKey: PublicKey;
  sessionPublicKey: PublicKey;
}

export interface TokenMetadata {
  name: string;
  symbol: string;
  image: string;
}

export interface TokenAccountInfo {
  mint: PublicKey;
  amountInWallet: bigint;
  decimals: number;
}

export interface SessionLimitInfo extends TokenAccountInfo {
  sessionLimit: bigint;
}

export interface TokenAccountData {
  tokensInWallet: (TokenAccountInfo & TokenMetadata)[];
  sessionLimits: (SessionLimitInfo & TokenMetadata)[];
}

export interface SessionKeyPair {
  privateKey: any;
  publicKey: any;
}

export interface StoredSession {
  sessionKey: SessionKeyPair;
  walletPublicKey: PublicKey;
  createdAt?: string;
  walletName?: string;
}

export enum TransactionContext {
  SESSION_ESTABLISHMENT = 'session-establishment',
  SESSION_LIMIT_UPDATE = 'session-limit-update',
  SESSION_REPLACEMENT = 'session-replacement'
}

export interface ContextualError {
  message: string;
  context: TransactionContext;
  originalError: unknown;
  name: string;
}