  $(document).ready(function ($) {
    //manually adding some params here
      var uluru = {lat: 41.8854497, lng: -87.62603000000001};
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: uluru
      });



    $.ajax({
      url: "https://clarity2018.wpengine.com/wp-json/wp/v2/places",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      type: "GET",
      dataType: 'json',

      data:{
        //format:'json'
      },
      success:function(places){
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
        console.log(address);

        if(addy['map'] == ''){
          var lat2 = '',
          lng2 = '';

          lat2 = parseFloat(41.8854497),
          lng2 = parseFloat(-87.62603000000001)
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
      }); //end of loop

      $('#locations .list').each(function(){
        $('a', this).on('click', function(){
          //console.log($(this).attr('data-markerid'));
          google.maps.event.trigger(markers[$(this).attr('data-markerid')], 'click');
        });
      });


 //filtering
    var container = $('#locations');
    var filters = []
    jQuery('.cat-menu li a').on( 'click', function(event) {
      var $target = $( event.currentTarget );
      $target.toggleClass('is-checked');
      var isChecked = $target.hasClass('is-checked');
      var filterValue = $target.attr('data-filter');

      if ( isChecked ) {
        addFilter( filterValue );

      } else {
        removeFilter( filterValue );
      }
      // filter isotope
      // group filters together, inclusive
      container.isotope({ filter: filters.join(',') });

      //filter markers
      $('#locations .row').each(function(){
        var div = $(this);
        if(div.css('display') === 'none'){
          var markerid = $('a', this).attr('data-markerid');
          console.log($('a', this).attr('data-markerid'));
          markers[markerid].setVisible(false);
        } else{
          markers[markerid].setVisible(true);
        }
        //console.log($('#locations .row').not(':hidden').each(function(){ $('a',this).attr('data-markerid')}));
      });
    });

    function addFilter( filter ) {
      if ( filters.indexOf( filter ) == -1 ) {
        filters.push( filter );
      }
    }

    function removeFilter( filter ) {
      var index = filters.indexOf( filter);
      if ( index != -1 ) {
        filters.splice( index, 1 );
      }
    }




      },
      error:function(){
        console.log( "error" );
        $('#locations').append('<div class="alert alert-danger">There was an error with your request</div>');
      }
    });


    //filtering
   /* var container = $('#locations');
    var filters = []
    jQuery('.cat-menu li a').on( 'click', function(event) {

      var $target = $( event.currentTarget );
      $target.toggleClass('is-checked');
      var isChecked = $target.hasClass('is-checked');
      var filterValue = $target.attr('data-filter');

      if ( isChecked ) {
        addFilter( filterValue );
        markers[2].setVisible(false);
      } else {
        removeFilter( filterValue );
      }
      // filter isotope
      // group filters together, inclusive
      container.isotope({ filter: filters.join(',') });
    });

    function addFilter( filter ) {
      if ( filters.indexOf( filter ) == -1 ) {
        filters.push( filter );
      }
    }

    function removeFilter( filter ) {
      var index = filters.indexOf( filter);
      if ( index != -1 ) {
        filters.splice( index, 1 );
      }
    }*/
  });
