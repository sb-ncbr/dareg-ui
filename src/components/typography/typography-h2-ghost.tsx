interface TypographyH2GhostProps {
  text: string;
}

export function TypographyH2Ghost({ text }: TypographyH2GhostProps) {
  return (
    <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight opacity-60">
      {text}
    </h2>
  );
}
