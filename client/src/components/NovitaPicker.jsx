import { React, useState } from 'react';
import { useSnapshot } from 'valtio';

import CustomButton from './CustomButton';
import state from '../store';

const NovitaPicker = ({ promptNovita, setPromptNovita, generatingImgNovita, handleSubmitNovita, handleDecals, imgSrcNovita, setImgSrcNovita, selectedImgNovita, setSelectedImgNovita }) => {
  const NOVITA_API_KEY = import.meta.env.VITE_NOVITA_API_KEY;

  const snap = useSnapshot(state);
  const imageContainer = imgSrcNovita.map((img, index) => {
    return (
      <label key={index} className='cursor-pointer'>
        <input 
          type="radio" 
          name="selectedImage" 
          value={img} 
          checked={selectedImgNovita === img} 
          onChange={() => setSelectedImgNovita(img)} 
          className="hidden"
        />
        <img 
          src={img}
          onClick={() => setSelectedImgNovita(img)}
          className={`min-w-[90px] ${selectedImgNovita === img ? `border-8 border-[${snap.color}]` : ""}`} 
        />
      </label>
    )
  })
  const imageBox = 
    <form className='w-full grid grid-cols-2 gap-2'>
      {imageContainer}
    </form>

  return (
    <div className={`aipicker-container ${imgSrcNovita.length > 0 ? "w-[300px]" : "w-[195px]"}`}>
      <textarea 
        placeholder="Ask Novita AI..."
        rows={5} 
        value={promptNovita} 
        onChange={(e) => setPromptNovita(e.target.value)} 
        className="aipicker-textarea"
      />
      {generatingImgNovita ? <p>Loading...</p> : imageBox}
      <CustomButton 
        type="filled"
        title="Check Credits"
        handleClick={async() => {
          const response = await fetch("https://api.novita.ai/v3/user", {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${NOVITA_API_KEY}` 
            }, 
          });

          const data = await response.json();
          console.log("allowed features : ");
          console.log(data.allow_features);
          if (data.credit_balance > 0){
            alert(`you can create image using novita.ai! \nCredits : ${data.credit_balance}`);
          } else {
            alert(`you need credits to create image using novita.ai! \nCredits : ${data.credit_balance}`);
          }
        }}
        customStyles="text-xs"
      />
      <CustomButton 
        type="filled"
        title="Generate"
        handleClick={() => handleSubmitNovita()}
        customStyles="text-xs"
      />
      <div className='flex flex-wrap gap-3'>
        {generatingImgNovita ? (
          <CustomButton 
            type="outline"
            title="Asking Novita AI..."
            customStyles="text-xs"
          />
        ) : (
          <>
            <CustomButton 
              type="outline"
              title="AI Logo"
              handleClick={() => handleDecals('logo', selectedImgNovita)}
              customStyles="text-xs"
            />
            <CustomButton 
              type="outline"
              title="AI Full"
              handleClick={() => handleDecals('full', selectedImgNovita)}
              customStyles="text-xs"
            />
          </>
        )}
      </div>        
    </div>
  )
}

export default NovitaPicker