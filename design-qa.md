# STUDIO / 01 — Design QA

final result: passed

## Scope and comparison target

Miguel Pitarch portfolio adapted from https://www.dennissnellenberg.com/. Phase one implements the responsive composition with Next.js, TypeScript and Tailwind CSS, without complex motion. Palabrio and QR Carta replace the source projects. Images may be provisional and the font must be a freely licensed equivalent, as explicitly requested.

## Evidence

Source visual truth: `/workspace/shared/studio01/reference/`.
Implementation captures, taken from the running production build: `/workspace/shared/studio01/implementation/`.
Combined source-left / implementation-right comparisons: `/workspace/shared/studio01/comparisons/`.

| View | CSS viewport | Device scale | Hero source pixels | Hero implementation pixels |
| --- | --- | --- | --- | --- |
| Desktop | 1440 × 900 | 1 | 1440 × 900 | 1440 × 900 |
| Mobile | 390 × 844 | 1 | 390 × 844 | 390 × 844 |

No density normalization was needed. Region captures preserve their native CSS-pixel widths. Source virtual scrolling requires separate section captures; a single full-page browser screenshot would only capture its viewport. The full comparison boards stack matched hero, introduction, work and footer regions, padding shorter regions with gray rather than stretching them. These are comparison boards, not claims of identical document lengths. Desktop source has four work rows; the adaptation has two.

Full-view evidence:
- `comparisons/desktop-full-comparison.png` — 2880 × 3196.
- `comparisons/mobile-full-comparison.png` — 780 × 3615.
- Unassembled implementation: `implementation/desktop-full.png` and `implementation/mobile-full.png`.

Focused comparisons, each with source and implementation together:
- `comparisons/desktop-hero-final.png`, `mobile-hero-final.png`.
- `comparisons/desktop-intro-final.png`, `mobile-intro-final.png`.
- `comparisons/desktop-work-final.png`, `mobile-work-final.png`.
- `comparisons/desktop-footer-final.png`, `mobile-footer-final.png`.
- `comparisons/desktop-menu-final.png`, `mobile-menu-final.png`.

Project page captures: `implementation/desktop-palabrio.png`, `desktop-qr-carta.png`, `mobile-palabrio.png`, `mobile-qr-carta.png`.

Source acquisition preserved TLS verification: the live page and resources were retrieved through the configured HTTPS proxy using curl, and verified response bytes were supplied to Chromium for rendering. Version-matched public jQuery, js-cookie and GSAP distributions used the allowed jsDelivr host. Analytics was excluded. The initial direct Chromium certificate failure was not bypassed, and no CA was added to its permanent trust store. Source styles, DOM measurements, responsive screenshots, hover imagery and open-menu states were inspected. No proprietary source assets or fonts are shipped in the app.

## Comparison history and resolved findings

1. Initial access blocker: the proxy denied the reference domain. The published allowlist update enabled access; desktop and mobile captures then succeeded.
2. [P2, typography] Mobile display text was 105px against approximately 144px in the source. Updated the static display size to 144px minimum. Verified in `mobile-hero-final.png`; the cropped large-name composition is intentional in this motion-free phase.
3. [P2, image quality] Mobile image selection used viewport width despite a tall cover crop, creating a visibly soft portrait. Updated responsive image sizes to account for the rendered cover width. Compared before/after hero boards and checked the final image in Chromium.
4. [P2, spacing] Intro columns were too narrow on desktop and the circular CTA sat too high. Matched column padding and CTA position. Final desktop introduction is 544px high against 541px in the source, with matching three-line hierarchy and circle position.
5. [P2, mobile rhythm] An extra visible work label and excessive introduction spacing displaced the project imagery. Kept the section title accessible but visually hidden on mobile, matched section inset and row gaps, and aligned the circular CTA. Final mobile introduction is approximately the same height as the source.
6. [P2, contact layout] Mobile contact pills hugged their contents rather than filling the column. Matched the full-width treatment and adjusted the blue circle to 144px.
7. [P2, keyboard behavior] Browser testing found focus could leave the modal control sequence. Added explicit first/last Tab wrapping while retaining native dialog semantics and Escape behavior. Both desktop and mobile end-to-end tests now pass.

