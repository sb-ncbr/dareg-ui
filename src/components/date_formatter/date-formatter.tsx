"use client";
export function DateFormater({
  dateString,
  locale = "cs-CZ",
}: {
  dateString: string;
  locale?: string;
}) {
  const date = new Date(dateString);
  return <>{date.toLocaleDateString(locale)}</>;
}
