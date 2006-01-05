function prod_unit_add()
{
    UnitTreeAddItem(g_selected_product,
        al_getValue('prod_unit_unit'),
        al_getValue('prod_unit_weight'));
}

function prod_unit_delete()
{
    UnitTreeDeleteItem(g_selected_product);
}

function UnitTreeSetItems(items)
{
    var root = document.getElementById('prod_unit_tree_children');
    // remove old
    var kids = root.childNodes;
    for (var i = 0; i < kids.length; i++)
        root.removeChild(kids[i]);

    // add new
    for (var i = 0; i < items.length; i++)
    {
        var item = document.createElement('treeitem');
        var row = document.createElement('treerow');
        var cell_unit = document.createElement('treecell');
        var cell_weight = document.createElement('treecell');
        cell_unit.setAttribute('label', items[i]['unit']);
        cell_weight.setAttribute('label', items[i]['weight']);
        row.appendChild(cell_unit);
        row.appendChild(cell_weight);
        item.appendChild(row);
        root.appendChild(item);
    }
}

function prod_unit_selected()
{
    var tree = document.getElementById('prod_unit_tree');
    if (tree.currentIndex != -1)
    {
        var kid = document.getElementById('prod_unit_tree_children').childNodes[tree.currentIndex];

        var unit = kid.firstChild.firstChild.getAttribute('label');
        var weight = kid.firstChild.lastChild.getAttribute('label');
        al_setValue('prod_unit_unit', unit);
        al_setValue('prod_unit_weight', weight);
    }


}

function UnitTreeAddItem(id, unit, weight)
{
    var data = {command: 'prod_unit_add',
                id: id,
                unit: unit,
                weight: weight,
                user: g_user_name,
                password: g_user_password};
    var result = communicate(data)
    if (result['pass'] == 'true')
    {
        if (result['type'] == 'added')
        {
            var root = document.getElementById('prod_unit_tree_children');
            var item = document.createElement('treeitem');
            var row = document.createElement('treerow');
            var cell_unit = document.createElement('treecell');
            var cell_weight = document.createElement('treecell');
            cell_unit.setAttribute('label', unit);
            cell_weight.setAttribute('label', weight);
            row.appendChild(cell_unit);
            row.appendChild(cell_weight);
            item.appendChild(row);
            root.appendChild(item);
        }
        else
        {
            var tree = document.getElementById('prod_unit_tree');
            var kids = document.getElementById('prod_unit_tree_children').childNodes;
            for (var i = 0; i < kids.length; i++)
                if (kids[i].firstChild.firstChild.getAttribute('label') == unit)
                {
                    kids[i].firstChild.lastChild.setAttribute('label', weight);
                }
        }
    }
}


function UnitTreeDeleteItem(id)
{
    var tree = document.getElementById('prod_unit_tree');
    var root = document.getElementById('prod_unit_tree_children');
    var kids = root.childNodes;
    var unit = kids[tree.currentIndex].firstChild.firstChild.getAttribute('label');

    var data = {command: 'prod_unit_delete',
                id: id,
                unit: unit,
                user: g_user_name,
                password: g_user_password};
    var result = communicate(data)
    if (result['pass'] == 'true')
    {
        root.removeChild(kids[tree.currentIndex]);
    }
}
