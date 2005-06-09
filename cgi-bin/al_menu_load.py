# -*- coding: utf-8 -*-

def run(args, dbparams):
    import MySQLdb
    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["db"], passwd=dbparams["passwd"])
    c=db.cursor()

    data = {}
    from au_user import getUserId
    user = getUserId(c, args['user'], args['password'])
    if user == -1:
        data['pass'] = 'false'
        c.close()
        return data

    c.execute("SELECT p.id, p.name, un.name, m.amount "
              "FROM product p, menu m, unit u, unitname un "
              "WHERE m.uid = u.id AND u.unid = un.id AND u.prid = p.id AND "
              "m.user=%s AND m.time=%s",
              (user, int(args['time'])))
    res = c.fetchall()

    data['list'] = []
    for item in res:
        unit = {'id': str(item[0]),
                'product': item[1],
                'unit': item[2],
                'amount': str(item[3]),
                'units': []}

        c.execute("SELECT un.name FROM unit u, unitname un WHERE u.prid = %s AND u.unid = un.id",
                (item[0],))
        units = c.fetchall()
        for u in units:
            unit['units'].append({'name': u[0]})

        data['list'].append(unit)
    data['pass'] = 'true'
    c.close()
    return data
