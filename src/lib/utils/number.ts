/**
 * Validates and normalizes a numeric input value, allowing for different decimal separators.
 * Accepts dots, commas, and semicolons as decimal separators.
 * Only allows positive numbers.
 * 
 * @param value The input value to validate and normalize
 * @returns The normalized value if valid, empty string if invalid or negative
 */
export const normalizeNumericInput = (value: string): string => {
  // Allow empty value
  if (value === '') return '';

  // Check if the input matches the pattern for positive numbers with optional decimal separator
  if (/^[0-9]*[.,;]?[0-9]*$/.test(value)) {
    // Normalize decimal separator to dot
    const normalizedValue = value.replace(/[,;]/g, '.');
    const numericValue = parseFloat(normalizedValue);

    // Only allow non-negative numbers
    if (!isNaN(numericValue) && numericValue >= 0) {
      return value;
    }
  }

  return '';
};

/**
 * Parses a string value that may contain different decimal separators into a number.
 * 
 * @param value The string value to parse
 * @returns The parsed number or undefined if invalid
 */
export const parseNumericInput = (value: string): number | undefined => {
  if (value === '') return undefined;
  
  const normalizedValue = value.replace(/[,;]/g, '.');
  const numericValue = parseFloat(normalizedValue);
  
  return !isNaN(numericValue) && numericValue >= 0 ? numericValue : undefined;
};
