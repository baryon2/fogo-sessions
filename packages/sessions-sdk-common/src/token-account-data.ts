import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { tokenAccountsSchema } from './schemas.js';
import type { EstablishedSessionState } from './types.js';

export const getCacheKey = (walletPublicKey: PublicKey) => [
  'tokenAccountData',
  walletPublicKey.toBase58(),
];

export type Token = Awaited<
  ReturnType<typeof getTokenAccounts>
>['tokensInWallet'][number];

export const getTokenAccounts = async (
  connection: Connection,
  sessionState: EstablishedSessionState,
  getMetadata: (mints: string[]) => Promise<Record<string, any>>
) => {
  const accounts = tokenAccountsSchema.parse(
    await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
      filters: [
        {
          dataSize: 165,
        },
        {
          memcmp: {
            offset: 32,
            bytes: sessionState.walletPublicKey.toBase58(),
          },
        },
      ],
    })
  );

  const metadata = await getMetadata(accounts.map((account) => account.mint));

  return {
    tokensInWallet: accounts
      .filter(({ amountInWallet }) => amountInWallet !== 0n)
      .map(({ mint, amountInWallet, decimals }) => ({
        mint: new PublicKey(mint),
        amountInWallet,
        decimals,
        ...metadata[mint],
      })),
    sessionLimits: accounts
      .filter(
        ({ delegate, delegateAmount }) =>
          delegate === sessionState.sessionPublicKey.toBase58() &&
          delegateAmount !== 0n
      )
      .map(({ mint, delegateAmount, decimals }) =>
        delegateAmount === undefined
          ? undefined
          : {
              mint: new PublicKey(mint),
              sessionLimit: delegateAmount,
              decimals,
              ...metadata[mint],
            }
      )
      .filter((account) => account !== undefined),
  };
};

