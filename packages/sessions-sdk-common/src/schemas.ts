import { z } from 'zod';

export const metadataSchema = z.record(
  z.string(),
  z.object({
    name: z.string(),
    symbol: z.string(),
    image: z.string(),
  })
);

export const tokenAccountSchema = z
  .object({
    account: z.object({
      data: z.object({
        parsed: z.object({
          info: z.object({
            mint: z.string(),
            delegate: z.string().optional(),
            tokenAmount: z.object({
              amount: z.string(),
              decimals: z.number(),
            }),
            delegatedAmount: z
              .object({
                amount: z.string(),
                decimals: z.number(),
              })
              .optional(),
          }),
        }),
      }),
    }),
  })
  .transform(({ account }) => {
    const { info } = account.data.parsed;
    const { tokenAmount, delegatedAmount, mint, delegate } = info;
    return {
      mint,
      delegate,
      amountInWallet: BigInt(tokenAmount.amount),
      delegateAmount:
        delegatedAmount === undefined
          ? undefined
          : BigInt(delegatedAmount.amount),
      decimals: tokenAmount.decimals,
    };
  });

export const tokenAccountsSchema = z.array(tokenAccountSchema);