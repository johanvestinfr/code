var timer;
var element_id;
var link_hover;
var text;
var count = 0;
var links = new Array(2);

//mouseover & mouseout
function LinkHover(id,direction)
{

//länk:hover
if(direction == "enter")
{
element_id = id; //hämta id
//nollställ timern
if(timer != undefined){clearInterval(timer);timer = "undefined";link_hover = null; text = "";}

//om timern är nollställd
//hämta dokumentet
//hämta value attributet
//starta timern
if(timer == undefined)
{
link_hover = document.getElementById(element_id);

text = String(link_hover.getAttribute("value"));
timer = setInterval(AnimateLink, 100);
}

}
//pekarn är inte över länken längre
else if(direction == "out")
{
//nollställ timern och länktexten
clearInterval(timer);
link_hover.text = text;
timer = undefined;
element_id = null;
link_hover = null;
}
}

var len;
var to_upper;
var animation;
function AnimateLink()
{
len = 0;
to_upper = "";
animation = "";
link_hover.text = text;

len = text.length;
//kolla så att index inte överskrider strängen
if(count >= len){count = 0;} 
to_upper = null;
to_upper = text.charAt(count).toUpperCase(); // sätt nuvarande position till storbokstav
//ersätt den gamla karaktären genom att använda substring
animation = text.substr(0, count) + to_upper + text.substr(count + 1);
link_hover.text = animation;
count = count + 1;
}
function toggleMenu()
{
  var toggle = document.getElementById("menu-toggle");
  var menu =  document.getElementById("left-tab");
  if(menu.style.display != "none")
  {
	  menu.style.display = 'none';
  } 
  else
  {
	menu.style.display = 'inline';  
  }
  console.log("toggle");
}
