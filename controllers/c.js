/**
 * GET /
 * canvassApp page.
 */
 
 
var fs = require('fs'); //needed to read static files
var url = require('url');  //needed to parse url strings

//Hard coded size of client window -should be done better
var canvasWidth = 600; //hard code expected client height
var canvasHeight = 300; //hard coded expected client width

var MIME_TYPES = {
    'css': 'text/css',
    'gif': 'image/gif',
    'htm': 'text/html',
    'html': 'text/html',
    'ico': 'image/x-icon',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'js': 'text/javascript', //should really be application/javascript
    'json': 'application/json',
    'png': 'image/png',
    'txt': 'text/text'
};

//words and locations maintained by server
var words = [];
words.push({word: "Louis", x: 100, y: 200});
words.push({word: "Sean", x: 200, y: 250});


var colourConsole = function(request) {
  if(request == "GET")
    return (request).green;
  else if(request == "PUT")
    return (request).red;
  else if(request == "POST")
    return (request).blue;
  return (request).rainbow;
}
function addWord(aWordString){

    //add aWordString to the words collection if it is not already there
    if(aWordString == null || aWordString.length == 0) return;

    for(var i=0; i<words.length; i++){
       if(words[i].word == aWordString) return; //already there
    }
    //add word at random location
    words.push({word: aWordString,
                   x: 20 + Math.floor(Math.random()*(canvasWidth -40)),
                   y: 20 + Math.floor(Math.random()*(canvasHeight - 40))});


}

function moveWord(aWord, aDirection){
   //direction should be one of left, right, up, down
   //Exercise: change this so words stay entirely within canvas area
   console.log("MOVE THE WORD".green);
   var increment = 10;
   for(var i=0; i<words.length; i++) {
        var w = words[i];
        if(w.word == aWord){
          if(aDirection == "right" && w.x <= canvasWidth - increment) w.x += increment;
          if(aDirection == "left" && w.x >= increment) w.x -= increment;
          if(aDirection == "up" && w.y >= increment) w.y -= increment;
          if(aDirection == "down" && w.y <= canvasHeight - increment) w.y += increment;
        }
   }

}


exports.index = function(req, res) {
    
    var words = [];
    words.push({word: "Louis", x: 100, y: 200});
    words.push({word: "Sean", x: 200, y: 250});
   //parse the query parameters if there are some
   var urlObj = url.parse(req.url, true, false);
//   console.log(urlObj);

   if(urlObj.pathname != "/pollData"){
      //don't show details of /pollData requests
      console.log('\n============================');
      console.log("http request: " + req.url);
      console.log("METHOD: " + req.method);
    console.log("PATHNAME: " + urlObj.pathname);
    //show any URL query parameters for GET methods
    for(key in urlObj.query)
       console.log("   " + key + ": " + urlObj.query[key]);
   }

//   console.log(urlObj);
   if(req.method == "POST" || req.method == "PUT"){
   //handle http POST or PUT reqs

      var receivedData = '';

      //attached event handlers to collect POST message data body
      //which may arrive in chunks
      req.on('data', function(chunk) {
         receivedData += chunk;
      });
 
    //event handler for the end of the POST message data
      req.on('end', function(){
         //console.log('REQUEST END: ');
	   var dataObj;
	   try {
	      //try to parse received data as valid JSON
            dataObj = JSON.parse(receivedData);
         } catch (e) {
	        //invalid JSON data format
              console.log('ERROR: data not valid JSON: ', receivedData);
              res.writeHead(404);
              res.end('ERROR: Invalid JSON data');
              return;
         }

         console.log("test");

	   if(urlObj.pathname == "/move"){
	     //move request
	     //expected message data format: {word:"Bird", direction:"right"}
           console.log('received data: ', receivedData);
           moveWord(dataObj.word, dataObj.direction);
	   }
	   else if(urlObj.pathname == "/add"){
	    //move request
	    //expected message data format: {word:"Bird"}
          console.log('received data: ', receivedData);
          addWord(dataObj.word);
	   }
	   else if (urlObj.pathname == "/pollData"){
            console.log("METHOD: " + req.method);
            //nothing extra to do
	   }
	   //echo back the location of all the words as a JSON object
	   var responseObject = {words: words};
         res.writeHead(200, {'Content-Type': MIME_TYPES["json"]}); 
         res.end(JSON.stringify(responseObject)); //send just the JSON object
      });

   }
 
   if(req.method == "GET"){
 //handle HTTP GET requests

   }
   //echo back the location of all the words as a JSON object
   var responseObject = {words: words};
   res.writeHead(200, {'Content-Type': MIME_TYPES["json"]}); 
   res.end(JSON.stringify(responseObject)); //send just the JSON object
};