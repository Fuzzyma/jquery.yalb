# Yalb

Yet Another LightBox  
Easy to use, out of the box

## Getting Started
Download the [production version][min] or the [development version][max].
Or run 
	
	bower install jquery.yalb

[min]: https://raw.githubusercontent.com/Fuzzyma/jquery.yalb/master/dist/jquery.yalb.min.js
[max]: https://raw.githubusercontent.com/Fuzzyma/jquery.yalb/master/dist/jquery.yalb.js

Include yalb after jquery in your web page:

    <link rel="stylesheet" href="dist/yalb.min.css">
	<script src="jquery.js"></script>
	<script src="dist/jquery.yalb.min.js"></script>
	<script>
	jQuery(function($) {
	
	  var images = [
	    'img1.jpg',
	    'img2.jpg',
	    'img3.jpg',
	    'img4.jpg',
	    'img5.jpg'
	  ]
	
	  $.yalb(images);

      // or just
      $('img').yalb();

      // for other possibilities to call yalb see below

	});
	</script>

## Documentation

### Collections you can pass to Yalb / Examples

- `array` filled with `Strings`

		var images = [
			'img1.jpg',
			'img2.jpg',
			'img3.jpg',
			'img4.jpg',
			'img5.jpg'
		];
		
		$.yalb(images);

- `NodeList` or `Array` of `Nodes`

		var images = document.getElementsByTagName('img');
        $.yalb(images);

		// or
		var links = document.getElementsByTagName('a');
		$.yalb(links, {src: 'href'});

        // or any other node with an attribute containing the path
        // e.g. <span data-image="/path/to/image.jpg"
        $.yalb(span, {src: 'data-image'});

- `jQuery`-Collection

		var images = $('img');
		$.yalb(images);

		// or of course
		$('img').yalb();

		// or same as above


- selfmade object containing the path

		var images = [
			{
				foo: 'bar'
				path: 'path/to/image.jpg'
			}, 
			{
				// and so on
			}
		];

		$.yalb(images, {src: 'path'});

		// or even
		var images = [
			{
				path: {
					'to': {
						'image': 'path/to/image.jpg'
					}
				}
			},
			{
				// and so on
			}
		];

		$.yalb(images, {src: 'path.to.image'});

### Options

The following options can be passed when calling yalb:

- `src` ( `default:'src'` ), Attribute where the path is located.
- `current` ( `default:0` ), The image which is presented when opening yalb
- `class` ( `default:'yalb'` ), The class passed to the html-container of yalb
- `loop` ( `default:true` ), If true, images will be repeated when hitting the first/last image
- `open` ( `default:true` ), If true, yalb opens when called
- `width` ( `default:0` ), max-with of the Yalb-window
- `height` ( `default:0` ), max-height of the Yalb-window

You can change the default values for the whole page by assigning to `$.yalb.defaults`

    $.yalb.defaults = {
        src: 'src',
        current: 0,
        'class': 'yalb',
        loop: true,
        open: true,
        width: 0,
        height: 0
    };

### Methods

You can control the behavior of yalb with the following methods

- `$.yalb.open()` - Opens yalb when still not open
- `$.yalb.close0()` - Close yalb; same as hitting the close-button
- `$.yalb.next()` - Next Image; same as hitting the next-button
- `$.yalb.prev()` - Previous Image; same as hitting the prev-button
- `$.yalb.show(index)` - Changes to the image on position `index`
- `$.yalb.on()` - Binds handler to an event (take a look at the **Events**-section)
- `$.yalb.off()` - Removes Handler (**Caution!!** - This will also remove handlers used by yalb itself when you don't explicitely specify a listener which should be removed or when you don't use namespaced events)
- `$.yalb.get()` - Gets the jQuery-instance of the container on which all events are triggered

### Events

You can listen to the following Events when using yalb:

- `change` - When the image has changed
- `open` - When open is called (per Method or per yalb-call with `open:true`)
- `close` - When close-button is pressed
- `next` - When next-button is pressed
- `prev` - When prev-button is pressed
- `show` - When show is called

### Style

You can style yalb to your own needs. An example-style is shipped with the code. You can change it to your needs.
Every button used is styled with css-only. No icon is needed. Even the loading-animation is css.

Take a look into the css-file - it's selfexplaining!