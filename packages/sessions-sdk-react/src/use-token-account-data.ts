import { useConnection } from "@solana/wallet-adapter-react";
import {
  useTokenAccountData as useTokenAccountDataShared,
} from "@fogo/sessions-sdk-common";
import type { EstablishedSessionState } from "./session-provider.js";

// Re-export for backward compatibility
export { StateType } from "./use-data.js";
export { getCacheKey, type Token } from "@fogo/sessions-sdk-common";

export const useTokenAccountData = (sessionState: EstablishedSessionState) => {
  const { connection } = useConnection();

  // Convert the complex EstablishedSessionState to the simple interface expected by shared hook
  const sessionStateSimple = {
    walletPublicKey: sessionState.walletPublicKey,
    sessionPublicKey: sessionState.sessionPublicKey,
  };

  return useTokenAccountDataShared(sessionStateSimple, connection);
};
