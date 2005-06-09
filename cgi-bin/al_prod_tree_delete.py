# -*- coding: utf-8 -*-

def canBeDeleted(c, id):
    c.execute('SELECT id FROM unit WHERE prid=%s',
              (id,))
    units = c.fetchall()
    for unit in units:
        c.execute('SELECT count(*) FROM complex WHERE uid=%s',
                  (unit[0],))
        count = c.fetchone()[0]
        if count > 0:
            return False
        c.execute('SELECT count(*) FROM menu WHERE uid=%s',
                  (unit[0],))
        count = c.fetchone()[0]
        if count > 0:
            return False
    return True

def delete(c, id, container, delete_list):
    if container:
        c.execute("SELECT id FROM category WHERE pid=%s", (id,))
        res = c.fetchall()
        for item in res:
            if not delete(c, item[0], True, delete_list):
                return False

        c.execute("SELECT id FROM product WHERE pid=%s", (id,))
        res = c.fetchall()
        for item in res:
            if not delete(c, item[0], False, delete_list):
                return False

        delete_list.append({'id': id, 'cat': True})
    else:
        if canBeDeleted(c, id):
            delete_list.append({'id': id, 'cat': False})
        else:
            return False
    return True

def run(args, dbparams):

    import MySQLdb
    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["db"], passwd=dbparams["passwd"])
    db.autocommit(False)
    c=db.cursor()

    from au_user import getUserId, haveRight, haveProductRight, getCategoryParent, getProductParent

    parent = 0
    if args['container'] == 'true':
        container = True
        parent = getCategoryParent(c, int(args['id']))
    else:
        container = False
        parent = getProductParent(c, int(args['id']))

    if parent == 0:
        data = {'pass': 'false'}
        c.close()
        return data

    id = getUserId(c, args['user'], args['password'])
    if id == -1:
        data = {'pass': 'false'}
        c.close()
        return data

    if args['container'] == 'true':
        candelete = haveRight(c, id, int(args['id']))
    else:
        candelete = haveProductRight(c, id, int(args['id']))

    if haveRight(c, id, parent) and candelete:
        delete_list = []
        if delete(c, int(args['id']), container, delete_list):
            for item in delete_list:
                if item['cat']:
                    c.execute("DELETE FROM category WHERE id=%s", (item['id'],))
                else:
                    c.execute("DELETE FROM product WHERE id=%s", (item['id'],))
                    c.execute('DELETE FROM unit WHERE prid=%s', (item['id'],))
            data = {'pass': 'true'}
            db.commit()
        else:
            data = {'pass': 'false'}

    c.close()
    return data
