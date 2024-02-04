import requests
from requests.auth import HTTPBasicAuth


class MyOpenHorizonService:
    # https://stackoverflow.com/questions/26000336/execute-curl-command-within-a-python-script
    def __init__(self, url, org, userName, password, headers, exchangeAPI):
        """
        Constructor
        https://open-horizon.github.io/docs/api/exchange_swagger/
        """
        self._url = url + "/v1/orgs/myorg/services"
        self._org = org
        self._userName = userName
        self._password = password
        self._headers = headers
        self._exchangeAPI = exchangeAPI



    def get(self):
        """
        Gets the services from the exchange
        """
        # Check if the service is running
        try:
            status = requests.get(self._url, headers=self._headers, auth=HTTPBasicAuth(self._org + "/" + self._userName,self._password))
        except requests.exceptions.RequestException as e:
            print(e)
            return None
        
        return status.json()