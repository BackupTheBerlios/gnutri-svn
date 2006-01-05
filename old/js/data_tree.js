/**********************************************************************
    Tree data class
**********************************************************************/
function TreeData() {
    this.data = [{prod_tree_name: '/',
                  open: true,
                  id: '1',
                  container: true,
                  modify: false,
                  parmod: false}];
    this.boxObjects = [];
    this.retrieveRows(0);
}

/**********************************************************************
    Returns number of rows
**********************************************************************/
TreeData.prototype._getRowCount = function(aData)
{
    var count = 0;
    for (var i = 0; i < aData.length; i++)
    {
        count++;

        if ('children' in aData[i] && 'open' in aData[i] && aData[i].open)
            count += this._getRowCount(aData[i].children);
    }
    return count;
}

TreeData.prototype.getRowCount = function()
{
    return this._getRowCount(this.data);
}

/**********************************************************************
    Returns row element
**********************************************************************/
TreeData.prototype._getRowElement = function(aData, aRow)
{
    for (var i = 0; i < aData.length && aRow > 0; i++)
    {
        aRow--;

        if ('children' in aData[i] && aData[i].open)
        {
            var count = this._getRowCount(aData[i].children);

            if (aRow < count)
            {
                var element = this._getRowElement(aData[i].children, aRow);
                return element;
            }
            else
                aRow -= count;
        }
    }

    if (i < aData.length)
        return aData[i];
    else
        return undefined;
}

TreeData.prototype.getRowElement = function(aRow)
{
    return this._getRowElement(this.data, aRow);
}

/**********************************************************************
    Returns level of element
**********************************************************************/
TreeData.prototype._getLevel = function(aData, aRow)
{
    for (var i = 0; i < aData.length && aRow > 0; i++)
    {
        aRow--;

        if ('children' in aData[i] && aData[i].open)
        {
            var count = this._getRowCount(aData[i].children);

            if (aRow < count)
                return this._getLevel(aData[i].children, aRow) + 1;
            else
                aRow -= count;
        }
    }

    if (i < aData.length)
        return 0;
    else
        return -1;
}

TreeData.prototype.getLevel = function(aRow)
{
    var level = this._getLevel(this.data, aRow);
    return level;
}
/**********************************************************************
    Get parent index
**********************************************************************/
TreeData.prototype._getParentIndex = function(aData, aRow)
{
    var row_add = 0;
    for (var i = 0; i < aData.length && aRow > 0; i++)
    {
        aRow--;

        if ('children' in aData[i] && aData[i].open)
        {
            var count = this._getRowCount(aData[i].children);

            if (aRow < count)
                return this._getParentIndex(aData[i].children, aRow) + i + row_add + 1;
            else
            {
                aRow -= count;
                row_add += count;
            }
        }
    }
    return -1;
}

TreeData.prototype.getParentIndex = function(aRow)
{
    return this._getParentIndex(this.data, aRow);
}

/**********************************************************************
    Remove row
**********************************************************************/
TreeData.prototype.removeRow = function(aRow)
{
    var element = this._getRowElement(this.data, aRow);

    var data = {command: 'prod_tree_delete',
        id: element['id'],
        container: element['container'] ? 'true' : 'false',
        user: g_user_name,
        password: g_user_password}
    var result = communicate(data);

    if (result['pass'] == 'true')
    {
        var parent = this.getParentIndex(aRow);
        var children = this.data;
        if (parent >= 0)
            children = this.getRowElement(parent).children;

        var count = 1;
        if (('children' in element) && ('open' in element) && element.open)
            count += this._getRowCount(element.children);

        for (var i = 0; i < children.length; i++)
        {
            if (children[i] == element)
            {
                children.splice(i, 1);
                break;
            }
        }

        for (var i = 0; i < this.boxObjects.length; i++)
            this.boxObjects[i].rowCountChanged(aRow, -count);
    }
}

/**********************************************************************
    Retrieve rows from server
**********************************************************************/

function buildElement(source, parent)
{
    var new_element = {prod_tree_name: source['name'],
                       id: source['id'],
                       container: source['container'] == 'true' ? true : false,
                       modify: source['modify'] == 'true' ? true : false,
                       parmod: parent['modify']};
    if (!new_element.container)
    {
        new_element.prod_tree_rieb = source['rieb'];
        new_element.prod_tree_angl = source['angl'];
        new_element.prod_tree_balt = source['balt'];
    }
    if (new_element.prod_tree_name.length == 0)
        new_element.prod_tree_name = new_element.id;
    return new_element;
}

function compareTreeElements(a, b)
{
    var con_a = a['container'];
    if (typeof con_a == 'String')
        con_a = con_a == 'true' ? true : false;
    var con_b = b['container'];
    if (typeof con_b == 'String')
        con_b = con_b == 'true' ? true : false;
    if (con_a && !con_b)
        return -1
    else if (!con_a && con_b)
        return 1
    else
        return parseInt(a.id)-parseInt(b.id);
}

