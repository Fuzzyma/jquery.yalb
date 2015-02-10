/*
 * jquery.yalb
 * https://github.com/Fuzzyma/jquery.yalb
 *
 * Copyright (c) 2015 Ulrich-Matthias Schäfer
 * Licensed under the MIT license.
 */

/* jshint -W083 */
(function($){

    var instance = null;

    $.yalb = function(options){

        // We create an instance of this plugin
        if(!(this instanceof $.yalb)){
            // close last instance
            if(instance){ instance.yalb.trigger('close'); }
            return new $.yalb(options);
        }else{
            instance = this;
        }

        var settings = $.extend({}, $.yalb.defaults, options),
            images = [],
            imgs = settings.imgs,
            current = settings.current,
            $container = $('<div>'),
            $wrapper,
            createSpan, prev, next, close, open, show, onload, onerror, changeImg, loadImg, showImg, resizeWindow, showError, showLoader, hideLoader, hideShowButtons, oldWidth = 0, oldHeight = 0;

        createSpan = function(name){
            return $('<span>',{ 'class': name, click: function(){ $container.trigger(name); } });
        };

        // add prev/next-links, loader and error-msg
        $container.addClass(settings['class'])
                  .append(createSpan('prev'))
                  .append(createSpan('next'))
                  .append(createSpan('close'))
                  .append($('<span>').addClass('loader').hide())
                  .append($('<strong>').addClass('error').hide());

        // wrapper containing the container
        $wrapper = $('<div>').addClass(settings['class'] + '_wrapper').click(function(e){
            if(e.target === this){ $container.trigger('close'); }
        }).append($container);

        // returns function which is called when one image is loaded
        onload = function(i){
            return function(){
                images[i].loaded = true;
                // when the just loaded image is the current one we are waiting for: change to it ( we could directly call resizeWindow here)
                if(i === current){ changeImg(); }
            };
        };

        // returns function which is called when one image could not be loaded
        onerror = function(i){
            return function(){
                images[i].error = true;
                if(i === current){ changeImg(); }
            };
        };

        // change the image
        changeImg = function(){

            hideShowButtons();

            if(images[current].loaded){
                // when image is already loaded, start the resizing process
                resizeWindow();
            }else if(images[current].error){
                // if there was an error loading the image, display the error ( no need to resize here )
                showError();
            }else{
                // the image has to be laded first. Display loader and start loading the Image
                showLoader();
                loadImg();
            }

        };

        // Loads one or more images
        loadImg = function(arr){

            arr = arr || [current];

            for(var i = 0, len = arr.length; i < len; ++i){

                // when image is already loaded or we are waiting for it or index out of range: continue
                if(arr[i] >= images.length || arr[i] < 0 || images[arr[i]].loaded || images[arr[i]].pending || images[arr[i]].error){ continue; }

                // set the path to the image which starts loading it, state is now "pending"
                images[arr[i]].img.src = imgs[arr[i]][settings.src];
                images[arr[i]].pending = true;

            }

        };

        // displays the loader-icon
        showLoader = function(){
            $container.children('img.loader').stop().fadeIn();
        };

        // hides it
        hideLoader = function(){
            $container.children('img.loader').stop().fadeOut();
            $container.children('strong.error').stop().fadeOut();
        };

        showImg = function(){
            $container.append($(images[current].img).addClass('image').fadeIn());
            $container.trigger('change', {index:current});
            loadImg([current-1, current+1]);
        };

        showError = function(){

            $container.children('img.image').fadeOut();
            $container.children('strong.error').fadeIn();

            loadImg([current-1, current+1]);

        };

        resizeWindow = function(){
            hideLoader();

            var ratio = images[current].img.naturalWidth / images[current].img.naturalHeight;
            var height = images[current].img.naturalHeight;
            var width = images[current].img.naturalWidth;

            if(height > $(window).height() - 40){
                height = $(window).height() - 40;
                width = ratio * ($(window).height() - 40);
            }

            if(width > $(window).width() - 40){
                width = $(window).width() - 40;
                height = ($(window).width() - 40) / ratio;
            }

            if($container.children('img.image').attr('src') === $(images[current].img).attr('src')){ return; }

            if($container.children('img.image').length){ $container.children('img.image').fadeOut(function(){ $(this).remove(); }); }

            if(Math.abs(oldWidth - width) > 1 || Math.abs(oldHeight - height) > 1){
                $container.stop();
                $container.animate({
                    width:width,
                    height:height,
                    bottom: -($(window).height() - height) / 2
                }, showImg);
            }else{
                showImg();
            }

            oldHeight = height;
            oldWidth = width;

        };

        hideShowButtons = function(){
            if(settings.loop){ return; }

            if(current === imgs.length - 1){ $container.children('.next').hide(); }
            else{ $container.children('.next').show();}

            if(current === 0){ $container.children('.prev').hide(); }
            else{ $container.children('.prev').show(); }
        };

        prev = function(){
            if(current > 0){
                --current;
                changeImg();
            }else if(settings.loop){
                current = images.length -1;
                changeImg();
            }
        };

        next = function(){
            if(current < imgs.length - 1){
                ++current;
                changeImg();
            }else if(settings.loop){
                current = 0;
                changeImg();
            }
        };

        close = function(){
            $container.parent().fadeOut(function(){ $(this).remove(); });
            $container.unbind();
        };

        show = function(e, data){
            if(data.index !== null){
                current = data.index % images.length;
                changeImg();
            }
        };

        open = function(){
            $wrapper.appendTo('body').fadeIn();
            changeImg();
        };

        // Bind events to yalb
        $container.on({
            prev:prev,
            next:next,
            close:close,
            show:show,
            open:open
        });

        this.yalb = $container;

        for(var i = 0, len = imgs.length; i < len; ++i){

            images[i] = {
                img: new Image(),
                loaded: false,
                pending: false,
                error: false
            };

            images[i].img.onload = (function(i){ return onload(i); })(i);
            images[i].img.onerror = (function(i){ return onerror(i); })(i);

        }

        if(settings.open){
            open();
            changeImg();
        }
    };

    $.yalb.prev = function(){
        if(!instance){ return; }
        instance.yalb.trigger('prev');
    };

    $.yalb.next = function(){
        if(!instance){ return; }
        instance.yalb.trigger('next');
    };

    $.yalb.close = function(){
        if(!instance){ return; }
        instance.yalb.trigger('close');
    };

    $.yalb.show = function(index){
        if(!instance){ return; }
        instance.yalb.trigger('show', {index:index});
    };

    $.yalb.open = function(){
        if(!instance){ return; }
        instance.yalb.trigger('open');
    };

    $.yalb.on = function(){
        if(!instance){ return; }
        instance.yalb.on.apply(instance.yalb, Array.prototype.slice.call(arguments, 0));
    };

    $.yalb.off = function(){
        if(!instance){ return; }
        instance.yalb.off.apply(instance.yalb, Array.prototype.slice.call(arguments, 0));
    };

    $.yalb.get = function(){
        if(!instance){ return; }
        return instance.yalb;
    };

    $.yalb.defaults = {
        imgs: [],
        src: 'src',
        current: 0,
        'class': 'yalb',
        loop: true,
        open: true
    };
})(jQuery);