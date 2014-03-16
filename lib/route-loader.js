var fs = require("fs");
var isLoggingEnabled = false;
var red = "\u001b[31m";
var reset = "\u001b[0m";

function argsFromPosition(args, position){
  return Array.prototype.splice
         .call(args, position, args.length);
}

function log(){
  if(isLoggingEnabled){
    console.log(arguments[0], argsFromPosition(arguments, 1));
  }
}

function requireAllIn(path){
  var requiredFiles = arguments[1] || {};
  var files = fs.readdirSync(path);

  files.forEach(function(f){
    var filename;
    var filepath = fs.realpathSync(path + f);
    var stats = fs.statSync(filepath);
    
    if(stats.isFile() && f.match(/.js$/g)){
      filename = f.split(".")[0];

      log("found js-file: ", filename);
      log(red + "trying to require: %s" + reset, filepath);

      requiredFiles[filename] = require(filepath);
    }
    else if(stats.isDirectory()){
      log("directory found: ", f);
      load(filepath + "/", requiredFiles);
    }
    else{
      log("ignoring: ", f);
    }
  });
  return requiredFiles;
}

/*
  Arguments: path = directory to load (default=/routes)
             rest = parameters to inject for each require
*/
function injectRoutes(path){
  var files = requireAllIn(path);
  var args = argsFromPosition(arguments, 1);

  for(var file in files){
    files[file].apply(undefined, args);
  }
}

function load(){
  var args = argsFromPosition(arguments, 0);
  args.unshift("./routes/");

  injectRoutes.apply(undefined, args);
}

exports.enableLogging = function(){
  isLoggingEnabled = true;
};

exports.disableLogging = function(){
  isLoggingEnabled = false;
};

exports.requireAllIn = requireAllIn;
exports.injectRoutes = injectRoutes;
exports.load = load;