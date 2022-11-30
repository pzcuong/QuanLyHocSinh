j2h = require("../lib/json2html")
fs = require("fs")

class Aclass
instance = new Aclass()

class AnotherClass
	toString: ->
		return "Instance of AnotherClass"
anotherInstance = new AnotherClass()

afunction = (->)

myJson =
	a_table: [
		name: "hugo"
		tel: "1234561234"
		email: "hugo@blah.com"
	,
		name: "joe"
		tel: "1234569999"
		email: "joe@blah.com"
	 ]
	straigh_array: [ "a", "b", "c" ]
	an_object:
		myAttribute:
			a: 1
			b: 2

		anotherAttribute:
			r: 2
			d: 2
	an_instance:
		instance
	another_instance:
		anotherInstance
	a_function:
		afunction

fs.writeFileSync("./test/test.html", "#{j2h.render(myJson)}")