import { DEFAULT_DATE_RANGE, Token } from "@/components/tokenized-search/types/search-models";

/**
 * Formats a token's display value, handling special cases like date ranges
 * @param token - The token to format
 * @returns A formatted string representation of the token value
 */
export function formatTokenDisplayValue(token: Token): string {
  const isDateRange =
    token.value &&
    typeof token.value === "object" &&
    "from" in token.value &&
    "to" in token.value &&
    !(token.value instanceof Date);

  if (isDateRange) {
    const value = token.value as { from?: string | Date; to?: string | Date };
    
    // Check if dates are default values (same logic as calendar component)
    const isDefaultFrom = !value.from || 
      new Date(value.from).getTime() === DEFAULT_DATE_RANGE.from!.getTime();
    const isDefaultTo = !value.to || 
      new Date(value.to).getTime() === DEFAULT_DATE_RANGE.to!.getTime();
    
    if (isDefaultFrom && isDefaultTo) {
      return "All dates";
    } else if (!isDefaultFrom && isDefaultTo) {
      return `After ${new Date(value.from!).toLocaleDateString("cs-CZ")}`;
    } else if (isDefaultFrom && !isDefaultTo) {
      return `Up to ${new Date(value.to!).toLocaleDateString("cs-CZ")}`;
    } else {
      return `${new Date(value.from!).toLocaleDateString("cs-CZ")} - ${new Date(value.to!).toLocaleDateString("cs-CZ")}`;
    }
  }

  // If displayValue is an object, stringify it
  if (typeof token.displayValue === "object") {
    return JSON.stringify(token.displayValue);
  }

  // Default display value
  return String(token.displayValue);
}
