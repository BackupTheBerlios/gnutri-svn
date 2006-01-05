/*
    Complex Editing
*/

function prod_complex_changed()
{
    var tree = document.getElementById('prod_complex_tree');

    var list = document.getElementById('prod_unit_list');
    var kids = list.childNodes;
    for (var i = kids.length-1; i >= 0; i--)
        list.removeChild(list.childNodes[i]);

    var element = g_complexdata.getRowElement(tree.currentIndex);
    var names = element['units'];
    for (var i = 0; i < names.length; i++)
    {
        var item = document.createElement('listitem');
        item.setAttribute('label', names[i]['name']);
        list.appendChild(item);
        if (names[i]['name'] == element['prod_complex_tree_unit'])
            list.selectedIndex = i;
    }
    al_setValue('prod_complex_amount', element['prod_complex_tree_amount']);
}

function prod_tree_dblclick()
{
    if (document.getElementById('prod_tabs').selectedIndex == 3)
    {
        var tree = document.getElementById("prod_tree");
        var element = g_treedata.getRowElement(tree.currentIndex);

        if (!('container' in element) || !element.container)
        {
            var exists = false;
            for (var i = 0; i < g_complexdata.data.length; i++)
                if (g_complexdata.data[i]['id'] == g_selected_product)
                    exists = true;
            if (!exists)
            {
                var complextree = document.getElementById('prod_complex_tree');
                var data = {command: 'prod_complex_add',
                            id: g_selected_product,
                            prid: element['id'],
                            user: g_user_name,
                            password: g_user_password};
                var result = communicate(data);
                if (result['pass'] == 'true')
                {
                    var newelement = {id: element['id'],
                            'prod_complex_tree_prod': element['prod_tree_name'],
                            'prod_complex_tree_unit': result['list'][0]['name'],
                            'prod_complex_tree_amount': '0.0',
                            'units': result['list']};
                    g_complexdata.add(newelement);
                    complextree.view.performActionOnRow('add', g_complexdata.getRowCount()-1);
                    document.getElementById('prod_edit_complex').disabled = true;
                    al_setValue('prod_edit_balt', result['balt']);
                    al_setValue('prod_edit_angl', result['angl']);
                    al_setValue('prod_edit_rieb', result['rieb']);
                    al_setValue('prod_complex_total', 'Total: ' + result['total']);
                }
            }
        }
    }
}

function prod_complex_edit()
{
    var tree = document.getElementById('prod_complex_tree');
    var element = g_complexdata.getRowElement(tree.currentIndex);

    var list = document.getElementById('prod_unit_list');

    var data = {command: 'prod_complex_update',
            id: g_selected_product,
            prid: element['id'],
            unit: list.selectedItem.getAttribute('label'),
            oldunit: element['prod_complex_tree_unit'],
            amount: al_getValue('prod_complex_amount'),
            user: g_user_name,
            password: g_user_password};
    var result = communicate(data);
    if (result['pass'] == 'true')
    {
        tree.view.performActionOnRow('invalidate', tree.currentIndex);
        element['prod_complex_tree_unit'] = list.selectedItem.getAttribute('label');
        element['prod_complex_tree_amount'] = al_getValue('prod_complex_amount');
        al_setValue('prod_edit_balt', result['balt'])
        al_setValue('prod_edit_angl', result['angl'])
        al_setValue('prod_edit_rieb', result['rieb'])
        al_setValue('prod_complex_total', 'Total: ' + result['total']);
    }
}

function prod_complex_delete()
{
    var tree = document.getElementById('prod_complex_tree');
    var element = g_complexdata.getRowElement(tree.currentIndex);

    var data = {command: 'prod_complex_delete',
            id: g_selected_product,
            prid: element['id'],
            unit: element['prod_complex_tree_unit'],
            user: g_user_name,
            password: g_user_password};
    var result = communicate(data);
    if (result['pass'] == 'true')
    {
        g_complexdata.remove(tree.currentIndex);
        tree.view.performActionOnRow('remove', tree.currentIndex);
        al_setValue('prod_edit_balt', result['balt'])
        al_setValue('prod_edit_angl', result['angl'])
        al_setValue('prod_edit_rieb', result['rieb'])
        if (g_complexdata.getRowCount() == 0)
            document.getElementById('prod_edit_complex').disabled = false;
        al_setValue('prod_complex_total', 'Total: ' + result['total']);
    }
}


function cleanComplexList()
{
    var complextree = document.getElementById('prod_complex_tree');
    var count = g_complexdata.getRowCount();
    while (count > 0)
    {
        count--;
        complextree.view.performActionOnRow('remove', count);
        g_complexdata.remove(count);
        count = g_complexdata.getRowCount();
    }
}

function ComplexLoadItems(id)
{
    var data = {command: 'prod_complex_load',
            id: id};
    var result = communicate(data);

    var complextree = document.getElementById('prod_complex_tree');
    cleanComplexList();

    for (var i = 0; i < result['list'].length; i++)
    {
        var element = {id: result['list'][i]['id'],
                    'prod_complex_tree_prod': result['list'][i]['product'],
                    'prod_complex_tree_unit': result['list'][i]['unit'],
                    'prod_complex_tree_amount': result['list'][i]['amount'],
                    'units': result['list'][i]['units']};
        g_complexdata.add(element);
        complextree.view.performActionOnRow('add', g_complexdata.getRowCount());
    }
    al_setValue('prod_complex_total', 'Total: ' + result['total']);

    var list = document.getElementById('prod_unit_list');
    var kids = list.childNodes;
    for (var i = kids.length-1; i >= 0; i--)
        list.removeChild(list.childNodes[i]);

    if (g_complexdata.getRowCount() > 0)
    {
        var names = g_complexdata.getRowElement(0)['units'];
        for (var i = 0; i < names.length; i++)
        {
            var item = document.createElement('listitem');
            item.setAttribute('label', names[i]['name']);
            list.appendChild(item);
        }
    }
}

