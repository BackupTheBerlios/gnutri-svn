function prod_tree_addCategory()
{
    var tree = document.getElementById("prod_tree");
    if (tree.currentIndex > -1)
        tree.view.performActionOnRow('addCategory', tree.currentIndex);
}

/*
    XXX: add next product if product selected
    XXX: ask for name
*/
function prod_tree_addProduct()
{
    var tree = document.getElementById("prod_tree");
    if (tree.currentIndex > -1)
        tree.view.performActionOnRow('addProduct', tree.currentIndex);
}

function prod_tree_delete()
{
    var tree = document.getElementById("prod_tree");
    if (tree.currentIndex > -1)
        tree.view.performActionOnRow('removeRow', tree.currentIndex);
}

function prod_tree_load()
{
    var tree = document.getElementById("prod_tree");
    if ((tree.currentIndex > -1) && document.getElementById('prod_tabs').selectedIndex != 3)
    {
        var element = g_treedata.getRowElement(tree.currentIndex);
        var data = {command: 'prod_tree_load',
                    id: element['id'],
                    container: element['container'] ? 'true' : 'false',
                    name: g_user_name,
                    password: g_user_password}
        var result = communicate(data);
        element['modify'] = result['modify'] == 'true' ? true : false;
        element['parmod'] = result['parmod'] == 'true' ? true : false;

        if (!('container' in element) || ('container' in element && !element['container']))
        {
            al_hide('prod_cat');
            al_show('prod_edit');
            al_show('prod_unit');
            document.getElementById('prod_tabs').selectedIndex = 1;

            g_selected_product = element['id'];
            document.getElementById('prod_edit_complex').disabled = false;
            al_setCheckState('prod_edit_complex', result['complex']);
            al_setCheckState('prod_edit_secret', result['secret']);
            al_setCheckState('prod_rights_servant', result['mod_servant']);
            al_setCheckState('prod_rights_others', result['mod_others']);
            if (result['complex'] == 'true')
                al_show('prod_complex');
            else
                al_hide('prod_complex');


            document.getElementById('prod_edit_rieb').disabled = false;
            document.getElementById('prod_edit_angl').disabled = false;
            document.getElementById('prod_edit_balt').disabled = false;

            al_setValue('prod_edit_name', result['name']);
            al_setValue('prod_edit_rieb', result['rieb']);
            al_setValue('prod_edit_balt', result['balt']);
            al_setValue('prod_edit_angl', result['angl']);
            al_setValue('prod_edit_descr', result['descr']);
            al_setValue('prod_edit_linkdescr', result['linkdescr']);
            al_setValue('prod_edit_link', result['link']);
            if (result['name'] != '')
                element['prod_tree_name'] = result['name'];
            element['prod_tree_rieb'] = result['rieb'];
            element['prod_tree_angl'] = result['angl'];
            element['prod_tree_balt'] = result['balt'];

            UnitTreeSetItems(result['unit_list']);
            cleanComplexList();
            if (result['complex'] == 'true' &&
                !(result['secret'] == 'true' &&
                  (result['owner'] == 'false' || !g_business)))
            {
                ComplexLoadItems(g_selected_product);
                if (g_complexdata.data.length > 0)
                    document.getElementById('prod_edit_complex').disabled = true;
                document.getElementById('prod_edit_rieb').disabled = true;
                document.getElementById('prod_edit_angl').disabled = true;
                document.getElementById('prod_edit_balt').disabled = true;
            }
            if (result['secret'] == 'true' && result['owner'] == 'false')
            {
                al_hide('prod_complex');
                al_hide('prod_edit_complex');
            }
            else
                al_show('prod_edit_complex');

            // display commercial info
            var info = document.getElementById('prod_edit_information');
            info.setAttribute('href', result['link']);
            info.firstChild.nodeValue = result['linkdescr'];
        }
        else
        {
            al_show('prod_cat');
            al_hide('prod_edit');
            al_hide('prod_unit');
            al_hide('prod_complex');
            al_setCheckState('cat_rights_servant', result['mod_servant']);
            al_setCheckState('cat_rights_others', result['mod_others']);
            document.getElementById('prod_tabs').selectedIndex = 0;
            al_setValue('prod_cat_name', result['name']);
            if (result['name'] != '')
                element['prod_tree_name'] = result['name'];
        }

        // modify rights
        if (element['modify'])
        {
            al_show('cat_edit_edit');
            al_show('prod_edit_edit');
            al_show('prod_unit_add');
            al_show('prod_unit_delete');
            al_show('prod_complex_edit');
            al_show('prod_complex_delete');
        }
        else
        {
            al_hide('cat_edit_edit');
            al_hide('prod_edit_edit');
            al_hide('prod_unit_add');
            al_hide('prod_unit_delete');
            al_hide('prod_complex_edit');
            al_hide('prod_complex_delete');
        }

        // add/delete rights
        if (element['modify'] && element['container'])
        {
            al_show('prod_tree_addCategory');
            al_show('prod_tree_addProduct');
        }
        else
        {
            al_hide('prod_tree_addCategory');
            al_hide('prod_tree_addProduct');
        }

        if (result['cantake'] == 'true')
        {
            al_show('cat_edit_take');
            al_show('prod_edit_take');
        }
        else
        {
            al_hide('cat_edit_take');
            al_hide('prod_edit_take');
        }

        // owner stuff
        if (result['owner'] == 'true')
        {
            al_show('cat_rights_servant');
            al_show('cat_rights_others');
            al_show('prod_rights_servant');
            al_show('prod_rights_others');
        }
        else
        {
            al_hide('cat_rights_servant');
            al_hide('cat_rights_others');
            al_hide('prod_rights_servant');
            al_hide('prod_rights_others');
        }

        // business stuff
        if (result['owner'] == 'true' && g_business)
        {
            al_show('prod_edit_secret');
            al_show('prod_edit_r_linkdescr');
            al_show('prod_edit_r_link');
        }
        else
        {
            al_hide('prod_edit_secret');
            al_hide('prod_edit_r_linkdescr');
            al_hide('prod_edit_r_link');
        }

        if (element['parmod'])
            al_show('prod_tree_delete');
        else
            al_hide('prod_tree_delete');
    }
}
