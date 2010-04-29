/* The MIT License

Copyright (c) 2008 - 2009 Niall McCarroll
XXXX, what if

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
          for (var item_name in $import[mdl_name])
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
  
  
  function $kwargs(obj) {
    // make 'new' optional
    if (!(this instanceof $kwargs))
      return new $kwargs(obj);
    this._obj = obj;
  }
  $kwargs.prototype.toObject = function() {
      return this._obj;
  };
  pylib.$kwargs = $kwargs;
  
  
  function $args(arr) {
    // make 'new' optional
    if (!(this instanceof $args))
      return new $args(arr);
    this._arr = arr;
  }
  $args.prototype.toArray = function() {
    return this._arr;
  }
  pylib.$args = $args;
  
  
  function def(func) {
    /*
    Wraps the supplied function in Pythonic goodness. The wrapper handles
    unpacking **kwargs, unpacking *args, sending any extra arguments to the args
    and kwargs parameters, sending this to the self parameter and setting the
    __name__ property.
    
    Use the $args() wrapper instead of * to send in positional args for unpacking.
    If the combination of regular arguments passed and $args() passed are more
    than the number of declared arguments, the extra ones will be passed as a
    list to the "args" parameter. If there is no "args" parameter defined on the
    function, an error will be thrown.
    
    >>> var fn1 = def(function(arg1, arg2) { return [arg1, arg2].join(', '); });
    >>> fn1('test1', 'test2');
    "test1, test2"
    >>> fn1($args(['test1', 'test2']));
    "test1, test2"
    >>> fn1('test1', $args(['test2']));
    "test1, test2"
    >>> fn1('test1', $args(['test2', 'test3']));
    Error: __name__() takes at most 2 arguments (3 given).
    
    Use the $kwargs() wrapper instead of ** to pass in keyword arguments for
    unpacking. If any kwargs are passed in that don't map to a declared
    parameters, the extra ones will be passed in a dict to the "kwargs"
    parameter. If the function doesn't declare a "kwargs" parameter, an error
    will be thrown.
    
    >>> fn1($kwargs({'arg2': 'test2', 'arg1': 'test1'}));
    "test1, test2"
    >>> fn1('test1', $kwargs({'arg2': 'test2'}));
    "test1, test2"
    >>> fn1($kwargs({'arg3': 'test3'}));
    Error: __name__() got an unexpected keyword argument 'arg3'
    
    Here is an example of declaring "args" and "kwargs" parameters to catch
    extra arguments:
    
    >>> var fn2 = def(function(arg1, args, kwargs) { return arg1 + ', ' + JSON.stringify(args) + ', ' + JSON.stringify(kwargs); });
    >>> fn2($args(['test1']));
    "test1, [], {}"
    >>> fn2($args(['test1', 'test2']));
    "test1, [\"test2\"], {}"
    >>> fn2($kwargs({'arg1': 'test1', 'arg2': 'test2'}));
    "test1, [], {\"arg2\":\"test2\"}"
    
    */
    var declared_args = _argumentNames(func);
    var declared_arg_positions = {};
    var num_declared_args = declared_args.length;
    var extra_kwargs_pos = -1, extra_args_pos = -1;
    
    // record positions of arguments, including special 'kwargs' and 'args'
    if (num_declared_args) {
      // handle declared argument for extra kwargs
      if (declared_args[num_declared_args - 1] == 'kwargs') {
        extra_kwargs_pos = num_declared_args - 1;
        declared_args.pop();
        if (num_declared_args > 1 && declared_args[num_declared_args - 2] == 'args') {
          extra_args_pos = num_declared_args - 2;
          declared_args.pop();
        }
      }
      // handle declared argument for extra args
      else if (declared_args[num_declared_args - 1] == 'args') {
        extra_args_pos = num_declared_args - 1;
        declared_args.pop();
      }
      
      // reset num_declared_args after all the pop()s
      num_declared_args = declared_args.length;
      
      // create object that maps declared arg names to their positions
      for (var num_declared_arg = 0; num_declared_arg < num_declared_args; ++num_declared_arg)
        declared_arg_positions[declared_args[num_declared_arg]] = num_declared_arg;
    }
    
    return function() {
      var num_args = arguments.length;
      
      // only create extra_args and extra_kwargs if they're declared
      var extra_args, extra_kwargs;
      if (extra_args_pos != -1)
        extra_args = [];
      if (extra_kwargs_pos != -1)
        extra_kwargs = {};
      
      // turn into normal array, b/c we need to do non-trivial operations on it
      var args = [];
      for (var num_arg = 0; num_arg < num_args; ++num_arg)
        args.push(arguments[num_arg]);
      
      // if last item is kwargs, pull it off
      if (num_args) {
        if (args[num_args - 1] instanceof $kwargs)
         var passed_kwargs = args.pop().toObject();
      
        // if second-to-last item is args, add them to the array
        if (args.length && args[args.length - 1] instanceof $args)
          args = args.concat(args.pop().toArray())
      
        // pull any extra args into extra_args
        if (args.length > num_declared_args) {
          if (extra_args)
            extra_args = args.splice(num_declared_args, args.length - num_declared_args);
          else // TypeError
            throw new Error('__name__() takes at most ' + num_declared_args + ' arguments (' + args.length + ' given).');
        }
        
        // stick kwargs in args array if they're declared, extra_args otherwise
        for (var arg_name in passed_kwargs) {
          var position = declared_arg_positions[arg_name];
          if (position !== undefined) {
            args[position] = passed_kwargs[arg_name];
          }
          else {
            if (extra_kwargs)
              extra_kwargs[arg_name] = passed_kwargs[arg_name];
            else // TypeError
              throw new Error("__name__() got an unexpected keyword argument '" + arg_name + "'")
          }
        }
      }
      
      // we inject extra args/kwargs last b/c we don't want to prematurely
      // lengthen the args array
      if (extra_args_pos != -1)
        args[extra_args_pos] = extra_args;
      if (extra_kwargs_pos != -1)
        args[extra_kwargs_pos] = extra_kwargs;
      
      return func.apply(this, args);
    }
  }
  pylib.def = def;
  
  // private function for pulling parameter names from function
  // implementation borrowed from www.prototypejs.org
  function _argumentNames(func) {
    var names = func.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
      .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
      .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
  }
  
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
  
  
  function list(arr) {
    // make 'new' optional
    if (!(this instanceof list))
      return new list(arr);
    this._arr = arr;
  }
  
  list.prototype.append = function(value) {
    this._arr.push(value);
  };
  
  list.prototype.sort = function(cmp, key, reverse) {
    if (reverse === undefined)
      reverse = false;
    if (key === undefined) {
      this._arr.sort(cmp);
    }
    else {
      var sort_func = function(a, b) {
        if (!reverse) {
          return cmp(key(a), key(b));
        } else {
          return cmp(key(b), key(a));
        }
      };
      this._arr.sort(sort_func);
    }
  };
  
  list.prototype.extend = function(list2) {
    var list2_len = list2.length;
    for (var i = 0; i < list2_len; ++i)
      this._arr.push(list2[i]);
  };
})();  

