# -*- coding: utf-8 -*-

def run(args, dbparams):
    import MySQLdb
    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["db"], passwd=dbparams["passwd"])
    db.autocommit(False)
    c=db.cursor()

    data = {}
    from au_user import getUserId
    user_id = getUserId(c, args['user'], args['password'])
    if user_id == -1:
        data['pass'] = 'false'
        c.close()
        return data

    c.execute('SELECT id, pid FROM users WHERE name=%s',
              (args['child'].lower(),))
    res = c.fetchone()
    if res != None and len(res) > 0 and res[1] == user_id:
        admin = 0
        if args['admin'] == 'true':
            admin = 1
        business = 0
        if args['business'] == 'true':
            business = 1

        c.execute('UPDATE users SET admin=%s, business=%s WHERE id=%s',
                  (admin, business, res[0]))
        db.commit()
        data['pass'] = 'true'
    else:
        data['pass'] = 'false'

    c.close()
    return data
