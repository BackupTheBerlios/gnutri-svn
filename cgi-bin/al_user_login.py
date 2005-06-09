# -*- coding: utf-8 -*-

def run(args, dbparams):
    name = args['name'].lower()
    password = args['password']

    import MySQLdb
    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["db"], passwd=dbparams["passwd"])
    c=db.cursor()

    c.execute("SELECT id, admin, business FROM users WHERE name=%s and password=%s", (name, password))
    res = c.fetchone()

    data = {}
    if res != None and len(res) != 0:
        data['message'] = 'Sėkmingai prisijungėte'
        data['action'] = 'pass'

        if res[1] == 1:
            data['admin'] = 'true'
        else:
            data['admin'] = 'false'

        if res[2] == 1:
            data['business'] = 'true'
        else:
            data['business'] = 'false'

        c.execute("SELECT MAX(time) FROM health WHERE uid=%s", (res[0],))
        time = c.fetchone()
        if time != None and len(time) != 0:
            c.execute("SELECT weight, height, work FROM health WHERE uid=%s and time=%s ", (res[0], time[0]))
            res = c.fetchone()
            if res != None and len(res) != 0:
                data['weight'] = str(res[0])
                data['height'] = str(res[1])
                data['work'] = str(res[2])
            else:
                data['weight'] = '0'
                data['height'] = '0'
                data['work'] = '0'
        else:
            data['weight'] = '0'
            data['height'] = '0'
    else:
        data['message'] = 'Toks vartotojas neegzistuoja arba neteisingas slaptažodis'
        data['action'] = 'block'

    c.close()
    return data
