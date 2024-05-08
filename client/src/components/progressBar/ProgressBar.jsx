import React from 'react'
import './ProgressBar.css'
const ProgressBar = ({color,width,totalwidth}) => {
  return (
    <div className='progressbar-container' style={{width:`${totalwidth}%`}}>
        <div className="progressbar-wrapper"
        style={{width:`${width}%`,backgroundColor:`${color}`}}>
          
        </div>
    </div>
  )
}

export default ProgressBar