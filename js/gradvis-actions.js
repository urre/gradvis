
/**

 *
 *
 * Gradvis, an Chrome extension enhancing Gradvall.se
 * Code by @urre
 *
 */

(function($) {

    "use strict";

    var Gradvis = {

        init: function() {

            // Check list type, Year review or regular reviews
            this.checktype();

            // Add Share buttons
            this.sharebuttons();

            // Wrap Jan Gradvis in Twitter links to @janGradvis
            this.GradvisTwitter();
        },

        // Wrap Jan Gradvis in Twitter links to @janGradvis
        GradvisTwitter: function() {

            var opt = {
                keys: []
            };

            opt.keys[0] =
                {
                    keyword:'Jan Gradvall',
                    prefix:'<a href="http://twitter.com/janGradvall" class="twitter">',
                    suffix:'</a>',
                    partials: true
            };

            var selector = ":visible:not(:input):not(label):not(select)";
            Gradvis.applyKeyword(selector,opt);
        },

        // Append share and save buttons after text content
        sharebuttons: function(){

            var Gradvis_url = window.location.href;
            var Gradvis_title = $(document).find("title").text();

            // Kippt button
           $('#main').append('<h4 class="share">Dela och spara</h4>');

            // Tweet button
            $('#main').append('<a class="twitter-save-button" href="http://twitter.com/intent/tweet?text='+encodeURIComponent(Gradvis_title)+'&url='+encodeURIComponent(Gradvis_url)+'&via=janGradvis">Dela på Twitter</a>');

            // Facebook button
            $('#main').append('<a class="facebook-save-button" href="http://www.facebook.com/sharer.php?s=100&p[title]='+encodeURIComponent(Gradvis_title) + '&p[url]=' + encodeURIComponent(Gradvis_url)+'">Dela</a>');

            // Kippt button
            $('#main').append('<a href="https://kippt.com/save" class="kippt-save-button" data-url="'+Gradvis_url+'" data-title="'+Gradvis_title+'" data-source="Gradvis.se">Spara til Kippt</a>');

            // Handle Kippt click
            $(".kippt-save-button").on("click", function(e){
                e.preventDefault();
                var elem = e.currentTarget;
                var url = encodeURIComponent($(elem).data("url")),
                    title= encodeURIComponent($(elem).data("title")),
                    source = encodeURIComponent($(elem).data("source")),
                    via = encodeURIComponent($(elem).data("via"));

                var windowUrl = "https://kippt.com/extensions/new?url="+ url +"&title="+ title +"&source="+ source +"&via="+ via;
                window.open(windowUrl, "kippt-popup", "location=no,menubar=no,status=no,titlebar=no,scrollbars=no,width=420,height=192");
            });

            // Pocket button
            $('#main').append('<a class="pocket-save-button" href="http://getpocket.com/edit">Pocket</a>');
        },

        // Find keyword (ie. text node) and wrap it with dom element (argument)
        applyKeyword: function(selector,opt) {

          var numOfKeys = opt.keys.length;
          for (var i=0;i<numOfKeys;i++){
            if (opt.keys[i].partials) {
              var re = new RegExp("("+opt.keys[i].keyword+")",'ig');
            } else {
              var re = new RegExp("(\\b"+opt.keys[i].keyword+"\\b)",'ig');
            }
            $(selector).contents().filter(function(){
              return this.nodeType != 1;
            }).each(function(){
              var output = $(this).text().replace(re,opt.keys[i].prefix+"$1"+opt.keys[i].suffix);
              if (output != $(this).text()) {
                $(this).wrap("<p></p>").parent('p').html(output).contents().unwrap();
              }
            })
          }
        },

        // Check article type
        checktype: function(){

            var archive_exists  = $('#main').find('h2').length;
            var start_exists    = $('#mainFirst').length;
            var archive_heading = $('#main').find('h2').text();
            var the_heading     = $('#main').find('h1').text();

            if(archive_exists || the_heading.indexOf("Gosskör") >= 0 || the_heading.indexOf("hemsida") >= 0 || the_heading.indexOf("Skivrecensioner") == -1) {
            } else {

                var kind = $.trim($('#main').find('h1').next('p').html().split("<br>")[0]);

                if(kind.indexOf('Årets') >= 0) {
                    Gradvis.yearlist();
                } else {
                    Gradvis.regularlist();

                }

            }

        },


        // A numbered yearlist. ex. http://www.Gradvis.se/artiklar.asp?entry_id=1047
        yearlist: function(){

            var notspotifyble = ["återutgivningar", "musikböcker", "återutgivningar", "textförfattare", "kompositör", "producenter", "tv-serier", "skandal", "utställningar", "live", "kreativa epicentrum", "bioupplevelser" ];
            var i = 1;
            var opta = {
                keys: []
            };

            // Selector, not a label och select element
            var selectorz = ":visible:not(:input):not(label):not(select)";

            // Get att br tags, make text node selections from here
            $("#main p br").each(function(i) {

                if($(this).nextAll("br").get(1)) {

                    // Get raw text node value
                    var tt = $(this).nextAll("br").get(0).nextSibling.nodeValue;

                    // Check heading
                    if(tt.indexOf("Årets") == -1 && $.inArray(tt, notspotifyble) == -1) {

                        // Get numbered strings (splist list with bullets)
                        var to = $.trim(tt.split('. ')[1]);

                        // Sanitize
                        if(typeof to !== 'undefined' && to != '' && to.indexOf(",") != -1) {

                            // String cleanup
                            var tp_title = to;
                            var tp_title_spaces = tp_title.replace(/, /g, ' ');
                            var tp_clean = tp_title.replace(/, /g, ' ').replace(/ /g, '+');

                                // Wrap strings with spotify links
                               opta.keys[i] =
                               {
                                   keyword: tp_title,
                                   prefix:'<a href="spotify:search:'+tp_clean+'" class="spotify">',
                                   suffix:'</a>',
                                   partials: true
                               };

                        }

                    }

                }

            });

            // Apply spotify links in text sections
            Gradvis.applyKeyword(selectorz,opta);
        },

        // Regular "Skivrecensioner"
        regularlist: function(){

            // Wrap Betyg in span tags, and use this as a starting point for finding album and artists
            $('#main p').contents().filter(function() {
               if( this.nodeType == 3 && $.trim(this.data) != "" && this.data.indexOf("Betyg") >= 0 ) {
                   return true;
                }
            }).wrap('<span class="betyg"></span>')
            .end();

                // Start from Betyg span and traverse the DOM from here
                $("span:contains('Betyg:')").each(function() {

                    var artist       = $(this).prev().prev().prev()[0].previousSibling.nodeValue.trim();
                    var artist_clean = artist.replace(/\s/g,"+");
                    var artist_parts = artist_clean.split("+");

                    var album_title       = $(this).prev().prev()[0].previousSibling.nodeValue.trim();
                    var album_title_clean = album_title.replace(/Titel: /g, '').replace(/\s/g,"+").replace(/Titel. /g, '');

                    var first_uri;
                    var artist_uri;

                    // Use Spotify Metadata API
                    $.ajax({
                        type: "GET",
                        url: "http://ws.spotify.com/search/1/album?q=album:"+album_title_clean+"+artist:"+artist_clean+"",
                        dataType: "json",
                        success: function (data) {

                            // Check returned data from Spotify API
                            if($.isEmptyObject(data.albums) == false) {

                                first_uri = data.albums[0].href;

                                var spotify_artist_name = data.albums[0].artists[0].name;
                                var regex = new RegExp(album_title_clean, 'g');


                                // Check if spotify artist name exists in splitted artist name array. For Gradvis spelling issues :)
                                var found = $.inArray(spotify_artist_name, artist_parts) > -1;

                                // Make link and include Spotify play button widget
                                if(found !== -1) {
                                    var first_play_button = '<iframe src="https://embed.spotify.com/?uri='+first_uri+'" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>';
                                    var discover_links = '<div class="discover">'+artist+'<a class="allmusic" href="http://www.allmusic.com/search/artists/'+artist_clean+'" alt="Upptäck mer på All music"></a><a class="wikipedia" href="http://en.wikipedia.org/w/index.php?search='+encodeURIComponent(artist)+'" alt="Upptäck mer på Wikipedia"></a></div>';
                                    $('#main p').replaceText(album_title, '<a href="spotify:search:album:'+album_title_clean+'" class="spotify">'+album_title+'<\/a>'+first_play_button+discover_links+'' );
                                }

                                Gradvis.remove_duplicate_links();

                            } else {
                                Gradvis.get_artist_playbutton(artist, artist_clean, album_title, album_title_clean);

                            }
                        },
                        error: function(data) {


                        }
                    });

                });

        },

        remove_duplicate_links: function(){

            // Remove duplicate links
            var seen = {};
            $('#main p .spotify').each(function() {
                var href = $(this).attr('href');
                if (seen[href]) {
                    $(this).removeClass('spotify').removeAttr('href');
                    $(this).next('iframe').remove();
                    $(this).next('.discover').remove();
                } else {
                    seen[href] = true;
                }
            });

        },

        get_artist_playbutton: function(artist_name, artist_name_clean, album_title, album_title_clean){

            // Use Spotify Metadata API, now searching for album by artist name
            $.ajax({
                type: "GET",
                url: "http://ws.spotify.com/search/1/album.json?q=artist:"+artist_name+"",
                dataType: "json",
                success: function (data) {
                    var album_uri = data.albums[0].href;
                    var first_play_button = '<iframe src="https://embed.spotify.com/?uri='+album_uri+'" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>';
                    var discover_links = '<div class="discover">'+artist_name+'<a class="allmusic" href="http://www.allmusic.com/search/artists/'+artist_name_clean+'" alt="Upptäck mer på All music"></a><a class="wikipedia" href="http://en.wikipedia.org/w/index.php?search='+encodeURIComponent(artist_name)+'" alt="Upptäck mer på Wikipedia"></a></div>';
                    $('#main p').replaceText(album_title, '<a href="spotify:search:'+album_title_clean+'" class="spotify">'+album_title+'<\/a>'+first_play_button+discover_links+'' );

                    Gradvis.remove_duplicate_links();

                }

            });


        }


	}

    $(function() {
        Gradvis.init();
    });

}(jQuery));