export const separateChainFromAddress = (str?: string | null) => {
  if (!str) return null;
  return str.split(":")[1];
};
