from xml.dom.minidom import getDOMImplementation
import types

class SendData:
    """ SendData class is used for sending data. """

    def __init__(self, root):
        self.newdoc = getDOMImplementation().createDocument(None, root, None)

    def add(self, node_name, node_value=""):
        node = self.newdoc.createElement(node_name)
        if node_value != "":
            node.appendChild(self.newdoc.createTextNode(node_value))
        self.newdoc.documentElement.appendChild(node)
        item = SendDataItem(self, node)
        return item

class SendDataItem:

    def __init__(self, parent, node):
        self.parent = parent

    def add(self, node_name, node_value=""):
        node = self.parent.newdoc.createElement(node_name)
        if node_value != "":
            node.appendChild(self.parent.newdoc.createTextNode(node_value))
        self.node.appendChild(node)
        item = SendDataItem(self, node)
        return item

def senddata_append(doc, to_element, name, data):
    node = doc.createElement(name)
    to_element.appendChild(node)

    if type(data) == types.StringType:
        node.appendChild(doc.createTextNode(data))
    elif type(data) == types.ListType:
        node.setAttribute('array', 'true')
        for item in data:
            senddata_append(doc, node, 'item', item)
    elif type(data) == types.DictType:
        for name in data:
            senddata_append(doc, node, name, data[name])

def senddata(data):
    doc = getDOMImplementation().createDocument(None, "auslavis", None)

    for name in data:
        senddata_append(doc, doc.documentElement, name, data[name])
    return doc.toxml()