(function() {
  $import.pylib.dict = dict;
  function dict(obj) {
    // make 'new' optional
    if (!(this instanceof dict))
      return new dict(obj);
    this._obj = obj || {};
  }
  
  dict.prototype.get = get;
  function get(key, $default) {
    /*
    Return the value for `key` if `key` is in the dictionary, else `default`.
    If `default` is not given, it defaults to `null`, so that its method never
    raises a KeyError.
    
    >>> dict({key: 'value'}).get('key')
    "value"
    >>> dict({ }).get('key', 'value')
    "value"
    >>> dict({ }).get('key')
    null
    */
    if ($default === undefined) $default = null;
    return key in this._obj ? this._obj[key] : $default;
  }
  
  dict.prototype.set = function(key, val) {
    this._obj[val] = key;
  };
  
  dict.prototype.clear = function() {
    this._obj = {};
  };
  
  dict.prototype.items = function() {
    var items = [];
    for (var key in this._obj) {
      items.push([key, this._obj[key]]);
    }
    return list(items);
  };
  
  dict.prototype.keys = function() {
    var keys = [];
    for (var k in this._obj)
      keys.push(k);
    return list(keys);
  };
  
  dict.prototype.values = function() {
    var values = [];
    for (var k in this._obj)
      values.push(this._obj[k]);
    return list(values);
  };
  
  dict.prototype.setdefault = function(key, $default) {
    return key in this._obj ? this._obj[key] : this._obj[key] = $default;
  };
  
  dict.prototype.has_key = function(key) {
    return key in this._obj;
  };
  
  dict.prototype.__delattr__ = function(key) {
    delete this._obj[key];
  };
  
  // TODO: prove that there's a sufficiently x-browser way to do setters
  // and implement a __len__ property OR make all such properties methods
})();
