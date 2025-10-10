import { useCallback } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { getMetadata } from '../metadata.js';
import { useData } from '../data-utils.js';

/**
 * Hook to fetch and manage token account data for an established session.
 * Requires a connection provider to be passed in.
 */
export const useTokenAccountData = (
  sessionState: { walletPublicKey: PublicKey; sessionPublicKey: PublicKey },
  connection: Connection
) => {
  const getTokenAccountDataFn = useCallback(
    async () => {
      // Import locally to avoid circular dependencies
      const { getTokenAccounts } = await import('../token-account-data.js');
      return getTokenAccounts(connection, sessionState, getMetadata);
    },
    [connection, sessionState]
  );

  return useData(
    ['tokenAccountData', sessionState.walletPublicKey.toBase58()],
    getTokenAccountDataFn,
    {}
  );
};