"""py2js overview tests

This is a runner, which runs the documentation examples on the wiki.
The wiki can be pulled via hg lcone https://bitbucket.org/PeterRust/py2js/wiki

The tests cover the basic, beginner uses of doctestjs and will be included
on the homepage of the site, introducing Javascript and Python programmers
to the wonders of a one-to-one mapping between Python and Javascript.

Detailed testing of each piece of py2js will be done in the docstrings of
the appropriate functions and will be used to generate deeper
documentation pages.

"""
from pyfrontend import pyparse
from jsbackend import jswrite_simple

def py2js(input):
  return jswrite_simple(pyparse(input))

def run_tests(parsed):
  for item in parsed:
    if hasattr(item, 'get'):
      py_code = '\n'.join(item['pytest'])
      js_expected = '\n'.join(item['jstest'])
      #print 'Python Code:'
      #print py_code
      #print 'Javascript Code:'
      #print js_expected
      
      js_actual = py2js(py_code)
      
      if js_expected == js_actual:
        print 'Test Passed'
      else:
        print 'Test Failed. Expected:'
        print js_expected
        print 'Got:'
        print js_actual
    #else:
    #  print 'No Tests: ' + item

def generate_wiki(parsed):
  wiki = []
  for item in parsed:
    if hasattr(item, 'get'):
      # Python Example (Wiki Creole 1.0 - pygments)
      wiki.append('Python:')
      wiki.append('{{{')
      wiki.append('#!py')
      wiki.extend(item['pytest'])
      wiki.append('}}}')
      wiki.append('')
      
      # Javascript Example (Wiki Creole 1.0 - pygments)
      wiki.append('Javascript:')
      wiki.append('{{{')
      wiki.append('#!js')
      wiki.extend(item['jstest'])
      wiki.append('}}}')
    else:
      wiki.append(item)
  return wiki
  
def parse_tests(lines):
  """
  Returns a list of intermixed dicts representing tests and strings, which
  represent documentation and whitespace between tests.
  
  The dicts that represent tests have two keys, `pytest` and `jstest`.
  """
  parsed = []
  in_py_test = False
  in_js_test = False
  py_indent = None
  js_indent = None
  test = None
  
  for line in lines:
    if line.startswith('Python:'):
      in_py_test = True
      test = { 'pytest': [], 'jstest': [] }
      parsed.append(test)
    elif line.startswith('Javascript:'):
      in_js_test = True
    elif line == '' or not line[0].isspace():
      parsed.append(line)
      in_py_test = False
      in_js_test = False
      py_indent = None
      js_indent = None
    else:
      if in_py_test:
        if py_indent is None:
          py_indent = len(line) - len(line.lstrip())
        test['pytest'].append(line[py_indent:])
      elif in_js_test:
        if js_indent is None:
          js_indent = len(line) - len(line.lstrip())
        test['jstest'].append(line[js_indent:])
  
  return parsed

  
#code = pyparse("""def test(x): print x""")
#print jswrite_simple(code)

if __name__ == '__main__':
  with open('wiki\\Home.src') as home:
    parsed = parse_tests(home.read().split('\n'))
    run_tests(parsed)
    with open('wiki\\Home.wiki', 'w') as wiki:
      wiki.write('\n'.join(generate_wiki(parsed)))