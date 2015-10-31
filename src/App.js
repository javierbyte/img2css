import React from 'react'

var _ = require('lodash')
var Dropzone = require('react-dropzone')

var base64ImageToRGBArray = require('./lib/base64ImageToRGBArray')

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

    this.setState({
      loadingImage: true
    })

    fr.onload = (data) => {
      const base64 = data.currentTarget.result

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
        return `rgb(${col.r},${col.g},${col.b}) ${colIndex ? colIndex + 'px' : 0} ${rowIndex ? rowIndex + 'px' : 0}`
      }).join(',')
    }).join(',')

    return (
      <div className='padding-2x'>
        <h1>img2css.</h1>
        <div>This is a tool that can convert any image into a <i>pure css</i> image.</div>
        <div>Try it! (It's cpu heavy, please try with a small image first).</div>

        <Dropzone onDrop={this.onDrop} className='dropZone'>
          {loadingImage ? 'Processing...' : 'Drop an image here, or click to upload.'}
        </Dropzone>

        {rgbArray && (
          <div>
            <div className='tutorial'>
              This is your pure css (and single div) image! Enjoy!
            </div>

            <div className='pixel' style={{
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

        <div className='tutorial'>
          Created by <a href='http://github.com/javierbyte/'>javierbyte</a>.
        </div>

      </div>
    )
  }
})
