import React from 'react'
import './spiner.css'
function Spinner({width, height}) {
  return (
    <div>
      <div className="loading-spinner-container">
    <div className="loading-spinner" 
    style={{ width: `${width}px`, height: `${height}px` }}></div>
  </div>
    </div>
  )
}

export default Spinner
