  $(document).ready(function ($) {
    //function initMap() {
      var uluru = {lat: 41.8854497, lng: -87.62603000000001};
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: uluru
      });
      var marker = '';
      var markers = '';
    //}



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
      markers = new Array();
      var infoWindow = new google.maps.InfoWindow({
        maxWidth: 300,
      });

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

        marker = new google.maps.Marker({
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
        '<a href="#" data-markerid="'+ num +'" marker-id="'+marker.id+'"><h2>'+title+'</h2></a>'+
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
      },
      error:function(){
        console.log( "error" );
        $('#locations').append('<div class="alert alert-danger">There was an error with your request</div>');
      }
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

      //Marker pin update
      setTimeout(function(){
        $('#locations .row').each(function(){
          var id = $(this).find('a').attr('data-markerid');

          if($(this).css('display') == 'none'){
            //console.log($(this).find('a').attr('marker-id'));
            markers[id].setVisible(false);
          } else{
            markers[id].setVisible(true);
          }
        });
      }, 500);
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
  });