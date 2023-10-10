import CanvasModel from "./canvas";
import Customizer from "./pages/Customizer";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <main className='w-screen h-screen'>
        <Home />
        <CanvasModel />
        <Customizer />
      </main>
    </>
  )
}

export default App
