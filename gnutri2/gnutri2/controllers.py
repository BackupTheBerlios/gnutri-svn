import turbogears
from turbogears import controllers

class Root(controllers.Root):

    @turbogears.expose(html="gnutri2.templates.welcome")
    def index(self):
        import time
        return dict(now=time.ctime())