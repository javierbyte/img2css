# img2css

Convert any image to pure CSS.

[Live demo](https://javier.xyz/img2css/)

[![img2css](docs-assets/screenshot.jpg)](https://javier.xyz/img2css/)

## How does it works?

Well, it just puts the image in a canvas, calculates an array with the rgb values, and then... creates a single pixel shadow for each value!

## Why?

Hum... to demonstrate the power of CSS!

And this may have other interesting applications, like creating loading screens with pixel art, display images where `<img />` tags are not allowed or supported.

I made another proof-of-concept using pixel-level animations here https://javier.xyz/morphin/

## Development

Run development server:

```
npm run dev
```

Build

```
npm run build
```
