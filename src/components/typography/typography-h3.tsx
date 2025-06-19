interface TypographyH3Props {
  text: string;
  variant?: "default" | "ghost";
}

export function TypographyH3({ text, variant = "default" }: TypographyH3Props) {
  return (
    <h3
      className={`scroll-m-20 text-2xl font-semibold tracking-tight${
        variant === "ghost" ? " opacity-60" : ""
      }`}
    >
      {text}
    </h3>
  );
}
