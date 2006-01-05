/**********************************************************************
    Tree View class
**********************************************************************/
function alTreeView(treedata) {
    this.treedata = treedata;
}

/**********************************************************************
    Those functions are just necessary
**********************************************************************/
alTreeView.prototype.boxObject = null;

alTreeView.prototype.QueryInterface = function(aIID)
{
    return this;
}

alTreeView.prototype.setTree = function(boxObject) {
    this.boxObject = boxObject;
    this.treedata.addBoxObject(boxObject);
}

alTreeView.prototype.getInterfaces = function(count) {}
alTreeView.prototype.getHelperForLanguage = function(language) {return null; }

/**********************************************************************
    Get functions
**********************************************************************/
alTreeView.prototype.__defineGetter__('rowCount',
    function() {return this.treedata.getRowCount()});

alTreeView.prototype.getCellText = function(aRow, aCol)
{
    if (typeof aCol != 'string')
        aCol = aCol.id;

    var element = this.treedata.getRowElement(aRow);
    if (typeof element == 'undefined')
        return null;

    return element[aCol];
}

alTreeView.prototype.getCellValue = function(aRow, aCol) {return null;}
alTreeView.prototype.getProgressMode = function(aRow, aCol) {return null;}
alTreeView.prototype.getImageSrc = function(aRow, aCol) {return null;}
alTreeView.prototype.getColumnProperties = function(aCol, aProperties) {}
alTreeView.prototype.getRowProperties = function(aRow, aProperties) {}
alTreeView.prototype.getCellProperties = function(aRow, aCol, aProperties) {}
alTreeView.prototype.isSeparator = function(aRow) {return false;}

alTreeView.prototype.isContainer = function(aRow)
{
    var element = this.treedata.getRowElement(aRow);
    return (typeof element != 'undefined' &&
            ('container' in element && element.container == true) &&
            ('children' in element || !('cached' in element) ||
            ('cached' in element && element.cached == false)));
}
alTreeView.prototype.isContainerOpen = function(aRow)
{
    var element = this.treedata.getRowElement(aRow);
    return (typeof element != 'undefined' && 'open' in element && element.open);
}
alTreeView.prototype.isContainerEmpty = function(aRow)
{
    var element = this.treedata.getRowElement(aRow);
    return (typeof element == 'undefined' ||
            ('children' in element && element.children.length == 0));
}

alTreeView.prototype.getLevel = function(aRow)
{
    return this.treedata.getLevel(aRow);
}

alTreeView.prototype.getParentIndex = function(aRow)
{
    return this.treedata.getParentIndex(aRow);
}

/**********************************************************************
    Test if element has next sibling
**********************************************************************/
alTreeView.prototype.hasNextSibling = function(aRow, aAfterRow)
{
    var parent = this.treedata.getParentIndex(aRow);

    var element = this.treedata.getRowElement(aRow);
    if (typeof element == 'undefined')
        return false;

    var elementCount = 0;
    if ('children' in element)
        elementCount = this.treedata._getRowCount(element.children);

    if (aRow + elementCount + 1 < this.treedata.getRowCount())
    {
        parent2 = this.treedata.getParentIndex(aRow + elementCount + 1);
        if (parent2 == parent)
            return true;
    }
    return false;
}

/**********************************************************************
    toggle open state
**********************************************************************/
alTreeView.prototype.toggleOpenState = function(aRow)
{
    this.treedata.toggleOpenState(aRow);

}

/**********************************************************************
    Perform action on row
**********************************************************************/
alTreeView.prototype.performActionOnRow = function(aAction, aRow)
{
    switch (aAction)
    {
        case 'removeRow':
            this.treedata.removeRow(aRow);
            break;
        case 'addCategory':
            this.treedata.addCategory(aRow);
            break;
        case 'addProduct':
            this.treedata.addProduct(aRow);
            break;
    }
}

/**********************************************************************
    Other funcions
**********************************************************************/
alTreeView.prototype.sortColumn = null;
alTreeView.prototype.cycleHeader = function(aCol){}
alTreeView.prototype.isSorted = function(){return false;}
alTreeView.prototype.isEditable = function(aRow, aCol){return false;}
alTreeView.prototype.cycleCell = function(aRow, aCol) {}
alTreeView.prototype.performAction = function(aAction) {}

alTreeView.prototype.performActionOnCell = function(aAction, aRow, aCol) {}

alTreeView.prototype.canDrop = function(aRow, aOrientation)
{
    return false;
}
alTreeView.prototype.canDropOn = function(aRow)
{
    return false;
}
alTreeView.prototype.canDropBeforeAfter = function(aRow, aBefore)
{
    return false;
}

alTreeView.prototype.drop = function(aRow, aOrientation) {}

alTreeView.prototype.selection = null;
alTreeView.prototype.selectionChanged = function() {};

alTreeView.prototype.canCreateWrapper
  = alTreeView.prototype.canCallMethod
  = alTreeView.prototype.canGetProperty
  = alTreeView.prototype.canSetProperty
  = function()
{
    return 'AllAccess';
}

