import { useState } from 'react'
import './App.css'
import { GameStore } from "./Stores/GameStore"
import ChessBoard from "./components/chessboardv3"
import { INotificationService, ConsoleNotificationService } from "./Services/NotificationService";
import { BrowserRouter } from "react-router-dom"
import { Sidebar } from "./components/sidebar/sidebar"


const gameStore = new GameStore(new ConsoleNotificationService())

function App() {
  
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#312e2b]">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center p-4">
      <ChessBoard gameStore={gameStore} size={720} />
      </div>
    </div>
    </BrowserRouter>
  )
}

export default App
