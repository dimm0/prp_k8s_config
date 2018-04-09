c.Spawner.cmd = ['jupyter-labhub']
c.Spawner.default_url = '/lab'

c.JupyterHub.confirm_no_ssl = True
c.JupyterHub.hub_ip = '127.0.0.1'

## Authenticator
from oauthenticator.cilogon import CILogonOAuthenticator
from jupyterhub.auth import LocalAuthenticator
from oauthenticator.cilogon import *
class LocalCILogonOAuthenticator(LocalAuthenticator, CILogonOAuthenticator):
    """A version that mixes in local system user creation"""
    @gen.coroutine
    def username_from_token(self, token):
        """Turn a user token into a username"""
        uri = url_concat(ujoin(self.oauth_url, 'getcert'), {
            'oauth_token': token,
        })
        uri, _, _ = self.oauth_client.sign(uri)
        resp = yield self.client.fetch(uri)
        # FIXME: handle failure
        reply = resp.body.decode('utf8', 'replace')
        _, cert_txt = reply.split('\n', 1)
        cert = load_certificate(FILETYPE_PEM, cert_txt)
        username = None
        for i in range(cert.get_extension_count()):
            ext = cert.get_extension(i)
            if ext.get_short_name().decode('ascii', 'replace') == 'subjectAltName':
                data = ext.get_data()
                # cert starts with some weird bytes. Not sure why or if they are consistent
                username = data[4:].decode('utf8').lower()
                # workaround notebook bug not handling @
                username = username.replace('@', '.')
                break
        if username is None:
            raise ValueError("Failed to get username from cert: %s", cert_txt)
        
        return username.replace(".",""), cert_txt

c.JupyterHub.authenticator_class = LocalCILogonOAuthenticator
c.LocalCILogonOAuthenticator.create_system_users = True
c.LocalCILogonOAuthenticator.add_user_cmd = ['adduser']
c.Authenticator.admin_users = {'dmishinucsdedu', 'jjgrahamucsdedu'}
c.JupyterHub.admin_access = True

from jupyterhub.spawner import LocalProcessSpawner
from wrapspawner import ProfilesSpawner
## Spawner
from dockerspawner import SystemUserSpawner
#c.JupyterHub.spawner_class = SystemUserSpawner
c.JupyterHub.spawner_class = ProfilesSpawner
#c.DockerSpawner.container_image = "systemuser:datascience-notebook-zonca-caffe-cuda-7.5-cudnn5-runtime"
#c.DockerSpawner.container_image = "jupyterhub/systemuser"
#c.DockerSpawner.container_image = "gpu_jupyterhub/singleuser"
#c.DockerSpawner.remove_containers = True

## nvidia-docker
# [zonca@patternlab dockerspawner]$ curl -s localhost:3476/docker/cli
#--volume-driver=nvidia-docker --volume=nvidia_driver_361.93.02:/usr/local/nvidia:ro --device=/dev/nvidiactl --device=/dev/nvidia-uvm --device=/dev/nvidia-uvm-tools --device=/dev/nvidia0 --device=/dev/nvidia1
#--volume-driver=nvidia-docker --volume=nvidia_driver_367.55:/usr/local/nvidia:ro --device=/dev/nvidiactl --device=/dev/nvidia-uvm --device=/dev/nvidia-uvm-tools --device=/dev/nvidia0 --device=/dev/nvidia1[zonca@patternlab run_jupyterhub]$ 

#c.DockerSpawner.read_only_volumes = {"nvidia_driver_367.55":"/usr/local/nvidia"}
#c.DockerSpawner.extra_create_kwargs = {"volume_driver":"nvidia-docker"}
#c.DockerSpawner.extra_host_config = { "devices":["/dev/nvidiactl","/dev/nvidia-uvm","/dev/nvidia-uvm-tools","/dev/nvidia0","/dev/nvidia1"] }

c.ProfilesSpawner.profiles = [
      ( "Host process", 'local', 'jupyterhub.spawner.LocalProcessSpawner', {'ip':'0.0.0.0'} ),
      #('Docker CAFFE', 'caffe', 'dockerspawner.SystemUserSpawner',
      #   dict(
      #      container_image="systemuser:datascience-notebook-zonca-caffe-cuda-7.5-cudnn5-runtime",
      #      read_only_volumes = {"nvidia_driver_361.93.02":"/usr/local/nvidia"},
      #      extra_create_kwargs = {"volume_driver":"nvidia-docker"},
      #      extra_host_config = { "devices":["/dev/nvidiactl","/dev/nvidia-uvm","/dev/nvidia-uvm-tools","/dev/nvidia0","/dev/nvidia1"] }
      #   )),
      ('Docker CPU-only', 'systemuser', 'dockerspawner.SystemUserSpawner',
         dict(container_image="jupyterhub/systemuser")),
]
