import { PublicKey } from '@solana/web3.js';
import { useTokenMetadata as useTokenMetadataShared } from '@fogo/sessions-sdk-common';
import { useMobileConnection } from '../wallet-connect/wallet-provider';

// Re-export for backward compatibility
export { TokenDataStateType } from '../utils/use-data';
export type { Metadata } from '@fogo/sessions-sdk-common';

/**
 * Hook to fetch token metadata from mint address.
 *
 * @category React Hooks
 * @public
 */
export const useTokenMetadata = (mint: PublicKey) => {
  const { connection } = useMobileConnection();
  return useTokenMetadataShared(mint, connection);
};
