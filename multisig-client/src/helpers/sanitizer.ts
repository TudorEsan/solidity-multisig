interface SanitizeNumberInputOptions {
  decimalSeparator?: string;
  thousandSeparator?: string;
  allowNegative?: boolean;
  maxDecimalPlaces?: number;
  allowScientificNotation?: boolean;
}

export function sanitizeNumberInput(
  value: string,
  options: SanitizeNumberInputOptions = {}
): string {
  const {
    decimalSeparator = ".",
    allowNegative = false,
    maxDecimalPlaces = null,
    allowScientificNotation = false,
  } = options;

  // Remove all characters except digits, decimalSeparator, and optionally the negative sign and 'e' or 'E' for scientific notation
  const regexPattern = `[^0-9${decimalSeparator}${allowNegative ? "-" : ""}${
    allowScientificNotation ? "eE" : ""
  }]`;
  let sanitized = value.replace(new RegExp(regexPattern, "g"), "");

  // Convert decimal separator to a standard "." if it's different, to simplify further processing
  if (decimalSeparator !== ".") {
    sanitized = sanitized.replace(
      new RegExp(`\\${decimalSeparator}`, "g"),
      "."
    );
  }

  // Ensure only one decimal point is present
  const parts = sanitized.split(".");
  if (parts.length > 2) {
    // Join the parts back with a single decimal point, discarding additional points
    sanitized = `${parts.shift()}.${parts.join("")}`;
  }

  // Handle negative numbers
  if (allowNegative) {
    sanitized = sanitized.replace(/^-/, "").padStart(sanitized.length + 1, "-");
  } else {
    sanitized = sanitized.replace(/-/g, "");
  }

  // Limit decimal places
  if (maxDecimalPlaces !== null && parts.length === 2) {
    sanitized = `${parts[0]}.${parts[1].slice(0, maxDecimalPlaces)}`;
  }

  // Handle scientific notation if allowed
  if (allowScientificNotation) {
    const scientificNotationMatch = sanitized.match(
      /(-?\d+(?:\.\d+)?)(e-?\d+)/i
    );
    if (scientificNotationMatch) {
      sanitized = parseFloat(scientificNotationMatch[0]).toString();
    }
  }

  return sanitized;
}
