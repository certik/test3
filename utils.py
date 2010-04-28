"""
Helper utilities to support testing and documentation.
"""

def parse_js_multiline_comments(path):
  js_source = ''
  with open(path, 'r') as js_file:
    js_source = js_file.read()
  multiline_comments = []
  
  start = js_source.find('/*') # prime the pump
  end = 0
  
  while start >= 0:
    start += 2 # get it past the comment
    end = js_source.find('*/', start)
    if end >= 0:
      multiline_comments.extend(js_source[start:end].split('\n'))
    else:
      raise Exception('parse_js_multiline_comments() parsing error, did not find end of multiline comment');
    
    # repeat
    start = js_source.find('/*', end)
  
  return multiline_comments;