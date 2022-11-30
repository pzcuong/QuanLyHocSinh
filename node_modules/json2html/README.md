### A really (**really**) simple node.js formatter for json data

json2html simply takes a json structure as an input and returns an html string. It can be nice for exploring your data - but don't expect too much of it. 

### Installation

```
npm install json2html
```

### Sample code

```
var http = require('http'); var json2html = require('json2html')
http.createServer(function (req, res) {
	var myJson = {
		a_table: [
			{name: 'hugo', tel: '1234561234', email: 'hugo@blah.com'},
			{name: 'joe', tel: '1234569999', email: 'joe@blah.com'}
		],
		straigh_array: ['a','b','c'],
		an_object: {
			myAttribute: {a:1, b:2},
			anotherAttribute: {r:1, d:2}
			}
	};
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(json2html.render(myJson));
}).listen(1337, '127.0.0.1');
```

This will produce a page with this html https://gist.github.com/2053246 (plus some minimalistic css formatting / javascript to exand or collapse content)

### Usage
```
require('json2html').render(json, options)
```

```json``` is the json object you want to convert into HTML
```options``` is a json object, the only option available so far is plainHtml (use ```{plainHtml: true}```) if you want to instrument the page with your own event and disable the admittedly basic onclick events embedded in the HTML (for expanding / collapsing)

