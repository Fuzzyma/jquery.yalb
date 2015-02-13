# Yalb

Yet Another LightBox  
Easy to use, out of the box

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/ulima/jquery.yalb/master/dist/yalb.min.js
[max]: https://raw.github.com/ulima/jquery.yalb/master/dist/yalb.js

In your web page:


	<script src="jquery.js"></script>
	<script src="dist/yalb.min.js"></script>
	<script>
	jQuery(function($) {
	
	  // Some images to be shown
	  // This is only one possibility to call yalb
      // See Below for other accepted formats
	  var images = [
	    'img1.jpg',
	    'img2.jpg',
	    'img3.jpg',
	    'img4.jpg',
	    'img5.jpg'
	  ]
	
	  $.yalb(images);

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

### Methods

You can control the behavior of yalb with the following methods

- `$.yalb.open()` - Opens yalb when still not open
- `$.yalb.close0()` - Close yalb; same as hitting the close-button
- `$.yalb.next()` - Next Image; same as hitting the next-button
- `$.yalb.prev()` - Previous Image; same as hitting the prev-button
- `$.yalb.show(index)` - Changes to the image on position `index`
- `$.yalb.on()` - Binds handler to an event (take a look at the **Events**-section)
- `$.yalb.off()` - Removes Handler (**Caution!!** - This will also remove handlers used by yalb itself when you don't explicitely specify a listener which should be removed or when you don't use namespaced events)
- `$.yalb.get()` - Gets the jQuery-instance of the container to which all events are binded

### Events

You can listen to the following Events when using yalb:

- `change` - When the image has changed
- `open` - When open is called (per Method or per yalb-call with `open:true`)
- `close` - When close-button is pressed
- `next` - When next-button is pressed
- `prev` - When prev-button is pressed
- `show` - When show is called
