import postgres from 'postgres';

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export function createPool(option: postgres.Options<{}>) {
  return postgres(option);
}
