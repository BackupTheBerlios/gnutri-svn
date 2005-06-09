function initAdminData()
{
    var data = {command: 'admin_load',
                user: g_user_name,
                password: g_user_password};
    var result = communicate(data);
    if (result['pass'] == 'true')
    {
        var list = document.getElementById('user_management_list');
        users = result['users'];
        for (var i = 0; i < users.length; i++)
        {
            v = users[i]['admin'] == 'true' ? '+' : '-';
            v += users[i]['business'] == 'true' ? '+' : '-';
            list.appendItem(users[i]['name'], v)
        }
        if (users.length > 0)
        {
            list.selectedIndex = 0;
            al_setCheckState('user_management_admin', users[0]['admin']);
            al_setCheckState('user_management_business', users[0]['business']);
        }
    }
}

function user_management_add()
{
    var data = {command: 'admin_add',
                child: al_getValue('user_management_name'),
                user: g_user_name,
                password: g_user_password};
    var result = communicate(data);
    if (result['pass'] == 'true')
    {
        var list = document.getElementById('user_management_list');
        list.appendItem(al_getValue('user_management_name'))
    }
}


function user_management_change()
{
    var list = document.getElementById('user_management_list');
    var item = list.selectedItem;
    var data = {command: 'admin_change',
                child: item.label,
                admin: al_getCheckState('user_management_admin'),
                business: al_getCheckState('user_management_business'),
                user: g_user_name,
                password: g_user_password};
    var result = communicate(data);
    if (result['pass'] == 'true')
    {
        item.value = al_getCheckState('user_management_admin') == 'true' ? '+' : '-';
        item.value += al_getCheckState('user_management_business') == 'true' ? '+' : '-';
    }
}

function user_management_delete()
{
    var list = document.getElementById('user_management_list');
    var item = list.selectedItem;
    var data = {command: 'admin_delete',
                child: item.label,
                user: g_user_name,
                password: g_user_password};
    var result = communicate(data);
    if (result['pass'] == 'true')
    {
        list.removeItemAt(list.selectedIndex);
    }
}

function user_management_list()
{
    var list = document.getElementById('user_management_list');
    var item = list.selectedItem;
    al_setCheckState('user_management_admin', item.value[0] == '+' ? 'true' : 'false');
    al_setCheckState('user_management_business', item.value[1] == '+' ? 'true' : 'false');
}
