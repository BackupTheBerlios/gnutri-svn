# -*- coding: utf-8 -*-

def run(args, dbparams):
    parent = int(args['parent'])

    import MySQLdb
    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["user"], passwd=dbparams["passwd"])
    db.autocommit(False)
    c=db.cursor()

    from au_user import getUserId, haveRight

    data = {}
    id = getUserId(c, args['user'], args['password'])
    if id == -1:
        data['id'] == '0'
        c.close()
        return data

    data['id'] = '0'
    if haveRight(c, id, parent):
        c.execute("INSERT INTO category(pid, aid, oid, mod_servant, mod_others) VALUES(%s, %s, %s, 1, 1)",
                  (parent, id, id))
        data['id'] = str(db.insert_id())
    db.commit()
    c.close()
    return data
