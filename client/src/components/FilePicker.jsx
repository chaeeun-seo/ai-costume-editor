import React, { useState } from 'react';

import CustomButton from './CustomButton';

const FilePicker = ({ file, setFile, fileSrc, setFileSrc, readFile }) => {
  return (
    <div className='filepicker-container'>
      <div className='flex-1 flex flex-col gap-2'>
        <input 
          id='file-upload'
          type="file" 
          accept='image/*'
          onChange={(e) => {
            const reader = new FileReader();

            setFile(e.target.files[0]);
            reader.readAsDataURL(e.target.files[0])

            reader.onloadend = () => {
              setFileSrc(reader.result);
            }
          }}
          className= "w-full block"
        />
        <label htmlFor="file-upload" className='filepicker-label text-center'>
          Upload File
        </label>

        <p className='mt-2 text-gray-600 text-xs truncate'>
          {file === '' ? "No file selected" : file.name}
        </p>
        <img src={fileSrc} alt="" />
      </div>

      <div className='mt-4 flex flex-wrap gap-3'>
        <CustomButton 
          type="outline"
          title="Logo"
          handleClick={() => readFile('logo')}
          customStyles='text-xs'
        />
        <CustomButton 
          type="filled"
          title="Full"
          handleClick={() => readFile('full')}
          customStyles='text-xs'
        />
      </div>
    </div>
  )
}

export default FilePicker