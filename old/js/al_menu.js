
function initMenuData()
{
    var today = new Date();
    var cYear = document.getElementById('menu_date_year');
    var year = today.getFullYear();

    for (var i = -1; i < 10; i++)
        cYear.appendItem(year-i);
    cYear.selectedIndex = 1;

    var cMonth = document.getElementById('menu_date_month');
    cMonth.selectedIndex = today.getMonth();

    setDays();
    var cDay = document.getElementById('menu_date_day');
    cDay.selectedIndex = today.getDate()-1;

    var cTime = document.getElementById('menu_date_time');
    var hour = today.getHours();
    if (hour >= 5 && hour < 9)
        cTime.selectedIndex = 0;
    else if (hour >= 9 && hour < 11)
        cTime.selectedIndex = 1;
    else if (hour >= 11 && hour < 15)
        cTime.selectedIndex = 2;
    else if (hour >= 15 && hour < 18)
        cTime.selectedIndex = 3;
    else if (hour >= 18 && hour < 22)
        cTime.selectedIndex = 4;
    else
        cTime.selectedIndex = 5;

    tree = document.getElementById('menu_user_tree');
    tree.view = new alComplexView(g_menudata);
    MenuLoadItems();
}

function setDays()
{
    var cYear = document.getElementById('menu_date_year');
    var cMonth = document.getElementById('menu_date_month');
    var cDay = document.getElementById('menu_date_day');

    var days = getDaysInMonth(parseInt(cYear.selectedItem.label), cMonth.selectedIndex);

    if (days != cDay.menupopup.childNodes.length)
    {
        cDay.removeAllItems();
        for (var i = 0; i < days; i++)
            cDay.appendItem(i+1);
        cDay.selectedIndex = 0;
    }
}

function menuDateChanged()
{
    setDays();
    MenuLoadItems();
}

/*
    Menu editing
*/
function getMenuTime()
{
    var year = parseInt(document.getElementById('menu_date_year').selectedItem.label);
    var month = document.getElementById('menu_date_month').selectedIndex;
    var day = document.getElementById('menu_date_day').selectedIndex;
    var time = document.getElementById('menu_date_time').selectedIndex;
    var hour;
    switch (time)
    {
        case 0: hour = 7; break;
        case 1: hour = 10; break;
        case 2: hour = 12; break;
        case 3: hour = 17; break;
        case 4: hour = 20; break;
        case 5: hour = 23; break;
    }
    return String(Date.UTC(year, month, day+1, hour));
}


function MenuLoadItems(id)
{
    if (g_user_name.length != 0)
    {
        var data = {command: 'menu_load',
                    user: g_user_name,
                    password: g_user_password,
                    time: getMenuTime()};
        var result = communicate(data);

        if (result['pass'] == 'true')
        {
            var complextree = document.getElementById('menu_user_tree');
            var count = g_menudata.getRowCount();
            while (count > 0)
            {
                count--;
                complextree.view.performActionOnRow('remove', count);
                g_menudata.remove(count);
                count = g_menudata.getRowCount();
            }

            for (var i = 0; i < result['list'].length; i++)
            {
                var element = {id: result['list'][i]['id'],
                            'prod_complex_tree_prod': result['list'][i]['product'],
                            'prod_complex_tree_unit': result['list'][i]['unit'],
                            'prod_complex_tree_amount': result['list'][i]['amount'],
                            'units': result['list'][i]['units']};
                g_menudata.add(element);
                complextree.view.performActionOnRow('add', g_menudata.getRowCount());
            }

            var list = document.getElementById('menu_user_list');
            var kids = list.childNodes;
            for (var i = kids.length-1; i >= 0; i--)
                list.removeChild(list.childNodes[i]);

            if (g_menudata.getRowCount() > 0)
            {
                var names = g_menudata.getRowElement(0)['units'];
                for (var i = 0; i < names.length; i++)
                {
                    var item = document.createElement('listitem');
                    item.setAttribute('label', names[i]['name']);
                    list.appendChild(item);
                }
            }
        }
    }
}

function menu_user_changed()
{
    var tree = document.getElementById('menu_user_tree');

    var list = document.getElementById('menu_user_list');
    var kids = list.childNodes;
    for (var i = kids.length-1; i >= 0; i--)
        list.removeChild(list.childNodes[i]);

    var element = g_menudata.getRowElement(tree.currentIndex);
    var names = element['units'];
    for (var i = 0; i < names.length; i++)
    {
        var item = document.createElement('listitem');
        item.setAttribute('label', names[i]['name']);
        list.appendChild(item);
        if (names[i]['name'] == element['prod_complex_tree_unit'])
            list.selectedIndex = i;
    }
    al_setValue('menu_user_amount', element['prod_complex_tree_amount']);
}

function menu_tree_dblclick()
{
    var tree = document.getElementById("menu_tree");
    var element = g_treedata.getRowElement(tree.currentIndex);

    var complextree = document.getElementById('menu_user_tree');
    var data = {command: 'menu_add',
                prid: element['id'],
                user: g_user_name,
                password: g_user_password,
                time: getMenuTime()};
    var result = communicate(data);
    if (result['pass'] == 'true')
    {
        var newelement = {id: element['id'],
                'prod_complex_tree_prod': element['prod_tree_name'],
                'prod_complex_tree_unit': result['list'][0]['name'],
                'prod_complex_tree_amount': '0.0',
                'units': result['list']};
        g_menudata.add(newelement);
        complextree.view.performActionOnRow('add', g_menudata.getRowCount()-1);
    }
}

function menu_user_edit()
{
    var tree = document.getElementById('menu_user_tree');
    var element = g_menudata.getRowElement(tree.currentIndex);

    var list = document.getElementById('menu_user_list');

    var data = {command: 'menu_update',
            prid: element['id'],
            unit: list.selectedItem.getAttribute('label'),
            oldunit: element['prod_complex_tree_unit'],
            amount: al_getValue('menu_user_amount'),
            user: g_user_name,
            password: g_user_password,
            time: getMenuTime()};
    var result = communicate(data);
    if (result['pass'] == 'true')
    {
        tree.view.performActionOnRow('invalidate', tree.currentIndex);
        element['prod_complex_tree_unit'] = list.selectedItem.getAttribute('label');
        element['prod_complex_tree_amount'] = al_getValue('menu_user_amount');
    }
}

function menu_user_delete()
{
    var tree = document.getElementById('menu_user_tree');
    var element = g_menudata.getRowElement(tree.currentIndex);

    var data = {command: 'menu_delete',
            prid: element['id'],
            unit: element['prod_complex_tree_unit'],
            user: g_user_name,
            password: g_user_password,
            time: getMenuTime()};
    var result = communicate(data);
    if (result['pass'] == 'true')
    {
        g_menudata.remove(tree.currentIndex);
        tree.view.performActionOnRow('remove', tree.currentIndex);
    }
}
