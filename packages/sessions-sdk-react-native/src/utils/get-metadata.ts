import { z } from 'zod';
// React Native provides fetch globally
// For Node.js environments (like testing), we conditionally polyfill
declare const globalThis: {
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  fetch?: typeof fetch;
};

/**
 * TODO: This should ideally be imported from `@fogo/sessions-sdk` but this branch is not in sync with the main so initialising locally.
 * Refer - https://github.com/fogo-foundation/fogo-sessions/blob/fc37049470147f28002d65b9cf8127a4fffecfb8/packages/sessions-sdk-ts/src/connection.ts#L41C1-L44C2
 */
export enum Network {
  Testnet,
  Mainnet,
}

const NETWORK_TO_QUERY_PARAM: Record<Network, string> = {
  [Network.Mainnet]: "mainnet",
  [Network.Testnet]: "testnet",
};

if (globalThis.fetch === undefined) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports, unicorn/prefer-module, n/no-extraneous-require
    const nodeFetch = require('node-fetch');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/prefer-nullish-coalescing
    globalThis.fetch = nodeFetch.default || nodeFetch;
  } catch {
    // Ignore if node-fetch is not available
  }
}

export const getMetadata = async (mints: string[], network: Network) => {
  const metadataUrl = new URL('https://api.fogo.io/api/token-metadata');
  for (const mint of mints) {
    metadataUrl.searchParams.append('mint[]', mint);
  }
  metadataUrl.searchParams.append("network", NETWORK_TO_QUERY_PARAM[network]);
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  const metadataResult = await fetch(metadataUrl);
  return metadataSchema.parse(await metadataResult.json());
};

const metadataSchema = z.record(
  z.string(),
  z.object({
    name: z.string(),
    symbol: z.string(),
    image: z.string(),
  })
);
