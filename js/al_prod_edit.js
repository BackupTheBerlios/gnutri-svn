function prod_edit_complex()
{
    var check = document.getElementById('prod_edit_complex');
    if (check.getAttribute('checked') == 'true')
    {
        al_show('prod_complex');
        document.getElementById('prod_edit_rieb').disabled = true;
        document.getElementById('prod_edit_angl').disabled = true;
        document.getElementById('prod_edit_balt').disabled = true;
    }
    else
    {
        al_hide('prod_complex');
        document.getElementById('prod_edit_rieb').disabled = false;
        document.getElementById('prod_edit_angl').disabled = false;
        document.getElementById('prod_edit_balt').disabled = false;
    }
}

function prod_cat_edit()
{
    var tree = document.getElementById("prod_tree");
    var element = g_treedata.getRowElement(tree.currentIndex);
    if (('container' in element) && element.container && element.id != 1)
    {
        var data = {command: 'prod_cat_edit',
            id: element['id'],
            name: al_getValue('prod_cat_name'),
            mod_servant: document.getElementById('cat_rights_servant').getAttribute('checked'),
            mod_others: document.getElementById('cat_rights_others').getAttribute('checked'),
            user: g_user_name,
            password: g_user_password};
        var result = communicate(data);
        if (result['pass'] == 'true')
        {
            element['prod_tree_name'] = data['name'];
        }
    }
}

function prod_edit_edit()
{
    var data = {command: 'prod_edit',
        id: g_selected_product,
        complex: document.getElementById('prod_edit_complex').getAttribute('checked'),
        secret: document.getElementById('prod_edit_secret').getAttribute('checked'),
        mod_servant: document.getElementById('prod_rights_servant').getAttribute('checked'),
        mod_others: document.getElementById('prod_rights_others').getAttribute('checked'),
        name: al_getValue('prod_edit_name'),
        rieb: al_getValue('prod_edit_rieb'),
        balt: al_getValue('prod_edit_balt'),
        angl: al_getValue('prod_edit_angl'),
        descr: al_getValue('prod_edit_descr'),
        linkdescr: al_getValue('prod_edit_linkdescr'),
        link: al_getValue('prod_edit_link'),
        user: g_user_name,
        password: g_user_password};
    var result = communicate(data);

    if (result['pass'] == 'true')
    {
        var tree = document.getElementById("prod_tree");
        var element = g_treedata.getRowElement(tree.currentIndex);
        element['prod_tree_name'] = al_getValue('prod_edit_name');
        element['prod_tree_rieb'] = al_getValue('prod_edit_rieb');
        element['prod_tree_balt'] = al_getValue('prod_edit_balt');
        element['prod_tree_angl'] = al_getValue('prod_edit_angl');

        // display commercial info
        var info = document.getElementById('prod_edit_information');
        info.setAttribute('href', data['link']);
        info.firstChild.nodeValue = data['linkdescr'];
    }
}

function edit_take()
{
    var tree = document.getElementById("prod_tree");
    var element = g_treedata.getRowElement(tree.currentIndex);
    if (('container' in element) && element.container && element.id != 1)
    {
        var data = {command: 'prod_edit_take',
            id: element['id'],
            category: 'true',
            user: g_user_name,
            password: g_user_password};
        var result = communicate(data);
        if (result['pass'] == 'true')
            prod_tree_load();
    }
    else if (!('container' in element) || !element.container)
    {
        var data = {command: 'prod_edit_take',
            id: element['id'],
            category: 'false',
            user: g_user_name,
            password: g_user_password};
        var result = communicate(data);
        if (result['pass'] == 'true')
            prod_tree_load();
    }
}


