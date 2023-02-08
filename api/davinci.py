import requests
import json
import os

from http.server import BaseHTTPRequestHandler

# Get the API key from the environment variable
API_KEY = os.environ['OPENAI_API_KEY']

# Set the URL for the API request
url = 'https://api.davinci.ai/v1/insights'



class handler(BaseHTTPRequestHandler):
	print('API_KEY', API_KEY)
	def do_GET(self):
		self.send_response(200)
		self.send_header('Content-type','text/plain')
		self.end_headers()
		self.wfile.write('Hello, world!'.encode('utf-8'))
		return