def run(args, dbparams):
    parent = int(args['parent'])
    import MySQLdb
    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["user"], passwd=dbparams["passwd"])
    c=db.cursor()

    from au_user import getUserId, haveRight, haveProductRight

    user = -1
    if args['user'] != '':
        user = getUserId(c, args['user'], args['password'])
        if user == -1:
            data = {'pass': 'false'}
            c.close()
            return data

    c.execute("SELECT id, name FROM category WHERE pid=%s AND "
               "id != 1 ORDER BY name", (parent,))
    res = c.fetchall()

    data = {}
    data['list'] = []
    for item in res:
        name = str(item[1])
        if len(name) == 0:
            name = str(item[0])
        element = {'id': str(item[0]), 'name': name, 'container': 'true'}
        if user != -1 and haveRight(c, user, element['id']):
            element['modify'] = 'true'
        else:
            element['modify'] = 'false'
        data['list'].append(element)

    c.execute("SELECT id, name, rieb, angl, balt FROM product WHERE PID=%s ORDER BY name", (parent,))
    res = c.fetchall()
    for item in res:
        name = str(item[1])
        if len(name) == 0:
            name = str(item[0])
        element = {'id': str(item[0]),
            'name': name,
            'rieb': str(item[2]),
            'angl': str(item[3]),
            'balt': str(item[4])}
        if user != -1 and haveProductRight(c, user, element['id']):
            element['modify'] = 'true'
        else:
            element['modify'] = 'false'
        data['list'].append(element)

    data['pass'] = 'true'
    c.close()
    return data

