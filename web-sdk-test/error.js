window.onerror = function(messageOrEvent, source, lineNo, columnNo, error) {
    // messageOrEvent = JSON.parse(messageOrEvent);
    // console.log(messageOrEvent);
    // console.log(JSON.stringify(messageOrEvent,null,"\t"));

    return false;

	// var string = messageOrEvent.toLowerCase();
 //    var substring = "script error";
 //    if (string.indexOf(substring) > -1){
 //        alert('Script Error: See Browser Console for Detail');
 //    } else {
 //        var message = [
 //            'Message: ' + messageOrEvent,
 //            'URL: ' + source,
 //            'Line: ' + lineNo,
 //            'Column: ' + columnNo,
 //            'Error object: ' + JSON.stringify(error)
 //        ].join(' \n ');

 //    }
	// console.log("--------------eof-----------");
    return false;
}	


function MyError(message) {
  this.name = 'MyError';
  this.message = message || 'Default Message';
  this.stack = (new Error()).stack;
}

function throwErr(args){
    args = JSON.stringify(args,null,"\t");
	throw new Error(args); 
    // throw args;
}