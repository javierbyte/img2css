import React from 'react'
import tinycolor from 'tinycolor2'

var _ = require('lodash')
var Dropzone = require('react-dropzone')

var base64ImageToRGBArray = require('./lib/base64ImageToRGBArray')

function compressColor (rgb) {
  var hex = tinycolor(rgb).toHexString()

  switch (hex) { // based on CSS3 supported color names http://www.w3.org/TR/css3-color/
    case '#c0c0c0': return 'silver';
    case '#808080': return 'gray';
    case '#800000': return 'maroon';
    case '#ff0000': return 'red';
    case '#800080': return 'purple';
    case '#008000': return 'green';
    case '#808000': return 'olive';
    case '#000080': return 'navy';
    case '#008080': return 'teal';
  }
  return hex[1] === hex[2] && hex[3] === hex[4] && hex[5] === hex[6] ? "#" + hex[1] + hex[3] + hex[5] : hex;
}

export const App = React.createClass({

  getInitialState () {
    return {
      rgbArray: null,
      loadingImage: false
    }
  },

  onDrop (files) {
    var file = files[0]
    var fr = new window.FileReader()

    if (window.ga) {
      window.ga('send', 'event', 'button', 'click', 'img2css execute')
    }

    this.setState({
      loadingImage: true
    })

    fr.onload = (data) => {
      const base64 = data.currentTarget.result

      if (base64.length > 100000) {
        let confirmation = confirm('Your image is really big, do you really want to try to convert it?')

        if(!confirmation) {
          this.setState({
            loadingImage: false
          })
          return
        }
      }

      base64ImageToRGBArray(base64, (err, data) => {
        if (err) return console.error(err)

        this.setState({
          rgbArray: data,
          loadingImage: false
        })
      })
    }
    fr.readAsDataURL(file)
  },

  render () {
    var {rgbArray, loadingImage} = this.state

    var masterShadow = _.map(rgbArray, (row, rowIndex) => {
      return _.map(row, (col, colIndex) => {
        var color = compressColor(`rgb(${col.r},${col.g},${col.b})`)

        return `${color} ${colIndex ? colIndex + 'px' : 0} ${rowIndex ? rowIndex + 'px' : 0}`
      }).join(',')
    }).join(',')

    return (
      <div className='padding-horizontal-2x'>

        <Dropzone onDrop={this.onDrop} className='dropZone'>
          {loadingImage ? 'Processing...' : 'Drop an image here, or click to upload.'}
        </Dropzone>

        {rgbArray && (
          <div>
            <div className='tutorial'>
              This is your pure css (and single div) image! Enjoy! {masterShadow.length.toLocaleString()}b
            </div>

            <div className='pixel' style={{
              height: 1,
              width: 1,
              boxShadow: masterShadow,
              marginBottom: rgbArray.length
            }} />

            <div className='tutorial'>
              The code:
            </div>

            <div className='code'>
              {`<div style="height: 1px; width: 1px; box-shadow: ${masterShadow}"></div>`}
            </div>
          </div>
        )}

      </div>
    )
  }
})
