_ = require("underscore")

toggleJS = (options)->
	if options?.plainHtml
		return ""
	else
		"onclick=\"j2h.toggleVisibility(this);return false\""

makeLabelDiv = (options, level, keyname, datatype)->
	if _.isNumber(keyname)
		return "<div class='index'><span class='j2hlabel'>#{keyname}&nbsp;</span></div>"
	else if _.isString(keyname)
		if datatype is 'array'
			return "<div class='collapsible level#{level}' #{toggleJS(options)}><span class='j2hlabel'>#{keyname}</span></div>"
		else if datatype is 'object'
			return "<div class='attribute collapsible level#{level}' #{toggleJS(options)}><span class='j2hlabel'>#{keyname}:</span></div>"
		else
			return "<div class='leaf level#{level}'><span class='j2hlabel'>#{keyname}:</span></div>"
	else return ""
	
getContentClass = (keyname)->
	if _.isString(keyname)
		return "content"
	else
		return ""
isPlainObject = (val)->
	# Own properties are enumerated firstly, so to speed up,
	# if last one is own, then all properties are own.
	for own key of val
		lastOwnKey = key
	for key of val
		lastKey = key
	return lastOwnKey is lastKey
isLeafValue = (val)->
	return _.isNumber(val) or _.isString(val) or _.isBoolean(val) or _.isDate(val) or _.isNull(val) \
	or _.isUndefined(val) or _.isNaN(val) or _.isFunction(val) or not isPlainObject(val)

isLeafObject = (obj)->
	if not _.isObject(obj)
		return false
	for key, val of obj
		if not isLeafValue(val)
			return false
	return true

isTable = (arr)->
	if not _.isArray(arr)
		return false
	if arr.length is 0 or not _.isObject(arr[0])
		return false
	else
		nonCompliant = _.detect arr, (row)-> not isLeafObject(row)
		if nonCompliant
			return false
		else
			cols = _.keys(arr[0])
			nonCompliant = _.detect arr, (row)-> not _.isEqual cols, _.keys(row)
			if nonCompliant
				return false
			else
				return true
			
drawTable = (arr)->
	drawRow = (headers, rowObj) ->
		return "<td>" + (rowObj[header] for header in headers).join("</td><td>") + "</td>"
	cols = _.keys(arr[0])
	content = ((drawRow(cols, rowObj)) for rowObj in arr)
	
	headingHtml = "<tr><th>" + cols.join("</th><th>") + "</th></tr>" 
	contentHtml = "<tr>" + content.join("</tr><tr>") + "</tr>"
	
	return "<table>#{headingHtml}#{contentHtml}</table>"
	
		
	
render = (name, data, options, level, altrow)->
	#console.log "printing level #{level} for key #{name}"
	contentClass = getContentClass(name)
	if _.isArray(data)
		title = makeLabelDiv(options, level, "#{name} (#{data.length})", 'array')
		if isTable(data)
			subs = drawTable(data)
		else
			subs = "<div class='altRows'>"+(render(idx, val, options, (level+1), (idx % 2)) for val, idx in data).join("</div><div class='altRows'>")+"</div>"
		return "
		<div class=\"j2hcollapse clearfix #{altrow}\">
			#{title}
			<div class=\"#{contentClass}\">#{subs}</div>
		</div>" 
	else if isLeafValue(data)
		title = makeLabelDiv(options, level, name)
		if _.isFunction(data)
			return "#{title}<span class='j2hvalue'>&nbsp;&nbsp;-function() can't render-</span>"
		else if not isPlainObject(data)
			if _.isFunction data.toString
				return "#{title}<span class='j2hvalue'>&nbsp;&nbsp;#{data.toString()}</span>"
			else
				return "#{title}<span class='j2hvalue'>&nbsp;&nbsp;-instance object, can't render-</span>"
		else
			return "#{title}<span class='j2hvalue'>&nbsp;&nbsp;#{data}</span>"
	else
		title = makeLabelDiv(options, level, name, 'object')
		count = 0
		subs = "<div>"+(render(key, data[key], options, (level+1), (count++ % 2) ) for key of data).join("</div><div>")+"</div>"

		inner = """
		<div class=\"j2hexpand clearfix #{altrow}\">
			#{title}
			<div class=\"#{contentClass}\">#{subs}</div>
		</div>
		"""
		return """
				#{if level is 0 then '<div id=\'j2h\'>' else ''}
					#{inner}
				#{if level is 0 then '</div>' else ''}
		"""

