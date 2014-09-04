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

var isPaused = 0;
var isPlaying = 0;

var pi_approximation = 0;

var circle_radius = 10;
var ecartType_approximation = 0;

var points_to_plot = new Array();
var points_conf_interval = new Array();
var nbPoints_plot_index = 0;

var points_abs_error = new Array();

function OnChangeValue( frm )
{
	if( window.interval_timer )
	{
		clearInterval( window.interval_timer);
	}
	GetGlobalUserValues( frm )
	ShowGraph();
	plot();
}

function OnChangeTime( frm )
{
	if( window.interval_timer )
	{
		clearInterval( window.interval_timer);
	}
	window.time_intervals = parseInt( frm.time_interval.value );
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
	if(isPlaying == 0 )
	{
		if( window.interval_timer )
		{
			clearInterval( window.interval_timer);
		}
		
		GetGlobalUserValues( frm );
		ShowGraph();
		plot();
		interval_timer = setInterval( function(){AddPoints()}, window.time_intervals );
		
		isPlaying = 1;
		document.getElementById("play_pause_btn").innerHTML = "Pause";
	}
	else 
	{
		if( isPaused == 0 )
		{
			if(window.interval_timer)
			{
				clearInterval( window.interval_timer);
			}
			isPaused = 1;
			document.getElementById("play_pause_btn").innerHTML = "Play";
		}
		else
		{
			interval_timer = setInterval( function(){AddPoints()}, window.time_intervals );
			isPaused = 0;
			document.getElementById("play_pause_btn").innerHTML = "Pause";
		}
	}
}

function OnReset( frm )
{
		if( window.interval_timer )
		{
			clearInterval( window.interval_timer);
		}
		
		ecartType_approximation = 0;
        points_to_plot = new Array();
		points_conf_interval = new Array();
		nbPoints_plot_index = 0;
		pi_approximation = 0;
				
		GetGlobalUserValues( frm );
		ShowGraph();
		plot();
		
		// Reset values.
		window.nbEvent_inside = 0;
		document.getElementById("nb_inside").innerHTML = "Number inside circle  : " + window.nbEvent_inside;
		
		window.nbEvent_outside = 0;
		document.getElementById("nb_outside").innerHTML = "Number outside circle  : " + window.nbEvent_outside;
		
		window.nbElements = 0;
		document.getElementById("nb_iter").innerHTML = "Number in square : " + window.nbElements;
		
		my_pi = 0;
		document.getElementById("pi_approx").innerHTML = "Approximation of PI   : " + pi_approximation;
		
		document.getElementById("play_pause_btn").innerHTML = "Play";
		isPlaying = 0;
		isPause = 0;
}

