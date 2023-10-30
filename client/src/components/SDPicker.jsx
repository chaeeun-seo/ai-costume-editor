import { React, useState } from 'react';
import { useSnapshot } from 'valtio';

import CustomButton from './CustomButton';
import state from '../store';

const SDPicker = ({ promptSD, setPromptSD, generatingImgSD, handleSubmitSD, handleDecals, imgSrcSD, setImgSrcSD, selectedImg, setSelectedImg }) => {
  const snap = useSnapshot(state);
  const imageContainer = imgSrcSD.map((img, index) => {
    return (
      <label key={index} className='cursor-pointer'>
        <input 
          type="radio" 
          name="selectedImage" 
          value={img} 
          checked={selectedImg === img} 
          onChange={() => setSelectedImg(img)} 
          className="hidden"
        />
        <img 
          src={img}
          onClick={() => setSelectedImg(img)}
          className={`min-w-[90px] ${selectedImg === img ? `border-8 border-[${snap.color}]` : ""}`} 
        />
      </label>
    )
  })
  const imageBox = 
    <form className='w-full grid grid-cols-2 gap-2'>
      {imageContainer}
    </form>

  return (
    <div className={`aipicker-container ${imgSrcSD.length > 0 ? "w-[300px]" : "w-[195px]"}`}>
      <textarea 
        placeholder="Ask Stable Diffusion..." 
        rows={5} 
        value={promptSD} 
        onChange={(e) => setPromptSD(e.target.value)} 
        className="aipicker-textarea"
      />
      {/* {generatingImgSD ? <p>Loading...</p> : <img src={imgSrcSD}/>} */}
      {generatingImgSD ? <p>Loading...</p> : imageBox}
      <CustomButton 
        type="filled"
        title="Generate"
        handleClick={() => handleSubmitSD()}
        customStyles="text-xs"
      />
      <div className='flex flex-wrap gap-3'>
        {generatingImgSD ? (
          <CustomButton 
            type="outline"
            title="Asking Stable Diffusion..."
            customStyles="text-xs"
          />
        ) : (
          <>
            <CustomButton 
              type="outline"
              title="AI Logo"
              handleClick={() => handleDecals('logo', selectedImg)}
              customStyles="text-xs"
            />
            <CustomButton 
              type="outline"
              title="AI Full"
              handleClick={() => handleDecals('full', selectedImg)}
              customStyles="text-xs"
            />
          </>
        )}
      </div>        
    </div>
  )
}

export default SDPicker