function al_sortByName(a, b)
{
    var con_a = a['container'];
    if (typeof con_a == 'String')
        con_a = con_a == 'true' ? true : false;
    var con_b = b['container'];
    if (typeof con_b == 'String')
        con_b = con_b == 'true' ? true : false;
    if (con_a && !con_b)
        return -1
    else if (!con_a && con_b)
        return 1
    else if (a.prod_tree_name > b.prod_tree_name)
        return 1;
    else
        return -1;
}

TreeData.prototype.retrieveRows = function(aRow)
{
    var element = this.getRowElement(aRow);
    if (typeof element == 'undefined')
        return;

    if (!('children' in element))
        element.children = []

    var data = {command: 'prod_tree_get',
                parent: element.id,
                user: g_user_name,
                password: g_user_password};
    var res = communicate(data);
    if (res['pass'] == 'true')
    {
        if (!('cached' in element) ||
            ('cached' in element && element.cached == false))
        {
            var list = res['list'];
            for (var i = 0; i < list.length; i++)
            {
                var new_element = buildElement(list[i], element);
                element.children.push(new_element);
            }
            element.cached = true;
        }
        else
        {
            var list = res['list'];
            list.sort(compareTreeElements);
            element.children.sort(compareTreeElements);
            var j = 0;
            var i = 0;
            var new_kids = [];
            while (i < list.length || j < element.children.length)
            {
                if (j == element.children.length)   // add new elements
                {
                    var new_element = buildElement(list[i], element);
                    new_kids.push(new_element);
                    i++;
                }
                else if (i == list.length)          // remove old ones
                {
                    element.children.splice(j, 1);
                }
                else if (compareTreeElements(list[i], element.children[j]) < 0)
                {
                    var new_element = buildElement(list[i], element);
                    new_kids.push(new_element);
                    i++;
                }
                else if (compareTreeElements(list[i], element.children[j]) > 0)
                {
                    element.children.splice(j, 1);
                }
                else
                {
                    j++;
                    i++;
                }
            }
            // add new kids to children
            for (i = 0; i < new_kids.length; i++)
                element.children.push(new_kids[i]);

            element.children.sort(al_sortByName);
        }
    }
}

/**********************************************************************
    Add category to tree
**********************************************************************/
TreeData.prototype.addCategory = function(aRow)
{
    var element = this.getRowElement(aRow);
    if (typeof element == 'undefined')
        return -1;
    if (!('container' in element) || element.container == false)
        return -1;

    var data = {command: 'prod_tree_add_category',
            parent: element.id,
            user: g_user_name,
            password: g_user_password};

    if (!('children' in element))
        element.children = []

    var id = communicate(data)['id'];

    if (id != '0')
    {
        if ('cached' in element && element.cached)
        {
            var new_element = {prod_tree_name: id, id: id, container: true};
            element.children.push(new_element);
            for (var i = 0; i < this.boxObjects.length; i++)
                this.boxObjects[i].rowCountChanged(aRow+element.children.length, 1);
        }
        if (!('open' in element) || !element.open)
            this.toggleOpenState(aRow);
    }
}

/**********************************************************************
    Add category to tree
**********************************************************************/
TreeData.prototype.addProduct = function(aRow)
{
    var element = this._getRowElement(this.data, aRow);
    if (typeof element == 'undefined')
        return -1;
    if (!('container' in element) || element.container == false)
        return -1;

    var data = {command: 'prod_tree_add_product',
                parent: element.id,
                user: g_user_name,
                password: g_user_password};

    if (!('children' in element))
        element.children = []

    var id = communicate(data)['id'];

    if (id != '0')
    {
        if ('cached' in element && element.cached)
        {
            var new_element = {prod_tree_name: id, id: id};
            element.children.push(new_element);
            for (var i = 0; i < this.boxObjects.length; i++)
                this.boxObjects[i].rowCountChanged(aRow+element.children.length, 1);
        }
        if (!('open' in element) || !element.open)
            this.toggleOpenState(aRow);
    }
    return -1;
}

TreeData.prototype.addBoxObject = function(boxObject)
{
    this.boxObjects.push(boxObject);
}


TreeData.prototype.toggleOpenState = function(aRow)
{
    var element = this.getRowElement(aRow);
    if (typeof element == 'undefined')
        return;
    element.open = !element.open;

    if (element.open)
        this.retrieveRows(aRow);

    if (!element.children.length)
    {
        for (var i = 0; i < this.boxObjects.length; i++)
            this.boxObjects[i].invalidateRow(aRow);
        return;
    }

    var count = this._getRowCount(element.children);
    if (element.open)
    {
        for (var i = 0; i < this.boxObjects.length; i++)
        {
            this.boxObjects[i].rowCountChanged(aRow+1, count);
            this.boxObjects[i].invalidateRow(aRow);
        }
    }
    else
    {
        for (var i = 0; i < this.boxObjects.length; i++)
        {
            this.boxObjects[i].rowCountChanged(aRow+1, -count);
            this.boxObjects[i].invalidateRow(aRow);
        }
    }
}
