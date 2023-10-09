import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';

import state  from '../store';
import {
    headContainerAnimation,
    headContentAnimation,
    headTextAnimation,
    slideAnimation,
} from '../config/motion'

const Home = () => {
    const snap = useSnapshot(state);

    return (
    <AnimatePresence>
        {snap.intro && (
            <motion.section className='home' {...slideAnimation('left')}>
                <motion.header {...slideAnimation("down")}>
                    <img src="./threejs.png" alt="logo" className='w-8 h-8 object-contain' />
                </motion.header>

                <motion.div className="home-content" {...headContainerAnimation}>
                    <motion.div {...headTextAnimation}>
                        <h1 className='head-text'>
                            Ifland Studio<br className='md:block hidden'/> AI Costume Editor
                        </h1>
                    </motion.div>
                    <motion.div className='flex flex-col gap-5' {...headContentAnimation}>
                        <p className='max-w-lg font-normal text-gray-600 text-base'>
                            Create your unique and exclusive t-shirt with ifland studio's 3D customization tool. <strong>Unleash your imagination</strong>{" "} and define your own style with the help of AI.
                        </p>
                    </motion.div>
                </motion.div>
            </motion.section>
        )}
    </AnimatePresence>
    )
}

export default Home