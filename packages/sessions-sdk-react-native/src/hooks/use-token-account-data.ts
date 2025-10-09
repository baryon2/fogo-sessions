import { useTokenAccountData as useTokenAccountDataShared } from '@fogo/sessions-sdk-common';
import { useMobileConnection } from '../wallet-connect/wallet-provider';
import type { EstablishedSessionState } from '../session-provider';

export { TokenDataStateType } from '../utils/use-data';

/**
 * Hook to fetch and manage token account data for an established session.
 *
 * This hook retrieves SPL token account information including balances,
 * metadata, and other token-related data for the connected wallet.
 * It automatically caches and refreshes data as needed.
 *
 * @example
 * ```tsx
 * import { useTokenAccountData, useSession, StateType } from '@fogo/sessions-sdk-react-native';
 *
 * function TokenList() {
 *   const sessionState = useSession();
 *
 *   if (sessionState.type === StateType.Established) {
 *     const { data, loading, error } = useTokenAccountData(sessionState);
 *
 *     if (loading) return <Text>Loading tokens...</Text>;
 *     if (error) return <Text>Error loading tokens</Text>;
 *
 *     return (
 *       <View>
 *         {data?.map(token => (
 *           <Text key={token.mint}>{token.symbol}: {token.balance}</Text>
 *         ))}
 *       </View>
 *     );
 *   }
 *
 *   return <Text>No session established</Text>;
 * }
 * ```
 *
 * @param sessionState - The established session state containing wallet information
 * @returns Object containing token data, loading state, and error information
 *
 * @category React Hooks
 * @public
 */
export const useTokenAccountData = (sessionState: EstablishedSessionState) => {
  const { connection } = useMobileConnection();

  // Convert the complex EstablishedSessionState to the simple interface expected by shared hook
  const sessionStateSimple = {
    walletPublicKey: sessionState.walletPublicKey,
    sessionPublicKey: sessionState.sessionPublicKey,
  };

  return useTokenAccountDataShared(sessionStateSimple, connection);
};

// Re-export Token type and getCacheKey for backward compatibility
export type { Token } from '@fogo/sessions-sdk-common';
export { getCacheKey } from '@fogo/sessions-sdk-common';
