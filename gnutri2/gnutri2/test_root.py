from turbogears.tests import util
from gnutri2.controllers import Root
import cherrypy

def test_withtemplate():
    "Tests the output passed through a template"
    cherrypy.root = Root()
    util.createRequest("/?value=27")
    assert "The new value is 54." in cherrypy.response.body[0]

def test_directcall():
    "Tests the output of the method without the template"
    d = util.call(cherrypy.root.index, "5")
    assert d["newvalue"] == 10

