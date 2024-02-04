from flask import Blueprint, request, json
from flask import Response, stream_with_context
from openHorizon.openHorizon import MyOpenHorizon
import logging
import os

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logger.addHandler(logging.StreamHandler())

services = Blueprint('services', __name__)

@services.route('/API/services', methods=['GET'])
def get_services():
    """
    Gets the services
    """
    moh = MyOpenHorizon(url=os.environ['HZN_EXCHANGE_URL'], org=os.environ['HZN_ORG_ID'], userAuth=os.environ['HZN_EXCHANGE_USER_AUTH'])
    services = moh.services.get()
    data = []

    for service in services["services"]:
        cs = services["services"][service]
        data.append({"id": service.split("/")[1],
                    "label": cs["label"],
                    "description": cs["description"],
                    "deployment": json.loads(cs["deployment"]),
                    "version": cs["version"],
                    "url": cs["url"],
                    "lastUpdated": cs["lastUpdated"]})

    response = Response(json.dumps(data),
                        status=200,
                        mimetype='application/json')
    return response