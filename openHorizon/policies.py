import requests, json
# import urllib
from requests.auth import HTTPBasicAuth


class MyOpenHorizonPolicies:
    # https://stackoverflow.com/questions/26000336/execute-curl-command-within-a-python-script
    def __init__(self, url, org, userName, password, headers, exchangeAPI):
        """
        Constructor
        https://open-horizon.github.io/docs/api/exchange_swagger/
        """
        self._url = url + "/v1/orgs/myorg"
        self._org = org
        self._userName = userName
        self._password = password
        self._headers = headers
        self._exchangeAPI = exchangeAPI



    def get(self):
        """
        Gets the policies from the exchange
        """
        # Check if the service is running
        try:
            status = requests.get(self._url + "/business/policies", headers=self._headers, auth=HTTPBasicAuth(self._org + "/" + self._userName,self._password))
        except requests.exceptions.RequestException as e:
            print(e)
            return None
        
        return status.json()
    
    

    def get_business_policy(self, businessId):
        """
        Gets the business policy
        """
        url = self._url + "/business/policies/" + self._org + "%2F" + businessId

        # Check if the service is running
        try:
            status = requests.get(url, headers=self._headers, auth=HTTPBasicAuth(self._org + "/" + self._userName,self._password))
        except requests.exceptions.RequestException as e:
            print(e)
            return None
        
        data = status.json()
        data = data["businessPolicy"][self._org + "/" + businessId]
        return data



    def update_business_policy(self, businessId, data):
        """
        Updates the business policy
        """
        url = self._url + "/business/policies/" + self._org + "%2F" + businessId

        # Check if the service is running
        try:
            status = requests.put(url, data=json.dumps(data), headers=self._headers, auth=HTTPBasicAuth(self._org + "/" + self._userName,self._password))
        except requests.exceptions.RequestException as e:
            print(e)
            return None
        
        return status.json()
    
    

    def update_node_policy(self, nodeId, data):
        """
        Updates the node policy
        """
        url = self._url + "/nodes/myorg%2F" + nodeId + "/policy"

        data = {
            "properties":data
        }
        # Check if the service is running
        try:
            status = requests.put(url, data=json.dumps(data), headers=self._headers, auth=HTTPBasicAuth(self._org + "/" + self._userName,self._password))
        except requests.exceptions.RequestException as e:
            print(e)
            return None
        
        return status.json()