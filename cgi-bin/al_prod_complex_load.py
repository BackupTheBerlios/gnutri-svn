# -*- coding: utf-8 -*-

def run(args, dbparams):
    id = int(args['id'])

    import MySQLdb
    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["db"], passwd=dbparams["passwd"])
    c=db.cursor()

    c.execute("SELECT p.id, p.name, un.name, c.amount, u.weight "
              "FROM product p, complex c, unit u, unitname un "
              "WHERE c.prid=%s AND c.uid = u.id AND u.unid = un.id AND u.prid = p.id",
              (id,))
    res = c.fetchall()

    data = {}
    data['list'] = []
    total = 0.0
    for item in res:
        total += item[3]*item[4];
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
    data['total'] = str(total)
    c.close()
    return data
