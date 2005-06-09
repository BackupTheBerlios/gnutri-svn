#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
#sys.path.append('/stud/2001/dado1945/lib/python')

import sys
import os

if os.environ['REQUEST_METHOD'] == 'POST':
    xml = sys.stdin.read(int(os.environ['CONTENT_LENGTH']))

    from RetrData import retrdata
    args = retrdata(xml)

    db = {'host': 'db.berlios.de', 'db': 'gnutri', 'user': 'gnutri', 'passwd': ''}
    command = args['command']
    result = __import__('al_%s' % command).run(args, dbparams)

    from SendData import senddata

    print "Content-type: application/xml"
    print
    print senddata(result)
