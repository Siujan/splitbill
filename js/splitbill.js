/* Model */
var totalAmount = 0;
var peopleQty = 0;
var listOfPeople = [];

function setTotalAmount(input){
	if(listOfPeople.length > 1){
		evenDistributeTotal(input);
	}
	totalAmount = input;
}

function setPeopleQty(input){
	if(input > 1){
		updateListOfPeopleQty(input);
		evenDistributeQty();
		peopleQty = input;
	}	
}

function getReminder(){
	let actualTotal = 0;
	for(let i = 0;i<listOfPeople.length;i++){
		actualTotal = (actualTotal + parseInt(listOfPeople[i].price * 100));
	}
	return (totalAmount*100 - actualTotal)/100;
}

function updateListOfPeopleQty(qty){
	let curListLength = listOfPeople.length;
	if(qty > curListLength){
		for(let i = curListLength;i<qty;i++){
			var name = "Person " + (i + 1);
			appendPeople(i,name);				
		}		
	}else{
		for(let i = qty;i<curListLength;i++){
			listOfPeople.pop();
		}
	}	
}

function evenPeopleById(id){
	listOfPeople[id].type = "even";
	evenDistributeQty();
}

function updatePeoplePriceById(id,price){
	listOfPeople[id].price = price;
	listOfPeople[id].type = "fixed";
	evenDistributeQty();
}

function updatePeopleNameById(id,name){
	listOfPeople[id].name = name;
}

function appendPeople(id,name,price = 0){
	let people = {
		"id" : id,
		"name": name,
		"price": price,
		"type": "even" /* Even; Fixed;*/
	}	
	listOfPeople.push(people);	
}

function getListByType(type){
	let listByType = [];
	for(let i = 0;i<listOfPeople.length;i++){
		if(listOfPeople[i].type == type){
			listByType.push(listOfPeople[i]);
		}
	}
	return listByType;
}

function evenDistributeQty(){
	let evenAmount = totalAmount;
	let fixedList = getListByType("fixed");	
	for(let i = 0;i < fixedList.length;i++){		
		evenAmount -= listOfPeople.find(x => x.id === fixedList[i].id).price;
	}		
	
	setEvenTypeAmount(evenAmount)	
}

function evenDistributeTotal(input){
	let evenAmount = input;
	let fixedList = getListByType("fixed");
	for(let i = 0;i < fixedList.length;i++){
		let ratioPrice = (fixedList[i].price/totalAmount) * input;
		ratioPrice = ratioPrice.roundDown(ratioPrice,2);
		listOfPeople.find(x => x.id === fixedList[i].id).price = ratioPrice;
		evenAmount -= ratioPrice;
	}
	setEvenTypeAmount(evenAmount)
	
}

function roundDown(value,count){
	value = value.toString();
	if(value.indexOf(".") > 0){
		return parseFloat(value.substring(0,value.indexOf(".") + count + 1));
	}else{
		return value;
	}
}

function setEvenTypeAmount(evenAmount){
	let evenList = getListByType("even");
	evenAmount = evenAmount/evenList.length;
	evenAmount = roundDown(evenAmount,2);	
	for(let i = 0;i < evenList.length;i++){
		listOfPeople.find(x => x.id === evenList[i].id).price = evenAmount;
	}		
}

/* Maximum possible Even Amount to add*/
function totalEvenAmount(){
	let totalAmount = 0;
	for(let i = 0;i<listOfPeople.length;i++){
		if(listOfPeople[i].type == "even"){
			totalAmount += parseFloat(listOfPeople[i].price);
		}
	}
	return totalAmount;
}

/* Model */

/* Controller */

var openSec = 0;
var openSecTime = 1000;

/* Set Comma to Price */
function setCommaToPrice(price){
	let decimal = "";	
	if(price.indexOf(".") > -1){
		decimal = price.substring(price.indexOf(".")+1,price.length);
		price = price.substring(0,price.indexOf("."));
	}
    let thousand = Math.trunc((price.length-1)/3);
    for(let i=1;i<=thousand;i++){
      price = price.substring(0, price.length - (i-1) - i*3) + "," + price.substring(price.length - (i-1) - i*3,price.length);  
    }
	
	if(decimal !== "" && decimal !== "00"){
		price = price + "." + decimal;
	}
    return price;
}

/* Remove Comma from price*/
function removeCommaFromPrice(input){
	return input.replace(/,/g, '');
}

/* Keyboard Input for Total Price */
function totalPriceKeyboardInput(input){
	let originalInput = input;
	let totalPriceInput = document.getElementById("totalPriceInput");
	let totalPriceValue = "";
	input = removeCommaFromPrice(input);
	if(input.match(/^[0-9]+$/) === null){
		if(input.length < 2){
			totalPriceValue = "";
		}else{
			totalPriceValue = originalInput.replace(input.match(/\D/g),'');
		}		
	}else if(input.charAt(0) == "0"){
		let output = input.substring(1, input.length);
		output = setCommaToPrice(output);
		totalPriceValue = output;
	}else{
		totalPriceValue = setCommaToPrice(input);
	}
	
	totalPriceInput.value = totalPriceValue;
}

