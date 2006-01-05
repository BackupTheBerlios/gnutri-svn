from xml.dom.minidom import parseString

class RetrData:
    """ RetrData parses passed data to script. """

    def __init__(self, xmldoc):
        self.dom = parseString(xmldoc)

    def get(self, name):
        child = self.dom.getElementsByTagName(name)
        if len(child) > 0:
            if child[0].hasChildNodes():
                return child[0].firstChild.nodeValue
        return ""

def retrdata_append(to_data, name, element):
    if element.getAttribute('array') == 'true':
        to_data[name] = []
        for c0 in element.childNodes:
            to_data[name].append({})
            for c1 in c0.childNodes:
                retrdata_append(to_data[name][-1], c1.nodeName, c1)
    else:
        if len(element.childNodes) == 0:
            to_data[name] = ''
        elif len(element.childNodes) == 1 and \
                element.childNodes[0].nodeType == element.TEXT_NODE:
            to_data[name] = element.childNodes[0].nodeValue.encode('utf-8')
        else:
            to_data[name] = {}
            for child in element.childNodes:
                retrdata_append(to_data[name], child.nodeName, child)

def retrdata(xmldoc):
    data = {}
    dom = parseString(xmldoc)
    for child in dom.documentElement.childNodes:
        retrdata_append(data, child.nodeName, child)
    return data


