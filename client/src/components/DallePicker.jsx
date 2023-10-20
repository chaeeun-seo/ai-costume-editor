import { React, useState } from 'react';

import CustomButton from './CustomButton';

const DallePicker = ({ promptDalle, setPromptDalle, generatingImg, handleSubmitDalle, imgSrc, setImgSrc }) => {
  return (
    <div className='aipicker-container'>
      <textarea 
        placeholder="Ask DALL-E..." 
        rows={5} 
        value={promptDalle} 
        onChange={(e) => setPromptDalle(e.target.value)} 
        className="aipicker-textarea"
      />
      {generatingImg ? <p>Loading...</p> :<img src={imgSrc}/>}
      <div className='flex flex-wrap gap-3'>
        {generatingImg ? (
          <CustomButton 
            type="outline"
            title="Asking AI..."
            customStyles="text-xs"
          />
        ) : (
          <>
            <CustomButton 
              type="outline"
              title="AI Logo"
              handleClick={() => handleSubmitDalle('logo')}
              customStyles="text-xs"
            />
            <CustomButton 
              type="filled"
              title="AI Full"
              handleClick={() => handleSubmitDalle('full')}
              customStyles="text-xs"
            />
          </>
        )}
      </div>        
    </div>
  )
}

export default DallePicker