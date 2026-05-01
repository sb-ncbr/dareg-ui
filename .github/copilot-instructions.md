# Project Guidelines (DAREG UI + thesis source)

This repo contains both a Next.js UI and thesis authoring files (LaTeX/BibTeX).

## Default behavior

- When the user asks about the thesis, treat it as the primary task context.
- Follow the writing and citation rules in ThesisWritingGuidelines.md.
- Keep LaTeX changes consistent with the `fithesis4` template and the current thesis file structure.

## Thesis editing conventions

- Primary files:
  - fi-pdflatex.tex (main thesis source)
  - references.bib (bibliography database)
  - ThesisWritingGuidelines.md (writing rules)
- Citations:
  - Prefer `\cite{...}` by default (unless user asks otherwise)
  - Ensure every citation key used in LaTeX/Markdown exists in references.bib
  - Do not invent DOIs/metadata; if a BibTeX entry is needed, ask for the source or add a minimal `@online` entry with `url` + `urldate`.
- Structure:
  - Write prose as paragraphs; keep any per-section “reading map” `itemize` lists separate from the narrative.

## Build/test

- For thesis compilation, assume BibLaTeX + biber workflow (`pdflatex` → `biber` → `pdflatex` x2).
- Do not attempt to “fix” unrelated UI build errors unless the user asks.
