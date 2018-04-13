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
    def normalize_username(self, username):
        return username.replace('@', '.').lower()

c.JupyterHub.authenticator_class = LocalCILogonOAuthenticator
c.LocalCILogonOAuthenticator.create_system_users = True
c.LocalCILogonOAuthenticator.add_user_cmd = ['adduser']
c.Authenticator.admin_users = {'dmishin', 'jjgraham'}
c.JupyterHub.admin_access = True

## Spawner
#from jupyterhub.spawner import LocalProcessSpawner
#c.JupyterHub.spawner_class = 'LocalProcessSpawner'
#import os
#os.system("pip install jupyterhub-systemdspawner")
#c.JupyterHub.spawner_class = 'systemdspawner.SystemdSpawner'
import pip
pip.main(['install', 'jupyterhub-simplespawner'])
c.JupyterHub.spawner_class = 'simplespawner.SimpleLocalProcessSpawner'
