# Import your application as:
# from app import application
# Example:

from dotenv import load_dotenv
from app import app

# Import CherryPy
import cherrypy

if __name__ == '__main__':

    # Load the environment variables
    # https://stackoverflow.com/questions/58943578/i-have-installed-python-dotenv-but-python-cannot-find-it
    load_dotenv('.env')

    # Mount the application
    cherrypy.tree.graft(app, "/")

    # Unsubscribe the default server
    cherrypy.server.unsubscribe()
    
    # Disable auto reload
    cherrypy.engine.autoreload.unsubscribe()

    # Instantiate a new server object
    server = cherrypy._cpserver.Server()

    # Configure the server object
    server.socket_host = "0.0.0.0"
    server.socket_port = 8080
    server.thread_pool = 30

    # For SSL Support
#    server.ssl_module            = 'pyopenssl'
#    server.ssl_certificate       = 'tls/cert.pem'
#    server.ssl_private_key       = 'tls/privkey.pem'
    # server.ssl_certificate_chain = 'ssl/bundle.crt'

    # Subscribe this server
    server.subscribe()

    # Start the server engine (Option 1 *and* 2)

    cherrypy.engine.start()
    cherrypy.engine.block()