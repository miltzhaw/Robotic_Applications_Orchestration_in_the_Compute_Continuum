
from kubernetes import client, config, utils
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logger.addHandler(logging.StreamHandler())

class KubernetesAPIHelper:
    def __init__(self, robot, namespace, properties):
        self.robot = robot
        self.namespace = namespace
        self.port = 32420 # Default port

            # Check if the robot is registered
        for x in properties:
            if x['name'] == "wg.port":
                self.port = x['value']
                break


    def create_pods_from_yaml(self, yaml_file):
        """
        Creates pods from yaml
        https://stackoverflow.com/questions/56673919/kubernetes-python-api-client-execute-full-yaml-file
        """
        config.load_kube_config(config_file='.kubectl-config')
        k8s_client = client.ApiClient()

        self._create_deployed_yaml_file(yaml_file)

        try:
            api_response = utils.create_from_yaml(k8s_client, '/root/Robotic_Applications_Orchestration_in_the_Compute_Continuum/docker_yaml/deployed/' + self.robot + '-' + yaml_file, namespace=self.namespace)
            for i in api_response:
                print("'%s' successfully created" %(i[0].metadata.name))

        except Exception as e:
            print("Exception when calling AppsV1Api->create_namespaced_deployment: %s\n" % e)
            logger.error("Exception when calling AppsV1Api->create_namespaced_deployment: %s\n" % e)
    


    def _create_deployed_yaml_file(self, yaml_file):
        # https://www.geeksforgeeks.org/python-copy-contents-of-one-file-to-another-file/
        try:
            # open both files
            with open('/root/Robotic_Applications_Orchestration_in_the_Compute_Continuum/docker_yaml/' + yaml_file, 'r') as r, open('/root/Robotic_Applications_Orchestration_in_the_Compute_Continuum/docker_yaml/deployed/' + self.robot + '-' + yaml_file, 'w') as f:

                # read content from first file 
                for line in r:
                     # append content to file 
                    f.write(line.replace("${RAOCC_ROBOT_NAME}", self.robot).replace("${RAOCC_WG_PORT}", str(self.port)))
                
                # close both files
                f.close()
                r.close()

                logger.info("File created or updated")


        except Exception as e:
            print("Exception when calling AppsV1Api->create_namespaced_deployment: %s\n" % e)
            logger.error("Exception when calling AppsV1Api->create_namespaced_deployment: %s\n" % e)


    def delete_all_pods(self):
        """
        Deletes all pods
        https://stackoverflow.com/questions/59773615/python-kubernetes-client-equivalent-of-kubectl-get-pods
        https://stackoverflow.com/questions/64221992/simple-way-to-delete-existing-pods-from-python
        https://stackoverflow.com/questions/48785434/not-able-to-delete-kubernetes-ingress-object-through-kubernetes-python-client
        https://blog.knoldus.com/how-to-create-ingress-using-kubernetes-python-client%EF%BF%BC/
        https://stackoverflow.com/questions/74641038/how-to-delete-a-k8s-deployment-using-k8s-python-client
        """
        config.load_kube_config(config_file='.kubectl-config')

        try:
            # Delete services if exists
            service_client = client.CoreV1Api()
            if self.service_exists("wireguard-" + self.robot):
                service_client.delete_namespaced_service(name="wireguard-" + self.robot, namespace=self.namespace)
            service_client.delete_namespaced_service(name="foxglove-bridge-" + self.robot, namespace=self.namespace)

            # Delete ingress
            ingress_client = client.NetworkingV1Api()
            ingress_client.delete_namespaced_ingress(name="foxglove-bridge-" + self.robot + "-ingress", namespace=self.namespace)
            ingress_client.delete_namespaced_ingress(name="foxglove-" + self.robot +"-ingress", namespace=self.namespace)
            
            # Delete deployments
            deploymnet_client = client.AppsV1Api()
            deploymnet_client.delete_namespaced_deployment(name="fxg-bridge-" + self.robot + "-deployment", namespace=self.namespace)
        
        except Exception as e:
            print("Exception when calling AppsV1Api->create_namespaced_deployment: %s\n" % e)
            logger.error("Exception when calling AppsV1Api->create_namespaced_deployment: %s\n" % e)


    def get_pods(self):
        """
        Gets all pods
        """
        config.load_kube_config(config_file='.kubectl-config')
        api_instance = client.CoreV1Api()
        api_response = api_instance.list_namespaced_pod(namespace=self.namespace)
        return api_response
    

    def get_pod(self, pod_name):
        """
        Gets a pod
        """
        config.load_kube_config(config_file='.kubectl-config')
        api_instance = client.CoreV1Api()
        api_response = api_instance.read_namespaced_pod(name=pod_name, namespace=self.namespace)
        return api_response
    

    def get_pod_logs(self, pod_name):
        """
        Gets the logs of a pod
        """
        config.load_kube_config(config_file='.kubectl-config')
        api_instance = client.CoreV1Api()
        api_response = api_instance.read_namespaced_pod_log(name=pod_name, namespace=self.namespace)
        return api_response
    

    def get_services(self):
        """
        Gets all services
        """
        config.load_kube_config(config_file='.kubectl-config')
        api_instance = client.CoreV1Api()
        api_response = api_instance.list_namespaced_service(namespace=self.namespace)
        return api_response
    

    def get_service(self, service_name):
        """
        Gets a service
        """
        config.load_kube_config(config_file='.kubectl-config')
        api_instance = client.CoreV1Api()
        api_response = api_instance.read_namespaced_service(name=service_name, namespace=self.namespace)
        return api_response
    

    def service_exists(self, service_name):
        """
        Checks if a service exists
        """
        config.load_kube_config(config_file='.kubectl-config')
        api_instance = client.CoreV1Api()
        api_response = api_instance.list_namespaced_service(namespace=self.namespace)
        for service in api_response.items:
            if service.metadata.name == service_name:
                return True
        
        return False
    

    def get_ingresses(self):
        """
        Gets all ingresses
        """
        config.load_kube_config(config_file='.kubectl-config')
        api_instance = client.NetworkingV1Api()
        api_response = api_instance.list_namespaced_ingress(namespace=self.namespace)
        return api_response
    

    def get_ingress(self, ingress_name):
        """
        Gets an ingress
        """
        config.load_kube_config(config_file='.kubectl-config')
        api_instance = client.NetworkingV1Api()
        api_response = api_instance.read_namespaced_ingress(name=ingress_name, namespace=self.namespace)
        return api_response
    

    def get_deployments(self):
        """
        Gets all deployments
        """
        config.load_kube_config(config_file='.kubectl-config')
        api_instance = client.AppsV1Api()
        api_response = api_instance.list_namespaced_deployment(namespace=self.namespace)
        return api_response
    

    def get_deployment(self, deployment_name):
        """
        Gets a deployment
        """
        config.load_kube_config(config_file='.kubectl-config')
        api_instance = client.AppsV1Api()
        api_response = api_instance.read_namespaced_deployment(name=deployment_name, namespace=self.namespace)
        return api_response
    

    def get_namespace(self, namespace_name):
        """
        Gets a namespace
        """
        config.load_kube_config(config_file='.kubectl-config')
        api_instance = client.CoreV1Api()
        api_response = api_instance.read_namespace(name=namespace_name)
        return api_response
    

    def get_config_maps(self):
        """
        Gets all config maps
        """
        config.load_kube_config(config_file='.kubectl-config')
        api_instance = client.CoreV1Api()
        api_response = api_instance.list_namespaced_config_map(namespace=self.namespace)
        return api_response
    


# if __name__ == "__main__":
#     k = KubernetesAPIHelper("rap-2023-10")
#     k.create_pods_from_yaml('foxglove_bridge/foxglove_bridge-deployment.yaml')
#     k.delete_all_pods()
#     print(k.get_pods())
#     print(k.get_pod("foxglove-bridge-deployment-7c8c7b7c9f-9z4zr"))
#     print(k.get_pod_logs("foxglove-bridge-deployment-7c8c7b7c9f-9z4zr"))
#     print(k.get_services())
#     print(k.get_service("foxglove-bridge"))
#     print(k.get_ingresses())
#     print(k.get_ingress("foxglove-bridge-ingress"))
#     print(k.get_deployments())
#     print(k.get_deployment("foxglove-bridge-deployment"))
#     print(k.get_namespace("rap-2023-10"))
#     print(k.get_config_maps())
