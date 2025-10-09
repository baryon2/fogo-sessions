import { useCallback, useEffect } from 'react';
import { getMint } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { getMetadata } from '../metadata.js';
import { useData, StateType } from '../data-utils.js';

/**
 * Hook to fetch token metadata from mint address.
 * Requires a connection provider to be passed in.
 */
export const useTokenMetadata = (
  mint: PublicKey,
  connection: Connection
) => {
  const getTokenMetadataData = useCallback(
    async () => getTokenMetadata(connection, mint),
    [mint, connection]
  );

  const data = useData(['tokenMetadata', mint.toBase58()], getTokenMetadataData, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    if (data.type === StateType.NotLoaded) {
      data.mutate().catch((error: unknown) => {
        console.error('Failed to fetch token metadata', error);
      });
    }
  }, [data]);

  return data;
};

const getTokenMetadata = async (connection: Connection, mint: PublicKey) => {
  const mintAsString = mint.toString();
  const [mintInfo, metadata] = await Promise.all([
    getMint(connection, mint),
    getMetadata([mintAsString]).then((meta) => meta[mintAsString]),
  ]);

  return { ...mintInfo, ...metadata };
};

export type Metadata = Awaited<ReturnType<typeof getTokenMetadata>>;