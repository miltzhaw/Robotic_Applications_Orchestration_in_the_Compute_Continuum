from flask import Blueprint, request, json
from flask import Response, stream_with_context
from openHorizon.openHorizon import MyOpenHorizon
import logging
import os

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logger.addHandler(logging.StreamHandler())

robots = Blueprint('robots', __name__)

# https://stackoverflow.com/questions/13081532/return-json-response-from-flask-view
# https://stackoverflow.com/questions/52008881/flask-attributeerror-blueprint-object-has-no-attribute-response-class
# https://stackoverflow.com/questions/7478366/create-dynamic-urls-in-flask-with-url-for
@robots.route('/API/robots', methods=['GET'])
def get_nodes():
    """
    Gets the robots (nodes) from Open Horizon from a robot
    """
    moh = MyOpenHorizon(url=os.environ['HZN_EXCHANGE_URL'], org=os.environ['HZN_ORG_ID'], userAuth=os.environ['HZN_EXCHANGE_USER_AUTH'])
    nodes = moh.nodes.get()
    data = []

    # Prepare the data
    for node in nodes:
        if node["name"] == "node1":
            continue
        data.append({"id": node["id"],
                    "name": node["name"],
                    "nodeType" : node["nodeType"],
                    "properties" : node["properties"],
                    "services": {
                        "registeredServices": node["registeredServices"],
                        "runningServices": node["runningServices"],
                        "services": node["services"]
                    },
                    "userInput" : node["userInput"],
                    "lastUpdated": {
                        "heartbeat": node["lastHeartbeat"],
                        "nodePolicy": node["lastUpdatedNodePolicy"],
                        "nodeStatus": node["lastUpdatedNodeStatus"],
                    }
                    })

    response = Response(json.dumps(data),
                        status=200,
                        mimetype='application/json')
    
    return response


