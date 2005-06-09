/*
    Returns the class of the argument or undefined if it's not a 
    valid JavaScript object.
*/
function getObjectClass(obj)
{
    if (obj && obj.constructor && obj.constructor.toString)
    {
        var arr = obj.constructor.toString();
        arr = arr.match(/function\s*(\w+)/);
        return arr && arr.length == 2 ? arr[1] : undefined;
    }
    else
    {
        return undefined;
    }
}

/*
    Takes given dictionary and constructs XML file from it
*/

function senddata_append(doc, to_element, name, data)
{
    var node = doc.createElement(name);
    to_element.appendChild(node);

    switch (getObjectClass(data))
    {
        case 'String':
            node.appendChild(doc.createTextNode(data));
            break;
        case 'Array':
            node.setAttribute('array', 'true');
            for (var i = 0; i < data.length; i++)
                senddata_append(doc, node, 'item', data[i]);
            break;
        case 'Object':
            for (var n in data)
                senddata_append(doc, node, n, data[n])
            break;
    }
}

function senddata(data)
{
    var doc = document.implementation.createDocument("", "auslavis", null);
    for (var name in data)
        senddata_append(doc, doc.documentElement, name, data[name])
    return doc;
}

/*
    Takes given XML and constructs dictionary from it
*/
function retrdata_append(to_data, name, element)
{
    if (element.getAttribute('array') == 'true')
    {
        to_data[name] = new Array(element.childNodes.length);
        for (var i = 0; i < element.childNodes.length; i++)
        {
            var child = element.childNodes[i];
            to_data[name][i] = {}
            for (var j = 0; j < child.childNodes.length; j++)
            {
                retrdata_append(to_data[name][i],
                    child.childNodes[j].nodeName,
                    child.childNodes[j]);
            }
        }
    }
    else
    {
        if (element.childNodes.length == 0)
        {
            to_data[name] = '';
        }
        else if ((element.childNodes.length == 1) &&
            (element.childNodes[0].nodeType == element.childNodes[0].TEXT_NODE))
        {
            to_data[name] = element.childNodes[0].nodeValue;
        }
        else
        {
            to_data[name] = {};
            for (var i = 0; i < element.childNodes.length; i++)
                retrdata_append(to_data[name], element.childNodes[i].nodeName,
                    element.childNodes[i]);
        }
    }
}

function retrdata(xml)
{
    data = {};
    for (var i = 0; i < xml.documentElement.childNodes.length; i++)
        retrdata_append(data,
            xml.documentElement.childNodes[i].nodeName,
            xml.documentElement.childNodes[i]);
    return data;
}

/*
    communication function
*/
function communicate(data)
{
    var xrequest=new XMLHttpRequest();
    xrequest.open('POST', '../../cgi-bin/auslavis.cgi', false);
    xrequest.send(senddata(data));
    return retrdata(xrequest.responseXML);
}
