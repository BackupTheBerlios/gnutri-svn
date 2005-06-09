# -*- coding: utf-8 -*-

def run(args, dbparams):

    import MySQLdb
    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["db"], passwd=dbparams["passwd"])
    db.autocommit(False)
    c=db.cursor()

    from au_user import getUserId
    user = getUserId(c, args['user'], args['password'])
    if user == -1:
        data = {'pass': 'true'}
        c.close()
        return data

    c.execute("SELECT id FROM unitname WHERE name=%s", (args['unit'],))
    res = c.fetchone()
    unid = res[0]
    c.execute("SELECT id FROM unit WHERE unid=%s AND prid=%s", (unid, int(args['prid'])))
    res = c.fetchone()
    uid = res[0]

    c.execute("DELETE FROM menu WHERE uid=%s AND "
              "user=%s AND time=%s",
             (uid, user, int(args['time'])))
    db.commit()

    data = {'pass': 'true'}

    c.close()
    return data
