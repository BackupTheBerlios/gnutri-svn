/**********************************************************************
    Tree View class
**********************************************************************/
function alComplexView(complexdata) {
    this.complexdata = complexdata;
}

/**********************************************************************
    Those functions are just necessary
**********************************************************************/
alComplexView.prototype.boxObject = null;

alComplexView.prototype.QueryInterface = function(aIID)
{
    return this;
}

alComplexView.prototype.setTree = function(boxObject) {
    this.boxObject = boxObject
}

alComplexView.prototype.getInterfaces = function(count) {}
alComplexView.prototype.getHelperForLanguage = function(language) {return null; }

/**********************************************************************
    Get functions
**********************************************************************/
alComplexView.prototype.__defineGetter__('rowCount',
    function() {return this.complexdata.getRowCount()});

alComplexView.prototype.getCellText = function(aRow, aCol)
{
    if (typeof aCol != 'string')
        aCol = aCol.id;

    var element = this.complexdata.getRowElement(aRow);
    if (typeof element == 'undefined')
        return null;

    return element[aCol];
}

alComplexView.prototype.getCellValue = function(aRow, aCol) {return null;}
alComplexView.prototype.getProgressMode = function(aRow, aCol) {return null;}
alComplexView.prototype.getImageSrc = function(aRow, aCol) {return null;}
alComplexView.prototype.getColumnProperties = function(aCol, aProperties) {}
alComplexView.prototype.getRowProperties = function(aRow, aProperties) {}
alComplexView.prototype.getCellProperties = function(aRow, aCol, aProperties) {}
alComplexView.prototype.isSeparator = function(aRow) {return false;}
alComplexView.prototype.isContainer = function(aRow) {return false;}
alComplexView.prototype.isContainerOpen = function(aRow) {return false;}
alComplexView.prototype.isContainerEmpty = function(aRow) {return false;}
alComplexView.prototype.getLevel = function(aRow) {return 0;}
alComplexView.prototype.getParentIndex = function(aRow) {return -1;}
alComplexView.prototype.hasNextSibling = function(aRow, aAfterRow) {return false;}
alComplexView.prototype.toggleOpenState = function(aRow) {}
alComplexView.prototype.performActionOnRow = function(aAction, aRow)
{
    switch (aAction)
    {
        case 'add':
            this.boxObject.rowCountChanged(aRow, 1);
            break;
        case 'remove':
            this.boxObject.rowCountChanged(aRow, -1);
            break;
        case 'invalidate':
            this.boxObject.invalidateRow(aRow);
            break;
    }
}
alComplexView.prototype.sortColumn = null;
alComplexView.prototype.cycleHeader = function(aCol){}
alComplexView.prototype.isSorted = function(){return false;}
alComplexView.prototype.isEditable = function(aRow, aCol){return false;}
alComplexView.prototype.cycleCell = function(aRow, aCol) {}
alComplexView.prototype.performAction = function(aAction) {}

alComplexView.prototype.performActionOnCell = function(aAction, aRow, aCol) {}

alComplexView.prototype.canDrop = function(aRow, aOrientation)
{
    return false;
}
alComplexView.prototype.canDropOn = function(aRow)
{
    return false;
}
alComplexView.prototype.canDropBeforeAfter = function(aRow, aBefore)
{
    return false;
}

alComplexView.prototype.drop = function(aRow, aOrientation) {}

alComplexView.prototype.selection = null;
alComplexView.prototype.selectionChanged = function() {};

alComplexView.prototype.canCreateWrapper
  = alComplexView.prototype.canCallMethod
  = alComplexView.prototype.canGetProperty
  = alComplexView.prototype.canSetProperty
  = function()
{
    return 'AllAccess';
}

