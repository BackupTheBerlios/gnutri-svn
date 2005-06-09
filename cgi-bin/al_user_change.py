# -*- coding: utf-8 -*-

def run(args, dbparams):
    try:
        weight = float(args['weight'])
    except ValueError:
        weight = 0.0
    try:
        height = float(args['height'])
    except ValueError:
        height = 0.0
    args['old_name'] = args['old_name'].lower()
    args['new_name'] = args['new_name'].lower()
    import MySQLdb
    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["db"], passwd=dbparams["passwd"])
    db.autocommit(False)
    c=db.cursor()

    c.execute("SELECT id FROM users WHERE name=%s AND password=%s",
            (args['old_name'], args['old_password']))
    res = c.fetchone()

    data = {}
    if res == None:
        data['message'] = 'Įvyko klaida!'
        data['action'] = 'block'
    else:
        if args['old_name'] != args['new_name']:
            c.execute("SELECT count(*) FROM users WHERE name=%s", (args['new_name']))
            count = c.fetchone()
            if count > 0:
                data['message'] = 'Toks vartotojas egzistuoja!'
                data['action'] = 'block'
                return data

            c.execute("UPDATE users SET name=%s WHERE id=%s",
                    (args['new_name'], res[0]))

        if args['old_password'] != args['new_password']:
            c.execute("UPDATE users SET password=%s WHERE id=%s",
                    (args['new_password'], res[0]))

        c.execute("INSERT INTO health(uid, time, height, weight, work) VALUES (%s, %s, %s, %s, %s)",
                (res[0], int(args['time']), height, weight, int(args['work'])))

        data['message'] = 'Informacija sėkmingai pakeista'
        data['action'] = 'pass'
        db.commit()
    db.commit()
    c.close()
    return data
