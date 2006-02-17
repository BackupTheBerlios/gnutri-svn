from sqlobject import *
from turbogears.database import PackageHub

hub = PackageHub("gnutri2")
__connection__ = hub

class User(SQLObject):
    class sqlmeta:
        table = "user_table"

    username = StringCol(length=255, alternateID=True)
    password = StringCol(length=64)
    roles = RelatedJoin('Role')
    health = MultipleJoin('Health')
    menu = MultipleJoin('Menu')

class Role(SQLObject):
    name = StringCol(length=255, alternateID=True)
    users = RelatedJoin('User')

class Health(SQLObject):
    date = DateCol()
    height = FloatCol()
    weight = FloatCol()
    work = IntCol()
    person = ForeignKey('User')

class Product(SQLObject):
    name = StringCol(length=255)
    description = StringCol()
    ingredients = MultipleJoin('Ingredient')
    bases = MultipleJoin('BaseMaterial')
    tags = RelatedJoin('Tag')

class Unit(SQLObject):
    product = ForeignKey('Product')
    name = StringCol(length=255)
    weight = FloatCol() # always in grams

class Ingredient(SQLObject):
    product = ForeignKey('Product')
    unit = ForeignKey('Unit')
    amount = FloatCol()

class BaseMaterialName(SQLObject):
    name = StringCol(length=255)

class BaseMaterial(SQLObject):
    product = ForeignKey('product')
    name = ForeignKey('BaseMaterialName')
    amount = FloatCol() # always in grams

class Tag(SQLObject):
    name = StringCol(length=255)
    product = RelatedJoin('Product')

class Menu(SQLObject):
    user = ForeignKey('User')
    unit = ForeignKey('Unit')
    date = DateCol()
    amout = FloatCol()