/* Keyboard Input for People quantity */
function peopleQtyKeyboardInput(input){
	let peopleQuantityInput = document.getElementById("peopleQtyInput");

	if(input.charAt(0) == "0"){    
	  input = input.substring(1, input.length);
	  peopleQuantityInput.value = input;
	}
  
	if(input.match(/^[1-9]+$/) === null){
		if(input.length < 2){
			peopleQuantityInput.value = "";		
		}else{
			input = input.replace(input.match(/\D/g),'');
			peopleQuantityInput.value = input;
		}		
	}
  
}

function updateQtyTotal(action){
	let qty = document.getElementById("peopleQtyInput");
	let total = document.getElementById("totalPriceInput");
	if(isEmpty(qty) || isEmpty(total)){
		console.log("is Empty");
	}else{
		total = removeCommaFromPrice(total.value);
		updateQtyTotalController(qty.value,total);
		
		setTimeout(function(){       
			reminder = getReminder();
			document.getElementById("reminder").innerHTML = "Reminder : " + reminder;
			document.getElementById("reminder").style.display = "block";									
					}, openSecTime);	
	
	}
}

function isEmpty(input){
	if(input.value == "" || input.value == null){
		alertEmpty(input);
		return true;
	}else{	
		return false;
	}
}

function alertEmpty(input){
	let addedClass = "emptyAlert";
	let animTime = 1000;
	input.classList.add(addedClass);
	setTimeout(()=>input.classList.remove(addedClass),animTime);
	// input.animate([
			// { boxShadow: '0px 0px 0px #ff0000'},
			// { boxShadow: '0px 0px 5px #ff0000',offset: 0.2}, 
			// { boxShadow: '0px 0px 5px #ff0000',offset: 0.8}, 
			// { boxShadow: '0px 0px 0px #ff0000'}  
		// ],{
		  // duration:2000,
		  // easing:'ease'
		// });	
}

function updateQtyTotalController(qty,total){
	if(peopleQty.toString != qty || total !== totalAmount || total !== "" || qty !== ""){
		setPeopleQty(qty);
		setTotalAmount(total);
		if(openSec == 0){
			if(window.innerWidth > 600){
				openSecSection();
				setTimeout(function(){       
					updateListOfPeople();}, openSecTime*2);					
			}else{
				document.getElementById("result-section").style.display = "block";	
				document.getElementById("input-section").style.marginTop = "2rem";
				updateListOfPeople();
			}				
		}else{
			updateListOfPeople();	
		}
	}
}

/* Quantity Button Controller */
function updateQuantity(qty,total){
	if(peopleQty.toString != qty){
		setPeopleQty(qty);
		if(total !== ""){
			if(openSec == 0){
				openSecSection();
				setTimeout(function(){       
					setTotalAmount(total);
					updateListOfPeople();}, openSecTime);				
			}else{
				setTotalAmount(total);
				updateListOfPeople();				
			}		
		}	
	}
}

/* Next Total Button Controller */
function updateTotal(qty,total){
	if(total !== totalAmount){
		setTotalAmount(total);
		if(qty !== ""){
			if(openSec == 0){
				openSecSection();
				setTimeout(function(){     
					setPeopleQty(qty);
					updateListOfPeople();}, openSecTime);
			}else{
				setPeopleQty(qty);
				updateListOfPeople();				
			}
		}
	}
}

function updateListOfPeople(){
	let timeDelay = 0;
	let childrenLength = document.getElementById("listOfPeople").children.length;
	if(peopleQty > childrenLength){
		for(let i = 0;i<peopleQty;i++){
			if( document.getElementById("card_" + i) == null ) {
				setTimeout(function(){     
					appendMainPeople(i);}, timeDelay);				
				timeDelay += 400;
			}else{
				updatePeoplePrice(i);
			}
		}		
	}else{
		for(let i = 0;i < childrenLength;i++){
			if (i >= listOfPeople.length) {
				document.getElementById("card_" + i).remove();
			}else{
				updatePeoplePrice(i);
			}
		}
	}
  
}

function updatePeoplesPrice(){
	let childrenLength = document.getElementById("listOfPeople").children.length;
	for(let i=0;i<childrenLength;i++){
		updatePeoplePrice(i);
	}
	
	reminder = getReminder();
	document.getElementById("reminder").innerHTML = "Reminder : " + reminder;
	document.getElementById("reminder").style.display = "block";	
	
}

function updatePeoplePrice(id){
	let card_childs = document.getElementById("card_" + id).children;
	let updatedPrice = setCommaToPrice(listOfPeople[id].price.toString());
	card_childs[1].value = updatedPrice;
	
	
	if(listOfPeople[id].type == "even"){
		card_childs[1].animate([
			{ background: '#ffffff',
				color: '#000000' },
			{ background: '#ffe8d6',
				color: '#ffffff' }, 
			{ background: '#ffffff',
				color: '#000000'}  
		],{
		  duration:2000,
		  easing:'ease'
		});	
	}
}

