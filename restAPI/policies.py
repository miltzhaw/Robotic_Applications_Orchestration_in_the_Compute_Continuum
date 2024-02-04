from flask import Blueprint, request, json
from flask import Response
from openHorizon.openHorizon import MyOpenHorizon
from utility.k8s_api_helper import KubernetesAPIHelper
import logging
import os

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logger.addHandler(logging.StreamHandler())

policies = Blueprint('policies', __name__)

@policies.route('/API/policies', methods=['GET'])
def get_policies():
    """
    Gets the policies
    """
    moh = MyOpenHorizon(url=os.environ['HZN_EXCHANGE_URL'], org=os.environ['HZN_ORG_ID'], userAuth=os.environ['HZN_EXCHANGE_USER_AUTH'])
    policies = moh.policies.get()
    data = []

    for policy in policies["businessPolicy"]:
        properties = []

        # Only get the public properties
        for property in policies["businessPolicy"][policy]["properties"]:
            if property["name"].startswith("public."):
                properties.append({"name": property["name"][7:], "value": property["value"]})

        data.append({"id": policy.split("/")[1],
                    "constraints": policies["businessPolicy"][policy]["constraints"],
                    "properties": properties,
                    "description": policies["businessPolicy"][policy]["description"],
                    "service": policies["businessPolicy"][policy]["service"],
                    "created": policies["businessPolicy"][policy]["created"],
                    "lastUpdated": policies["businessPolicy"][policy]["lastUpdated"]})
    
    response = Response(json.dumps(data),
                        status=200,
                        mimetype='application/json')
    return response



@policies.route('/API/policies/<string:business_id>', methods=['PUT'])
def update_policiy_by_id(business_id):
    """
    Gets the policies
    """
    uuid = request.get_json()['uuid']
    robot = request.get_json()['robot']
    start = request.get_json()['start']

    
    moh = MyOpenHorizon(url=os.environ['HZN_EXCHANGE_URL'], org=os.environ['HZN_ORG_ID'], userAuth=os.environ['HZN_EXCHANGE_USER_AUTH'])
    policies = moh.policies.get_business_policy(businessId=business_id)
    node_policies = moh.nodes.get_policy(id=robot)

    # Initialize the k8s api helper
    k8s_api_helper = KubernetesAPIHelper(robot=robot, namespace=os.environ['K8S_NAMESPACE'], properties=node_policies['properties'])

    
    # Delete the fields that are not needed
    del policies["owner"]
    del policies["lastUpdated"]
    del policies["created"]

    # Get the index of the uuid
    index = _get_uuid_index(policies)
    k8s = _get_k8s_of_property(policies["properties"])

    if start:
        """
        Start the service
        """
        # Check if there is no uuid in the policy
        if index == -1:
            # Add the uuid to the policy
            policies["constraints"].append("uuid=" + uuid)
        # Check if the uuid is not in the policy
        elif uuid not in policies["constraints"][index]:
            # Add the uuid to the policy
            policies["constraints"][index] += " OR uuid=" + uuid

        # Check if there is no k8s in the policy
        if k8s is not None:
            # Deploy the containers in the k8s
            k8s_api_helper.create_pods_from_yaml(k8s)
    else:
        """
        Stop the service
        """
            # Check if there is no uuid in the policy
        if index != -1:
            # Delete the uuid from the policy
            uuids = policies["constraints"][index].split(" OR ")
            for id, tmpUuid in enumerate(uuids):
                if uuid in tmpUuid:
                    del uuids[id]
                    break
            
            # Merge the uuids
            policies["constraints"][index] = " OR ".join(uuids)

        # Check if there is no k8s in the policy
        if k8s is not None:
            # Delete the containers in the k8s
            k8s_api_helper.delete_all_pods()

    return moh.policies.update_business_policy(businessId=business_id, data=policies)



def _get_uuid_index(policy):
    """
    Gets the uuids from the policy
    """
    index = -1
    temp_index = 0
    for constraint in policy["constraints"]:
        if "uuid" in constraint:
            index = temp_index
            break

        temp_index += 1

    return index


def _get_k8s_of_property(properties):
    """
    Gets the k8s of the property
    """
    for property in properties:
        if property["name"] == "k8s":
            return property["value"]

    return None