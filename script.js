var square_size = 20;
var time_intervals = 500;

var one_square = 21;
var middle_square = 12
var rect_topleft_x = window.one_square * (12 - window.square_size/2);
var rect_topleft_y = window.one_square * (12 - window.square_size/2);
var rect_real_size = window.square_size * window.one_square;

var interval_timer = 0;
var nbEvent_inside = 0;
var nbEvent_outside = 0;
var nbElements = 0;
var numberPointsPerIter = 1;

var pi_approximation = 0;

var circle_radius = 10;

function OnChangeValue( frm )
{
	if( window.interval_timer )
	{
		clearInterval( window.interval_timer);
	}
	GetGlobalUserValues( frm )
	ShowGraph( );
}

function OnChangeTime( frm )
{
	if( window.interval_timer )
	{
		clearInterval( window.interval_timer);
	}
	window.time_intervals = parseInt( frm.time_interval.value );
	//GetGlobalUserValues( frm );
	//var nb_iterations = parseInt( frm.iterations.value );
	//ShowGraph( );
	interval_timer = setInterval( function(){AddPoints()}, window.time_intervals );
}

function OnChangeNbPoints( frm )
{
	window.numberPointsPerIter = parseInt( frm.nbPoints.value );
}

function GetGlobalUserValues( frm )
{
	window.square_size = parseInt( frm.square.value );
	window.circle_radius = parseFloat( frm.circle.value );
	window.time_intervals = parseInt( frm.time_interval.value );
	window.numberPointsPerIter = parseInt( frm.nbPoints.value );
	
	window.nbEvent_inside = 0;
	window.nbEvent_outside = 0;
	window.nbElements = 0;
	
	window.rect_topleft_x = window.one_square * (12 - window.square_size/2);
	window.rect_topleft_y = window.one_square * (12 - window.square_size/2);
	window.rect_real_size = window.square_size * window.one_square;
	
	//document.getElementById("density").innerHTML = "Density : " + (1.0 / (window.square_size * window.square_size ) );
}

function MyShow( frm )
{
	if( window.interval_timer )
	{
		clearInterval( window.interval_timer);
	}
	
	GetGlobalUserValues( frm );
	//var nb_iterations = parseInt( frm.iterations.value );
	ShowGraph( );
	interval_timer = setInterval( function(){AddPoints()}, window.time_intervals );
}

function AddPoints( )
{
	ShowGraph();
	var a_canvas = document.getElementById( "a" );
	var context = a_canvas.getContext( "2d" );
	
	for( var n = 0; n < window.numberPointsPerIter; n++ )
	{
		x = Math.random() * rect_real_size + rect_topleft_x;
		y = Math.random() * rect_real_size + rect_topleft_y;	

		var center = window.one_square * window.middle_square;
		var radius =  window.circle_radius * window.one_square;
		
		//window.nbEvent_inside++;
		//document.getElementById("nb_inside").innerHTML = "Number inside circle  : " + window.nbEvent_inside;
		var c = (center - x) * (center - x) + (center - y) * (center - y);
		var color = '#0000FF';
		//radius *= radius;
		if( c <= radius * radius )
		{
			window.nbEvent_inside++;
			document.getElementById("nb_inside").innerHTML = "Number inside circle  : " + window.nbEvent_inside;
		}
		else
		{
			color = '#FF0000'
			window.nbEvent_outside++;
			document.getElementById("nb_outside").innerHTML = "Number outside circle  : " + window.nbEvent_outside;
		}
		
		window.nbElements++;
		document.getElementById("nb_iter").innerHTML = "Number in square : " + window.nbElements;
		
		var square_surface_over_radius_square = (window.square_size * window.square_size) / (window.circle_radius * window.circle_radius);
		window.pi_approximation = (window.nbEvent_inside / window.nbElements) *( square_surface_over_radius_square);
		
		var my_pi = Math.round(window.pi_approximation*100000)/100000
		document.getElementById("pi_approx").innerHTML = "Approximation of PI   : " + my_pi;
		
		var absError = Math.round( Math.abs(Math.PI - my_pi) * 100000)/100000;
		document.getElementById("absolute_error").innerHTML = "Absolute Error   : " + absError;//Math.abs( Math.PI - my_pi2 ) ;
		
		context.beginPath();
		context.lineWidth = 3;
		context.strokeStyle = color;
		//context.strokeStyle = '#FF0000'; // set line color
		context.arc( x, y, 2, 0, 2 * Math.PI );
		context.closePath();
		context.stroke();
	}
	
}