exports.render = (json, options)->
	return "#{head}#{render(null,json, options, 0, 0)}"



head = '''
<style type="text/css">
#j2h table {
	border-collapse:collapse;
}
#j2h th {
	color: #888 ;
}
#j2h table,th, td {
	border: 1px solid #DDD;
	padding: 10px 5px ;
}
#j2h th, td {
	text-align:center;
}
#j2h .content {
	padding-left: 30px ;
	font-family: Arial ;
}

#j2h .index {
	font-size: 100% ;
	color: #999 ;
	float: left ;
}
#j2h  .clearfix:after {
	content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
#j2h  .j2hlabel {
	font-family: Helvetica Neue ;
	color: #333 ;
}
#j2h  .j2hvalue {
	font-family: Arial ;
	color: #777 ;
}
#j2h .collapsible > .j2hlabel:hover {
	text-decoration: underline;
}
#j2h .collapsible > .j2hlabel {
	color: #15C;
}
#j2h  .j2hcollapse > div.content {
	display: none ;
}
#j2h  .j2hcollapse > .j2hlabel {
	font-weight: bold ;
}

#j2h .j2hexpand  > div > .j2hlabel, #j2h .j2hcollapse  > div > .j2hlabel {
	background-repeat:no-repeat;
	background-position:left;
	padding-left: 25px ;
	margin: 5px 0px 5px 15px ;
	display: inline-block ;
}

#j2h .j2hexpand  > div > .j2hlabel {
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAD8GlDQ1BJQ0MgUHJvZmlsZQAAKJGNVd1v21QUP4lvXKQWP6Cxjg4Vi69VU1u5GxqtxgZJk6XpQhq5zdgqpMl1bhpT1za2021Vn/YCbwz4A4CyBx6QeEIaDMT2su0BtElTQRXVJKQ9dNpAaJP2gqpwrq9Tu13GuJGvfznndz7v0TVAx1ea45hJGWDe8l01n5GPn5iWO1YhCc9BJ/RAp6Z7TrpcLgIuxoVH1sNfIcHeNwfa6/9zdVappwMknkJsVz19HvFpgJSpO64PIN5G+fAp30Hc8TziHS4miFhheJbjLMMzHB8POFPqKGKWi6TXtSriJcT9MzH5bAzzHIK1I08t6hq6zHpRdu2aYdJYuk9Q/881bzZa8Xrx6fLmJo/iu4/VXnfH1BB/rmu5ScQvI77m+BkmfxXxvcZcJY14L0DymZp7pML5yTcW61PvIN6JuGr4halQvmjNlCa4bXJ5zj6qhpxrujeKPYMXEd+q00KR5yNAlWZzrF+Ie+uNsdC/MO4tTOZafhbroyXuR3Df08bLiHsQf+ja6gTPWVimZl7l/oUrjl8OcxDWLbNU5D6JRL2gxkDu16fGuC054OMhclsyXTOOFEL+kmMGs4i5kfNuQ62EnBuam8tzP+Q+tSqhz9SuqpZlvR1EfBiOJTSgYMMM7jpYsAEyqJCHDL4dcFFTAwNMlFDUUpQYiadhDmXteeWAw3HEmA2s15k1RmnP4RHuhBybdBOF7MfnICmSQ2SYjIBM3iRvkcMki9IRcnDTthyLz2Ld2fTzPjTQK+Mdg8y5nkZfFO+se9LQr3/09xZr+5GcaSufeAfAww60mAPx+q8u/bAr8rFCLrx7s+vqEkw8qb+p26n11Aruq6m1iJH6PbWGv1VIY25mkNE8PkaQhxfLIF7DZXx80HD/A3l2jLclYs061xNpWCfoB6WHJTjbH0mV35Q/lRXlC+W8cndbl9t2SfhU+Fb4UfhO+F74GWThknBZ+Em4InwjXIyd1ePnY/Psg3pb1TJNu15TMKWMtFt6ScpKL0ivSMXIn9QtDUlj0h7U7N48t3i8eC0GnMC91dX2sTivgloDTgUVeEGHLTizbf5Da9JLhkhh29QOs1luMcScmBXTIIt7xRFxSBxnuJWfuAd1I7jntkyd/pgKaIwVr3MgmDo2q8x6IdB5QH162mcX7ajtnHGN2bov71OU1+U0fqqoXLD0wX5ZM005UHmySz3qLtDqILDvIL+iH6jB9y2x83ok898GOPQX3lk3Itl0A+BrD6D7tUjWh3fis58BXDigN9yF8M5PJH4B8Gr79/F/XRm8m241mw/wvur4BGDj42bzn+Vmc+NL9L8GcMn8F1kAcXjEKMJAAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAvUlEQVQokcXSsQqDMBAG4DM5dNEIR8ic0c0XyEv0DfoKPlEfQ1fJ0t2lu0snt87XpRYbG0Gh9CAEcnw/B7mEmeFoicPyZ5iISq31hYjKXZiISkTs8zw/I2IfC1jhGapC1VmWgSpUHQsQMShRAgCARBkNEFswTdP7VoCIQWNMNwzDyRjThQEfeJqmh7V2XELvfQMAV+99swyw1o7vuZl5PpVzrnXOtcxcLd6jvSRYz+p13778zKoX4l31v91+Aia/VebVEqkCAAAAAElFTkSuQmCC) ;
}

#j2h .j2hcollapse > div > .j2hlabel {
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAD8GlDQ1BJQ0MgUHJvZmlsZQAAKJGNVd1v21QUP4lvXKQWP6Cxjg4Vi69VU1u5GxqtxgZJk6XpQhq5zdgqpMl1bhpT1za2021Vn/YCbwz4A4CyBx6QeEIaDMT2su0BtElTQRXVJKQ9dNpAaJP2gqpwrq9Tu13GuJGvfznndz7v0TVAx1ea45hJGWDe8l01n5GPn5iWO1YhCc9BJ/RAp6Z7TrpcLgIuxoVH1sNfIcHeNwfa6/9zdVappwMknkJsVz19HvFpgJSpO64PIN5G+fAp30Hc8TziHS4miFhheJbjLMMzHB8POFPqKGKWi6TXtSriJcT9MzH5bAzzHIK1I08t6hq6zHpRdu2aYdJYuk9Q/881bzZa8Xrx6fLmJo/iu4/VXnfH1BB/rmu5ScQvI77m+BkmfxXxvcZcJY14L0DymZp7pML5yTcW61PvIN6JuGr4halQvmjNlCa4bXJ5zj6qhpxrujeKPYMXEd+q00KR5yNAlWZzrF+Ie+uNsdC/MO4tTOZafhbroyXuR3Df08bLiHsQf+ja6gTPWVimZl7l/oUrjl8OcxDWLbNU5D6JRL2gxkDu16fGuC054OMhclsyXTOOFEL+kmMGs4i5kfNuQ62EnBuam8tzP+Q+tSqhz9SuqpZlvR1EfBiOJTSgYMMM7jpYsAEyqJCHDL4dcFFTAwNMlFDUUpQYiadhDmXteeWAw3HEmA2s15k1RmnP4RHuhBybdBOF7MfnICmSQ2SYjIBM3iRvkcMki9IRcnDTthyLz2Ld2fTzPjTQK+Mdg8y5nkZfFO+se9LQr3/09xZr+5GcaSufeAfAww60mAPx+q8u/bAr8rFCLrx7s+vqEkw8qb+p26n11Aruq6m1iJH6PbWGv1VIY25mkNE8PkaQhxfLIF7DZXx80HD/A3l2jLclYs061xNpWCfoB6WHJTjbH0mV35Q/lRXlC+W8cndbl9t2SfhU+Fb4UfhO+F74GWThknBZ+Em4InwjXIyd1ePnY/Psg3pb1TJNu15TMKWMtFt6ScpKL0ivSMXIn9QtDUlj0h7U7N48t3i8eC0GnMC91dX2sTivgloDTgUVeEGHLTizbf5Da9JLhkhh29QOs1luMcScmBXTIIt7xRFxSBxnuJWfuAd1I7jntkyd/pgKaIwVr3MgmDo2q8x6IdB5QH162mcX7ajtnHGN2bov71OU1+U0fqqoXLD0wX5ZM005UHmySz3qLtDqILDvIL+iH6jB9y2x83ok898GOPQX3lk3Itl0A+BrD6D7tUjWh3fis58BXDigN9yF8M5PJH4B8Gr79/F/XRm8m241mw/wvur4BGDj42bzn+Vmc+NL9L8GcMn8F1kAcXjEKMJAAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAy0lEQVQokcXSQQqDMBAF0J8SDIRAQeYIknWWXbjwKHbppeIxeoAcQ6EXEHfdFaabRixNFKTQgUBg/htmMYKZcbROh+VPMRH1RNSngqmeXDeNMe37j2marns9CQBlWZ6J6CKEiPk2hiJUSgEAiqK4fKw9z/PDe99prUcAUErBGNMS0X0Ntdaj975b9mbm+GQIoXHODdZattZyVVUc/865IYTQMLOMZo2TA3Iwhb8G5GAOLwPqur7lIDNDbJynBFABGAE8U4EtvFv/u+0XXc3BmKS0o/MAAAAASUVORK5CYII=);
}

#j2h .j2hcollapse > span.collapsible:before {
	border-radius: 2px;
	border-color: #A44;
	border-style: solid;
	border-width: 1px;
	color: #A44;
	content: '+';
	display: inline-block;
	line-height: 7px;
	margin: 0 2px;
	overflow: hidden;
	padding: 1px;
	font-size: 11px ;
}

#j2h .j2hexpand > span.collapsible:before {
	border: none ;
	color: #A44;
	content: '-';
	display: inline-block;
	line-height: 7px;
	margin: 4px;
	overflow: hidden;
	padding: 1px;
	font-size: 11px ;
}

#j2h.level0 {
	font-size: 25px ;
}
#j2h  .level1 {
	font-size: 22px ;
}


#j2h .leaf {
	color: #666;
	display: inline ;
}

#j2h .altRows:nth-child(odd)    { background-color:#ddd; }
#j2h .altRows:nth-child(even)    { background-color:#fff; }

#j2h tr:nth-child(odd)    { background-color:#eee; }
#j2h tr:nth-child(even)    { background-color:#fff; }


</style>
<script type=text/javascript>
	j2h = {
		toggleVisibility: function(el, name) {
			j2h.toggleClass(el.parentElement,'j2hcollapse j2hexpand') ;
		},
		classRe: function(name) {
			return new RegExp('(?:^|\\\\s)'+name+'(?!\\\\S)') ;
		},
		addClass: function(el, name) {
			el.className += " "+name;
		},
		removeClass: function(el, name) {
			var re = j2h.classRe(name) ;
			el.className  = el.className.replace( j2h.classRe(name) , '' )
		},
		hasClass: function(el, name) {
			var re = j2h.classRe(name) ;
			return j2h.classRe(name).exec(el.className);
		},
		toggleClass: function(el, name) {
			var names = name.split(/\\s+/) ;
			for (n in names) {
				if (j2h.hasClass(el, names[n])) {
					j2h.removeClass(el, names[n]) ;
				} else {
					j2h.addClass(el, names[n]) ;
				}
			}
		}
	};
</script>
'''