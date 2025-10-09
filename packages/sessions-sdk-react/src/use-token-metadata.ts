import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useTokenMetadata as useTokenMetadataShared } from "@fogo/sessions-sdk-common";

// Re-export for backward compatibility
export { StateType } from "./use-data.js";
export type { Metadata } from "@fogo/sessions-sdk-common";

export const useTokenMetadata = (mint: PublicKey) => {
  const { connection } = useConnection();
  return useTokenMetadataShared(mint, connection);
};
