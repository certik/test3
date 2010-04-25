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
# jslib.py
#
# A library of javascript code to provide an equivalent to python built-in functions and methods
#

py2js_modules = { "mtrandom" : "MersenneTwister19937class" }

py2js_lib = { 

"Kwarg":"""
function Kwarg(dict) {
    this.dict = dict;
}
Kwarg.prototype.getDict = function() {
    return this.dict;
}
""",

"py2js_in":"""

function py2js_in(item,container) {
        if (container instanceof Array) {
            return container.indexOf(item) != -1;
        }
        return item in container;
}
""",

"py2js_len":"""

function py2js_len(container) {
        if (container instanceof Array) {
            return container.length;
        }
        var i;
        var count = 0;
        for (i in container) {
            count++;
        }
        return count;
}
""",

"py2js_xrange2":"""

function py2js_xrange2(min,max) {
        result = [];
        var i;
        for(i=min;i<max;i++) {
            result.push(i);
        }
        return result;
}
""",

"py2js_replace":"""
function py2js_replace(str,mat,rep) {
    var s = str;    
    var pos = s.indexOf(mat,0);
    while(pos >= 0) {
        s = "".concat(s.slice(0,pos),rep,s.slice(pos+mat.length));
        pos = s.indexOf(mat,pos+rep.length);
    }
    return s;
}
""",

"py2js_sort3":"""
function py2js_sort3(lst,fn,ky,rv) {
    sfn = function(a,b) {
        if (!rv) {
            return fn(ky(a),ky(b));
        } else {
            return fn(ky(b),ky(a));
        }    
    }
    lst.sort(sfn);
}
""",

"py2js_rstrip":"""
function py2js_rstrip(str,chars) {
    var i = str.length-1;    
    while(i >= 0) {
        if (chars.indexOf(str.slice(i,i+1)) == -1) {
            break;
        }            
        i--;
    }
    if (i < (str.length-1)) {
        if (i < 0) {
            return "";
        }
        return str.slice(0,i+1);
    }
    return str;
}
""",

"py2js_lstrip":"""
function py2js_lstrip(str,chars) {
    var i = 0;    
    while(i < str.length) {
        if (chars.indexOf(str.slice(i,i+1)) == -1) {
            break;
        }            
        i++;
    }
    if (i == 0) {
        return str;
    }    
    if (i == str.length) {
        return "";
    }
    return str.slice(i);
}
""",

"py2js_sum":"""
function py2js_sum(list) {
    var i,total = 0;
    for(i=0;i<list.length;i++) {
        total += list[i];
    }    
    return total;
}
""",

"py2js_extend":"""
function py2js_extend(list1,list2) {
    var i;
    for(i=0;i<list2.length;i++) {
        list1.push(list2[i]);
    }    
}
""",

"py2js_keys":"""
function py2js_keys(obj) {
    var result = [];
    var k;
    for ( k in obj ) {
        result.push(k);
    }    
    return result;
}
""",

"py2js_minmax":"""
function py2js_minmax(list,minNotMax) {
    var result = null;
    /* FIXME should throw ValueError if list is empty */    
    for(i=0;i<list.length;i++) {
        if ((result == null) || (minNotMax && list[i]<result) || (!minNotMax && list[i]>result)) {
            result = list[i];
        }
    }    
    return result;
}
""",

"py2js_map":"""
function py2js_map(fn,list) {
    var i,result=[];
    for(i=0;i<list.length;i++) {
        result.push(fn(list[i]));
    }    
    return result;
}
""",

"py2js_mod_format":"file:library/strings/string_formatting.js",

"py2js_filter":"""
function py2js_filter(fn,list) {
    var results = [];
    var i = 0;
    for(i=0; i<list.length; i++) {
        v = list[i];
        if (fn(v)) {
            results.push(v);
        }
    }
    return results;
}
""",

"py2js_reduce":"""
function py2js_reduce(fn,list) {
    var pos = 0;
    var result = null;
    if (arguments.length == 3) {
        result = arguments[2];
    }
    if (result == null) {
        pos = 1;
        result = list[0];    
    }

    for(i=pos;i<list.length;i++) {
        result = fn(result,list[i]);
    }    

    return result;
}
""",

"py2js_zip":"""
function py2js_zip() {
    
    if (arguments.length == 0) {
        return [];
    }

    var results = [];
    var pos = -1;
    var i = 0;
    var cont = true;
    while(cont) {
        pos++;
        for(i=0;i<arguments.length;i++) {
            if (pos >= arguments[i].length) {
                cont = false;
                break;
            }
        }
        if (cont) {
            var newitem = [];
            for(i=0; i<arguments.length;i++) {
               newitem.push(arguments[i][pos]);
            }
            results.push(newitem);
        }
    }
    return results;
}
""",

"py2js_count":"""
function py2js_count(str,sub,start,end) {
    var pos = 0;
    if (start != undefined) {
        if (start < 0) {
            start = str.length + start;
        }
        if (start < 0) {
            start = 0;
        }
        pos = start;
    }    
    if (end != undefined) {
        if (end < 0) {
            end = str.length + end;
        } 
        if (end < 0) {
            end = 0;
        }
    }
    pos = str.indexOf(sub,pos);
    var count = 0;
    while(pos >= 0) {
        if (end != undefined) {
            if (pos+sub.length > end) {
                break;
            }
        }
        count++;
        pos += sub.length;
        pos = str.indexOf(sub,pos);
    }
    return count;
}
""",

"Generator":"""


function Generator(container) {
        var isarray = (container instanceof Array);
        var isstring = (typeof(container) == 'string');
        if (container.__iter__) {
                this.values = [];
                this.iterator = container.__iter__();
        } else if (isarray || isstring) {
                this.values = container;
        } else {
                this.values = [];
                for(key in container) {
                        this.values.push(key);
                }
        }
        this.index = 0;
}

Generator.prototype.nextValue = function() {
        if (this.iterator) {
                try {
                        return this.iterator.next();
                } catch( e ) {
                        this.iterator_exhausted = true;
                        return null;
                }
        }
        else if (this.index < this.values.length) {
                return this.values[this.index++];
        } else {
                this.index++;
                return null;
        }
}

Generator.prototype.hadMore = function() {
        if (this.iterator_exhausted) {
                return false;
        }
        return (this.index-1) < this.values.length;
}


""",

"py2js_int":"""

function py2js_int(s) {
    if (typeof(s) == 'string' && s.indexOf('.') != -1) {
        throw(new ValueError("invalid literal for int: "+String(s)));
    }
    var n = new Number(s);
    if (isNaN(n)) {
        // warning text nicked from python ValueError
        throw(new ValueError("invalid literal for int: "+String(s)));
    }
    if (n < 0) {
        n = -Math.floor(Math.abs(n));
    } else {
        n = Math.floor(n);
    }        
    return n;
}

""",

"py2js_float":"""

function py2js_float(s) {
    var n = new Number(s);
    if (isNaN(n)) {
        // warning text nicked from python ValueError
        throw(new ValueError("invalid literal for float: "+String(s)));
    }
    return n;
}
""",

"py2js_str":"""

function py2js_str(v) {
    if (v && v.toFixed) {
        if (Math.floor(v) != v) {
            return v.toFixed(12);
        }
    }
    return new String(v);
}
""",

"ValueError":"""

function ValueError(details) {
    this.details = details;
    return this;
}
""" }


