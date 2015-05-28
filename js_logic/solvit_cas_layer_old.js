/* solvit_cas_layer.js. - The "math" Logic of Solvit.

The iOS code handles drawing. 
Each line in the Solvit Drawing pad is sent over to the logic layer of Solvit as a string with a corresponding line id. This is done via a client side request to a javascript file with GET parameters in the following form:.
	- an input of "a=5", must be sent in the following form: ".../cas/index.html?input=a%3D5", where certain symbols (such as the equals sign) are encoded using an objective c URIencode function (http://stackoverflow.com/questions/11302172/encodeuricomponent-equivalent-object-c)
	-after a pause of about a second (soon we will transition to promise feedback) the iOS code will have to retrieve the output by scraping all of the text outputted the cas/index.html file.
	-this text is stored in JSON.



*/
var solvit = {}; // an object to store everything in the "Solvit document"
solvit.variables = []; // an array of "variable" objects which contain the name of the variable - e.g. 'a' - and the value of the variable - e.g. 11.
solvit.inputs = []; // an array of "input" objects sent to the Math CAS.

var response = {};



//Input class constructor
function Input(id, input){
	this.id = id;
	this.input = input;
	this.cq = CQ(input);



	//Code to run upon instantiation of object.
	var initializationValue = getInitializationValue(input);

	if (initializationValue !== false){// if the input is an expression such as "a = 5"
		this.type = 'initialization';
		response.text = initializationValue['value'];
		var variable = initializationValue['variable'];
		solvit.variables.push(variable);
		console.log('a variable', variable, ' was just pushed');
	}
	else { //if the input is an expression such as "2 + 2"
		var allVariables = this.cq.getAllVariables();
		for (var i = 0; i < allVariables.length; i++) 
			var variable = allVariables[i];
			var value = allVariables['value'];
			console.log("checking for if a value for the following variable exists in the workspace: ", variable);
			console.log("the value found for the variable was ", value);
			if(value !== false){
				var o = {};
				o[variable] = value;
				this.cq = this.cq.sub(o);
				console.log("the value now should be subbed in for that variable");
			}
	}

}

//Input prototype/"class" definition
Input.prototype = {
	type: null,
	id: null,
	input: null,
	cq: null,
	toString: function(){
		if (this.type == "initialization"){
			console.log(getInitializationValue(this.input));
			return getInitializationValue(this.input);
		} 
		else {
			return this.cq.toString();
		}
	}

}





	//var CQinput = CQ(input);
	//parseInput(input);

//2 get input
	//RULES for input
	//// All spaces must be stripped
	//// Replace any plus signs with %2B
	//// Encode certain url characters. e.g.  //an input of "a=5", must be sent in the following form: ".../cas/index.html?input=a%3D5", where certain symbols (such as the equals sign) are encoded using an objective c URIencode function (http://stackoverflow.com/questions/11302172/encodeuricomponent-equivalent-object-c)


	var input = new Input(getURLParameter("id"), getURLParameter('input'));

	response.text = input.toString();
	solvit.inputs.push(input);
	//response.text = input.cq.toString();
		//variable declaration: NOPE
		//easy expression: YES
		//substitute expression:


//3 create necessary objects based on input
	//create objectbob
		//have it store value of simple expression

		//have it output value of expression

		//create variables if input is a = 5
//4 solve necessary stuff based on input
//5 return response via document.write in json format.

/*

*/

/*
function Response(){
	this.
} */

if(typeof(Storage) !== "undefined") {
	//response.error = {};
	//response.error.web_storage_support = true;

    // Code for localStorage/sessionStorage.
   // localStorage.test = "bob";
   // localStorage.test2 = "alice";

/*
   var sarah = "yolo";
   console.log(sarah);
   sarah = undefined;
   console.log(sarah);
    console.log(localStorage.test);
	    console.log(localStorage.test3);
	    localStorage.test = undefined;
	console.log(localStorage.test === undefined);
	console.log(localStorage);
	var variable = "test2";
	delete localStorage[variable];
	console.log(localStorage);


	for(var propt in localStorage)
		console.log("localStorage " + propt + " - " + localStorage[propt]);
*/
} else {
    // Sorry! No Web Storage support..
    //response.error.web_storage_support = false;
}


