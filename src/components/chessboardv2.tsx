import type React from "react"
import { useState, useEffect } from "react"
import { GameStore } from "../Stores/GameStore"

interface ChessPiece {
  id: string
  position: string
  type: "pawn"
}

const Chessboard: React.FC = () => {
  const [size, setSize] = useState(1600)
  const [pieces, setPieces] = useState<ChessPiece[]>([])
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null)

  //const gamestore = new GameStore(); 
 //testing commits
  // Initialize pieces
  useEffect(() => {
    const initialPieces: ChessPiece[] = []
    // Add pawns to all four rows (first two and last two)
    for (let col = 1; col <= 8; col++) {
      // First row (row 1)
      initialPieces.push({
        id: `pawn-1-${1},${col}`,
        position: `1,${col}`,
        type: "pawn",
      })
      // Second row (row 2)
      initialPieces.push({
        id: `pawn-2-${2},${col}`,
        position: `2,${col}`,
        type: "pawn",
      })
      // Seventh row (row 7)
      initialPieces.push({
        id: `pawn-7-${7},${col}`,
        position: `7,${col}`,
        type: "pawn",
      })
      // Eighth row (row 8)
      initialPieces.push({
        id: `pawn-8-${8},${col}`,
        position: `8,${col}`,
        type: "pawn",
      })
    }
    setPieces(initialPieces)
    //gamestore.showboard();
  }, [])

  useEffect(() => {
    const updateSize = () => {
      const minDimension = Math.min(window.innerWidth, window.innerHeight)
      setSize(Math.min(minDimension * 0.9, 1600))
    }

    window.addEventListener("resize", updateSize)
    updateSize()

    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const handleCellClick = (cellName: string) => {
    if (selectedPiece) {
      // Move piece
      setPieces((prevPieces) => {
        const newPieces = prevPieces.filter((p) => p.id !== selectedPiece && p.position !== cellName)
        return [
          ...newPieces,
          {
            ...prevPieces.find((p) => p.id === selectedPiece)!,
            position: cellName,
          },
        ]
      })
      setSelectedPiece(null)
    } else {
      // Select piece
      const pieceInCell = pieces.find((p) => p.position === cellName)
      if (pieceInCell) {
        setSelectedPiece(pieceInCell.id)
      }
    }
  }

  return (
    <div className="bg-[#312e2b] flex items-center justify-center min-h-screen">
      <div
        id="board-layout-chessboard"
        className="board-layout-chessboard board-board relative"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <img src="/assets/chessboard.png" alt="Chessboard" className="w-full h-full object-contain" />
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
          {[...Array(64)].map((_, index) => {
            const row = Math.floor(index / 8)
            const col = index % 8
            const x = 8 - row // Row number (1-8)
            const y = col + 1 // Column number (1-8)
            const cellName = `${x},${y}`
            const isLight = (row + col) % 2 === 0
            const piece = pieces.find((p) => p.position === cellName)
            const isSelected = piece?.id === selectedPiece

            return (
              <div
                key={index}
                id={`chessboard-cell-${cellName}`}
                className={`
                  relative
                  border border-transparent 
                  hover:border-yellow-400 
                  transition-colors
                  ${isLight ? "bg-[#F0EAD6]/0" : "bg-[#79945D]/0"}
                  ${isSelected ? "border-yellow-400" : ""}
                  cursor-pointer
                `}
                onClick={() => handleCellClick(cellName)}
              >
                {piece && (
                  <img
                    src="/assets/wpawn.png"
                    alt="White Pawn"
                    className={`
                      absolute 
                      inset-0 
                      w-full 
                      h-full 
                      p-2
                      transition-transform
                      ${isSelected ? "scale-110" : ""}
                    `}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Chessboard

