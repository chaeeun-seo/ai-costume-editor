import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import config from '../config/config';
import state from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, DallePicker, SDPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';

const Customizer = () => {
    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  
    const snap = useSnapshot(state);

    const [file, setFile] = useState('');
    const [fileSrc, setFileSrc] = useState("");

    // DALLE
    const [promptDalle, setPromptDalle] = useState('');
    const [imgSrc, setImgSrc] = useState("");
    const [generatingImg, setGeneratingImg] = useState(false);

    // Stable Diffusion
    const [promptSD, setPromptSD] = useState('');
    const [imgSrcSD, setImgSrcSD] = useState("");
    const [generatingImgSD, setGeneratingImgSD] = useState(false);

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
                    imgSrcSD={imgSrcSD}
                    setImgSrcSD={setImgSrcSD}
                />
            default:
                return null;
        }
    }

    // dalle 2023
    const handleSubmitDalle = async (type) => {
        if (!promptDalle) return alert("Please enter a prompt");
        
        try {
            // call backend to generate an ai image

            // want to generate image
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
            console.log(data);
            console.log("[*] handleSubmitDalle got response");

            setImgSrc(data.data[0].url);
            // handleDecals(type, `data:image/png;base64,${btoa(data.data[0].url)}`);
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

    // dalle 2023
    const handleSubmitSD = async (type) => {
        if (!promptSD) return alert("Please enter a prompt");
        
        try {
            // call backend to generate an ai image

            // want to generate image
            setGeneratingImgSD(true);
            console.log("[*] handleSubmitSD before response");
            const response = await fetch("https://2c8b-35-194-72-211.ngrok.io/", {
                method: 'GET', 
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "User-Agent": "Chrome",
                },
                // body: JSON.stringify({
                //     prompt: "HELLO",
                //     n: 1, 
                //     size: "512x512",
                // }), 
            });
            console.log("[*] handleSubmitSD after response");
            console.log("[*] response : " + response);
            console.log(response);
            // console.log(response.url);
            // setImgSrcSD(response.url);
            
            const data = await response.json();
            console.log(data);
            console.log(data["url"]);
            setImgSrcSD(data["url"]);
            console.log("[*] handleSubmitSD got response");

            // setImgSrc(data.data[0].url);

            // handleDecals(type, `data:image/png;base64,${btoa(data.data[0].url)}`);
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

    const readFile = (type) => {
        reader(file)
            .then((result) => {
                console.log("readFile result : " + result);
                handleDecals(type, result);
                setActiveEditorTab("");
            })
    }

    // activeFilterTab이 false이면, handleActiveFilter
    // type : logo, full
    const handleDecals = (type, result) => {
        const decalType = DecalTypes[type];

        state[decalType.stateProperty] = result; // logoDecal or fullDecal = GenAI image

        if(!activeFilterTab[decalType.filterTab]) {
            handleActiveFilterTab(decalType.filterTab)
        }
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