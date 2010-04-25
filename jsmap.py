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
# jsmap.py
#
# easy to use mapping from python to javascript operators and functions
#

# parameter substitution is controlled by using placeholders %1,%2,... in the mapped string
#
# if no placeholders are supplied, default substitution is carried out as:
#
# binary ops:
#   %1 <mapped-name> %2
#
# unary ops:
#   <mapped-name> %1
#
# function/method calls:
#   <mapped-name>(%1,%2,...,%N)

 
# map between python operators and javascript operators or functions
#
#

# binary operators

binaryOps = { 
    'and'       : '&&', 
    'or'        : '||', 
    '=='        : '==', 
    '!='        : '!=', 
    '**'        : 'Math.pow(%1,%2)',
    '[]'        : '%1[%2]',
    '<'         : '<',
    '<='        : '<=',
    '>'         : '>',
    '>='        : '>=',
    '<>'        : '!=',
    '!='        : '!=',
    'is'        : None,
    'is not'    : None,
    'in'        : ('py2js_in(%1,%2)',['py2js_in']),
    'not in'    : '!(%1 in %2)',
    '|'         : '|',
    '^'         : '^',
    '&'         : '&',
    '%'         : ('py2js_mod_format(%1,%2)',['py2js_mod_format']),
    '//'        : 'Math.floor(%1/%2)',
    '+'         : '+',
    '-'         : '-',
    '*'         : '*',
    '/'         : '/',
    '>>'        : '>>',
    '<<'        : '<<'
    }

# unary operators

unaryOps = { 
    'not'       : '!', 
    '-'         : '-',
    '+'         : '+',
    '~'         : '~'
}

# augmented assignment operators (always supply placeholders)

assignOps = {
    '+='        : '%1 += %2',
    '-='        : '%1 -= %2',
    '*='        : '%1 *= %2',
    '/='        : '%1 /= %2',
    '//='       : '%1 = Math.floor(%1/%2)',
    '%='        : '%1 %= %2',
    '>>='       : '%1 >>= %2',
    '<<='       : '%1 <<= %2',
    '**='       : '%1 = Math.pow(%1,%2)',
    '&='        : '%1 &= %2',
    '|='        : '%1 |= %2',
    '^='        : '%1 ^= %2'
}

#
# map between python builtins and javascript operators, functions or whatever
#
# where python and javascript builtin are the same, no need to include the mapping in this file
#
# for keys use the function name or "." plus the method name
# 
# to provide different mappings based on the number of arguments 
# supplied to the function/method, add the suffix .<#args> to the key.  
# 
# For example:
#   "spam.1" : js_eggs"   ... maps python function spam to javascript function js_eggs when exactly 
#                             1 argument is supplied   
#   "spam" : "js_spam"    ... maps python function spam to javascript function js_spam
#   

mappedFuncs = { 
# lists
    'len' : ('py2js_len(%1)',['py2js_len']), 
    '.append' : 'push',
    'sum' : ('py2js_sum',['py2js_sum']),
    'map' : ('py2js_map',['py2js_map']),
    'reduce' : ('py2js_reduce',['py2js_reduce']),
    'zip' : ('py2js_zip',['py2js_zip']),
    'filter' : ('py2js_filter',['py2js_filter']),
    'min' : ('py2js_minmax(%1,true)',['py2js_minmax']),
    'max' : ('py2js_minmax(%1,false)',['py2js_minmax']),
    '.sort.0' : 'sort',
    '.sort.1' : 'sort',
    '.sort.2' : ('py2js_sort3(%0,%1,%2,false)',['py2js_sort3']),
    '.sort.3' : ('py2js_sort3(%0,%1,%2,%3)',['py2js_sort3']),
    'xrange.2' : ( 'py2js_xrange2(%1,%2)',['py2js_xrange2']),
    '.extend' : ( 'py2js_extend(%0,%1)', ['py2js_extend']),
# conversion
    'str' : ('py2js_str(%1)',['py2js_str']),
    'int' : ('py2js_int(%1)',['py2js_int','ValueError']),
    'float' : ('py2js_float(%1)',['py2js_float','ValueError']),
# strings
    '.upper' : 'toUpperCase',
    '.lower' : 'toLowerCase',
    '.find' : 'indexOf',
    '.rfind' : 'lastIndexOf',
    '.splitlines.1' : None,
    '.splitlines.0' : 'split("\\n")',
    '.split.2' : None,
    '.split.1' : 'split(%1)',
    '.split.0' : 'split(/\s+/)',
    '.replace' : ('py2js_replace(%0,%1,%2)',['py2js_replace']),
    '.count' : ('py2js_count(%0,%*)',['py2js_count']),
    '.rstrip.0' : ('py2js_rstrip(%0,"\\n\\t ")',['py2js_rstrip']),
    '.rstrip.1' : ('py2js_rstrip(%0,%1)',['py2js_rstrip']),
    '.lstrip.0' : ('py2js_lstrip(%0,"\\n\\t ")',['py2js_lstrip']),
    '.lstrip.1' : ('py2js_lstrip(%0,%1)',['py2js_lstrip']),
    '.strip.0' : ('py2js_rstrip(py2js_lstrip(%0,"\\n\\t "),"\\n\\t ")',['py2js_rstrip','py2js_lstrip']),
    '.strip.1' : ('py2js_rstrip(py2js_lstrip(%0,%1),%1)',['py2js_rstrip','py2js_lstrip']),
#general
    'isinstance' : '%1 instanceof %2',
    '.keys' : ('py2js_keys(%0)',['py2js_keys']),
    '.has_key' : '(%1 in %0)',
    'super' : '%1.super(%2)'
}


