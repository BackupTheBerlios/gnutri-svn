# -*- coding: utf-8 -*-

def run(args, dbparams):
    import MySQLdb
    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["db"], passwd=dbparams["passwd"])
    c=db.cursor()

    data = {}
    from au_user import getUserId
    user_id = getUserId(c, args['user'], args['password'])
    if user_id == -1:
        data['pass'] = 'false'
        c.close()
        return data

    c.execute('SELECT name, admin, business FROM users WHERE pid=%s',
              (user_id,))
    res = c.fetchall()

    from au_user import booltostr
    data['users'] = []
    for item in res:
        user = {'name': item[0],
                'admin': booltostr(item[1]),
                'business': booltostr(item[2])}

        data['users'].append(user)
    data['pass'] = 'true'
    c.close()
    return data
