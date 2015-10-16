import React from 'react'

var _ = require('lodash')
var Dropzone = require('react-dropzone')

var base64ImageToRGBArray = require('./lib/base64ImageToRGBArray')

export const App = React.createClass({

  getInitialState () {
    return {
      rgbArray: null
    }
  },

  onDrop (files) {
    var file = files[0]
    var fr = new window.FileReader()
    fr.onload = (data) => {
      const base64 = data.currentTarget.result

      base64ImageToRGBArray(base64, (err, data) => {
        if (err) return console.error(err)

        this.setState({
          rgbArray: data
        })
      })
    }
    fr.readAsDataURL(file)
  },

  render () {
    var {rgbArray} = this.state

    var masterShadow = _.map(rgbArray, (row, rowIndex) => {
      return _.map(row, (col, colIndex) => {
        return `rgb(${col.r}, ${col.g}, ${col.b}) ${colIndex}px ${rowIndex}px`
      }).join(',')
    }).join(',')

    console.warn(masterShadow)

    return (
      <div>
        <Dropzone onDrop={this.onDrop} className='dropZone'>
          <div>Drop image here, or click to upload.</div>
        </Dropzone>

        <div className='pixel' style={{
          boxShadow: masterShadow
        }} />
      </div>
    )
  }
})
