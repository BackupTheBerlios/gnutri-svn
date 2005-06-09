/*
    Login
*/
function user_login()
{
    var data = {command: 'user_login',
                name: al_getValue('user_login_name'),
                password: al_getValue('user_login_password')}

    var result = communicate(data);
    al_setValue('user_info', result['message']);

    if (result['action'] == 'pass')
    {
        g_user_name = al_getValue('user_login_name');
        g_user_password = al_getValue('user_login_password');
        g_business = result['business'] == 'true' ? true : false;
        al_setValue('user_change_name', g_user_name);
        al_setValue('user_change_password', g_user_password);
        al_setValue('user_change_weight', result['weight']);
        al_setValue('user_change_height', result['height']);
        document.getElementById('user_change_work').selectedIndex = parseInt(result['work']);

        al_hide('user_login');

        al_show('user_change');
        al_show('logout');

        al_show('menu');
        al_show('report');
        if (result['admin'] == 'true')
            al_show('user_management');

        initMenuData();
        initReportData();
        initAdminData();
    }
}

/*
    Change user information
*/
function user_register()
{
    var today = new Date();
    var data = {command: 'user_register',
                name: al_getValue('user_register_name'),
                password: al_getValue('user_register_password'),
                weight: al_getValue('user_register_weight'),
                height: al_getValue('user_register_height'),
                work: String(document.getElementById('user_register_work').selectedIndex),
                time: String(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(),
                                      today.getHours(), today.getMinutes(), today.getSeconds()))};

    var result = communicate(data);
    al_setValue('user_info', result['message']);

    if (result['action'] == 'pass')
    {
        g_user_name = al_getValue('user_register_name');
        g_user_password = al_getValue('user_register_password');
        al_setValue('user_change_name', g_user_name);
        al_setValue('user_change_password', g_user_password);
        al_setValue('user_change_weight', al_getValue('user_register_weight'));
        al_setValue('user_change_height', al_getValue('user_register_height'));
        document.getElementById('user_change_work').selectedIndex =
            document.getElementById('user_register_work').selectedIndex;

        al_hide('user_login');

        al_show('user_change');
        al_show('logout');

        al_show('menu');
        al_show('report');

        initMenuData();
        initReportData();
        initAdminData();
    }
}

/*
    Change user information
*/
function user_change()
{
    var today = new Date();
    var data = {command: 'user_change',
                new_name: al_getValue('user_change_name'),
                old_name: g_user_name,
                new_password: al_getValue('user_change_password'),
                old_password: g_user_password,
                weight: al_getValue('user_change_weight'),
                height: al_getValue('user_change_height'),
                work: String(document.getElementById('user_change_work').selectedIndex),
                time: String(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(),
                                      today.getHours(), today.getMinutes(), today.getSeconds()))};

    var result = communicate(data);
    al_setValue('user_info', result['message']);

    if (result['action'] == 'pass')
    {
        g_user_name = al_getValue('user_change_name');
        g_user_password = al_getValue('user_change_password');
    }
}

/*
    Logout
*/
function user_logout()
{
    g_user_name = '';
    g_user_password = '';
    al_show('user_login');
    al_hide('user_change');
    al_hide('logout');
    al_hide('menu');
    al_hide('report');
    al_hide('user_management');
}
