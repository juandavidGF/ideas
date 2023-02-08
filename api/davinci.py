import requests
import json
import os

# Get the API key from the environment variable
API_KEY = os.environ['DAVINCI_API_KEY']

# Set the URL for the API request
url = 'https://api.davinci.ai/v1/insights'


from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','text/plain')
        self.end_headers()
        self.wfile.write('Hello, world!'.encode('utf-8'))
        return