import React from 'react'

var ImageAsCanvas = React.createClass({

  propTypes: {
    base64image: React.PropTypes.string
  },

  shouldComponentUpdate (nextProps) {
    return nextProps.base64image !== this.props.base64image
  },

  componentDidMount () {
    if (this.props.base64image) this._loadImageToCanvas()
  },

  componentDidUpdate () {
    this._loadImageToCanvas()
  },

  _loadImageToCanvas () {
    var img = new window.Image()
    img.onload = () => {
      var canvas = React.findDOMNode(this.refs.canvas)
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      console.warn(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height))

      // do some manipulations...

      // canvas.toDataURL('image/png')
    }
    img.src = this.props.base64image
  },

  render () {
    return (
      <canvas ref='canvas' />
    )
  }
})

module.exports = ImageAsCanvas
