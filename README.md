https://arendesai.com

## Site

A single animated business card: it slides in on load with a curved, physical
motion and settles into place. The card links out to GitHub, LinkedIn, and
email — no other pages.

- `layouts/_default/baseof.html` - head/meta only, no other chrome
- `layouts/index.html` - the card markup
- `static/css/main.css` - card styling + the slide-in keyframe animation

Preview without Hugo installed:

```
python tools/preview.py          # http://localhost:1313
python tools/preview.py --build  # writes .preview/index.html
```

`hugo server` renders the same thing.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds with Hugo
and publishes to GitHub Pages for the `arendesai.com` custom domain.
