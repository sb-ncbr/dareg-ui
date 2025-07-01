interface TypographyH4Props {
  text: string;
  variant?: "default" | "ghost";
}

export function TypographyH5({ text, variant = "default" }: TypographyH4Props) {
  return (
    <h4
      className={`scroll-m-20 text-md font-semibold tracking-tight${
        variant === "ghost" ? " opacity-60" : ""
      }`}
    >
      {text}
    </h4>
  );
}
