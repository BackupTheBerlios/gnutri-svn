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
    args['name'] = args['name'].lower()

    import MySQLdb
    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["db"], passwd=dbparams["passwd"])
    db.autocommit(False)
    c=db.cursor()

    c.execute ("SELECT count(*) FROM users WHERE name=%s", (args['name'],))
    count = c.fetchone()[0]

    data = {}
    if count == 0 and len(args['name']) != 0:
        c.execute("INSERT INTO users(name, password, admin, business, pid) VALUES (%s, %s, 0, 0, 0)",
                (args['name'], args['password']))
        c.execute("INSERT INTO health(uid, time, height, weight, work) VALUES (%s, %s, %s, %s, %s)",
                (db.insert_id(), int(args['time']), height, weight,
                 int(args['work'])))
        db.commit()
        data['message'] = 'Jūsų vartotojas sukurtas ir jūs esate prijungti prie sistemos'
        data['action'] = 'pass'
        db.commit()
    else:
        data['message'] = 'Toks vartotojas egzistuoja'
        data['action'] = 'block'
    c.close()

    return data