/* Append new Main Section People */
function appendMainPeople(index){
	let value = listOfPeople[index].price;
	var card = document.createElement("div");
	card.id = "card_" + index;
	var name = document.createElement("input");
	name.id = "cardName_" + index;
	name.setAttribute("type", "text");
	var price = document.createElement("input");
	price.setAttribute("type", "text");
	price.setAttribute("oninput","cardPriceKeyboardInput(this.value,this.id)");
	price.id = "cardPrice_" + index;
	var btn = document.createElement("button");	
	btn.id = "cardButton_" + index;
	var evenBtn = document.createElement("button");	
	evenBtn.id = "updateEven_" + index;	
	
	card.classList.add("card");
	name.classList.add("card-name");
	price.classList.add("card-price");
	btn.classList.add("card-button");
	evenBtn.classList.add("card-button");
	
	var btnNode = document.createTextNode("Update");
	var btnEvenNode = document.createTextNode("Even");
	name.value = listOfPeople[index].name;
	price.value = setCommaToPrice(value.toString());
	
	btn.appendChild(btnNode);
	evenBtn.appendChild(btnEvenNode);
	
	btn.setAttribute("onclick","mainPeopleButton(this.id)");
	evenBtn.setAttribute("onclick","evenUpdateButton(this.id)");
	
	card.appendChild(name);
	card.appendChild(price);
	card.appendChild(btn);
	card.appendChild(evenBtn);
	document.getElementById("listOfPeople").appendChild(card);	
}

/* Update Right Section Name of People */
function updatePeopleNameView(id){
	let card_childs = document.getElementById("card_" + id).children;
	card_childs[0].innerHTML = listOfPeople[id].name;
	
	card_childs[0].animate([
		{ background: '#ffffff',
			color: '#949494' },
		{ background: '#ffe8d6',
			color: '#ffffff' }, 
		{ background: '#ffffff',
			color: '#949494'}  
	],{
	  duration:1500,
	  easing:'ease'
	});		
}

/* Update Individual People Information Button */
function mainPeopleButton(id){
	let index = id.substring(id.indexOf("_")+1,id.length);
	let name = document.getElementById("cardName_" + index).value;
	let price = document.getElementById("cardPrice_" + index).value;
	
	if(name != listOfPeople[index].name){
		updatePeopleNameById(index,name);
		updatePeopleNameView(index);		
	}
		
	/* update price individu */
	price = removeCommaFromPrice(price);
	
	
	if(price !== listOfPeople[index].price){
		updatePeoplePriceById(index,price);
		updatePeoplesPrice();
	}
}

function evenUpdateButton(id){
	let index = id.substring(id.indexOf("_")+1,id.length);
	evenPeopleById(index);
	updatePeoplesPrice();
}

/* Card Keyboard Restriction */
function cardPriceKeyboardInput(input,id){
	let cardPriceInput = document.getElementById(id);
	let index = id.substring(id.indexOf("_")+1,id.length);
	let currentPrice = listOfPeople[index].price;
	let possibleEvenAmount = 0;
	
	listOfPeople[index].type == "even" ? possibleEvenAmount = totalEvenAmount() + getReminder() : possibleEvenAmount = totalEvenAmount() + parseFloat(currentPrice) + getReminder();
	let originalInput = input;
	let cardPriceValue = "";
	input = removeCommaFromPrice(input);
	
	if(input.match(/^[0-9]+$/) === null){
		console.log(input);
		if(input.length < 2){
			cardPriceValue = "";	
		}else{
			cardPriceValue = originalInput.replace(input.match(/\D/g),'');
		}		
	}else if(input == "00"){
		cardPriceValue = "0";
	}else{
		(parseInt(input, 10) >= parseInt(possibleEvenAmount, 10) ) ? cardPriceValue = setCommaToPrice(possibleEvenAmount.toString()) : cardPriceValue = setCommaToPrice(input);
	}
	cardPriceInput.value = cardPriceValue;	

}

function openSecSection(){
	let sec = document.getElementById("input-section");
	document.body.animate([
	  { backgroundPosition: '-10% 180%,120% 250%,center'}, 
	  { backgroundPosition: '-35% 180%,200% 250%,center'}  
	],{
	  duration:openSecTime,
	  fill:'forwards',
	  easing:'ease'
	});	

	document.getElementsByTagName("main")[0].animate([
	  { transform: 'translateX(35%)'}, 
	  { transform: 'translateX(0%)'}  
	],{
		delay:openSecTime,
	  duration:openSecTime,
	  fill:'forwards',
	  easing:'ease-out'});			
	  
	openSec = 1;
}

function getReceipt(){
	localStorage.setItem("total", totalAmount);
	localStorage.setItem("peopleQty", peopleQty);
	
	let nameList = [];
	let priceList = [];
	
	for(let i = 0;i<listOfPeople.length;i++){
		nameList.push(listOfPeople[i].name);
		priceList.push(listOfPeople[i].price);
	}
	
	localStorage.setItem("nameList", nameList);
	localStorage.setItem("priceList", priceList);
	window.open("file:///D:/Documents/artwork/website/SplitBill_v2/NoteBill.html", "_blank"); 
}