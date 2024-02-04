
## Required files
There are two files required in this [webapp](#) folder:
* .env
* .kubectl-config
 
The .env file requires the following parameters:
```
# Kubernetes
K8S_NAMESPACE=

# Open Horizon
HZN_ORG_ID=

HZN_EXCHANGE_URL=
HZN_EXCHANGE_USER_AUTH=
EXCHANGE_USER_ADMIN_PW=
```

The .kubectl-file contains the authentification.

## Web application

### Run the webapp localy
Use the following command to run the webapp locally

```bash
    python3 app.py
```

### Run the webapp on a Server

Change the SERVICE (Name of the Service), VERSION, SERVICE_CONTAINER (Name of the container) to the new Business Policy.
```bash
    python3 server.py
```

---

### Debug the code using VSCode
Open the [app.py](app.py) file in VSCode and debug the code with the `Pyhton Flask` configuartion which is provided in the [launch.json](../.vscode/launch.json) file.

---

### Debug only the Open Horizon part (without webapp)
To debug only the Open Horizon files (API), open the [openHorizon.py](openHorizon/openHorizon.py) file in VSCode and debug the code with the `Open Horizon` configuartion which is provided in the [launch.json](../.vscode/launch.json) file.<br />
But first, change the imports in the [openHorizon.py](openHorizon/openHorizon.py) file.<br />
<br />

Uncomment the following code:
```python
# from node import MyOpenHorizonNode
# from policies import MyOpenHorizonPolicies
# from services import MyOpenHorizonService
```

Comment the following code:
```python
from openHorizon.node import MyOpenHorizonNode
from openHorizon.policies import MyOpenHorizonPolicies
from openHorizon.services import MyOpenHorizonService
```

<br />
<b>Code for debugging:</b>

```python
from node import MyOpenHorizonNode
from policies import MyOpenHorizonPolicies
from services import MyOpenHorizonService
# from openHorizon.node import MyOpenHorizonNode
# from openHorizon.policies import MyOpenHorizonPolicies
# from openHorizon.services import MyOpenHorizonService
```

<br />
<b>Code for webapp:</b>

```python
# from node import MyOpenHorizonNode
# from policies import MyOpenHorizonPolicies
# from services import MyOpenHorizonService
from openHorizon.node import MyOpenHorizonNode
from openHorizon.policies import MyOpenHorizonPolicies
from openHorizon.services import MyOpenHorizonService
```