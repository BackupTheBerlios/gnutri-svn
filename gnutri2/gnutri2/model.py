from sqlobject import *
from turbogears.database import PackageHub

hub = PackageHub("gnutri2")
__connection__ = hub

class User(SQLObject):
    _table = "user_table"

    username = StringCol()
    # roles = RelatedJoin('Role')
