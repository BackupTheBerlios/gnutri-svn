def booltostr(bool):
    if bool:
        return 'true'
    else:
        return 'false'

def getUserId(c, user, password):
    """ Gets user Id by username and password. """
    c.execute("SELECT id FROM users WHERE name=%s AND password=%s", (user.lower(), password))
    id = c.fetchone()
    if id == None or len(id) == 0:
        return -1
    return id[0]

def isUserParent(c, id, pid):
    """ Checks if user is related with other user in hierarchical relation. """
    sid = id
    while sid != 0 and sid != pid:
        c.execute("SELECT pid FROM users WHERE id=%s", (sid,))
        sid = c.fetchone()[0]
    if sid == pid:
        return True
    return False

def haveRight(c, user_id, category_id):
    c.execute("SELECT mod_others FROM category WHERE id=%s", (category_id,))
    mod = c.fetchone()

    if mod != None and len(mod) > 0 and mod[0] == 1:
        return True
    else:
        c.execute("SELECT oid, mod_servant FROM category WHERE id=%s", (category_id,))
        res = c.fetchone()
        if res != None and len(res) > 0:
            if res[1] == 1 and isUserParent(c, user_id, res[0]):
                return True
            elif isUserParent(c, res[0], user_id):
                return True
            else:
                return False
        else:
            return False

def haveProductRight(c, user_id, product_id):
    c.execute("SELECT mod_others FROM product WHERE id=%s", (product_id,))
    mod = c.fetchone()

    if mod != None and len(mod) > 0 and mod[0] == 1:
        return True
    else:
        c.execute("SELECT oid, mod_servant FROM product WHERE id=%s", (product_id,))
        res = c.fetchone()
        if res != None and len(res) > 0:
            if res[1] == 1 and isUserParent(c, user_id, res[0]):
                return True
            elif isUserParent(c, res[0], user_id):
                return True
            else:
                return False
        else:
            return False

def getCategoryParent(c, id):
    c.execute('SELECT pid FROM category WHERE id=%s', (id,))
    pid = c.fetchone()
    if pid == None or len(pid) == 0:
        return 0
    return pid[0]

def getProductParent(c, id):
    c.execute('SELECT pid FROM product WHERE id=%s', (id,))
    pid = c.fetchone()
    if pid == None or len(pid) == 0:
        return 0
    return pid[0]

def isCategoryOwner(c, user, id):
    c.execute('SELECT count(*) FROM category WHERE id=%s AND oid=%s',
              (id, user))
    count = c.fetchone()[0]
    if count == 0:
        return False
    else:
        return True

def isProductOwner(c, user, id):
    c.execute('SELECT count(*) FROM product WHERE id=%s AND oid=%s',
              (id, user))
    count = c.fetchone()[0]
    if count == 0:
        return False
    else:
        return True
