def calcBAR(c, id):
    c.execute('SELECT uid, amount FROM complex WHERE prid=%s',
              (id,))
    recipe = c.fetchall()
    total = 0.0
    balt = 0.0
    angl = 0.0
    rieb = 0.0
    for item in recipe:
        c.execute('SELECT prid, weight FROM unit WHERE id=%s',
                  (item[0],))
        unit = c.fetchone()
        c.execute('SELECT balt, angl, rieb FROM product WHERE id=%s',
                  (unit[0],))
        prod = c.fetchone()
        # weight * amount
        weight = item[1]*unit[1]
        total += weight
        weight /= 100.0
        balt += prod[0] * weight
        angl += prod[1] * weight
        rieb += prod[2] * weight
    total /= 100.0
    if total != 0.0:
        balt /= total
        angl /= total
        rieb /= total
    c.execute("UPDATE product SET balt=%s, angl=%s, rieb=%s WHERE id=%s",
              (balt, angl, rieb, id))
    return (str(balt), str(angl), str(rieb), str(total*100))

def updateComplex(c, id):
    c.execute('SELECT id FROM unit WHERE prid=%s',
              (id,))
    units = c.fetchall()
    for unit in units:
        c.execute('SELECT prid FROM complex WHERE uid=%s',
                  (unit[0],))
        products = c.fetchall()
        for pid in products:
            calcBAR(c, pid[0])
            updateComplex(c, pid[0])
