#!/usr/bin/env python3
"""
Simple HTTP server for browsing the downloaded site locally.

Usage:
    python server.py              # Start on port 8000
    python server.py 9000         # Start on custom port
"""

import http.server
import socketserver
import sys
import os

# Change to script directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add headers to allow proper content type handling
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

Handler = MyHTTPRequestHandler

print(f"""
╔══════════════════════════════════════════╗
║     🌐 Local Site Server Running         ║
╠══════════════════════════════════════════╣
║  URL:  http://localhost:{PORT:<25}║
║  Dir:  {os.getcwd():<33} ║
╠══════════════════════════════════════════╣
║  Press Ctrl+C to stop                    ║
╚══════════════════════════════════════════╝
""")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✓ Server stopped")
        sys.exit(0)