function AddPoints( )
{
    ShowGraph();
    plot();
	var a_canvas = document.getElementById( "a" );
	var context = a_canvas.getContext( "2d" );
	
	for( var n = 0; n < window.numberPointsPerIter; n++ )
	{
		x = Math.random() * rect_real_size + rect_topleft_x;
		y = Math.random() * rect_real_size + rect_topleft_y;	

		var center = window.one_square * window.middle_square;
		var radius =  window.circle_radius * window.one_square;
		
		var c = (center - x) * (center - x) + (center - y) * (center - y);
		var color = '#0000FF';

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
		window.pi_approximation = (window.nbEvent_inside / window.nbElements) * (square_surface_over_radius_square);
		
	    //------------------------------------------------------------------------------------------------------------------------------------
        // Points to plot.
	    //------------------------------------------------------------------------------------------------------------------------------------
		window.points_to_plot[window.nbPoints_plot_index] = window.pi_approximation;
		
		var my_pi = Math.round(window.pi_approximation*100000)/100000;
		document.getElementById("pi_approx").innerHTML = "Approximation of PI   : " + my_pi;
		
		
		// S = sqrt(1/n(Somme(xi - xbar)^2))
		var tmp = 0;
		for (var i = 1; i < window.points_to_plot.length; ++i)
		{
			if(window.points_to_plot.length > 0)
			{
			    var v = (window.points_to_plot[i] - window.pi_approximation);
				v = v * v;
				tmp = tmp + v;
			}
		}
		tmp = tmp / window.points_to_plot.length;
		tmp = Math.sqrt(tmp);
		window.ecartType_approximation = 1.96 * tmp;
		
		window.points_conf_interval[window.nbPoints_plot_index] = window.ecartType_approximation;
		window.nbPoints_plot_index++;

		context.beginPath();
		context.lineWidth = 3;
		context.strokeStyle = color;
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
	context.moveTo(size_of_one_square * middle_square - 5, 10); // Left
	context.lineTo(size_of_one_square * middle_square,0); //Middle
	context.lineTo(size_of_one_square * middle_square + 5, 10); // Right
	context.strokeStyle = '#777777';
	context.stroke();
	
	// Axes arrows (x).
	context.beginPath();
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


// --------------------------------------------------------------
// PLOT
// --------------------------------------------------------------
function plot()
{
    var a_canvas = document.getElementById("plot");
    var context = a_canvas.getContext("2d");
    context.clearRect(0, 0, 500, 250);

    var y_axis_x_position = 25;

    // X axe.
    context.beginPath();
    context.moveTo(y_axis_x_position, 240);
    context.lineTo(490, 240);
    context.lineWidth = 1;
    context.strokeStyle = '#000000'; 
    context.stroke();

    // Arrow x.
    context.beginPath();
    context.moveTo(490 - 10, 235); // Left
    context.lineTo(490, 240); //Middle
    context.lineTo(490 - 10, 245); // Right
    context.strokeStyle = '#000000';
    context.fillStyle = "#000000";
    context.stroke();

    // Y axe.
    context.beginPath();
    context.moveTo(y_axis_x_position, 10);
    context.lineTo(y_axis_x_position, 240);
    context.lineWidth = 1;
    context.strokeStyle = '#000000';
    context.stroke();

    // Arrow Y.
    context.beginPath();
    context.moveTo(y_axis_x_position - 5, 20); // Left
    context.lineTo(y_axis_x_position, 10); //Middle
    context.lineTo(y_axis_x_position + 5, 20); // Right
    context.strokeStyle = '#000000';
    context.fillStyle = "#000000";
    context.stroke();

    var y = 0;

    // Grid horizontal.
    for (var i = 1; i <= 4; ++i)
    {
        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(y_axis_x_position + 1, 240 - i * 200 / 4.0);
        context.lineTo(490, 240 - i * 200 / 4.0);
        context.strokeStyle = '#AAAAAA';
        context.closePath();
        context.stroke();
    }

    // Grid horizontal (between main lines).
    for (var i = 1; i <= 4; ++i) {
        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(y_axis_x_position + 1, 240 - (i-0.5) * 200 / 4.0);
        context.lineTo(490, 240 - (i-0.5) * 200 / 4.0);
        context.strokeStyle = '#DDDDDD';
        context.closePath();
        context.stroke();
    }

    // Draw number.
    for (var i = 0; i <= 4; ++i) {
        context.font = "10px Arial";
        context.strokeStyle = '#000000';
        context.fillText(i, y_axis_x_position - 10, 240 - i * 200 / 4.0 + 3);
        //context.fillText("y", size_of_one_square * middle_square - 20, 13);
    }

    context.font = "11px Arial bold";
    context.fillStyle = 'blue';
    context.fillText("π", y_axis_x_position + -20, 240 - 3.14159 * 200 / 4.0 + 3);
    context.strokeStyle = '#FF0000';

    var x = y_axis_x_position + 1;


    context.globalAlpha = 0.2;
    //-----------------------------------------------------------------------------

    // Draw conf interval.
    for (var i = 0; i < window.points_to_plot.length; ++i) 
	{
        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(x++, 240 - (window.points_to_plot[i] + window.points_conf_interval[i]) * 200 / 4.0);
        context.lineTo(x, 240 - (window.points_to_plot[i] - window.points_conf_interval[i]) * 200 / 4.0);
        context.strokeStyle = '#AA0000';
        context.closePath();
        context.stroke();
    }

    context.globalAlpha = 1.0;
    //----------------------------------------------------------------------------
    // Ploting points.
    x = y_axis_x_position + 1;

    for (var i = 1; i < window.points_to_plot.length; ++i)
    {
        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(x++, 240 - window.points_to_plot[i-1] * 200 / 4.0);
        context.lineTo(x, 240 - window.points_to_plot[i] * 200 / 4.0);
        context.strokeStyle = '#000000';
        context.closePath();
        context.stroke();
    }

    // Draw PI axe.
    var pi_y_pos = 240 - Math.PI * 200.0 / 4.0;
    context.beginPath();
    context.moveTo(y_axis_x_position, pi_y_pos);
    context.lineTo(490, pi_y_pos);
    context.lineWidth = 1;
    context.strokeStyle = '#0000BB';
    context.stroke();
}
// --------------------------------------------------------------
// MAIN 
// --------------------------------------------------------------
ShowGraph();
plot();