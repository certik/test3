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
from difflib import ndiff

def py2js(input):
  return jswrite_simple(pyparse(input))

def run_tests(parsed):
  for item in parsed:
    if hasattr(item, 'get'):
      py_code = '\n'.join(item['pytest'][1:])
      js_expected = '\n'.join(item['jstest'][1:])
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
        print 'Diff:'
        print '\n'.join(ndiff(js_expected.split('\n'), js_actual.split('\n')))
    #else:
    #  print 'No Tests: ' + item

def generate_wiki(parsed):
  wiki = []
  for item in parsed:
    if hasattr(item, 'get'):
      # Render each example using Wiki Creole 1.0 - pygments
      for (testname, testtype) in [('pytest', 'py'), ('fftest', 'js'), ('jstest', 'js')]:
        wiki.extend(gen_wiki_example(item[testname], testtype))
      
    else:
      wiki.append(item)
  return wiki

def gen_wiki_example(ex_lines, ex_language):
  wiki_ex = []
  if len(ex_lines):
    wiki_ex.extend([
      ex_lines[0],
      '{{{',
      '#!' + ex_language
    ])
    wiki_ex.extend(ex_lines[1:])
    wiki_ex.append('}}}')
    wiki_ex.append('')
  return wiki_ex
  
def parse_tests(lines):
  """
  Returns a list of intermixed dicts representing tests and strings, which
  represent documentation and whitespace between tests.
  
  The dicts that represent tests have two keys, `pytest` and `jstest`.
  """
  parsed = []
  in_py_test = False
  in_js_test = False
  in_ff_test = False
  py_indent = None
  js_indent = None
  ff_indent = None
  test = None
  
  for line in lines:
    if line.startswith('Python:'):
      in_py_test = True
      test = { 'pytest': [], 'jstest': [], 'fftest': [] }
      parsed.append(test)
      test['pytest'].append(line)
    elif line.startswith('Javascript:'):
      in_js_test = True
      test['jstest'].append(line)
    elif line.startswith('Firefox 3+:'):
      in_ff_test = True
      test['fftest'].append(line)
    elif line == '' or not line[0].isspace():
      parsed.append(line)
      in_py_test = False
      in_js_test = False
      in_ff_test = False
      py_indent = None
      js_indent = None
      ff_indent = None
    else:
      if in_py_test:
        if py_indent is None:
          py_indent = len(line) - len(line.lstrip())
        test['pytest'].append(line[py_indent:])
      elif in_js_test:
        if js_indent is None:
          js_indent = len(line) - len(line.lstrip())
        test['jstest'].append(line[js_indent:])
      elif in_ff_test:
        if ff_indent is None:
          ff_indent = len(line) - len(line.lstrip())
        test['fftest'].append(line[ff_indent:])
  
  return parsed

  
#code = pyparse("""def test(x): print x""")
#print jswrite_simple(code)

if __name__ == '__main__':
  with open('Home.src') as home:
    parsed = parse_tests(home.read().split('\n'))
    run_tests(parsed)
    with open('wiki\\Home.wiki', 'w') as wiki:
      wiki.write('\n'.join(generate_wiki(parsed)))
      print 'generated: ' + '\n'.join(generate_wiki(parsed))