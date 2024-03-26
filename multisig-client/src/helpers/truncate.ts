export const truncateMiddle = (
  fullStr?: string,
  strLen?: number,
  separator?: string
) => {
  if (!fullStr || !strLen) return "";

  if (fullStr.length <= strLen) return fullStr;

  separator = separator || "...";

  const sepLen = separator.length;
  const charsToShow = strLen - sepLen;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return (
    fullStr.substring(0, frontChars) +
    separator +
    fullStr.substring(fullStr.length - backChars)
  );
};
