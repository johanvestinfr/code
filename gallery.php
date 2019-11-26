<html>
 <head>
  <title>Gallery</title>
    <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/babel-standalone@6.26.0/babel.js"></script>
    <script src="js/gallery.js"></script> 
    <link rel="stylesheet" type="text/css" href="css/design.css">
 </head>
 <body>
<script type="text/javascript">
	function closeDisplay()
	{
		var div = document.getElementById("show-img");
		div.style.display = "none";
		document.documentElement.style.overflow = 'auto';  
		document.body.scroll = "yes"; 
	}
	
	//onmouseover
	function exitHover()
	{
		var hover = document.getElementById("show-img-close");
		hover.src = "/img/gallery/close_hover.jpg";
		
	}
	//onmouseout 
	function exitOut()
	{
		var hover = document.getElementById("show-img-close");
		hover.src = "/img/gallery/close.jpg";
	}
</script>
<div id="show-img" style="display:none; width:100%;height:100%; position:absolute; background-color:white;  margin: 0 auto; border-radius: 3px; text-align:center;">
<img id="show-img-close" style="position:absolute;left:5;top:5;" src="img/gallery/close.jpg" onclick="javascript:closeDisplay();" onmouseover="javascript:exitHover();" onmouseout="javascript:exitOut();"></img>
<div id="img-display-container" style="margin: 0 auto; border-radius: 3px; display:inline-block;">
<img id="img-display" style="margin-top:5%;max-width:800px;max-height:800px;" onclick="javascript:closeDisplay();"></img>
<h1 id="img-display-title"></h1>
</div>
</div>
<div id="root-container" style="  margin: 0 auto; border-radius: 3px; text-align:center;" >
<div id="root" style="  margin: 0 auto; border-radius: 3px; display:inline-block;"></div>
</div>
<?php

$images = [];
$dir = "images/";
$id = 0;

$sections = [];
$myfile = fopen("images.txt", "r") or die("Unable to open file!");
while(!feof($myfile)) {
	$line = strval(fgets($myfile));
    $sections = explode("|", $line);
    $lineHasData = trim($line[0]);
    if(strlen($lineHasData) > 0 )
    {
	$srcset_gallery = $sections[0] . "_25.JPG" . " 300w, " . $sections[0] . "_50.JPG" . " 450w, ". $sections[0] . "_100.JPG" . " 700w, ". $sections[0] . "_125.JPG" . " 1000w "; 
	$srcset_selected = $sections[0] . "_200.JPG" . " 400w, " . $sections[0] . "_600.JPG" . " 800w, ". $sections[0] . "_800.JPG" . " 1000w, ". $sections[0] . "_1000.JPG" . " 1200w "; 
    array_push($images,array('id' => $id, 'url' => $sections[0],'srcset' => $srcset_gallery , 'title' => $sections[1], 'comment' => $sections[2], 'selected' => $srcset_selected));
    $id = $id + 1;
	}
}
fclose($myfile);

?>

<script type="text/babel">

const galleryDiv = {
  marginRight: '10px',
};

const galleryBox = {
  display: 'flex',
  marginBottom: '10px',
  
};

var image_url = <?php echo json_encode($images); ?>;
var image_url_selected = <?php echo json_encode($images); ?>;

var image_set = []
var image_elements = []
var i = 0;
var c = 0;

function showImage (id)
{
	var index = parseInt(id, 10);
	var div = document.getElementById("show-img");
	var img_frame = document.getElementById("img-display");
	var img_clicked = document.getElementById(id);
	var text = document.getElementById("img-display-title");
	
	div.style.display = "block";
	text.innerHTML = image_url_selected[index].title;
	img_frame.srcset = image_url_selected[index].selected;
	document.documentElement.style.overflow = 'hidden'; 
    document.body.scroll = "no"; 
	
}

while(image_url.length > 0)
{
	image_set[i] = image_url.splice(0,5);	
	image_elements[i] = image_set[i].map((img) =>
	<img key={img.id} id={img.id} srcSet={img.srcset} style={galleryDiv} onClick={() => showImage(img.id)}></img>
);
	i++;
}

//image_elements.forEach(function(entry) {
//    console.log(entry);
//});

var k;
var elements = [];
for(k = 0;k < image_elements.length; k++)
{
	elements[k] = <div style={galleryBox}>{image_elements[k]}</div>;
}

ReactDOM.render(
  elements,
  document.getElementById('root')
);
 
</script>
  
 </body>
</html>


