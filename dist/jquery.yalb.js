/*! jquery.yalb - v0.3.1 - 2015-02-20
* https://github.com/Fuzzyma/jquery.yalb
* Copyright (c) 2015 Ulrich-Matthias Schäfer; Licensed MIT */
/* jshint -W083 */
(function($){

    var instance = null;

    $.yalb = function(list, options){

        // We create an instance of this plugin
        if(!(this instanceof $.yalb)){
            // close last instance
            if(instance){ instance.yalb.trigger('close'); }
            return new $.yalb(list, options);
        }else{
            instance = this;
        }

        var settings = $.extend({}, $.yalb.defaults, options),
            images = [],
            current = settings.current,
            $container = $('<div>'),
            $wrapper,
            createSpan,
            hideLoader,
            hideShowButtons,
            showLoader,
            showError,
            showImg,
            getSrc,
            loadImg,
            changeImg,
            resizeWindow,
            onerror,
            onload,
            prev,
            next,
            show,
            open,
            close;


        // Helper, gives a span with added class and click-event
        createSpan = function(name){
            return $('<span>',{ 'class': name, click: function(){ $container.trigger(name); } });
        };

        // hides the loader-icon
        hideLoader = function(){
            $container.children('span.loader').stop().fadeOut();
            $container.children('strong.error').stop().fadeOut();
        };

        // hides or shows next and prev-button
        hideShowButtons = function(){
            if(settings.loop && list.length > 1){ return; }

            if(current === list.length - 1){ $container.children('.next').hide(); }
            else{ $container.children('.next').show();}

            if(current === 0){ $container.children('.prev').hide(); }
            else{ $container.children('.prev').show(); }
        };

        // displays the loader-icon
        showLoader = function(){
            $container.children('span.loader').stop().fadeIn();
        };

        // shows the error-msg
        showError = function(){

            $container.children('img.image').fadeOut(function(){ $(this).remove(); });
            $container.children('span.loader').stop().fadeOut();
            $container.children('strong.error').fadeIn();

            loadImg([current-1, current+1]);

        };

        // shows the image
        showImg = function(){
            $container.append($(images[current].img).addClass('image').fadeIn());
            $container.trigger('change', {index:current});
            loadImg([current-1, current+1]);
        };

        // returns the src-path of an image
        getSrc = function(obj){

            if(typeof obj === 'string'){ return obj; }

            // check if a data-attribute was specified
            if(obj instanceof Node && settings.src.indexOf('data-') === 0){

                return obj.getAttribute(settings.src);

            }

            var split = settings.src.split('.');

            // extract path from object in case `src`-path is nested
            for(var i = 0, len = split.length; i < len; ++i){
                obj = obj[split[i]];
            }

            // return path string
            return obj;

        };

        // Loads one or more images
        loadImg = function(arr){

            arr = arr || [current];

            for(var i = arr.length; i--;){

                // When looping is active, make sure we also load images out of range
                if(settings.loop && arr[i] < 0){
                    arr[i] += images.length;
                }

                // check if image is loaded / error / pending or index is out of range
                if(arr[i] >= images.length || arr[i] < 0 || images[arr[i]].loaded || images[arr[i]].pending || images[arr[i]].error){ continue; }

                // start image-loading by setting its path, state is now "pending"
                images[arr[i]].img.src = getSrc(list[arr[i]]);
                images[arr[i]].pending = true;

            }

        };

        // changes the image
        changeImg = function(){

            hideShowButtons();

            if(images[current].loaded){
                // when image is already loaded, start the resizing process
                resizeWindow();
            }else if(images[current].error){
                // if there was an error loading the image, display the error ( no need to resize here )
                showError();
            }else{
                // the image has to be loaded first. Display loader and start loading the Image
                showLoader();
                loadImg();
            }

        };

        // resizes the window to fit the new image
        resizeWindow = function(){
            hideLoader();

            // make sure that new image is not the same as current, fade Out the old Image
            if($container.children('img.image').attr('src') === $(images[current].img).attr('src')){ return; }
            if($container.children('img.image').length){ $container.children('img.image').fadeOut(function(){ $(this).remove(); }); }

            var ratio = images[current].img.naturalWidth / images[current].img.naturalHeight,
                height = images[current].img.naturalHeight,
                width = images[current].img.naturalWidth,
                maxHeight = settings.height || $(window).height() - 40,
                maxWidth = settings.width || $(window).width() - 40;

            // scale down image if to big
            if(height > maxHeight){
                height = maxHeight;
                width = ratio * maxHeight;
            }

            if(width > maxWidth){
                width = maxWidth;
                height = maxWidth / ratio;
            }

            // when image-dimension didn't change to much ( < 1px) don't animate
            if(Math.abs($container.width() - width) > 1 || Math.abs($container.height() - height) > 1){
                $container.stop();
                $container.animate({
                    width: width,
                    height: height,
                    bottom: -($(window).height() - height) / 2
                }, showImg);
            }else{
                showImg();
            }

        };

        // returns function which is called when one image could not be loaded
        onerror = function(i){
            return function(){
                images[i].error = true;
                if(i === current){ changeImg(); }
            };
        };

        // returns function which is called when one image is loaded
        onload = function(i){
            return function(){
                images[i].loaded = true;
                // when the just loaded image is the current one we are waiting for: change to it ( we could directly call resizeWindow here)
                if(i === current){ changeImg(); }
            };
        };

        // change to previous image
        prev = function(){
            if(current > 0){
                --current;
                changeImg();
            }else if(settings.loop){
                current = images.length -1;
                changeImg();
            }
        };

        // change to next image
        next = function(){
            if(current < list.length - 1){
                ++current;
                changeImg();
            }else if(settings.loop){
                current = 0;
                changeImg();
            }
        };

        // changes to a specific image
        show = function(e, data){
            if(data.index !== null){
                current = data.index % images.length;
                changeImg();
            }
        };

        // close yalb
        close = function(){
            $container.parent().fadeOut(function(){ $(this).remove(); });
            $container.unbind();
        };

        // open yalb if not already open
        open = function(){
            $wrapper.appendTo('body').fadeIn();
            changeImg();
        };

        // add prev/next-links, loader and error-msg
        $container.addClass(settings['class'])
                  .append(createSpan('prev'))
                  .append(createSpan('next'))
                  .append(createSpan('close'))
                  .append($('<span>').addClass('loader').hide())
                  .append($('<strong>').addClass('error').hide());

        // wrapper containing yalb
        $wrapper = $('<div>').addClass(settings['class'] + '_wrapper').click(function(e){
            if(e.target === this){ $container.trigger('close'); }
        }).append($container);

         // Bind events to yalb
        $container.on({
            prev:prev,
            next:next,
            close:close,
            show:show,
            open:open
        });

        this.yalb = $container;

        // loop through all images and create an image-object and a state-machine for every one
        for(var i = 0, len = list.length; i < len; ++i){

            images[i] = {
                img: new Image(),
                loaded: false,
                pending: false,
                error: false
            };

            images[i].img.onload = onload(i);
            images[i].img.onerror = onerror(i);

        }

        // Open yalb
        if(settings.open){
            open();
            changeImg();
        }
        
        return this;
    };

    $.yalb.prev = function(){
        if(!instance){ return $.yalb; }
        instance.yalb.trigger('prev');
        return $.yalb;
    };

    $.yalb.next = function(){
        if(!instance){ return $.yalb; }
        instance.yalb.trigger('next');
        return $.yalb;
    };

    $.yalb.close = function(){
        if(!instance){ return $.yalb; }
        instance.yalb.trigger('close');
        return $.yalb;
    };

    $.yalb.show = function(index){
        if(!instance){ return $.yalb; }
        instance.yalb.trigger('show', {index:index});
        return $.yalb;
    };

    $.yalb.open = function(){
        if(!instance){ return $.yalb; }
        instance.yalb.trigger('open');
        return $.yalb;
    };

    $.yalb.on = function(){
        if(!instance){ return $.yalb; }
        instance.yalb.on.apply(instance.yalb, Array.prototype.slice.call(arguments, 0));
        return $.yalb;
    };

    $.yalb.off = function(){
        if(!instance){ return $.yalb; }
        instance.yalb.off.apply(instance.yalb, Array.prototype.slice.call(arguments, 0));
        return $.yalb;
    };

    $.yalb.get = function(){
        if(!instance){ return $.yalb; }
        return instance.yalb;
    };

    $.yalb.defaults = {
        src: 'src',
        current: 0,
        'class': 'yalb',
        loop: true,
        open: true,
        width: 0,
        height: 0
    };

    $.fn.yalb = function(options){
        $.yalb(this, options);
        return this;
    };

})(jQuery);