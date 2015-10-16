var base64ImageToRGBArray = function (base64, callback) {
  var img = new window.Image()
  img.onload = () => {
    var canvas = document.createElement('canvas')
    var ctx
    var data
    var result

    canvas.width = img.width
    canvas.height = img.height

    ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)

    data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data

    result = []
    for (let y = 0; y < canvas.height; y++) {
      result[y] = []
      for (let x = 0; x < canvas.width; x++) {
        result[y][x] = {
          r: data[y * canvas.width * 4 + x * 4],
          g: data[y * canvas.width * 4 + x * 4 + 1],
          b: data[y * canvas.width * 4 + x * 4 + 2],
          a: data[y * canvas.width * 4 + x * 4 + 3]
        }
      }
    }

    callback(null, result)
  }
  img.src = base64
}

module.exports = base64ImageToRGBArray
