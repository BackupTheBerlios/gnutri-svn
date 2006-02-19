import turbogears
from turbogears import controllers

class Edit:

    @turbogears.expose(html="gnutri2.templates.edit")
    def index(self, page=''):
        return dict(name=page, description="testas")

    @turbogears.expose()
    def default(self, pagename):
        return self.index(pagename)

class Search:

    @turbogears.expose(html="gnutri2.templates.search")
    def index(self, keyword=''):
        products = ['1', '2', '3', keyword]
        return dict(products=products)

    @turbogears.expose()
    def default(self, pagename):
        return self.index(pagename)


class Root(controllers.Root):

    edit = Edit()
    search = Search()

    @turbogears.expose(html="gnutri2.templates.index")
    def index(self):
        import time
        return dict(now=time.ctime())
