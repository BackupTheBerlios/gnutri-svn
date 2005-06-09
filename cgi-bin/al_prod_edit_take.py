# -*- coding: utf-8 -*-

def run(args, dbparams):

    import MySQLdb
    from au_user import getUserId, isUserParent
    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["db"], passwd=dbparams["passwd"])
    db.autocommit(False)
    c=db.cursor()

    user = getUserId(c, args['user'], args['password'])
    if user == -1:
        data = {'pass': 'false'}
        c.close()
        return data

    if args['category'] == 'true':
        c.execute('SELECT oid FROM category WHERE id=%s',
                  (int(args['id']),))
        oid = c.fetchone()[0]
        if isUserParent(c, oid, user):
            c.execute('UPDATE category SET oid=%s WHERE id=%s',
                      (user, int(args['id'])))
            data = {'pass': 'true'}
        else:
            data = {'pass': 'false'}
    else:
        c.execute('SELECT oid FROM product WHERE id=%s',
                  (int(args['id']),))
        oid = c.fetchone()[0]
        if isUserParent(c, oid, user):
            c.execute('UPDATE product SET oid=%s WHERE id=%s',
                      (user, int(args['id'])))
            data = {'pass': 'true'}
        else:
            data = {'pass': 'false'}

    db.commit()

    c.close()
    return data
