import requests
# from node import MyOpenHorizonNode
# from policies import MyOpenHorizonPolicies
# from services import MyOpenHorizonService
from openHorizon.node import MyOpenHorizonNode
from openHorizon.policies import MyOpenHorizonPolicies
from openHorizon.services import MyOpenHorizonService

class MyOpenHorizon:
    # https://stackoverflow.com/questions/26000336/execute-curl-command-within-a-python-script
    def __init__(self, url, org, userAuth):
        """
        Constructor
        """
        self._url = url
        self._org = org
        self._userName = userAuth.split(":")[0]
        self._password = userAuth.split(":")[1]
        self._headers = {'Content-Type': 'application/json'}
        self._exchangeAPI = self.status["exchange_api"]
        self.nodes = MyOpenHorizonNode(url=url, org=org, userName=self._userName, password=self._password, headers=self._headers, exchangeAPI=self._exchangeAPI)
        self.policies = MyOpenHorizonPolicies(url=url, org=org, userName=self._userName, password=self._password, headers=self._headers, exchangeAPI=self._exchangeAPI)
        self.services = MyOpenHorizonService(url=url, org=org, userName=self._userName, password=self._password, headers=self._headers, exchangeAPI=self._exchangeAPI)
    

if __name__ == '__main__':
    moh = MyOpenHorizon(url="http://160.85.252.236:3090", org="myorg", userAuth="myuser:mypassword")

    # nodes = moh.nodes.get()
    # print (nodes)

    # services = moh.services.get()
    # print (services)

    policies = moh.policies.get()
    print (policies)


    policies = moh.policies.get_business_policy(businessId="example_policy_1.0.0")
    print (policies)
