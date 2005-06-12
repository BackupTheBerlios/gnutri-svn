# -*- coding: utf-8 -*-

def run(args, dbparams):

    from au_user import getUserId, haveProductRight
    import MySQLdb
    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["user"], passwd=dbparams["passwd"])
    db.autocommit(False)
    c=db.cursor()

    user = getUserId(c, args['user'], args['password'])
    if user == -1:
        data['pass'] == 'false'
        c.close()
        return data


    if args['unit'] != 'gramai' and haveProductRight(c, user, int(args['id'])):
        c.execute("SELECT id FROM unitname WHERE name=%s", (args['unit'],))
        unid = c.fetchone()[0]

        c.execute("SELECT id FROM unit WHERE prid=%s AND unid=%s", (int(args['id']), unid))
        uid = c.fetchone()[0]

        c.execute("SELECT count(*) FROM complex WHERE uid=%s", (uid,))
        count = c.fetchone()[0]
        if count == 0:
            c.execute("DELETE FROM unit WHERE id=%s", (uid,))
            data = {'pass': 'true'}
            db.commit()
        else:
            data = {'pass': 'false'}
    else:
        data = {'pass': 'false'}

    c.close()
    return data
