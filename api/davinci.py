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

	# def do_POST(self):
	# 	content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
	# 	post_data = self.rfile.read(content_length) # <--- Gets the data itself
	# 	logging.info("POST request,\nPath: %s\nHeaders:\n%s\n\nBody:\n%s\n",
    #             str(self.path), str(self.headers), post_data.decode('utf-8'))

	# 	self._set_response()
	# 	self.wfile.write("POST request for {}".format(self.path).encode('utf-8'))
	# 	return

