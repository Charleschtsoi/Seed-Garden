---
name: mobile-first-responsive-qa
description: Runs mobile-first responsive quality checks for the Seed Garden webpage. Use when validating layout, readability, interactions, and overflow from 320px mobile to desktop.
---
# Mobile-First Responsive QA

## Goal

Catch layout and usability issues early, starting from small mobile widths.

## Test Widths

Check at minimum:

- 320px
- 375px
- 430px
- 768px
- 1024px+

## QA Steps

1. Verify no horizontal overflow in each section.
2. Check heading and paragraph readability at smallest width.
3. Validate button/chip tap targets and spacing.
4. Ensure phone mockups scale within viewport.
5. Confirm nav and section transitions remain usable.
6. Re-check desktop two-column balance.

## Common Fixes

- Replace fixed widths with `minmax()`, `%`, or `clamp()`.
- Reduce dense text lines on mobile.
- Move side-by-side blocks to vertical stacking below tablet.
- Tighten or expand section spacing using tokenized values.

## QA Report Format

Use:

- `Issue`: short description
- `Viewport`: width where it appears
- `Severity`: high / medium / low
- `Fix`: targeted CSS or markup adjustment
