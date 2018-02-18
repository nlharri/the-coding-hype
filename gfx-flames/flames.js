window.onload = function() {

  const numOfColorsAtIndex = 4;
  const numOfColors = 65536;
  const divider = 4.0005;
  const createFlamesRandomRows = 2;

  var createFlamesCurrentRandomRows = 0;
  var canvas = document.getElementById("viewport");
  var context = canvas.getContext("2d");

  var width = canvas.width;
  var height = canvas.height;
  var imagedata = context.createImageData(width, height);

  var paletteRed   = [];
  var paletteGreen = [];
  var paletteBlue  = [];

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    for (var x=mousePos.x - 5; x<mousePos.x+5; x++) {
      for (var y=mousePos.y - 5; y<mousePos.y+5; y++) {
        var palIndex = Math.floor(Math.random()*numOfColors);
        imagedata.data[pixelIndex(x,y,'r')] = getColor(palIndex,'r');
        imagedata.data[pixelIndex(x,y,'g')] = getColor(palIndex,'g');
        imagedata.data[pixelIndex(x,y,'b')] = getColor(palIndex,'b');
      }
    }
    var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
    console.log(message);
  }, false);


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
    #FFFF00 to
    #FF0000 to
    #000000
  */
  function generatePalette() {
    var halfNumOfColors = Math.floor(numOfColors/2);
    for (var i = 0; i<halfNumOfColors; i++) {
      paletteRed[i]   = 255;
      paletteGreen[i] = Math.floor((halfNumOfColors - i) / halfNumOfColors * 256);
      paletteBlue[i]  = 0;
    }
    for (var i = halfNumOfColors; i<numOfColors; i++) {
      paletteRed[i]   = Math.floor((numOfColors - i) / halfNumOfColors * 256);
      paletteGreen[i] = 0;
      paletteBlue[i]  = 0;
    }
  }

  /*
  Colors from
    #FFFFFF to
    #FFFF00 to
    #FF8000 to
    #FF0000 to
    #000000
  */
  function generatePalette2() {
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

  // Create the image
  function createFlames() {
    var paletteIndex = 0, useForThisNumberOfPixels = 0;

    if (createFlamesCurrentRandomRows % createFlamesRandomRows == 0) {
      createFlamesCurrentRandomRows = 1;
      for (var x=0; x<width; x++) {
        if (useForThisNumberOfPixels == 0) {
          //paletteIndex = Math.round(Math.random()*2)*(numOfColors/4+numOfColors/8);
          paletteIndex = Math.floor(Math.random()*numOfColors);
          useForThisNumberOfPixels = Math.floor(Math.random()*5);
        } else {
          useForThisNumberOfPixels--;
        }
        imagedata.data[pixelIndex(x,height-1,'r')] = getColor(paletteIndex,'r');
        imagedata.data[pixelIndex(x,height-1,'g')] = getColor(paletteIndex,'g');
        imagedata.data[pixelIndex(x,height-1,'b')] = getColor(paletteIndex,'b');
        imagedata.data[pixelIndex(x,height-1,'a')] = 255;
      }
    }

    createFlamesCurrentRandomRows++;

    for (var y = 0; y<height-1; y++) {
      for (var x = 0; x<width-1; x++) {
        imagedata.data[pixelIndex(x,y,'r')] =
          (imagedata.data[pixelIndex(x-1,(y+1)%height,'r')] +
           imagedata.data[pixelIndex(x  ,(y+1)%height,'r')] +
           imagedata.data[pixelIndex(x+1,(y+1)%height,'r')] +
           imagedata.data[pixelIndex(x  ,(y+2)%height,'r')]) / divider;
        imagedata.data[pixelIndex(x,y,'g')] =
          (imagedata.data[pixelIndex(x-1,(y+1)%height,'g')] +
           imagedata.data[pixelIndex(x  ,(y+1)%height,'g')] +
           imagedata.data[pixelIndex(x+1,(y+1)%height,'g')] +
           imagedata.data[pixelIndex(x  ,(y+2)%height,'g')]) / divider;
        imagedata.data[pixelIndex(x,y,'b')] =
          (imagedata.data[pixelIndex(x-1,(y+1)%height,'b')] +
           imagedata.data[pixelIndex(x  ,(y+1)%height,'b')] +
           imagedata.data[pixelIndex(x+1,(y+1)%height,'b')] +
           imagedata.data[pixelIndex(x  ,(y+2)%height,'b')]) / divider;
        imagedata.data[pixelIndex(x,y,'a')] = 256;
      }
    }
  }


  // Main loop
  function main() {
      // Request animation frames
      window.requestAnimationFrame(main);

      // Create the image
      createFlames();

      // Draw the image data to the canvas
      context.putImageData(imagedata, 0, 1);
  }

  generatePalette2();

  // Call the main loop
  main();

}