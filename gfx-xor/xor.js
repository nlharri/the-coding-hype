window.onload = function() {

  const numOfColorsAtIndex = 4;
  const numOfColors = 65535;

  var canvas = document.getElementById("viewport");
  var context = canvas.getContext("2d");

  var offset = 0;
  var offsetIncrement = 1;

  var width = canvas.width;
  var height = canvas.height;
  var imagedata = context.createImageData(width, height);

  var paletteRed   = [];
  var paletteGreen = [];
  var paletteBlue  = [];

  // to calculate the pixel index
  function pixelIndex(x, y, colorComp) {
    var pixelIndex = (y * width + x) * numOfColorsAtIndex;
    var colorCompOffset = 0;
    switch (colorComp) {
      case 'r':
        break;
      case 'g':
        colorCompOffset = 1;
        break;
      case 'b':
        colorCompOffset = 2;
        break;
      case 'a':
        colorCompOffset = 3;
        break;
      default:
        break;
    }
    return pixelIndex + colorCompOffset;
  }

  /*
  Colors from
    #FFFFFF to
    #FFFF00 to
    #FF8000 to
    #FF0000 to
    #000000
  */
  function generatePalette() {
    var quarterNumOfColors = Math.floor(numOfColors/4);
    var halfNumOfColors = Math.floor(numOfColors/2);
    for (var i = 0; i<quarterNumOfColors; i++) {
      paletteRed[i]   = 255;
      paletteGreen[i] = 255;
      paletteBlue[i]  = Math.floor((quarterNumOfColors - i) / quarterNumOfColors * 256);
    }
    for (var i = quarterNumOfColors; i<halfNumOfColors; i++) {
      paletteRed[i]   = 255;
      paletteGreen[i] = Math.floor((halfNumOfColors - i) / quarterNumOfColors * 128) + 128;
      paletteBlue[i]  = 0;
    }
    for (var i = halfNumOfColors; i<halfNumOfColors + quarterNumOfColors; i++) {
      paletteRed[i]   = 255;
      paletteGreen[i] = Math.floor((halfNumOfColors + quarterNumOfColors - i) / quarterNumOfColors * 128);
      paletteBlue[i]  = 0;
    }
    for (var i = halfNumOfColors + quarterNumOfColors; i<numOfColors; i++) {
      paletteRed[i]   = Math.floor((numOfColors - i) / quarterNumOfColors * 256);
      paletteGreen[i] = 0;
      paletteBlue[i]  = 0;
    }
  }

  function getColor(index, colorComp) {
    switch (colorComp) {
      case 'r':
        return paletteRed[index];
        break;
      case 'g':
        return paletteGreen[index];
        break;
      case 'b':
        return paletteBlue[index];
        break;
      default:
        break;
    }
  }

// ^
// |
// &
  function createXOR() {
    var paletteIndex = 0;
    for (var y = 0; y<height-1; y++) {
      for (var x = 0; x<width-1; x++) {
        var color = Math.floor((((((x+offset)%256)^((y+offset)%256))+offset)/256)*numOfColors );
        imagedata.data[pixelIndex(x,y,'r')] = getColor(color, 'r');
        imagedata.data[pixelIndex(x,y,'g')] = getColor(color, 'g');
        imagedata.data[pixelIndex(x,y,'b')] = getColor(color, 'b');
        imagedata.data[pixelIndex(x,y,'a')] = 256;
      }
    }
    offset = (offset + offsetIncrement);
    if (offset == 256) {
      offsetIncrement = -1;
    } else if (offset == 0) {
      offsetIncrement = 1;
    }
  }

  // Main loop
  function main() {
      // Request animation frames
      window.requestAnimationFrame(main);

      // Create the image
      createXOR();

      // Draw the image data to the canvas
      context.putImageData(imagedata, 0, 1);
  }

  generatePalette();

  // Call the main loop
  main();

}