//only works for single character variables
function getInitializationValue(input){

	if(/^[a-zA-Z]=/.test(input)){
		var variable = {};

		//if so then create a string that stores that character. e.g. 'a'
			//TODO: check if that variable already exists.
		variable["name"] = /^[a-zA-Z]/.exec(input)[0];

		//and determine and store the value of that variables
		var index = 2; //would be location of where the value after the equals sign starts. //TODO: change 2 to the actual place where the equals sign would be.

		variable["value"] = input.substring(2);

		//parsed = true;
		return {value: variable['value'], variable: variable};
	}
	else { 
		console.log('regex did not find an initialization');
		return false;
	}


}

function getVariableValue(variable){
	for (var i = 0; i < solvit.variables.length; i++){
		if(solvit.variables[i]['name'] === variable.toString())
			return solvit.variables[i]['value'];
		else 
			return false;
	}
}



function parseInput(input){

	//TODO: convert input correct format
	console.log('parse input function called');
	var parsed = false;
	//1: Look for any variable initializations
		//check if the input starts with a string such as "a=3".
			if(/^[a-zA-Z]=/.test(input)){
				var variable = {};

				//if so then create a string that stores that character. e.g. 'a'
					//TODO: check if that variable already exists.
				variable["name"] = /^[a-zA-Z]/.exec(input)[0];

				//and determine and store the value of that variables
				var index = 2; //would be location of where the value after the equals sign starts.

				variable["value"] = input.substring(2);
				
				solvit.variables.push(variable);
				console.log('a variable', variable, ' was just pushed');

				parsed = true;
			}
	//2: If the input is an expression, evaluate it (if its variables have stored values)
	if (!parsed){

		//the input is an expression if the input does not contain an equals sign
		if (/^[^=]+$/g.test(input)){
			console.log('the input does not contain an equals sign');
/*
			//1. Create a list of all the variables found in the input expression
			var inputString = input;
			var variablesFoundInExpression = [];

			while (inputString.length > 0 ){
				match = /([a-zA-Z]+(?: [a-zA-Z]+)*)/g.exec(inputString);
				if (match != null){
					console.log("There was a variable %s found in the expression at index position %d", match[0], match.index);

					variablesFoundInExpression.push(match[0]);
					inputString = inputString.substring(match.index + 1);
				}
			};

			//2. Determine which variables have values (e.g. they are currently present in the variables array).

			variablesWithValues = [];

			for (var i = 0; i < variables.length; i++){
				for (vf in variablesFoundInExpression){
					console.log("the variable in the expression is %s, and the variable in the array is %s with the value %d", vf, variables[i]['name'], parseInt(variables[i]['value']));
					if (vf == variables[0]["name"]){
						console.log(" %s, a variable in this expression was found to already have the value %d", variables[0]['name'], variables[0]['value']);
						variablesWithValues.push(variables[0]);
					}
				}
			}

			//3. Simplify the expression substituting in values for each of the variables that do have values.

				//3a. If there are any variables iwth values that could be substituted in, substitute them into the expression
				if (variablesWithValues.length > 0){
					

					//TODO: May not work as intended for certain values of variables, if the value is an expression. e.g. if b = a + 5, and a = 2b. 
				}

				//3b. Simplify/evaluation the expression.



			*/
			//console.log(characters);
		}
		else console.log('the input contains an equals sign');

	}

	//3: If the input is an equation, and there is only one unknown variable, solve for that unknown variable.


}


//4 Add local storage so that when you revisit the page a second or a tenth of a second later, it already has the values of your previous variables stored.
	//-Trying to make this storage via JS, so it's easier to port to android.
/*
var SIdocument = function(){

}

SIdocument.prototype.workspaces = [];
*/

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}


response.solvit = solvit;
//response.text = 
document.write(JSON.stringify(response));
localStorage.solvit = JSON.stringify(solvit);