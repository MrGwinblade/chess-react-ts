import { useState } from 'react'
import './App.css'
import { GameStore } from "./Stores/GameStore"
import ChessBoard from "./components/chessboardv3"
import { INotificationService, ConsoleNotificationService } from "./Services/NotificationService";

import { Sidebar } from "./components/sidebar/sidebar"


const gameStore = new GameStore(new ConsoleNotificationService())

function App() {
  
  return (
      <div className="flex min-h-screen bg-[#312e2b]">
      <Sidebar />
      <div className=" flex items-center justify-center min-h-screen px-8">
      <ChessBoard gameStore={gameStore} size={720} />
      </div>
    </div>
  
  )
}

export default App
