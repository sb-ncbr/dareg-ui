export function formatDate(dateString: string, locale: string = "cs-CZ"): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale);
  }

  export function formatDateTime(dateString: string, locale: string = "cs-CZ"): string {
    const date = new Date(dateString);
    return date.toLocaleString(locale);
  }