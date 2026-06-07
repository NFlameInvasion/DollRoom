import { GameShell } from './components/GameShell'
import { HUD } from './components/HUD'
import { LoadingScreen } from './components/LoadingScreen'

function App() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-[#1a1a2e]">
      <GameShell />
      <HUD />
      <LoadingScreen />
    </div>
  )
}

export default App
