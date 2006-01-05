# -*- coding: utf-8 -*-

def run(args, dbparams):
    import MySQLdb
    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["user"], passwd=dbparams["passwd"])
    db.autocommit(False)
    c=db.cursor()

    data = {}
    from au_user import getUserId
    user = getUserId(c, args['user'], args['password'])
    if user == -1:
        data['pass'] = 'false'
        c.close()
        return data

    c.execute("SELECT count(*) FROM unit u, menu m "
              "WHERE m.uid = u.id AND u.prid = %s AND "
              "m.user=%s AND m.time=%s",
              (int(args['prid']), user, int(args['time'])))
    count = c.fetchone()[0];

    if count == 0:
        data['pass'] = 'true'
        data['list'] = []

        c.execute("SELECT un.name, u.id FROM unit u, unitname un WHERE u.prid = %s AND u.unid = un.id",
                (int(args['prid']),))
        units = c.fetchall()
        for u in units:
            data['list'].append({'name': u[0]})

        c.execute("INSERT INTO menu(user, time, uid, amount) VALUES (%s, %s, %s, %s)",
                (user, int(args['time']), units[0][1], 0.0))
        db.commit()
    else:
        data['pass'] = 'false'

    c.close()
    return data
