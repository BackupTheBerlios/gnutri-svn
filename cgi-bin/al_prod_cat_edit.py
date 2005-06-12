# -*- coding: utf-8 -*-

def run(args, dbparams):

    import MySQLdb
    from au_user import getUserId, haveRight, isCategoryOwner
    db=MySQLdb.connect(host=dbparams["host"], db=dbparams["db"], user=dbparams["user"], passwd=dbparams["passwd"])
    db.autocommit(False)
    c=db.cursor()

    user = getUserId(c, args['user'], args['password'])
    if user == -1:
        data = {'pass': 'false'}
        c.close()
        return data

    if haveRight(c, user, int(args['id'])):
        c.execute("UPDATE category SET name=%s WHERE id=%s",
                  (args['name'], int(args['id'])))
    else:
        data = {'pass': 'false'}
        c.close()
        return data

    if isCategoryOwner(c, user, int(args['id'])):
        mod_servant = 0
        if args['mod_servant'] == 'true':
            mod_servant = 1
        mod_others = 0
        if args['mod_others'] == 'true':
            mod_others = 1
        c.execute("UPDATE category SET mod_servant=%s, mod_others=%s WHERE id=%s",
                  (mod_servant, mod_others, int(args['id'])))
    db.commit()

    data = {'pass': 'true'}

    c.close()
    return data
