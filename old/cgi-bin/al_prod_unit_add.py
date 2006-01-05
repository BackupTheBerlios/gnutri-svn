# -*- coding: utf-8 -*-

def run(args, dbparams):
    try:
        weight = float(args['weight'])
    except ValueError:
        weight = 0.0
    from au_user import getUserId, haveProductRight
    import MySQLdb
    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["user"], passwd=dbparams["passwd"])
    db.autocommit(False)
    c=db.cursor()

    data = {}
    user = getUserId(c, args['user'], args['password'])
    if user == -1 or len(args['unit']) == 0:
        data['pass'] == 'false'
        c.close()
        return data

    if args['unit'] != 'gramai' and haveProductRight(c, user, int(args['id'])):
        c.execute("SELECT id FROM unitname WHERE name=%s", (args['unit'],))
        res = c.fetchall()
        unid = 0
        if (len(res) == 0):
            c.execute("INSERT INTO unitname(name) VALUES (%s)", (args['unit'],))
            unid = db.insert_id()
        else:
            unid = res[0][0]

        c.execute("SELECT id FROM unit WHERE prid=%s AND unid=%s",
                  (int(args['id']), unid))
        uid = c.fetchone()

        data = {'pass': 'true'}

        if uid != None and len(uid) > 0:
            c.execute("UPDATE unit SET weight=%s WHERE id=%s",
                      (weight, uid[0]))
            data['type'] = 'updated'
        else:
            c.execute("INSERT INTO unit(prid, unid, weight) VALUES (%s, %s, %s)",
                      (int(args['id']), unid, weight))
            data['type'] = 'added'
        db.commit()
    else:
        data = {'pass': 'false'}

    c.close()
    return data
