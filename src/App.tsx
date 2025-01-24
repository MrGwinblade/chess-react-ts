import { useState } from 'react'
import './App.css'
import { GameStore } from "./Stores/GameStore"
import ChessBoard from "./components/chessboardv3"
import { INotificationService, ConsoleNotificationService } from "./Services/NotificationService";

const gameStore = new GameStore(new ConsoleNotificationService())

function App() {
  
  return (
    <div className="bg-[#312e2b] flex items-center justify-center min-h-screen">


      <ChessBoard gameStore={gameStore} size={720} />
    </div>
  )
}

export default App
