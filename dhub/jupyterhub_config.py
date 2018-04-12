c.Spawner.cmd = ['jupyter-labhub']
c.Spawner.default_url = '/lab'

## FIXME LATER
import os
os.system("pip install jupyterhub-systemdspawner")

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
c.Authenticator.admin_users = {'dmishin', 'jjgraham'}
c.JupyterHub.admin_access = True

## Spawner
#from jupyterhub.spawner import LocalProcessSpawner
#c.JupyterHub.spawner_class = 'LocalProcessSpawner'
c.JupyterHub.spawner_class = 'systemdspawner.SystemdSpawner'

