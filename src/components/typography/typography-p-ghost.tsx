interface TypographyPGhostProps {
  text: string;
}

export function TypographyPGhost({ text }: TypographyPGhostProps) {
  return (
    <p className="leading-7 [&:not(:first-child)]:mt-6 opacity-70">{text}</p>
  );
}
