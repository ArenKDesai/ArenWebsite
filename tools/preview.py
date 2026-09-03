#!/usr/bin/env python3
"""Tiny stand-in for `hugo server` so the redesign can be viewed without Hugo.

Renders layouts/_default/baseof.html + layouts/index.html into one page and
serves it at / with static/ mounted at the site root.

    python tools/preview.py          # http://localhost:1313
    python tools/preview.py --build  # write .preview/index.html and exit
"""

import argparse
import functools
import http.server
import pathlib
import re
import socketserver
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
STATIC = ROOT / "static"


def site_title() -> str:
    text = (ROOT / "hugo.yaml").read_text(encoding="utf-8")
    m = re.search(r'^title:\s*"?([^"\n]+)"?', text, re.M)
    return m.group(1).strip() if m else "Aren Desai"


def render() -> str:
    baseof = (ROOT / "layouts" / "_default" / "baseof.html").read_text(encoding="utf-8")
    index = (ROOT / "layouts" / "index.html").read_text(encoding="utf-8")

    body = index.split('{{ define "main" }}', 1)[1].rsplit("{{ end }}", 1)[0]
    page = baseof.replace('{{ block "main" . }}{{ end }}', body)
    page = page.replace("{{ .Site.Title }}", site_title())

    leftover = re.findall(r"\{\{.*?\}\}", page)
    if leftover:
        print("warn: unrendered template actions:", leftover, file=sys.stderr)
    return page


FLAT = """<style id="flat">
  #boot { display: none !important; }
  .hero { min-height: auto !important; }
  .reveal { opacity: 1 !important; transform: none !important; }
  .fx-grain, .fx-flicker, .fx-scan::after, .figure-scan { animation: none !important; }
</style></head>"""


class Handler(http.server.SimpleHTTPRequestHandler):
    """Serves the rendered page at /; ?flat=1 freezes intros for screenshotting."""

    def do_GET(self):  # noqa: N802 - stdlib naming
        path = self.path.split("?", 1)[0]
        if path in ("/", "/index.html"):
            html = render()  # re-render each load, so edits show up
            if "flat=1" in self.path:
                html = html.replace("</head>", FLAT, 1)
            page = html.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(page)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(page)
            return
        super().do_GET()

    def log_message(self, fmt, *args):
        sys.stderr.write("  %s\n" % (fmt % args))


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=1313)
    ap.add_argument("--build", action="store_true", help="write .preview/index.html and exit")
    args = ap.parse_args()

    if args.build:
        out = ROOT / ".preview"
        out.mkdir(exist_ok=True)
        (out / "index.html").write_text(render(), encoding="utf-8")
        print(f"wrote {out / 'index.html'}")
        return

    handler = functools.partial(Handler, directory=str(STATIC))
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", args.port), handler) as httpd:
        print(f"preview: http://localhost:{args.port}  (ctrl-c to stop)")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
