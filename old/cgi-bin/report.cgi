#!/usr/bin/env python
# -*- coding: utf-8 -*-

def buildReport(c, user_id, time, days):
    """ Build report. """
    total_balt = 0.0
    total_angl = 0.0
    total_rieb = 0.0
    total_norm_balt = 0.0
    total_norm_angl = 0.0
    total_norm_rieb = 0.0
    for i in range(days):
        c.execute('SELECT weight, height, work FROM health WHERE time < %s AND uid=%s ORDER BY time DESC',
                  (time, user_id))
        info = c.fetchone()
        if info is None:
             c.execute('SELECT weight, height, work FROM health WHERE uid=%s ORDER BY time DESC',
                       (user_id))
             info = c.fetchone()
        if info is None:
            print 'Nėra vartotojo informacijos dienai %d <br/>' % (i,)
        else:
            print 'Diena %d <br/>' % (i,)
            print '<table border="1">'
            print '<tr>'
            print '<td>Produktas</td><td>Vienetai</td><td>Kiekis</td>'
            print '<td>Baltymai</td><td>Angliavandeniai</td><td>Riebalai</td>'
            print '</tr>'
            day_balt = 0.0
            day_angl = 0.0
            day_rieb = 0.0
            c.execute('SELECT uid, amount FROM menu WHERE time > %s AND time < %s AND user=%s',
                      (time, time+1000*60*60*24, user_id))
            menu = c.fetchall()
            if menu != None and len(menu) > 0:
                for item in menu:
                    c.execute("SELECT p.name, p.balt, p.angl, p.rieb, u.weight, un.name "
                              "FROM product p, unit u, unitname un "
                              "WHERE u.id=%s AND u.prid = p.id AND u.unid = un.id",
                              (item[0],))
                    res = c.fetchone()
                    weight = item[1]*res[4]
                    weight /= 100.0
                    balt = res[1] * weight
                    angl = res[2] * weight
                    rieb = res[3] * weight
                    print '<tr><td>%s</td><td>%s</td><td>%f</td><td>%f</td><td>%f</td><td>%f</td></tr>' % \
                            (res[0], res[5], item[1], balt, angl, rieb)
                    day_balt += balt
                    day_angl += angl
                    day_rieb += rieb
                print '<tr><td>Viso</td><td></td><td></td><td>%f</td><td>%f</td><td>%f</td></tr>' % \
                        (day_balt, day_angl, day_rieb)

            calory = (35.+5.*info[2])*info[0]
            if info[0] < (info[1]-100) * 0.95:
                calory *= 1.1
            elif (info[1]-100)*1.05 < info[0]:
                calory *= 0.9
            day_norm_balt = calory * 4.0/29.0 / 4.0
            day_norm_angl = calory * 16.0/29.0 / 4.0
            day_norm_rieb = calory * 9.0/29.0 / 9.0

            print '<tr><td>Dienos norma</td><td></td><td></td><td>%f</td><td>%f</td><td>%f</td></tr>' % \
                    (day_norm_balt, day_norm_angl, day_norm_rieb)

            print '<tr><td>Procentais</td><td></td><td></td><td>%3.1f%%</td><td>%3.1f%%</td><td>%3.1f%%</td></tr>' % \
                    (day_balt/day_norm_balt*100, day_angl/day_norm_angl*100, day_rieb/day_norm_rieb*100)
            print '</table>'

            total_balt += day_balt
            total_angl += day_angl
            total_rieb += day_rieb
            total_norm_balt += day_norm_balt
            total_norm_angl += day_norm_angl
            total_norm_rieb += day_norm_rieb

        time += 1000*60*60*24

    print 'Per %d dienas: <br/>' % (days,)
    print '<table border="1">'
    print '<tr>'
    print '<td>Informacija</td><td>Baltymai</td><td>Angliavandeniai</td><td>Riebalai</td>'
    print '</tr>'
    print '<tr><td>Viso</td><td>%f</td><td>%f</td><td>%f</td></tr>' % \
            (total_balt, total_angl, total_rieb)
    print '<tr><td>Norma</td><td>%f</td><td>%f</td><td>%f</td></tr>' % \
            (total_norm_balt, total_norm_angl, total_norm_rieb)
    if total_norm_balt != 0.0 and total_norm_angl != 0.0 and total_norm_rieb != 0.0:
        print '<tr><td>Procentais</td><td>%3.1f%%</td><td>%4.1f%%</td><td>%3.1f%%</td></tr>' % \
                (total_balt/total_norm_balt*100, total_angl/total_norm_angl*100, total_rieb/total_norm_rieb*100)
    print '</table>'
#
#   Main part
#

print 'Content-type: text/html'
print
print '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">'
print '<html>'
print '<head>'
print '<meta HTTP-EQUIV="Content-type" CONTENT="text/html; charset=UTF-8">'
print '<meta name="Author" content="Auslavis">'
print '<title>Raportas</title>'
print """<style><!--
    table { border: 1px solid black;
            border-collapse: collapse;}
//-->
</style>
"""

print '</head>'
print '<body>'

import cgi
form = cgi.FieldStorage()

if not form.has_key('user') or not form.has_key('from'):
    print 'Neįmanoma padaryti raporto'
else:
    password = ''
    if form.has_key('password'):
        password = form['password'].value

    import MySQLdb
    db=MySQLdb.connect(host='localhost', db='Auslavis', user='', passwd='')
    c=db.cursor()
    from au_user import getUserId
    user_id = getUserId(c, form['user'].value, password)

    if user_id == -1:
        print 'Neteisingas vartotojo vardas ir slaptažodis'
    else:
        days = 1
        if form.has_key('days'):
            try:
                days = int(form['days'].value)
            except ValueError:
                days = 1
        buildReport(c, user_id, int(form['from'].value), days)
    c.close()
print '</body>'
print '</html>'
