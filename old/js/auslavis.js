var g_user_name = '';
var g_user_password = '';
var g_business = false;

var g_selected_product='';

var g_treedata = new TreeData();
var g_complexdata = new ComplexData();
var g_menudata = new ComplexData();

/*
    Auslavis On Load
*/
function al_onload()
{
    // Initialisation
    var el = document.getElementById('prod_tree');
    el.view = new alTreeView(g_treedata);
    el = document.getElementById('menu_tree');
    el.view = new alTreeView(g_treedata);

    var tree = document.getElementById('prod_complex_tree');
    tree.view = new alComplexView(g_complexdata);

    // Events
    // user
    document.getElementById('logout').addEventListener('click', user_logout, false);
    document.getElementById('user_login_login').addEventListener('click', user_login, false);
    document.getElementById('user_register').addEventListener('click', user_register, false);
    document.getElementById('user_change_change').addEventListener('click', user_change, false);

    // product:tree
    document.getElementById('prod_tree_addCategory').addEventListener('click', prod_tree_addCategory, false);
    document.getElementById('prod_tree_addProduct').addEventListener('click', prod_tree_addProduct, false);
    document.getElementById('prod_tree_delete').addEventListener('click', prod_tree_delete, false);
    document.getElementById('prod_tree').addEventListener('click', prod_tree_load, false);

    // product:edit
    document.getElementById('cat_edit_take').addEventListener('click', edit_take, false);
    document.getElementById('prod_edit_take').addEventListener('click', edit_take, false);
    document.getElementById('cat_edit_edit').addEventListener('click', prod_cat_edit, false);
    document.getElementById('prod_edit_complex').addEventListener('command', prod_edit_complex, false);
    document.getElementById('prod_edit_edit').addEventListener('command', prod_edit_edit, false);

    // prod:unit
    document.getElementById('prod_unit_tree').addEventListener('click', prod_unit_selected, false);
    document.getElementById('prod_unit_add').addEventListener('click', prod_unit_add, false);
    document.getElementById('prod_unit_delete').addEventListener('click', prod_unit_delete, false);

    // prod:complex
    document.getElementById('prod_complex_tree').addEventListener('click', prod_complex_changed, false);
    document.getElementById('prod_tree').addEventListener('dblclick', prod_tree_dblclick, false);
    document.getElementById('prod_complex_edit').addEventListener('click', prod_complex_edit, false);
    document.getElementById('prod_complex_delete').addEventListener('click', prod_complex_delete, false);

    // menu
    document.getElementById('menu_date_year').addEventListener('command', menuDateChanged, false);
    document.getElementById('menu_date_month').addEventListener('command', menuDateChanged, false);
    document.getElementById('menu_date_day').addEventListener('command', menuDateChanged, false);
    document.getElementById('menu_date_time').addEventListener('command', menuDateChanged, false);

    document.getElementById('menu_user_tree').addEventListener('click', menu_user_changed, false);
    document.getElementById('menu_tree').addEventListener('dblclick', menu_tree_dblclick, false);
    document.getElementById('menu_user_edit').addEventListener('click', menu_user_edit, false);
    document.getElementById('menu_user_delete').addEventListener('click', menu_user_delete, false);

    // report
    document.getElementById('report_date_year').addEventListener('command', reportDateChanged, false);
    document.getElementById('report_date_month').addEventListener('command', reportDateChanged, false);
    document.getElementById('report_date_day').addEventListener('command', reportDateChanged, false);
    document.getElementById('report_generate').addEventListener('command', generateReport, false);

    // admin
    document.getElementById('user_management_add').addEventListener('click', user_management_add, false);
    document.getElementById('user_management_change').addEventListener('click', user_management_change, false);
    document.getElementById('user_management_delete').addEventListener('click', user_management_delete, false);
    document.getElementById('user_management_list').addEventListener('click', user_management_list, false);
}
