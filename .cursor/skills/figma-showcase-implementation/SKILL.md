---
name: figma-showcase-implementation
description: Translates selected Figma app frames into semantic, responsive website sections for Seed Garden. Use when implementing new webpage sections from Figma links, node IDs, or screenshots.
---
# Figma Showcase Implementation

## Goal

Implement Figma-inspired sections for the Seed Garden webpage while preserving responsive web behavior, accessibility, and project conventions.

## Workflow

1. Identify source frame(s): file key, node ID, and section intent.
2. Extract only needed context from Figma (layout, colors, copy, key assets).
3. Map app screen to webpage section (not pixel-by-pixel full screen clone).
4. Reuse existing semantic structure and CSS tokens in this project.
5. Add local assets under `assets/` when needed (avoid expiring URLs).
6. Validate mobile-first behavior before desktop polish.

## Mapping Rules

- Treat Figma as visual intent, not literal generated code style.
- Convert absolute-position-heavy app output into flexible web layout.
- Keep section hierarchy semantic: `section`, headings, paragraphs, lists, buttons.
- Keep interactions lightweight unless user asks for full app behavior.

## Output Checklist

- [ ] Section has clear heading and purpose.
- [ ] Uses existing palette and spacing variables.
- [ ] Works at 320px, 375px, 430px, tablet, and desktop.
- [ ] No broken or remote-only assets.
- [ ] Content tone remains calm and supportive.
