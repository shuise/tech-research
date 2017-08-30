/*
https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
http://caniuse.com/#search=insertAdjacentHTML
*/
function insertHTML(el,html){
	if(document.createElement("div").insertAdjacentHTML){
		el.insertAdjacentHTML("beforebegin", html);		
	}else{
		el.insertHTML = html;
	}
}