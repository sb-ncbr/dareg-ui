interface TypographySidebarProps {
  text: string;
}

export function TypographySidebar({ text }: TypographySidebarProps) {
  return <h4 className="scroll-m-20 text-lg tracking-tight">{text}</h4>;
}
