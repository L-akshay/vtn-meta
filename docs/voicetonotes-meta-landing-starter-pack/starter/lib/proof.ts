export type StoreProof = {
  ratingLabel: string;
  downloadLabel: string;
  sourceUrl: string;
  verifiedAt: string;
};

/**
 * Intentionally null.
 * Store metrics are volatile and must be approved before shipping.
 */
export const storeProof: StoreProof | null = null;
