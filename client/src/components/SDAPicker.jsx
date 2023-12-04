import { React, useState } from 'react';
import { useSnapshot } from 'valtio';

import CustomButton from './CustomButton';
import state from '../store';

const SDAPicker = ({ modelIdToGenerate, setModelIdToGenerate, promptSDA, setPromptSDA, generatingImgSDA, handleSubmitSDA, handleDecals, imgSrcSDA, setImgSrcSDA, selectedImgSDA, setSelectedImgSDA }) => {
  const snap = useSnapshot(state);
  const SDA_ENTERPRISE_API_KEY = import.meta.env.VITE_SDA_ENTERPRISE_API_KEY;

  const [modelList, setModelList] = useState(["test1", "test2", "test3"]);
  const [modelUrl, setModelUrl] = useState("");
  const [modelIdToLoad, setModelIdToLoad] = useState("");
  const [modelType, setModelType] = useState("");

  const getAllModels = async () => {
    try {
      const response = await fetch("https://stablediffusionapi.com/api/v1/enterprise/get_all_models", {
          method: 'POST', 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "key": SDA_ENTERPRISE_API_KEY,
          }),
          redirect: 'follow',
        });

      const restext = await response.text();
      const data = await JSON.parse(restext);
      setModelList(data.models.map((model) => {
        return model.model_id;
      }));
    } catch (error) {
      alert(error)
    }
  }

  const deleteModel = async (modelId) => {
    try {
      const response = await fetch('https://stablediffusionapi.com/api/v1/enterprise/delete_model', {
          method: 'POST', 
          headers: {
            "Content-Type": "application/json",     
          },
          body: JSON.stringify({
            "key": SDA_ENTERPRISE_API_KEY,
            "model_id": modelId,
          }),
          redirect: 'follow',
        });

      const restext = await response.text();
      const data = await JSON.parse(restext);
      if (data.status == "success") {
        alert(data.message);
        getAllModels();
      }
    } catch (error) {
      alert(error);
    }
  }

  const loadModel = async () => {
    try {
      const response = await fetch("https://stablediffusionapi.com/api/v1/enterprise/load_model", {
          method: 'POST', 
          headers: {
            "Content-Type": "application/json",     
          },
          body: JSON.stringify({
            "key": SDA_ENTERPRISE_API_KEY,
            "url": modelUrl,
            "model_id": modelIdToLoad,
            "model_type": modelType,
            "from_safetensors": "yes",
            "webhook": "https://stablediffusionapi.com",
            "revision": "fp32",
            "upcast_attention": "no"
          }),
          redirect: 'follow',
        });

      const restext = await response.text();
      const data = await JSON.parse(restext);
      if (data.status == "success") {
        alert(data.message);
        getAllModels();
      }
    } catch (error) {
      alert(error);
    }
  }

  const modelBox = modelList.map((modelId, idx) => {
    return (
      <div key={idx} className='flex justify-between'>
        <span>{modelId}</span>
        <button onClick={() => deleteModel(modelId)} className="cursor-pointer">X</button>
      </div>
    )
  })

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
      <h3 className='font-bold'>모델 조회하기</h3>
      {modelBox}
      <CustomButton 
        type="filled"
        title="모델 조회하기"
        handleClick={() => getAllModels()}
        customStyles="text-xs"
      />

      <h3 className='mt-4 font-bold'>모델 추가히기</h3>
      <input 
        placeholder="url"
        // rows={1} 
        value={modelUrl}
        onChange={(e) => setModelUrl(e.target.value)} 
        className="aipicker-textarea"
      />
      <input 
        placeholder="model_id"
        rows={1} 
        value={modelIdToLoad}
        onChange={(e) => setModelIdToLoad(e.target.value)} 
        className="aipicker-textarea"
      />
      <input 
        placeholder="model_type"
        rows={1} 
        value={modelType}
        onChange={(e) => setModelType(e.target.value)} 
        className="aipicker-textarea"
      />
      <CustomButton 
        type="filled"
        title="모델 추가하기"
        handleClick={() => loadModel()}
        customStyles="text-xs"
      />

      <h3 className='mt-4 font-bold'>이미지 생성하기</h3>
      <select name="" id="" onChange={(e) => {
          setModelIdToGenerate(e.target.value)
      }}>
        {modelList.map((model, idx) => {
          return <option key={idx} value={model}>{model}</option>
        })}
      </select>
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