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
	  var images = [
	    {src:'img1.jpg'},
	    {src:'img2.jpg'},
	    {src:'img3.jpg'},
	    {src:'img4.jpg'},
	    {src:'img5.jpg'}
	  ]
	
	  $.yalb({imgs:images});
	  
	  
	  // or use a jQuery-collection instead
	  var images = $('img');
	  $.yalb({imgs:images});
	  
	  // or links
	  var images ) $('a');
	  $.yalb{imgs:images, src:'href'}
	});
	</script>


## Documentation

### Options

There are differenz options you can specify when calling yalb:

- `imgs` - Array containing Objects with one attribute holding the image-paths.
           
    This can be a node-collection, jquery-collection or any other array as long as `array[index][attribute_holding_path]` is specified
- `src` ( `default:'src'` ), Attribute where the path is located.
    
    E.g. a node-list holding links where the href-attribute holds a path should pass `'href'` here
- `current` ( `default:0` ), The image which is presented when opening yalb
- `class` ( `default:'yalb` ), The class passed to the html-container of yalb
- `loop` ( `default:true` ), If true, images will be repeated when hitting the last image
- `open` ( `default:true` ), If true, yalb opens when called

### Methods

You can control the behavioud of yalb with the following methods

- `$.yalb.open()` - Opens yalb when still not open
- `$.yalb.close0()` - Close yalb; same as hitting the close-button
- `$.yalb.next()` - Next Image; same as hitting the next-button
- `$.yalb.prev()` - Previous Image; same as hitting the prev-button
- `$.yalb.show(index)` - Changes to the Image on position `index`
- `$.yalb.on()` - Binds Handler to one Event specified in Events
- `$.yalb.off()` - Removes Handler (**Caution!!** - This will also remove handlers used by yalb itself when you don't specify a listener which should be removed or when you don't use namespaced events)
- `$.yalb.get()` - Gets the jQuery-instance of the container to which all events are binded

### Events

You can listen to the following Events when using yalb:

- `change` - When the image has changed
- `open` - When open is called (per Method or per yalb-call with `open:true`)
- `close` - When close-button is pressed
- `next` - When next-button is pressed
- `prev` - When prev-button is pressed
- `show` - When show is called
