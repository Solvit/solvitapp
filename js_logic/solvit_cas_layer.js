/* solvit_cas_layer.js. - The "math" Logic of Solvit.

The iOS code handles drawing. 
Each line in the Solvit Drawing pad is sent over to the logic layer of Solvit as a string with a corresponding line id. This is done via a client side request to a javascript file with GET parameters in the following form:.
	- an input of "a=5", must be sent in the following form: ".../js_logic/index.html?input=a%3D5&id=24", where certain symbols (such as the equals sign) are encoded using an objective c URIencode function (http://stackoverflow.com/questions/11302172/encodeuricomponent-equivalent-object-c)
	-after a pause of about a second (soon we will transition to promise feedback) the iOS code will have to retrieve the output by scraping all of the text outputted the js_logic/index.html file.
	-this text is stored in JSON.



*/

//TODO: localStorage.

//1. Initialize objects.

	//first retrieve the previous workspace from memory
	if (localStorage.solvit)
		var solvit = JSON.parse(localStorage.solvit);
	else
	{
		var solvit = {}; // an object to store everything in the "Solvit document"
		solvit.variables = []; // an array of "variable" objects which contain the name of the variable - e.g. 'a' - and the value of the variable - e.g. 11.
		solvit.inputs = []; // an array of "input" objects sent to the Math CAS.
	}
	
	var response = {}; // Will contain 1) the immediate text sent back to the ios. Typically just a short phrase or number. For example if the input passed in to the javascrip was "2+2", then response.text will contain "4". 2) response.solvit. Response.solvit is an object that stores a lot of information about the workspace such as all the previous inputs, as well as all the variables contained in those inputs.


//2. Receive GET request input from iOS.
	if (getURLParameter('clear') == 'true'){//e.g. if the url is like js_logic/index.html?clear=true
		//Clear and reinitialize the workspace
		solvit = {};
		solvit.variables = [];
		solvit.inputs = [];
		//clear the localStorage
		localStorage.solvit = '';

		response.text = '';
		response.message = 'Workspace successfully cleared';
	}
	else if (getURLParameter('id') && getURLParameter('input')){ // process the input normally
		var input = new Input(getURLParameter("id"), getURLParameter('input'));
		solvit.inputs.push(input);

		response.text = input.toString();
		response.solvit = solvit;
	}
	else { //there was invalid GET parameters.
		response.text = 'Error';
		response.error = {};
		response.error.code = '1';
		response.error.text = 'Invalid get parameters. Valid options include 1) giving values to both "id" and "input" and uriencoding those values as in ".../js_logic/index.html?input=a%3D5&id=24". To URIencode see (http://stackoverflow.com/questions/11302172/encodeuricomponent-equivalent-object-c) or 2) clearing the workspace as in ".../js_logic/index.html?clear=true."';
	}


//3. Output JSON for iOS to obtain.
document.write(JSON.stringify(response));

//4. Save the workspace so that when the next input is sent in, that input will be able to interact with the previous inputs (for example, if variables were defined in previous inputs).
localStorage.solvit = JSON.stringify(solvit);



//4. Classes/functions

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


function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}
