import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import config from '../config/config';
import state from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, DallePicker, SDPicker, SAPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';

const Customizer = () => {
    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
    const STABILITY_API_KEY = import.meta.env.VITE_STABILITY_API_KEY;
  
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
            const url = "https://d933-35-229-138-163.ngrok.io";
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