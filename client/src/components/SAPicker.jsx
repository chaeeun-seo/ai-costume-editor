import { React, useState } from 'react';
import { useSnapshot } from 'valtio';

import CustomButton from './CustomButton';
import state from '../store';

const SAPicker = ({ promptSA, setPromptSA, generatingImgSA, handleSubmitSA, handleDecals, imgSrcSA, setImgSrcSA, selectedImgSA, setSelectedImgSA }) => {
  const snap = useSnapshot(state);
  const imageContainer = imgSrcSA.map((img, index) => {
    return (
      <label key={index} className='cursor-pointer'>
        <input 
          type="radio" 
          name="selectedImage" 
          value={img} 
          checked={selectedImgSA === img} 
          onChange={() => setSelectedImgSA(img)} 
          className="hidden"
        />
        <img 
          src={img}
          onClick={() => setSelectedImgSA(img)}
          className={`min-w-[90px] ${selectedImgSA === img ? `border-8 border-[${snap.color}]` : ""}`} 
        />
      </label>
    )
  })
  const imageBox = 
    <form className='w-full grid grid-cols-2 gap-2'>
      {imageContainer}
    </form>

  return (
    <div className={`aipicker-container ${imgSrcSA.length > 0 ? "w-[300px]" : "w-[195px]"}`}>
      <textarea 
        placeholder="Ask Stable Diffusion..." 
        rows={5} 
        value={promptSA} 
        onChange={(e) => setPromptSA(e.target.value)} 
        className="aipicker-textarea"
      />
      {generatingImgSA ? <p>Loading...</p> : imageBox}
      <CustomButton 
        type="filled"
        title="Generate"
        handleClick={() => handleSubmitSA()}
        customStyles="text-xs"
      />
      <div className='flex flex-wrap gap-3'>
        {generatingImgSA ? (
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
              handleClick={() => handleDecals('logo', selectedImgSA)}
              customStyles="text-xs"
            />
            <CustomButton 
              type="outline"
              title="AI Full"
              handleClick={() => handleDecals('full', selectedImgSA)}
              customStyles="text-xs"
            />
          </>
        )}
      </div>        
    </div>
  )
}

export default SAPicker