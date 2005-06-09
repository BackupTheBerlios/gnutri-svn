# -*- coding: utf-8 -*-

def run(args, dbparams):
    id = int(args['id'])

    import MySQLdb
    from au_user import getUserId, haveRight, haveProductRight, isUserParent, booltostr, \
            getCategoryParent, getProductParent, isCategoryOwner, isProductOwner

    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["db"], passwd=dbparams["passwd"])
    c=db.cursor()

    user = getUserId(c, args['name'], args['password'])

    if args['container'] == 'true':
        c.execute("SELECT name, oid, mod_servant, mod_others FROM category WHERE id=%s", (id,))
        res = c.fetchone()
        data = {'name': res[0],
                'mod_servant': booltostr(res[2]),
                'mod_others': booltostr(res[3])}

        data['owner'] = 'false'
        data['parmod'] = 'false'
        data['modify'] = 'false'
        data['cantake'] = 'false'

        if user != -1:
            if isCategoryOwner(c, user, id):
                data['owner'] = 'true'
            if haveRight(c, user, id):
                data['modify'] = 'true'
            parent = getCategoryParent(c, id)
            if parent != 0 and haveRight(c, user, parent) and data['modify'] == 'true':
                data['parmod'] = 'true'
            if isUserParent(c, res[1], user):
                data['cantake'] = 'true'
        else:
            data['modify'] = 'false'
            data['parmod'] = 'false'
    else:
        c.execute("SELECT name, complex, secret, balt, rieb, angl, descr, linkdescr, "
                  "link, mod_servant, mod_others, oid "
                  "FROM product WHERE id=%s", (id,))
        res = c.fetchone()
        oid = res[11]

        data = {'name': res[0],
                'complex': booltostr(res[1]),
                'secret': booltostr(res[2]),
                'balt': str(res[3]),
                'rieb': str(res[4]),
                'angl': str(res[5]),
                'descr': res[6],
                'linkdescr': res[7],
                'link': res[8],
                'mod_servant': booltostr(res[9]),
                'mod_others': booltostr(res[10]),
                'unit_list': []}

        c.execute("SELECT un.name, u.weight FROM unit u, unitname un WHERE u.prid = %s AND u.unid = un.id",
                  (id,))
        res = c.fetchall()
        for item in res:
            unit = {'unit': item[0], 'weight': str(item[1])}
            data['unit_list'].append(unit)

        data['modify'] = 'false'
        data['owner'] = 'false'
        data['parmod'] = 'false'
        data['cantake'] = 'false'

        if user != -1:
            if haveProductRight(c, user, id):
                data['modify'] = 'true'

            if isProductOwner(c, user, id):
                data['owner'] = 'true'

            parent = getProductParent(c, id)
            if parent != 0 and haveRight(c, user, parent) and data['modify'] == 'true':
                data['parmod'] = 'true'

            if isUserParent(c, oid, user):
                data['cantake'] = 'true'
        else:
            data['modify'] = 'false'
            data['parmod'] = 'false'


    c.close()
    return data
