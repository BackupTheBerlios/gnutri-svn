import turbogears
from turbogears import controllers
from model import Product

class Edit:

    @turbogears.expose(html="gnutri2.templates.edit")
    def index(self, page=''):
        return dict(name=page, description="testas")

    @turbogears.expose()
    def newproduct(self, product):
        p = Product(name=product, description='')
        return self.index(product)

    @turbogears.expose()
    def default(self, pagename):
        return self.index(pagename)

class Search:

    @turbogears.expose(html="gnutri2.templates.search")
    def index(self, keyword=''):
        product_list = Product.select()
        products = []
        for p in product_list:
            products.append(p.name)
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
