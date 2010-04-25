#!/bin/sh

# script to run py2js unit tests

origd=`pwd`
py2jsd=`dirname $0`

cd $py2jsd

# setup PYTHONPATH
export PYTHONPATH=`pwd`/modules/python

python py2js_test.py

cd $origd
