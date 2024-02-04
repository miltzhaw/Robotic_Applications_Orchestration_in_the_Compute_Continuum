import os
from flask import Flask, jsonify, render_template, make_response
from dotenv import load_dotenv
from openHorizon.openHorizon import MyOpenHorizon
from restAPI.policies import policies
from restAPI.robots import robots
from restAPI.services import services
import logging, time



logging.basicConfig(filename="logger-"+time.strftime("%Y%m%d")+".log", filemode='a',level=logging.DEBUG, format=f"%(levelname)-8s: \t %(filename)s %(funcName)s %(lineno)s - %(message)s")
logger = logging.getLogger("mylogger")
logger.addHandler(logging.StreamHandler())
app = Flask(__name__)
app.register_blueprint(policies)
app.register_blueprint(robots)
app.register_blueprint(services)
openHorizon = None


@app.route('/')
def main():
    
    HZN_ORG_ID = os.environ['HZN_ORG_ID']
    HZN_EXCHANGE_USER_AUTH = os.environ['HZN_EXCHANGE_USER_AUTH']
    openHorizon = MyOpenHorizon(url=os.environ['HZN_EXCHANGE_URL'], org=HZN_ORG_ID, userAuth=HZN_EXCHANGE_USER_AUTH)

    status = openHorizon.status
    if status is None:
        return render_template('no_service.html')
    else:
        return render_template('index.html', status=status)


if __name__ == '__main__':
    # Load the environment variables
    # https://stackoverflow.com/questions/58943578/i-have-installed-python-dotenv-but-python-cannot-find-it
    load_dotenv('.env')

    logger.info("Environment Variables loaded")

    openHorizon = MyOpenHorizon(url=os.environ['HZN_EXCHANGE_URL'],org=os.environ['HZN_ORG_ID'], userAuth=os.environ['HZN_EXCHANGE_USER_AUTH'])

    app.run(debug=True)
