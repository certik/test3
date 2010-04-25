# The MIT License
#
# Copyright (c) 2008 - 2009 Niall McCarroll
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
#
# py2js.py
#
# read a python file and attempt to convert to javascript
#
# usage:
#
#   python py2js.py example.py > example.js
#       
#   python py2js.py example.py -debug > example.js
#       (convert and embed a comment in the output with the parsetree, for debugging purposes)

from pyfrontend import pyread, FrontendException
from jsbackend import jswrite, BackendException
import sys


argfile = sys.argv[1]
debug = False
if len(sys.argv)>2:
    if sys.argv[2] == '-debug':
        debug = True

code = None
try:
    code = pyread(argfile)
except FrontendException, ex:
    print "py2js Frontend Error:" + str(ex)

if debug:
    print "/* " + str(code) + " */"

if code:
    try:
        print jswrite(code,argfile)
    except BackendException, ex:
        print "py2js Backend Error:" + str(ex)

