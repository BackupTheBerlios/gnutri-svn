# -*- coding: utf-8 -*-

def testCircularDep(c, id, prid):
    c.execute('SELECT uid FROM complex WHERE prid=%s', (prid,))
    units = c.fetchall()
    for unit in units:
        c.execute('SELECT prid FROM unit WHERE id=%s', (unit[0],))
        product = c.fetchone()
        if product[0] == id:
            return False
        else:
            if not testCircularDep(c, id, product[0]):
                return False
    return True

def noCircularDep(c, id, prid):
    if id == prid:
        return False
    else:
        return testCircularDep(c, id, prid)

def run(args, dbparams):
    from au_user import getUserId, haveProductRight
    import MySQLdb
    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["user"], passwd=dbparams["passwd"])
    db.autocommit(False)
    c=db.cursor()

    user = getUserId(c, args['user'], args['password'])
    data = {}
    if user == -1:
        data['pass'] = 'false'
        c.close()
        return data

    if haveProductRight(c, user, int(args['id'])) and noCircularDep(c, int(args['id']), int(args['prid'])):
        c.execute("SELECT count(*) FROM unit u, complex c "
                  "WHERE c.prid = %s AND c.uid = u.id AND u.prid = %s",
                  (int(args['id']), int(args['prid'])))
        count = c.fetchone()[0];

        if count == 0:
            data['pass'] = 'true'
            data['list'] = []

            c.execute("SELECT un.name, u.id FROM unit u, unitname un WHERE u.prid = %s AND u.unid = un.id",
                    (int(args['prid']),))
            units = c.fetchall()
            for u in units:
                data['list'].append({'name': u[0]})

            c.execute("INSERT INTO complex(prid, uid, amount) VALUES (%s, %s, %s)",
                      (int(args['id']), units[0][1], '0.0'))
            from au_calcBAR import calcBAR, updateComplex
            elem = calcBAR(c, int(args['id']))
            updateComplex(c, int(args['id']))
            db.commit()
            data['balt'] = elem[0]
            data['angl'] = elem[1]
            data['rieb'] = elem[2]
            data['total'] = elem[3]
        else:
            data['pass'] = 'false'
    else:
        data['pass'] = 'false'

    c.close()
    return data
