  $(document).ready(function ($) {
    //function initMap() {
      var uluru = {lat: 41.8854497, lng: -87.62603000000001};
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: uluru
      });
    //}

    $.getJSON("https://clarity2018.wpengine.com/wp-json/wp/v2/places", function(places){
      console.log('loading');

    }).done(function(places){
      console.log('done');
      var markers = new Array();
      var infoWindow = new google.maps.InfoWindow();

      $.each(places, function(i){
        var items = $(this);
        var addy = items[0]['acf'];
        var title = items[0]['title']['rendered'];
        var address = items[0]['acf']['map']['address'];
        var phone = items[0]['acf']['phone'];
        var content = items[0]['content']['rendered'];
        var lat1 = addy['map']['lat'];
        var lng1 = addy['map']['lng'];
        var placeTypes = items[0]['place_types'];
        var id = items[0]['id'];

        console.log(items);

        if(addy['map'] == ''){
          var lat2 = '',
          lng2 = '';

          lat2 = 41.8854497,
          lat2 = -87.62603000000001
        } else{
          lat2 = parseFloat(lat1.replace(/\"/g, ""));
          lng2 = parseFloat(lng1.replace(/\"/g, ""));
        }

        //var infowindow = new google.maps.InfoWindow({

        //});

        var marker = new google.maps.Marker({
          position: {lat: lat2, lng: lng2},
          map: map,
          title:title,
          id:id,
        });

        marker.metadata = {type:'point', id: id};

        marker.addListener('click', function() {
          infoWindow.setContent('<strong>' + title + '</strong><br/>' + address + '<p>' + content + '</p>');
          infoWindow.open(map, marker);
          console.log(marker);
        });

        //list of
        placeTypes = placeTypes.toString().replace(/,/g, " ");
        var num = i++;
        var contentList = '<div class="row list'+ ' '+ placeTypes +'">'+
        '<a href="#" data-markerid="'+ num +'"><h2>'+title+'</h2></a>'+
        '<span>'+address+'</span>'+
        '<span>'+phone+'</span>'+
        '</div>';
        $('#list #locations').append(contentList);
        markers.push(marker);
      });

      $('#locations .list').each(function(){
        $('a', this).on('click', function(){
          //console.log($(this).attr('data-markerid'));
          google.maps.event.trigger(markers[$(this).attr('data-markerid')], 'click');
        });
      });
    }).fail(function() {
      console.log( "error" );
      $('#loactions').append('<div class="alert alert-danger">There was an error with your request</div>');
    });
    var container = $('#locations');
    jQuery('.cat-menu li a').on( 'click', function() {
      //console.log('this');
      var filterValue = jQuery( this ).attr('data-filter');
      // use filterFn if matches value
      console.log(filterValue);
      //filterValue = filterFns[ filterValue ] || filterValue;
      container.isotope({ filter: filterValue });
      //container.on('filterComplete', onArrange);

    });
  });