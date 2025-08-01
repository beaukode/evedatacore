export class Web3TransactionError extends Error {
  public readonly name = "Web3TransactionError";
  public readonly tx?: string;
  public readonly details?: string[];

  constructor(message: string, tx?: string, details?: string[]) {
    super(message);
    this.tx = tx;
    this.details = details;
  }
}

export function isWeb3TransactionError(
  error: unknown
): error is Web3TransactionError {
  return error instanceof Web3TransactionError;
}
