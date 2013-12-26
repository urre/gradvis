
/**

 *
 *
 * Gradvis, an Chrome extension enhancing gradvall.se
 * Code by @urre
 *
 */

(function($) {

    "use strict";

    var Gradvall = {

        init: function() {

            // Check list type, Year review or regular reviews
            this.checktype();

            // Add Share buttons
            this.sharebuttons();
        },

        sharebuttons: function(){

            var gradvall_url = window.location.href;
            var gradvall_title = $(document).find("title").text();

            // Kippt button
           $('#main').append('<h4 class="share">Dela och spara</h4>');

            // Tweet button
            $('#main').append('<a class="twitter-save-button" href="http://twitter.com/intent/tweet?text='+encodeURIComponent(gradvall_title)+'&url='+encodeURIComponent(gradvall_url)+'&via=jangradvall">Dela på Twitter</a>');

            // Facebook button
            $('#main').append('<a class="facebook-save-button" href="http://www.facebook.com/sharer.php?s=100&p[title]='+encodeURIComponent(gradvall_title) + '&p[url]=' + encodeURIComponent(gradvall_url)+'">Dela</a>');

            // Kippt button
            $('#main').append('<a href="https://kippt.com/save" class="kippt-save-button" data-url="'+gradvall_url+'" data-title="'+gradvall_title+'" data-source="gradvall.se">Spara til Kippt</a>');

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

        // Find keyword (ie. text node) and wrap with spotify links
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
                    Gradvall.yearlist();
                } else {
                    Gradvall.regularlist();

                }

            }

        },


        // A numbered yearlist. ex. http://www.gradvall.se/artiklar.asp?entry_id=1047
        yearlist: function(){

            var notspotifyble = ["återutgivningar", "musikböcker", "återutgivningar", "textförfattare", "kompositör", "producenter", "tv-serier", "skandal", "utställningar", "live", "kreativa epicentrum", "bioupplevelser" ];
            var i = 1;
            var opta = {
                keys: []
            };

            var selectorz = ":visible:not(:input):not(label):not(select)";

            // Get att br tags, make text node selections from here
            $("#main p br").each(function(i) {

                if($(this).nextAll("br").get(1)) {
                    // Get raw text node value
                    var tt = $(this).nextAll("br").get(0).nextSibling.nodeValue;

                    // Check heading
                    if(tt.indexOf("Årets") == -1 && $.inArray(tt, notspotifyble) == -1) {

                        // Get numbering strings
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
            Gradvall.applyKeyword(selectorz,opta);
        },

        // Regular "Skivrecensioner"
        regularlist: function(){

           /**
             * First record
             */

            // Cleanup
            var first_record_artist        = $.trim($('#main').find('h1').next('p').html().split("<br>")[0]);
            var first_record_title         = $.trim($('#main').find('h1').next('p').html().split("<br>")[1]);
            var first_record_artist_clean  = first_record_artist.replace(/\s/g,"+");
            var first_record_title_clean   = $.trim(first_record_title.replace(/Titel: /g, '').replace(/\&amp;/g,'&'));
            var first_record_title_spotify = $.trim(first_record_title.replace(/Titel: /g, '').replace(/\s/g,"+"));

            // Use some regex
            var regex = new RegExp(first_record_title_clean, 'g');
            $('#main p').replaceText(regex, '<a href="spotify:search:album:'+first_record_title_spotify+'" class="spotify">'+first_record_title+'<\/a>' );

            // Wrap Jan Gradvall in Twitter links to @jangradvall
            var opt = {
                keys: []
            };

            opt.keys[0] =
                {
                    keyword:'Jan Gradvall',
                    prefix:'<a href="http://twitter.com/jangradvall" class="twitter">',
                    suffix:'</a>',
                    partials: true
            };

            var selector = ":visible:not(:input):not(label):not(select)";
            Gradvall.applyKeyword(selector,opt);

            /**
             * The other records
             */
            var i = 1;

            // Loop the Twitter links and find records below
            $("#main p .twitter").each(function(i) {

                if($(this).nextAll("br").get(2)) {

                    // Get album title and Spotify-friendly link href
                    var album_title = $.trim($(this).nextAll("br").get(2).nextSibling.nodeValue);
                    var album_title_clean  = album_title.replace(/Titel: /g, '').replace(/\s/g,"+").replace(/Titel. /g, '');

                        // Wrap records like before
                        if(album_title !== '') {

                           opt.keys[i] =
                           {
                               keyword: album_title,
                               prefix:'<a href="spotify:search:'+album_title_clean+'" class="spotify">',
                               suffix:'</a>',
                               partials: true
                           };

                           Gradvall.applyKeyword(selector,opt);

                        }
                }

            });

            // Remove nested links
            $('#main p').find('.spotify').each(function() {
                var hj = $(this).find('a');
                if(hj.length) {
                    var hk = $(this).text();
                    hj.remove();
                    $(this).text(hk.replace(/Titel: /g, '').replace(/Titel. /g, ''));
                }
            });

            // Remove duplicate links
            var seen = {};
            $('#main p').find('.spotify').each(function() {
                var txt = $(this).html();
                if (seen[txt]) {
                    $(this).removeAttr("href").removeClass('spotify');
                } else {
                    seen[txt] = true;
                }
            });


        },


	}

    $(function() {
        Gradvall.init();
    });

}(jQuery));
