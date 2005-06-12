# -*- coding: utf-8 -*-

def run(args, dbparams):
    try:
        balt = float(args['balt'])
    except ValueError:
        balt = 0.0
    try:
        rieb = float(args['rieb'])
    except ValueError:
        rieb = 0.0
    try:
        angl = float(args['angl'])
    except ValueError:
        angl = 0.0

    import MySQLdb
    from au_user import getUserId, haveProductRight, isProductOwner
    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["user"], passwd=dbparams["passwd"])
    db.autocommit(False)
    c=db.cursor()

    user = getUserId(c, args['user'], args['password'])
    if user == -1:
        data = {'pass': 'false'}
        c.close()
        return data

    if haveProductRight(c, user, int(args['id'])):
        complex = 0
        if args['complex'] == 'true':
            complex = 1

        secret = 0
        if args['secret'] == 'true':
            secret = 1

        c.execute("UPDATE product SET name=%s, balt=%s, rieb=%s, angl=%s, complex=%s, descr=%s, "
                  "secret=%s, linkdescr=%s, link=%s "
                  "WHERE id=%s",
                  (args['name'], balt, rieb, angl,
                   complex, args['descr'],
                   secret, args['linkdescr'], args['link'],
                   int(args['id'])))
        from au_calcBAR import updateComplex
        updateComplex(c, int(args['id']))
    else:
        data = {'pass': 'false'}
        c.close()
        return data

    if isProductOwner(c, user, int(args['id'])):
        mod_servant = 0
        if args['mod_servant'] == 'true':
            mod_servant = 1
        mod_others = 0
        if args['mod_others'] == 'true':
            mod_others = 1
        c.execute("UPDATE product SET mod_servant=%s, mod_others=%s WHERE id=%s",
                  (mod_servant, mod_others, int(args['id'])))

    db.commit()
    data = {'pass': 'true'}

    c.close()
    return data
