/*Define a settings object which will be required for setting up the theatre seats*/
var settings=
{
	rows:8,
	column:25,
	rowCssPrefix:'row-',
	colCssPrefix:'col-',
	seatCss:'seat',
	width:20,
	height:35,
	selectedSeatCss:'selectedSeat',
	selectingSeatCss:'selectingSeat',
	price:
	{
		Bronze:80,
		Silver:100,
		Gold:150
	},
	movies:
	[
		"Inception",
		"Black Friday"

	]
};

var bookedSeats={};

var selectingSeatArray=[];
var invisibleSeats=[];
var no_of_seats;

/*All event binding are done here*/
function setUpClickBinding()
{
	$('.'+settings.seatCss).click(function()
	{
		if($(this).hasClass(settings.selectedSeatCss))
		{
			$('.seats_alert > span').html("Already Selected Seat");
			$('.seats_alert').removeClass('alert-success').addClass('alert-danger');
			$('.seats_alert').show();	
		}
		else
		{
			var selected_category=$('.category-toggle span').text();

			if($(this).hasClass(settings.selectingSeatCss))
			{
				$(this).removeClass(settings.selectingSeatCss);
				var index=selectingSeatArray.indexOf($(this).children("a").attr("title"));
				if(index!=-1)
				{
					selectingSeatArray.splice(index,1);
					$('.checkout').addClass("disabled");
				}
				no_of_seats++;
			}
			else
			{
				if(no_of_seats==0)
				{
					
					$('.seats_alert > span').html("Seats already selected,Proceed to checkout,or change the number of seats you want");
					$('.seats_alert').removeClass('.alert-success').addClass('alert-danger');
					$('.seats_alert').show();
				}
				else
				{
					if($(this).parent().hasClass(selected_category))
					{
						$(this).toggleClass(settings.selectingSeatCss);
						selectingSeatArray.push($(this).children("a").attr('title'));
						if(--no_of_seats==0)
						{
							selectingSeatArray.sort(sortNumber);
							console.log(selectingSeatArray);
							if(isAdjacentSeat(selectingSeatArray))
							{
								if(isSingleSiloCreated(selectingSeatArray))
								{
									$('.seats_alert > span').html("Single silo created");
									$('.seats_alert').removeClass('.alert-success').addClass('alert-danger');
									$('.seats_alert').show();
								}
								else
								{
									$('.seats_alert > span').html("Seats selected,now proceed to checkout");
									$('.seats_alert').removeClass('alert-danger').addClass('alert-success');
									$('.seats_alert').show();
									$('.checkout').removeClass("disabled");
								}
							}

						}
					}
					else
					{
						$('.seats_alert > span').html("You can select tickets only from "+selected_category+' category');
						$('.seats_alert').removeClass('.alert-success').addClass('alert-danger');
						$('.seats_alert').show();
					}

				}
			}
		}
	});

}
/*window.onload=function()*/
$(document).ready(function()
{	
	/*Retrieve the already booked tickets from the local storage*/							
	if(localStorage.getItem('reservedSeat'))
	{
		bookedSeats=JSON.parse(localStorage.getItem('reservedSeat'));
	}
	/*When user clicks on book tickets, create a seat map for him for the movie he/she has selected*/							
	$('.btn-success').click(function()
	{

		$('.modal-title').html('Movie:'+$('.movies-toggle span').text());
		var selected_movie=$('.movies-toggle span').text();
		if(!bookedSeats[selected_movie])
		{
			bookedSeats[selected_movie]=[];
		}
		createSeats(bookedSeats[selected_movie]);
		$('.modal').modal('show'); 



	});

	$('.alert .close').on('click', function(e) {
    	$(this).parent().hide();
	});

	/*On checkout, save the selected seats for a particular movie in the local storage*/
	$('.checkout').click(function(){
		if(typeof(Storage)!="undefined")
		{
			var selected_movie=$('.movies-toggle span').text();
			bookedSeats[selected_movie]=bookedSeats[selected_movie].concat(selectingSeatArray);
			localStorage.setItem('reservedSeat',JSON.stringify(bookedSeats));
			
			$('.book_alert > span').html("Seats booked,proceeding to the home page now");
			$('.seats_alert').hide();
			$('.book_alert').show();
			setTimeout(function () {
       			window.location = "file:///F:/Dunia/trunk/home.html"; //will redirect to your blog page (an ex: blog.html)
    		}, 2000)
			
		}
	});


	/*This function is for the dropdown on the main page,do not allow the user to select the quantity and category,until he has selected the movie*/
	$( document.body ).on( 'click', '.dropdown-menu li', function( event ) {

		var $target = $( event.currentTarget );
		


		$target.closest( '.btn-group' )
		.find( '[data-bind="label"]' ).text( $target.text() )
		.end()
		.children( '.dropdown-toggle' ).dropdown( 'toggle' );
		if($target.closest( '.btn-group').find('[data-toggle="dropdown"]').hasClass('movies-toggle'))
		{
			if($target.closest( '.btn-group' ).find( '[data-bind="label"]' ).text()!="Select Movie")
			{
				$('.category-toggle').removeClass('disabled');
			}
			else
			{
				$('.category-toggle').addClass('disabled');
			}
		}
		else if($target.closest( '.btn-group' ).find('[data-toggle="dropdown"]').hasClass('category-toggle'))
		{
			if($target.closest( '.btn-group' ).find( '[data-bind="label"]' ).text()!="Select Category")
			{
				$('.quantity-toggle').removeClass('disabled');
			}
			else
			{
				$('.quantity-toggle').addClass('disabled');
			}

		}
		else
			$('.book').removeClass('disabled');

		return false;

	});

	/*Populate the movies,categories and qunatity dropdown*/
	var movies=[];
	for(var i=0;i<settings.movies.length;i++)
		movies.push('<li>'+'<a href="#">'+settings.movies[i]+'</a>'+'</li>');
	$('.movies').html(movies.join(''));
	var categories=[];
	for(category in settings.price)
	{
		categories.push('<li>'+'<a href="#">'+category+'</a>'+'</li>');
	}
	$('.movie_category').html(categories.join(''));

	var quantity=[];
	for(var i=1;i<=10;i++)
	{
		quantity.push('<li>'+'<a href="#">'+i+'</a>'+'</li>');
	}
	$('.quantity').html(quantity.join(''));
});