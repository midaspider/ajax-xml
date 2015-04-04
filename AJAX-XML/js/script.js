/* Gallery Script By Midaspider
* Created: March 29th, 2015 by midaspider.com. This notice must stay intact for usage 
* Author: Midaspider at http://www.midaspider.com/
* Visit http://www.midaspider.com/ for full source code
*/
$(function() {

    $.ajax({
      type: 'GET',
      url: '/xml/items.xml',
      dataType: 'xml',
      success: parse,
      error: function() {
        alert('The XML File could not be processed correctly.');
      }
    }).done(function() {
      //History.replaceState({}, artwork, document.location.href);
    });

    var History = window.History;
    var address = $(location).attr('pathname').split('/');
    var page = address[1];
    var genre = address[2];
    var artwork = address[3];
    var speed = 450;

    /*var setCurrentPage = function(url) {
      $('#artworkDiv').html(url || "/");
    };
    var setCurrentArtwork = function(i) {
      $('#artworkDiv').html(url+title+image+year+medium+height+width+availability);
    };*/

    function parse(xml) {

      $(document.body).on('click', '#thumbs div a', function(event) {
        var href = $(this).attr('href');
        var title = $(this).attr('title');
        History.pushState(null, title, href);
        event.preventDefault(); // don't follow link
      });

      window.buildNavigation = function(){ // BUILD THUMBNAILS FOR GENRE
        $(xml).find('PAGE').filter(function () {
          var title = $(this).find('> TITLE').text();
          var url = $(this).find('> URL').text();
          //var url = title[0].toLowerCase()+title.substring(1);
          $('<li id="'+url+'"><a href="/'+url+'/" title="'+title+'">'+title+'</a></li>').find('a').click(function(event) {
            //rebuildThumbs(genre);
            var href = $(this).attr('href');
            var title = $(this).attr('title');
            //event.buildThumbs();
            //alert(i);
            //alert($(this).attr('href'));
            History.pushState(null, title, href);
            event.preventDefault(); // don't follow link
            $('#nav li').removeClass('active');
            $(this).parent().addClass('active');
          }).end().appendTo('#nav');
        });
        $('#nav li').wrapAll('<ul/>');
      }

      window.buildGallery = function () { // BUILD NAVIGATION

        var genreArray = [];
        $(xml).find('ARTWORK').each(function(i) {
          genreArray[i] = $(this).find('GENRE').text();
        });
        var uniqueGenres = genreArray.filter(function(itm,i,genreArray) {
          return i == genreArray.indexOf(itm);
        });
        $(uniqueGenres).each(function(i) {
          var genre = uniqueGenres[i];
          var title = genre[0].toUpperCase()+genre.substring(1);
          $('<li><a href="/gallery/'+genre+'/" title="'+title+'">'+title+'</a></li>').find('a').click(function(event) {
            rebuildThumbs(genre);
            var href = $(this).attr('href');
            History.pushState(null, title, href);
            event.preventDefault();
            $('#nav li').removeClass('active');
            $(this).parent().addClass('active');
          }).end().appendTo('#gallery');
        });
        $('#gallery li').wrapAll('<ul/>');
      }

      window.buildThumbs = function(){ // BUILD THUMBNAILS FOR GENRE
        //$('#thumbs div').fadeToggle(speed);
        $('#thumbs div').addClass('fadein');
        //$(xml).find('ARTWORK:has(GENRE:contains("Title"),YEAR:contains("2014"))');
        //$(xml).find('ARTWORK:has(GENRE:contains(' + genre + ')):eq(' + a + ')');
        //$(xml).find('ARTWORK').filter(function () {return $(this).find('GENRE').text() == genre;}).each(function() {
        $(xml).find('ARTWORK:has(GENRE:contains('+genre+'))').each(function() {
          var title = $(this).find('TITLE').text();
          var url = $(this).find('URL').text();
          var image = $(this).find('IMAGE').text();
          var year = $(this).find('YEAR').text();
          var medium = $(this).find('MEDIUM').text();
          var height = $(this).find('HEIGHT').text();
          var width = $(this).find('WIDTH').text();
          var availability = $(this).find('AVAILABILITY').text();
          $('<div class="col-sm-4"><a href="/gallery/'+genre+'/'+url+'/" title="'+title+'"><img src="/images/thumbs/'+image+'" alt="'+title+'" class="img-responsive" /></a></div>').find('a').click(function(event) {
            //var targetUrl = $(this).attr('href');
            //window.history.pushState(null, title, targetUrl);
            $('#content').html('<img src="/images/'+image+'" alt="'+title+'" class="img-responsive fadein" />');
            $('#details').html('<p><strong>'+title+'</strong>, '+year+'<br />'+medium+', '+height+' x '+width+' cm<br />'+availability+'</p>');
            $('#thumbs div').removeClass('active');
            $(this).parent().addClass('active');
          }).end().appendTo('#thumbs');
        });
        $('#thumbs>div').wrapAll('<div class="row"/>');
      }

      window.rebuildThumbs = function(genre){ // REBUILD THUMBNAILS WHEN CHANGING GENRE
        //$('#thumbs div.row, #content img').fadeToggle(speed);
        $('#thumbs div.row, #content img').addClass('fadeout');
        $(xml).find('ARTWORK:has(GENRE:contains('+genre+'))').each(function () {
          var title = $(this).find('TITLE').text();
          var url = $(this).find('URL').text();
          var image = $(this).find('IMAGE').text();
          var year = $(this).find('YEAR').text();
          var medium = $(this).find('MEDIUM').text();
          var height = $(this).find('HEIGHT').text();
          var width = $(this).find('WIDTH').text();
          var availability = $(this).find('AVAILABILITY').text();
          //var targetTitle = $(this).attr('title');
          $('<div class="col-sm-4"><a href="/gallery/'+genre+'/'+url+'/" title="'+title+'"><img src="/images/thumbs/'+image+'" alt="'+title+'" class="img-responsive" /></a></div>').find('a').click(function(event) {
            $('#content').html('<img src="/images/'+image+'" alt="'+title+'" class="img-responsive fadeout" />').find('.fadeout').removeClass('fadeout').addClass('fadein');
            $('#details').html('<p><strong>'+title+'</strong>, '+year+'<br />'+medium+', '+height+' x '+width+' cm<br />'+availability+'</p>');
            $('#thumbs div').removeClass('active');
            $(this).parent().addClass('active');
          }).end().appendTo('#thumbs');
          //$('#thumbs div').css({"display":"inline-block"}).fadeIn(speed);
        });
        $('#thumbs>div').wrapAll('<div class="row"/>');
        $('.fadeout').remove();
      }

      /*window.buildArtwork = function(){ // BUILD ARTWORK
        $(xml).find('ARTWORK[URL="'+artwork+'"]').each(function() {
        //$(xml).find('ARTWORK:has(URL:contains('+artwork+'))').each(function () {
          var title = $(this).find('TITLE').text();
          var image = $(this).find('IMAGE').text();
          var year = $(this).find('YEAR').text();
          var medium = $(this).find('MEDIUM').text();
          var height = $(this).find('HEIGHT').text();
          var width = $(this).find('WIDTH').text();
          var availability = $(this).find('AVAILABILITY').text();
          $('#content').html('<img src="/images/'+image+'" alt="'+title+'" class="img-responsive" />');
          $('#details').html('<p><strong>'+title+'</strong>, '+year+'<br />'+medium+', '+height+' x '+width+' cm<br />'+availability+'</p>'); 
        });
      }*/


      var a = 0;
      var items = [];
      var numberOfArtworks = 0;
      var currentArtwork = [];
      //alert(artworkArray.length);
      window.loadArtwork = function () { // LOAD ARTWORK
        var tot = [];
        var items = $(xml).find('ARTWORK:has(GENRE:contains(' + genre + '))');
        for (var i = 0; i < items.length; i++) {
          var art = [];
          art[0] = $(items[i]).find('URL').text();
          //console.log('parse ' + ret[0]);
          art[1] = $(items[i]).find('TITLE').text();
          art[2] = $(items[i]).find('IMAGE').text();
          art[3] = $(items[i]).find('YEAR').text();
          art[4] = $(items[i]).find('MEDIUM').text();
          art[5] = $(items[i]).find('HEIGHT').text();
          art[6] = $(items[i]).find('WIDTH').text();
          art[7] = $(items[i]).find('AVAILABILITY').text();
          tot.push(art);
          //console.log('tot=' + tot);
        }
        console.log('items=' + items.length + ' tot=' + tot);
        numberOfArtworks = items.length-1;
        /*        
        var currentArtwork = $(xml).find('ARTWORK:has(GENRE:contains("Title"),YEAR:contains("2014"))');
        var currentArtwork = $(xml).find('ARTWORK:has(GENRE:contains('+genre+'))');
        var currentArtwork = $(xml).find('ARTWORK:eq('+a+')');
        */
        //currentArtwork = $(xml).find('ARTWORK:has(GENRE:contains(' + genre + ')):eq(' + a + ')');
        currentArtwork = tot[a];
        //artworkArray = $(xml).find('ARTWORK:has(GENRE:contains(' + genre + '))');
        
        //var currentArtwork = $(xml).find('ARTWORK:has(GENRE:contains(' + genre + ')):eq(' + a + ')');
        //var position = $.inArray(artworkArray, a);

        //var myArrayOfURLs = ["a", "b", "c", "d"];
        //var matching = artwork;
        //var matched = $.inArray(matching, myArrayOfURLs);
        //alert(artworkArray[1[1]]);
        //alert(position);

        /*
        var title = currentArtwork.find('TITLE').text();
        var href = currentArtwork.find('URL').text();
        var image = currentArtwork.find('IMAGE').text();
        var year = currentArtwork.find('YEAR').text();
        var medium = currentArtwork.find('MEDIUM').text();
        var height = currentArtwork.find('HEIGHT').text();
        var width = currentArtwork.find('WIDTH').text();
        var availability = currentArtwork.find('AVAILABILITY').text();
*/
        var title = currentArtwork[1];
        var href = currentArtwork[0];
        var image = currentArtwork[2];
        var year = currentArtwork[3];
        var medium = currentArtwork[4];
        var height = currentArtwork[5];
        var width = currentArtwork[6];
        var availability = currentArtwork[7];

        History.pushState(null, title, href);

        //alert(a);
        window.console && console.log('VALUE OF "a" :'+a+'... ');
        //window.console && console.log(href);
        //window.console && console.log(currentArtwork[0]);

        $('#content').html('<img src="/images/' + image + '" alt="' + title + '" title="' + title + '" class="img-responsive" />');
        $('#details').html('<p><strong>' + title + '</strong>, ' + year + '<br />' + medium + ', ' + height + ' x ' + width + ' cm<br />' + availability + '</p>');
        $('#pagination').html('<a id="prev">PREV</a><a id="next">NEXT</a>');
        if (a > 0) {
          $('#prev').removeClass('disabled');
        } else {
          $('#prev').addClass('disabled');
        }
        if (a < numberOfArtworks) {
          $('#next').removeClass('disabled');
        } else {
          $('#next').addClass('disabled');
        }
      }
      $(document.body).on('click', '#prev', function (event) {
        if (a > 0) a--;
        loadArtwork();
        event.preventDefault(); // don't follow link
      });
      $(document.body).on('click', '#next', function (event) {
        if (a < numberOfArtworks) a++;
        loadArtwork();
        event.preventDefault(); // don't follow link
      });

      buildNavigation();
      buildGallery();

      if (genre != null) {
        buildThumbs();
      }

      if (artwork != null) {
        //buildArtwork();
        loadArtwork();
      }

    }


    // Code to search object array for a key value match
    var Person = function (code, name) {
      this.code = code;
      this.name = name;
    };
    var people = [
        new Person("url_01", "Tooth Fairy"),
        new Person("url_02", "Santa Claus"),
        new Person("url_03", "Jack Sparrow"),
        new Person("url_04", "Easter Bunny")
    ];

    var utils = {};
  // Could create a utility function to do this
    utils.inArray = function (searchFor, property) {
      var retVal = -1;
      var self = this;
      for (var index = 0; index < self.length; index++) {
        var item = self[index];
        if (item.hasOwnProperty(property)) {
          if (item[property].toLowerCase() === searchFor.toLowerCase()) {
            retVal = index;
            return retVal;
          }
        }
      };
      return retVal;
    };

  // or we could create a function on the Array prototype indirectly
    Array.prototype.inArray = utils.inArray;

  // let's use the prototype for now
    var i = people.inArray('url_02', 'code');
    $('#output').text(people[i].name);

  // or we could create a function on the Array prototype directly
  /*
  Array.prototype.inArray2 = function(searchFor, property) {
      var retVal = -1;
      $.each(this, function(index, item) {
          if (item.hasOwnProperty(property)) {
              if (item[property].toLowerCase() === searchFor.toLowerCase()) {
                  retVal = index;
                  return false;
              }
          }
      });
      return retVal;
  };
  */

});





/*
var arr = [];
        $(xml).find('ARTWORK:has(GENRE:contains(' + genre + '))').each(function (idx, v) {
          arr[idx] = [];
          $(v).find('URL').each(function (i, vi) {
            arr[idx].push($(vi).text());
          });
        });
        console.log(arr);

$("#Trigger2").click(function () {
if ($("#thumbs").hasClass("fadeout"))
          $("#thumbs").removeClass("fadeout").addClass("fadein");
        else
          $("#thumbs").removeClass("fadein").addClass("fadeout");
      });


        $('#thumbs div').addClass('out').fadeOut(speed,function(){
          $('#thumbs div.out').remove();
          $('#thumbs div').fadeIn(speed);
        });

            $('#content').fadeOut(speed,function(){
              $('#content').html('<strong>'+title+'</strong>, '+year+'<br />'+medium+', '+height+' x '+width+' cm<br />'+availability+'<br /><img src="/gallery/images/'+image+'" alt="'+title+'" class="img-responsive" />');
            }).fadeIn(speed);


            window.onpopstate = function(e) {
        setCurrentPage(e.state ? e.state.url : null);
    };*/