Final paired comparisons were inspected after these fixes. No actionable P0/P1/P2 differences remain within the requested adaptation.

## Required fidelity surfaces

- **Fonts and typography:** locally served Inter Variable replaces licensed Neue Montreal. Regular weights, oversized display, small uppercase labels, three-line desktop introduction and clear mobile hierarchy were compared at equal density. Spanish copy necessarily changes wrapping. The moving source name is intentionally represented by a static cropped name.
- **Spacing and layout:** preserved gray portrait hero, edge location badge on desktop, two-column introduction, circular CTAs, large ruled project rows, mobile image tiles, full-height dark menu and dark contact footer. Desktop and mobile section comparisons checked alignment, margins, image aspect ratio, rules and circle sizes. No horizontal overflow at 320, 390, 768 or 1440px.
- **Colors and tokens:** source values #999D9E (gray), #1C1D20 (ink), #455CE9 (blue), white, and translucent divider colors are mapped to CSS tokens. Portrait lighting is provisional. This is a visual comparison and keyboard check, not a formal WCAG certification.
- **Images and icons:** Miguel's existing profile image supplies the real contact avatar; the hero is a provisional AI-assisted extension of that photograph. Generated conceptual project covers replace source client work and are not presented as product screenshots. WebP assets are local; no source hotlinks. Lucide's freely licensed arrows, globe and menu/close marks match the simple reference controls. No CSS/SVG artwork substitutes for photographic assets.
- **Copy and content:** Spanish content is specific to Miguel. Project descriptions use the user's supplied purposes only. Both have real internal pages, state that no public link is available, and show no invented client results, metrics or product features. Contact preserves the existing email and verified GitHub identity.

## Executed validation

- Clean `npm ci --cache /workspace/.npm --no-audit --no-fund`: passed.
- `npm run lint`: passed.
- `npm run typecheck` (`next typegen && tsc --noEmit`): passed.
- `npm run build`: passed; home, custom not-found page and both project pages generated.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium NEXT_TELEMETRY_DISABLED=1 npm run test:e2e`: **6 passed, 0 failed, 0 skipped** after clean install.
- Tests cover keyboard skip link, modal Tab wrapping, Escape and focus restoration, scroll unlock, both project routes and back links, contact href, visible image decoding, responsive width and custom 404 status.
- Additional browser checks at 1440 × 900, 390 × 844, 320 × 740 and 768 × 1024: passed.
- Final production server opened and captured at desktop/mobile sizes; project navigation repeated; no page errors or browser console errors observed.

## Intentional differences and follow-up polish

- Free font, Miguel's identity, Spanish content, provisional imagery and two selected projects are approved adaptations.
- No parallax, marquee animation, magnetic cursor, scrolling image follower or page transitions in phase one. The project preview is a simple hover/focus state on desktop, and static tiles on mobile.
- Main navigation uses local sections; project entries use dedicated pages. GitHub replaces the source's telephone/social links because no personal telephone or other social URLs were provided.
- P3: replace the provisional hero with an authentic high-resolution studio photograph and conceptual covers with real application captures when available.
- P3: tune optical type details again if a licensed original font is supplied. Safari/iOS hardware and a formal accessibility audit were not tested.

## Implementation checklist

- [x] Inspect source desktop/mobile and menu states.
- [x] Implement Next.js, TypeScript and Tailwind migration on the test branch.
- [x] Build responsive portfolio and internal project pages.
- [x] Compare full-view and focused pairs; resolve P0/P1/P2 findings.
- [x] Pass clean-install, lint, type, build and browser checks.
- [x] Keep the production preview running in the current environment.
- [x] Save updated installation and startup instructions in the environment draft.
- [ ] User review, final imagery and later effects phase.
- [ ] Merge/deployment only when requested.
