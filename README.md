# img2css

Convert any image to pure CSS.

[Live demo](http://javier.xyz/img2css/)

[![img2css](docs-assets/screenshot.jpg)](http://javier.xyz/img2css/)

## How does it works?

Well, it just puts the image in a canvas, calculates an array with the rgb values, and then... creates a single pixel shadow for each value!

## Why?
Hum... to demonstrate the power of CSS!

And this may have other interesting applications, like creating loading screens with pixel art or pixel-level animation.

I made another proof-of-concept using pixel-level animations here http://javier.xyz/morphin/

## Planned features
* Make the result smaller with smarter shadows and common background detection.
* Make animation and image morphing by using css transitions on the shadows. See http://javier.xyz/morphin/
* Add scale options to better support pixel art.
* Support for custom image filters.

## Development
Run development server:
```
npm start
```

Build 

```
npm run build
```