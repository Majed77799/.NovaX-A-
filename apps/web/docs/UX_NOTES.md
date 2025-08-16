### NovaX UI/UX Notes

- Components are provided by `@repo/ui`. Use tokens via CSS variables (see `styles.css`) and prefer semantic props over custom CSS.
- Motion: use subtle springs (0.2–0.3s). Respect `prefers-reduced-motion` (already handled in base CSS). Avoid animating expensive properties beyond opacity/transform.
- Empty states: pair a short headline with a one-line description and a clear CTA when appropriate.
- Focus: rely on focus-visible outlines; ensure all interactive elements have accessible names/aria labels.
- Keyboard shortcuts: `/` focuses search; `g p` → products; `g e` → explore.
- Dark mode: controlled via `data-theme` attribute by `ThemeProvider`.
- Cards: glassy, soft shadows; elevate on hover (scale 1.01, shadow-md→lg).