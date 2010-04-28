from utils import *
import shutil, subprocess, os, json

def jstests():
  comments = parse_js_multiline_comments('pylib.js')
  lines = [line.strip() for line in comments]
  tests = []
  test = None
  for line in lines:
    if line.startswith('>>>'):
      test = {}
      tests.append(test)
      test['code'] = line[3:].strip()
    elif test:
      test['result'] = line
      test = None
  
  # fresh copy of pylib.js - need it in tests folder so tests can access it
  shutil.copyfile('pylib.js', 'tests/pylib.js')
  write_test_json('tests/pylib_tests.json', tests)
  
  # run tests in default browser
  os.chdir('tests');
  subprocess.Popen('pylib_tests.html', shell=True)

def write_test_json(path, tests):
  with open(path, 'w') as test_html:
    test_html.write('var tests = ' + json.dumps(tests))

if __name__ == '__main__':
  jstests()