import { useState } from 'react'
import './App.css'
import { GameStore } from "./Stores/GameStore"
import ChessBoard from "./components/chessboardv3"
import { INotificationService, ConsoleNotificationService } from "./Services/NotificationService";
import { BrowserRouter } from "react-router-dom"
import { Sidebar } from "./components/sidebar/sidebar"
import rootStore from "./Stores/RootStore"
import { Provider } from "mobx-react"


const notificationService = new ConsoleNotificationService()
const gameStore = new GameStore(notificationService)

function App() {
  
  return (
    <Provider {...rootStore}>
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#312e2b]">
      <Sidebar gameStore={gameStore} />
      <div className="flex-1 flex items-center justify-center p-4">
      <ChessBoard gameStore={gameStore} size={720} />
      </div>
    </div>
    </BrowserRouter>
    </Provider>
  )
}

export default App
