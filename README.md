https://arendesai.com

## TODO:
1. Replace SVG
2. Finish Simplified Chinese section

## Redesign (branch `redesign/terminal`)

Prototype of the "open CV" redesign: phosphor-terminal / CRT treatment over the
same resume content. Everything lives in the Hugo layouts, no theme involved.

- `layouts/_default/baseof.html` - head, CRT overlays, HUD frame, boot screen, console
- `layouts/index.html` - all page content
- `static/css/main.css` - the whole design system
- `static/js/site.js` - boot sequence, HUD readouts, scroll reveal, `~` console

Preview without Hugo installed:

```
python tools/preview.py          # http://localhost:1313
python tools/preview.py --build  # writes .preview/index.html
```

`?flat=1` disables the intro animations, which is handy for screenshots.
`hugo server` renders the same thing.
