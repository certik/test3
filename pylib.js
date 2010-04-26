/* The MIT License

Copyright (c) 2008 - 2009 Niall McCarroll

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

pylib.js

A library of javascript code to provide an equivalent to python built-in functions and methods

*/

// two globals, $import() and $from() to mimic Python's module loading
// SIMPLIFIED USAGE: var pylib = $import.pylib;
// USAGE: eval($import('pylib', 'base64'));

// TODO: in pylib-ff3.js, use destructured assignment:
// var [pylib, base64] = $import('pylib', 'base64');
// it's longer than the eval() counterpart, but cleaner
if (!window['$import']) {
  function $import() {
    var strings_to_eval = [];
    var nArgs = arguments.length;
    for (var nArg = 0; nArg < nArgs; ++nArg) {
      var arg = arguments[nArg];
      strings_to_eval.push(arg + ' = $import.' + arg);
    }
    return 'var ' + strings_to_eval.join(', ');
  }
}

// USAGE: eval($from('pylib').$import('dict'));
if (!window['$from']) {
  function $from(mdl_name) {
    return {
      $import: function() {
        var strings_to_eval = [];
        var args = arguments;
        
        // special handling of $from('pylib').$import('*')
        if (args[0] == '*') {
          args = [];
          for (var item_name in _import[mdl_name])
            args.push(item_name);
        }
        
        var nArgs = args.length;
        for (var nArg = 0; nArg < nArgs; ++nArg) {
          var arg = args[nArg];
          strings_to_eval.push(arg + ' = $import.' + mdl_name + '.' + arg);
        }
        return 'var ' + strings_to_eval.join(', ');
      }
    };
  }
}

// py2js_modules = { "mtrandom" : "MersenneTwister19937class" }
// "py2js_mod_format":"file:library/strings/string_formatting.js",
$import.pylib = {  
  $in: function(item,container) {
    if (container instanceof Array) {
        return container.indexOf(item) != -1;
    }
    return item in container;
  },
  
  len: function(container) {
    if (container instanceof Array) {
        return container.length;
    }
    var i;
    var count = 0;
    for (i in container) {
        count++;
    }
    return count;
  },
  
  xrange2: function(min,max) {
    result = [];
    var i;
    for(i=min;i<max;i++) {
        result.push(i);
    }
    return result;
  },
  
  replace: function(str,mat,rep) {
    var s = str;    
    var pos = s.indexOf(mat,0);
    while(pos >= 0) {
        s = "".concat(s.slice(0,pos),rep,s.slice(pos+mat.length));
        pos = s.indexOf(mat,pos+rep.length);
    }
    return s;
  },
  
  sort3: function(lst,fn,ky,rv) {
    sfn = function(a,b) {
      if (!rv) {
          return fn(ky(a),ky(b));
      } else {
          return fn(ky(b),ky(a));
      }    
    }
    lst.sort(sfn);
  },
  
  rstrip: function(str,chars) {
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
  },
  
  lstrip: function(str,chars) {
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
  },
  
  sum: function(list) {
    var i,total = 0;
    for(i=0;i<list.length;i++) {
        total += list[i];
    }    
    return total;
  },
  
  extend: function(list1,list2) {
    var i;
    for(i=0;i<list2.length;i++) {
        list1.push(list2[i]);
    }    
  },
  
  minmax: function(list,minNotMax) {
    var result = null;
    /* FIXME should throw ValueError if list is empty */    
    for(i=0;i<list.length;i++) {
        if ((result == null) || (minNotMax && list[i]<result) || (!minNotMax && list[i]>result)) {
            result = list[i];
        }
    }    
    return result;
  },
  
  map: function(fn,list) {
    var i,result=[];
    for(i=0;i<list.length;i++) {
        result.push(fn(list[i]));
    }    
    return result;
  },
  
  filter: function(fn,list) {
    var results = [];
    var i = 0;
    for(i=0; i<list.length; i++) {
        v = list[i];
        if (fn(v)) {
            results.push(v);
        }
    }
    return results;
  },
  
  reduce: function(fn,list) {
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
  },
  
  zip: function() {
      
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
  },
  
  count: function(str,sub,start,end) {
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
  },
  
  $int: function(s) {
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
  },
  
  $float: function(s) {
      var n = new Number(s);
      if (isNaN(n)) {
          // warning text nicked from python ValueError
          throw(new ValueError("invalid literal for float: "+String(s)));
      }
      return n;
  },
  
  str: function(v) {
      if (v && v.toFixed) {
          if (Math.floor(v) != v) {
              return v.toFixed(12);
          }
      }
      return new String(v);
  }
};

// closure to define the other types, so the classes are named, not anonymous
(function() {
  var pylib = $import.pylib;
  
  function ValueError(details) {
      this.details = details;
      return this;
  }
  pylib.ValueError = ValueError;
  
  function Kwarg(dict) {
      this.dict = dict;
  }
  Kwarg.prototype.getDict = function() {
      return this.dict;
  };
  pylib.Kwarg = Kwarg;
  
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
  };
  
  Generator.prototype.hadMore = function() {
    if (this.iterator_exhausted) {
      return false;
    }
    return (this.index-1) < this.values.length;
  };
  pylib.Generator = Generator;
  
  function dict(obj) {
    // RESEARCH: if we can hack the setattr reliably across all browsers
    // i.e. "this.__inner = obj" and repointering getattr/setattr to __inner
    // if not, we're in danger of keys taking precedence over dict methods
    
    // the alternative is to replace [] notation with .set() and .get()
    // (with an option to make it getattr/setattr() for increased compatibility
    // but decreased readability) - but we'd have to do the same for lists and
    // tuples b/c they all use [] syntax and there's no way to differentiate
    
    // the other alternative is to fall back to functional-style calls, as Niall
    // had, instead of dot-notation (i.e. "Dict.keys(dct)" or just "keys(dct)"),
    // but this gets ambiguous real fast, is a significant divergence from
    // the py src and isn't compatible w/ python classes/subclasses that define
    // the same methods
    for (var key in obj) {
      this[key] = obj[key];
    }
  }
  
  dict.prototype.keys = function() {
    var result = [];
    for (var k in this) {
        result.push(k);
    }    
    return result;
  };
  
  dict.prototype.has_key = function(key) {
    for (var k in this)
      if (k == key)
        return true;
    return false;
  };
  
  pylib.dict = dict;
})();