function ShowGraph( )
{
// Set up!
var a_canvas = document.getElementById( "a" );
var context = a_canvas.getContext( "2d" );
context.clearRect ( 0 , 0 , 500 , 500 );

var circle_radius = window.circle_radius;
var size_of_one_square = window.one_square;
var middle_square = window.middle_square;

//var square_size = document.circle.value;
//alert("Hello\nHow are you?");
//alert( square_size );
	// Axes.
	  context.beginPath();
      context.moveTo(window.one_square * middle_square, 0);
      context.lineTo(size_of_one_square * middle_square, 500);
      context.lineWidth = 2;
      context.strokeStyle = '#AAAAAA';       // set line color
	  context.moveTo(0, size_of_one_square * middle_square);
      context.lineTo(500, size_of_one_square * middle_square);
      context.stroke();
	  
	// Axes arrows (y).
	context.beginPath();
	// // Draw a triangle location for each corner from x:y 100,110 -> 200,10 -> 300,110 (it will return to first point)
	context.moveTo(size_of_one_square * middle_square - 5, 10); // Left
	context.lineTo(size_of_one_square * middle_square,0); //Middle
	context.lineTo(size_of_one_square * middle_square + 5, 10); // Right
	context.strokeStyle = '#777777';
	context.stroke();
	
	// Axes arrows (x).
	context.beginPath();
	// // Draw a triangle location for each corner from x:y 100,110 -> 200,10 -> 300,110 (it will return to first point)
	context.moveTo(500 - 10, size_of_one_square * middle_square - 5); // Left
	context.lineTo(500, size_of_one_square * middle_square); //Middle
	context.lineTo(500 - 10, size_of_one_square * middle_square + 5); // Right
	context.strokeStyle = '#777777';
	context.fillStyle = "#000000";
	context.stroke();
	
	// Axes Labels
	context.font = "18px Arial";
	context.strokeStyle = '#000000';
	context.fillText("x", 500 - 13, size_of_one_square * middle_square + 20);
	context.fillText("y", size_of_one_square * middle_square - 20, 13);
	

// Vertical lines.
for( var i = size_of_one_square; i < 500; i+=size_of_one_square)
{
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, 500);
      context.lineWidth = 1;
      context.strokeStyle = '#CCCCCC';       // set line color
      context.stroke();
}

// Horizontal lines.
for( var i = size_of_one_square; i < 500; i += size_of_one_square)
{
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(500, i);
      context.lineWidth = 1;
      context.strokeStyle = '#AAAAAA'; // set line color
      context.stroke();
}

// Draw rectangle.
context.beginPath();
context.lineWidth = 3;
context.strokeStyle = '#000000'; // set line color
context.rect( size_of_one_square * (12 - window.square_size/2), 
			  size_of_one_square * (12 - window.square_size/2), 
			  window.square_size * size_of_one_square, 
			  window.square_size * size_of_one_square );
context.stroke();

context.beginPath();
context.globalAlpha = 0.1;
context.fillStyle = "#0000FF";
context.fillRect( size_of_one_square * (12 - window.square_size/2), 
				  size_of_one_square * (12 - window.square_size/2), 
				  window.square_size * size_of_one_square, 
				  window.square_size * size_of_one_square )


context.stroke();
context.globalAlpha = 1;

context.beginPath();

context.lineWidth = 2;
context.strokeStyle = '#000000'; // set line color
context.arc( size_of_one_square * middle_square, 
			 size_of_one_square * middle_square, 
			 circle_radius * size_of_one_square, 0, 2 * Math.PI );
context.closePath();
context.stroke();


context.beginPath();
context.fillStyle = "#00FF00";
context.globalAlpha = 0.3;
context.arc( size_of_one_square * middle_square, 
			 size_of_one_square * middle_square, 
			 circle_radius * size_of_one_square, 0, 2 * Math.PI );
context.fill()
context.closePath();
context.stroke();

context.globalAlpha = 1.0;
}

ShowGraph( );