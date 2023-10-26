import { React, useState } from 'react';

import CustomButton from './CustomButton';

const SDPicker = ({ promptSD, setPromptSD, generatingImgSD, handleSubmitSD, handleDecals, imgSrcSD, setImgSrcSD }) => {
  const imageContainer = imgSrcSD.map((img, index) => {
    return <img className='min-w-[90px]' key={index} src={img}/>
  })
  const imageBox = 
    <div className='w-full grid grid-cols-2 gap-2'>
      {imageContainer}
    </div>

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
              handleClick={() => handleSubmitSD('logo')}
              customStyles="text-xs"
            />
            <CustomButton 
              type="outline"
              title="AI Full"
              handleClick={() => handleSubmitSD('full')}
              customStyles="text-xs"
            />
          </>
        )}
      </div>        
    </div>
  )
}

export default SDPicker