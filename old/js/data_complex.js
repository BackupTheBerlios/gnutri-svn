/**********************************************************************
    Complex data class
**********************************************************************/
function ComplexData() {
    this.data = [];
}

ComplexData.prototype.getRowCount = function()
{
    return this.data.length;
}

ComplexData.prototype.getRowElement = function(aRow)
{
    return this.data[aRow];
}

ComplexData.prototype.remove = function(aRow)
{
    this.data.splice(aRow, 1);
}

ComplexData.prototype.add = function(element)
{
    this.data.push(element);
}
