import { React, useState } from 'react';
import { useSnapshot } from 'valtio';

import CustomButton from './CustomButton';
import state from '../store';

const SDAPicker = ({ promptSDA, setPromptSDA, generatingImgSDA, handleSubmitSDA, handleDecals, imgSrcSDA, setImgSrcSDA, selectedImgSDA, setSelectedImgSDA }) => {
  const snap = useSnapshot(state);
  const imageContainer = imgSrcSDA.map((img, index) => {
    return (
      <label key={index} className='cursor-pointer'>
        <input 
          type="radio" 
          name="selectedImage" 
          value={img} 
          checked={selectedImgSDA === img} 
          onChange={() => setSelectedImgSDA(img)} 
          className="hidden"
        />
        <img 
          src={img}
          onClick={() => setSelectedImgSDA(img)}
          className={`min-w-[90px] ${selectedImgSDA === img ? `border-8 border-[${snap.color}]` : ""}`} 
        />
      </label>
    )
  })
  const imageBox = 
    <form className='w-full grid grid-cols-2 gap-2'>
      {imageContainer}
    </form>

  return (
    <div className={`aipicker-container ${imgSrcSDA.length > 0 ? "w-[300px]" : "w-[195px]"}`}>
      <textarea 
        placeholder="Ask Stable diffusion API..."
        rows={5} 
        value={promptSDA} 
        onChange={(e) => setPromptSDA(e.target.value)} 
        className="aipicker-textarea"
      />
      {generatingImgSDA ? <p>Loading...</p> : imageBox}
      <CustomButton 
        type="filled"
        title="Generate"
        handleClick={() => handleSubmitSDA()}
        customStyles="text-xs"
      />
      <div className='flex flex-wrap gap-3'>
        {generatingImgSDA ? (
          <CustomButton 
            type="outline"
            title="Asking Stable diffusion API..."
            customStyles="text-xs"
          />
        ) : (
          <>
            <CustomButton 
              type="outline"
              title="AI Logo"
              handleClick={() => handleDecals('logo', selectedImgSDA)}
              customStyles="text-xs"
            />
            <CustomButton 
              type="outline"
              title="AI Full"
              handleClick={() => handleDecals('full', selectedImgSDA)}
              customStyles="text-xs"
            />
          </>
        )}
      </div>        
    </div>
  )
}

export default SDAPicker