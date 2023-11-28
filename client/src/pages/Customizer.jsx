import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import config from '../config/config';
import state from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, DallePicker, SDPicker, SAPicker, NovitaPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';

const Customizer = () => {
    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
    const STABILITY_API_KEY = import.meta.env.VITE_STABILITY_API_KEY;
    const NOVITA_API_KEY = import.meta.env.VITE_NOVITA_API_KEY;
  
    const snap = useSnapshot(state);

    const [file, setFile] = useState('');
    const [fileSrc, setFileSrc] = useState("");

    // DALLE
    const [promptDalle, setPromptDalle] = useState('');
    const [imgSrc, setImgSrc] = useState("");
    const [generatingImg, setGeneratingImg] = useState(false);

    // Stable Diffusion : Diffusers
    const [promptSD, setPromptSD] = useState('');
    const [imgSrcSD, setImgSrcSD] = useState([]);
    const [selectedImgSD, setSelectedImgSD] = useState("");
    const [generatingImgSD, setGeneratingImgSD] = useState(false);

    // Stable Diffusion : Stability AI
    const [promptSA, setPromptSA] = useState('');
    const [imgSrcSA, setImgSrcSA] = useState([]);
    const [selectedImgSA, setSelectedImgSA] = useState("");
    const [generatingImgSA, setGeneratingImgSA] = useState(false);

     // Stable Diffusion : Novita AI
    const [promptNovita, setPromptNovita] = useState('');
    const [imgSrcNovita, setImgSrcNovita] = useState([]);
    const [selectedImgNovita, setSelectedImgNovita] = useState("");
    const [generatingImgNovita, setGeneratingImgNovita] = useState(false);

    const [activeEditorTab, setActiveEditorTab] = useState("");
    const [activeFilterTab, setActiveFilterTab] = useState({
        logoShirt : true, 
        stylishShirt : false,
    });

    // show tab content depending on the activeTab
    const generateTabContent = () => {
        switch (activeEditorTab) {
            case "colorpicker":
                return <ColorPicker />  
            case "filepicker":
                return <FilePicker 
                    file={file}
                    setFile={setFile}
                    fileSrc={fileSrc}
                    setFileSrc={setFileSrc}
                    readFile={readFile}
                />
            // case "aipicker":
            //     return <AIPicker 
            //         prompt = {prompt}
            //         setPrompt={setPrompt}
            //         generatingImg={generatingImg}
            //         handleSubmit={handleSubmit}
            //     />
            case "dallepicker":
                return <DallePicker 
                    promptDalle = {promptDalle}
                    setPromptDalle={setPromptDalle}
                    generatingImg={generatingImg}
                    handleSubmitDalle={handleSubmitDalle}
                    imgSrc={imgSrc}
                    setImgSrc={setImgSrc}
                />
            case "sdpicker":
                return <SDPicker 
                    promptSD = {promptSD}
                    setPromptSD={setPromptSD}
                    generatingImgSD={generatingImgSD}
                    handleSubmitSD={handleSubmitSD}
                    handleDecals={handleDecals}
                    imgSrcSD={imgSrcSD}
                    setImgSrcSD={setImgSrcSD}
                    selectedImgSD={selectedImgSD} 
                    setSelectedImgSD={setSelectedImgSD}
                />
            case "sapicker":
                return <SAPicker 
                    promptSA = {promptSA}
                    setPromptSA={setPromptSA}
                    generatingImgSA={generatingImgSA}
                    handleSubmitSA={handleSubmitSA}
                    handleDecals={handleDecals}
                    imgSrcSA={imgSrcSA}
                    setImgSrcSA={setImgSrcSA}
                    selectedImgSA={selectedImgSA} 
                    setSelectedImgSA={setSelectedImgSA}
                />
            case "novitapicker":
                return <NovitaPicker 
                    promptNovita = {promptNovita}
                    setPromptNovita={setPromptNovita}
                    generatingImgNovita={generatingImgNovita}
                    handleSubmitNovita={handleSubmitNovita}
                    handleDecals={handleDecals}
                    imgSrcNovita={imgSrcNovita}
                    setImgSrcNovita={setImgSrcNovita}
                    selectedImgNovita={selectedImgNovita} 
                    setSelectedImgNovita={setSelectedImgNovita}
                />
            default:
                return null;
        }
    }

    // dalle 2023
    const handleSubmitDalle = async (type) => {
        if (!promptDalle) return alert("Please enter a prompt");
        
        try {
            setGeneratingImg(true);
            console.log("[*] handleSubmitDalle before response");
            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: 'POST', 
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "User-Agent": "Chrome",
                },
                body: JSON.stringify({
                    prompt: promptDalle,
                    n: 1, 
                    size: "512x512",
                }), 
            });
            console.log("[*] handleSubmitDalle after response");

            const data = await response.json();
            console.log("data = response.json() : ");
            console.log(data);
            console.log("[*] handleSubmitDalle got response");
            console.log("[*] data.data[0].url : ");
            console.log(data.data[0].url);
            setImgSrc(data.data[0].url);
            console.log("[*] setImgSrc success");
            console.log("[*] start handleDecals");
            handleDecals(type, data.data[0].url);
            console.log("[*] finish handleDecals");
            // console.log(`data:image/png;base64,${btoa(data.data[0].url)}`);
 
            // handleDecals(type, `data:image/png;base64,${data.photo}`)
            // console.log(`data:image/png;base64,${data.photo}`)
        } catch (error) {
            alert(error)
        } finally {
            setGeneratingImg(false);
            setActiveEditorTab("");
        }
    }

    // Diffusers : get generated images list
    const handleSubmitSD = async () => {
        if (!promptSD) return alert("Please enter a prompt");
        
        try {
            setGeneratingImgSD(true);
            console.log("[*] handleSubmitSD before response");
            const url = "https://d8d7-130-211-221-19.ngrok.io";
            const response = await fetch(`${url}/?prompt=${promptSD}`, {
                method: 'GET', 
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("[*] handleSubmitSD after response");
            console.log("[*] response : ");
            console.log(response);
            
            const data = await response.json();
            const imageList = data["img"].map((img) => {
                return `data:image/png;base64,${img}`;
            });
            setImgSrcSD(imageList);
            // setImgSrcSD(`data:image/png;base64,${data.img}`);
            console.log("[*] handleSubmitSD got response");
            // handleDecals(type, `data:image/png;base64,${data.img}`)
        } catch (error) {
            alert(error)
        } finally {
            setGeneratingImgSD(false);
            // setActiveEditorTab("");
        }
    }

    // Stability AI
    const handleSubmitSA = async (type) => {
        if (!promptSA) return alert("Please enter a prompt");
        
        try {
            setGeneratingImgSA(true);
            console.log("[*] handleSubmitSA before response");
            const response = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", {
                method: 'POST', 
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${STABILITY_API_KEY}`,
                },
                body: JSON.stringify({
                    steps: 40,
                    width: 1024,
                    height: 1024,
                    seed: 0,
                    cfg_scale: 5,
                    samples: 6,
                    text_prompts: [
                      {
                        "text": promptSA,
                        "weight": 1
                      },
                    //   {
                    //     "text": "blurry, bad",
                    //     "weight": -1
                    //   }
                    ],
                }), 
            });
            console.log("[*] handleSubmitSA after response");
            console.log("[*] response : " + response);
            console.log(response);
            
            const restext = await response.text();
            console.log("response text");
            console.log(restext);

            const data = await response.json();
            console.log(data);
            console.log("data.artifacts : ");
            console.log(data.artifacts);
            console.log("data.artifacts[0][base64] : ");
            console.log(data.artifacts[0]["base64"]);
            const imageList = data.artifacts.map((img) => {
                return `data:image/png;base64,${img.base64}`;
            });
            console.log("imageList : ")
            console.log(imageList);
            setImgSrcSA(imageList);
            console.log("[*] handleSubmitSD got response");
        } catch (error) {
            alert(error)
        } finally {
            setGeneratingImgSA(false);
        }
    }

        // Novita AI
        const handleSubmitNovita = async (type) => {
            if (!promptNovita) return alert("Please enter a prompt");
            
            try {
                setGeneratingImgNovita(true);
                console.log("[*] handleSubmitNovita before response");
                const response = await fetch("https://api.novita.ai/v2/txt2img", {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${NOVITA_API_KEY}`,
                    },
                    body: JSON.stringify({
                        "prompt": "(masterpiece, best quality:1.2), illustration, absurdres, highres, extremely detailed, 1 petite girl, white short hair, rabbit ears, red eyes, eye highlights, dress, short puffy sleeves, frills, outdoors, flower, fluttering petals, upper body, (moon:1.2), night, depth of field, (:d:0.8), chromatic aberration abuse,pastel color, Depth of field,garden of the sun,shiny,Purple tint,(Purple fog:1.3)",
                        "negative_prompt": "NG_DeepNegative_V1_75T, EasyNegative, extra fingers, fewer fingers, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, (worst quality, low quality:1.4), Negative2, (low quality, worst quality:1.4), (bad anatomy), (inaccurate limb:1.2), bad composition, inaccurate eyes, extra digit,fewer digits, (extra arms:1.2), (bad-artist:0.6), bad-image-v2-39000, <lora:3DMM_V11_67066:1>",
                        "sampler_name": "Euler a",
                        "batch_size": 1,
                        "n_iter": 1,
                        "steps": 20,
                        "cfg_scale": 7,
                        "seed": 3223553976,
                        "height": 512,
                        "width": 512,
                        "model_name": "AnythingV5_v5PrtRE.safetensors",
                        "restore_faces": false,
                        "restore_faces_model": "CodeFormer",
                        "sd_vae": "",
                        "clip_skip": null,
                        "enable_hr": false,
                        "hr_upscaler": "Latent",
                        "hr_scale": null,
                        "hr_resize_x": null,
                        "hr_resize_y": null,
                        "img_expire_ttl": null,
                        "sd_refiner": [
                          {
                            "checkpoint": "sd_xl_refiner_1.0.safetensors",
                            "switch_at": null
                          }
                        ],
                        "controlnet_units": [
                          {
                            "model": "",
                            "weight": "",
                            "input_image": "",
                            "module": "none",
                            "control_mode": 0,
                            "mask": "",
                            "resize_mode": 1,
                            "lowvram": false,
                            "processor_res": null,
                            "threshold_a": null,
                            "threshold_b": null,
                            "guidance_start": null,
                            "guidance_end": null,
                            "pixel_perfect": false
                          }
                        ]
                      }), 
                });
                console.log("[*] handleSubmitNovita after response");
                console.log("[*] response : " + response);
                console.log(response);
    
                const data = await response.json();
                console.log(data);
                console.log(data.data.task_id);
                
                console.log(data.artifacts[0]["base64"]);
                const imageList = data.artifacts.map((img) => {
                    return `data:image/png;base64,${img.base64}`;
                });
                console.log("imageList : ")
                console.log(imageList);
                setImgSrcSA(imageList);
                console.log("[*] handleSubmitNovita got response");
            } catch (error) {
                alert(error)
            } finally {
                setGeneratingImgSA(false);
            }
        }

    // Novita AI for Civitai models
    const handleSubmitNovitaCivitai = async (type) => {
        if (!promptNovita) return alert("Please enter a prompt");
        
        try {
            setGeneratingImgNovita(true);
            console.log("[*] handleSubmitNovitaCivitai before response");
            // const civitai_version_id = 64094;
            const response_check = await fetch(`https://api.novita.ai/v2/model/civitai_version_id/${civitai_version_id}`, {
                method: 'GET', 
                headers: {
                    Authorization: `Bearer ${NOVITA_API_KEY}`,
                },
            });
            console.log("[*] handleSubmitNovitaCivitai after response");
            console.log("[*] response_check : ");
            console.log(response_check);
            const data_check = await response_check.json();
            console.log(data_check);
            console.log(data_check.data.model.enable);

            if (data_check.data.model.enable == 1) {
                const response = await fetch(`https://api.novita.ai/v2/model/civitai_version_id/${civitai_version_id}/v2/txt2img`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${NOVITA_API_KEY}`,
                    },
                    body: JSON.stringify({
                        "prompt": "(masterpiece, best quality:1.2), illustration, absurdres, highres, extremely detailed, 1 petite girl, white short hair, rabbit ears, red eyes, eye highlights, dress, short puffy sleeves, frills, outdoors, flower, fluttering petals, upper body, (moon:1.2), night, depth of field, (:d:0.8), chromatic aberration abuse,pastel color, Depth of field,garden of the sun,shiny,Purple tint,(Purple fog:1.3)",
                        // "negative_prompt": "NG_DeepNegative_V1_75T, EasyNegative, extra fingers, fewer fingers, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, (worst quality, low quality:1.4), Negative2, (low quality, worst quality:1.4), (bad anatomy), (inaccurate limb:1.2), bad composition, inaccurate eyes, extra digit,fewer digits, (extra arms:1.2), (bad-artist:0.6), bad-image-v2-39000, <lora:3DMM_V11_67066:1>",
                        "sampler_name": "Euler a",
                        "batch_size": 5,
                        "n_iter": 1,
                        "steps": 20,
                        "cfg_scale": 7,
                        // "seed": 3223553976,
                        "height": 512,
                        "width": 512,
                        "model_name": "AnythingV5_v5PrtRE.safetensors",
                        "restore_faces": false,
                        "restore_faces_model": "CodeFormer",
                        "sd_vae": "",
                        "clip_skip": null,
                        "enable_hr": false,
                        "hr_upscaler": "Latent",
                        "hr_scale": null,
                        "hr_resize_x": null,
                        "hr_resize_y": null,
                        "img_expire_ttl": null,
                        "sd_refiner": [
                          {
                            "checkpoint": "sd_xl_refiner_1.0.safetensors",
                            "switch_at": null
                          }
                        ],
                        "controlnet_units": [
                          {
                            "model": "",
                            "weight": "",
                            "input_image": "",
                            "module": "none",
                            "control_mode": 0,
                            "mask": "",
                            "resize_mode": 1,
                            "lowvram": false,
                            "processor_res": null,
                            "threshold_a": null,
                            "threshold_b": null,
                            "guidance_start": null,
                            "guidance_end": null,
                            "pixel_perfect": false
                          }
                        ]
                    })
                });
            }
            // console.log("data.artifacts : ");
            // console.log(data.artifacts);
            // console.log("data.artifacts[0][base64] : ");
            // console.log(data.artifacts[0]["base64"]);
            // const imageList = data.artifacts.map((img) => {
            //     return `data:image/png;base64,${img.base64}`;
            // });
            // console.log("imageList : ")
            // console.log(imageList);
            // setImgSrcNovita(imageList);
            console.log("[*] handleSubmitNovitaCivitai got response");
        } catch (error) {
            alert(error)
        } finally {
            setGeneratingImgNovita(false);
        }
    }

    const readFile = (type) => {
        reader(file)
            .then((result) => {
                // console.log("readFile result : " + result);
                console.log("[*] readFile start")
                handleDecals(type, result);
                setActiveEditorTab("");
            })
    }

    // activeFilterTab이 false이면, handleActiveFilter
    // type : logo, full
    const handleDecals = (type, result) => {
        console.log("[*] handleDecals start")
        const decalType = DecalTypes[type];

        state[decalType.stateProperty] = result; // logoDecal or fullDecal = GenAI image

        if(!activeFilterTab[decalType.filterTab]) {
            handleActiveFilterTab(decalType.filterTab)
        }
        console.log("[*] handleDecals end")
    }

    const handleActiveFilterTab = (tabName) => {
        switch (tabName) {
            case "logoShirt":
                state.isLogoTexture = !activeFilterTab[tabName];
                break;
            case "stylishShirt":
                state.isFullTexture = !activeFilterTab[tabName];
                break;
            default:
                state.isLogoTexture = true;
                state.isFullTexture = false;
                break;
        }

        // after setting the state, activeFilterTab is updated
        setActiveFilterTab((prevState) => {
            return {
                ...prevState,
                [tabName]: !prevState[tabName],
            }
        })
    }

    return (
    <AnimatePresence>
        {!snap.intro && (
            <>                
                <motion.div key="custom" className='absolute top-0 left-0 z-10' {...slideAnimation('left')}>
                    <div className='flex items-center min-h-screen'>
                        <div className='editortabs-container tabs'>
                            {EditorTabs.map((tab) => (
                                <Tab 
                                    key={tab.name} 
                                    tab={tab} 
                                    handleClick={() => setActiveEditorTab(tab.name)}
                                />
                            ))}

                            {generateTabContent()}
                        </div>
                    </div>
                </motion.div>

                <motion.div className='absolute z-10 top-5 right-5' {...fadeAnimation}>
                        <CustomButton 
                            type="filled" 
                            title="Go Back" 
                            handleClick={() => state.intro = true} 
                            customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                        />
                </motion.div>

                <motion.div className='filtertabs-container' {...slideAnimation('up')}>
                    {FilterTabs.map((tab) => (
                        <Tab 
                            key={tab.name} 
                            tab={tab} 
                            isFilterTab 
                            isActiveTab={activeFilterTab[tab.name]} 
                            handleClick={() => handleActiveFilterTab(tab.name)}
                        />
                    ))}
                </motion.div>
            </>
        )}
    </AnimatePresence>
    )
}

export default Customizer