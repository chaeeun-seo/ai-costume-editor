import { React, useState } from 'react';

import CustomButton from './CustomButton';

const SDPicker = ({ promptSD, setPromptSD, generatingImgSD, handleSubmitSD, imgSrcSD, setImgSrcSD }) => {
  return (
    <div className='aipicker-container'>
      <textarea 
        placeholder="Ask Stable Diffusion..." 
        rows={5} 
        value={promptSD} 
        onChange={(e) => setPromptSD(e.target.value)} 
        className="aipicker-textarea"
      />
      <img src="https://drive.google.com/uc?export=download&id=1KiR2akP9CzX_c4oG5-g5YRkYUrVtPsrc"/>
      {generatingImgSD ? <p>Loading...</p> :<img src={imgSrcSD}/>}
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
              type="filled"
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