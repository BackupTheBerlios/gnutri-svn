# -*- coding: utf-8 -*-

def run(args, dbparams):
    from au_user import getUserId, haveProductRight
    import MySQLdb
    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["db"], passwd=dbparams["passwd"])
    db.autocommit(False)
    c=db.cursor()

    user = getUserId(c, args['user'], args['password'])
    if user == -1:
        data = {'pass': 'false'}
        c.close()
        return data

    if haveProductRight(c, user, int(args['id'])):
        c.execute("SELECT id FROM unitname WHERE name=%s", (args['unit'],))
        res = c.fetchone()
        unid = res[0]
        c.execute("SELECT id FROM unit WHERE unid=%s AND prid=%s", (unid, int(args['prid'])))
        res = c.fetchone()
        uid = res[0]

        c.execute("DELETE FROM complex WHERE prid=%s AND uid=%s", (int(args['id']), uid))
        data = {'pass': 'true'}

        from au_calcBAR import calcBAR, updateComplex
        elem = calcBAR(c, int(args['id']))
        updateComplex(c, int(args['id']))
        db.commit()
        data['balt'] = elem[0]
        data['angl'] = elem[1]
        data['rieb'] = elem[2]
        data['total'] = elem[3]
    else:
        data = {'pass': 'false'}

    c.close()
    return data
