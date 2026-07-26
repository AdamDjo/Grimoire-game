# Design QA — Game Session #125

- Source visual truth: `docs/private/assets/landing/references/mockups/Gamesession.png`
- Implementation screenshot: `/var/folders/dx/91zsmyhs0291c0g4qqpksv480000gn/T/codex-clipboard-a1fa4af9-a887-4173-ac49-8a7695ca96f8.png`
- Viewport: desktop, approximately 1844 × 513 visible capture
- State: character panel open during initial scene loading

## Full-view comparison evidence

The implementation follows the source composition: full-bleed tavern image, transparent context bar, central narrative/action area, and persistent lower HUD. The supplied implementation capture exposed one blocking layering mismatch: the character panel entered the HUD stacking context and its lower content was hidden behind the footer.

## Focused region comparison evidence

The lower-right panel/HUD intersection was inspected because it contains the reported defect. In the source, overlays remain visually above the HUD. In the implementation capture, the HUD crossed in front of the character panel and made its lower attributes unreachable.

## Findings

- [P1] Character panel hidden behind the HUD.
  - Fix applied: the tool panel was moved outside `GameSceneLayout` into a fixed global overlay at z-index 80.
  - Fix applied: its desktop bounds now run from below the top bar to above the HUD.
  - Fix applied: mobile keeps a full-screen panel.
  - Fix applied: a backdrop and Escape key both close the panel.

- [P2] Action composer briefly appeared before the opening scene was ready.
  - Fix applied: choices and composer now render only after a real scene response exists.

- [P2] Attribute bars were visually oversized.
  - Fix applied: the attribute column is capped at 22rem on wide screens and 20rem at the intermediate breakpoint.

## Comparison history

1. Initial comparison: P1 panel/HUD collision, P2 premature composer, P2 oversized stat column.
2. Code fixes completed. Interaction tests, lint, TypeScript and production build pass.
3. A post-fix browser screenshot at the same viewport is still required to provide visual evidence that the P1/P2 findings are cleared.

## Final result

final result: blocked

Blocker: no post-fix browser-rendered screenshot was available in the current tool session.
