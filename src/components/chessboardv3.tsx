import type React from "react"
import { observer } from "mobx-react-lite"
import type { GameStore } from "../Stores/GameStore"
import { useState } from "react"
import PawnPromotionForm from "./PawnPromotionForm"

interface ChessBoardProps {
  gameStore: GameStore
  size: number
}

const ChessBoard: React.FC<ChessBoardProps> = observer(({ gameStore, size }) => {
  const renderedBoard = gameStore.renderBoard()

  const handlePromote = (pieceType: string) => {
    gameStore.completePromotion(pieceType);
  };

  const handleCancel = () => {
    gameStore.cancelPromotion();
  };

  const handleCellClick = (cellName: string) => { // Если кликнули на уже выбранную клетку

    if (gameStore.selectedCell === cellName) {
      gameStore.selectCell(null);
      
      return;
    }
    
    // Если есть выбранная фигура
    if (gameStore.selectedPiece) {
        const selectedPiece = gameStore.selectedPiece;
        if (selectedPiece) {
            console.log("Selected piece:", selectedPiece);
          } else {
            console.log("No piece selected or the cell is empty.");
          }
      // Парсим координаты из выбранной клетки (from)
      const [fromX, fromY] = gameStore.selectedCell!.split("").map(Number);
      console.log("Clicked cell coordinates:", [fromX, fromY]);
      // Парсим координаты текущего клика (to)
      const [toX, toY] = cellName.split("").map(Number);
      console.log("Clicked cell coordinates2:", [toX, toY]);
  
      // Выполняем перемещение
      const moveResult = gameStore.movePiece(fromX, fromY, toX, toY);
      const movedPiece = gameStore.board[toY][toX]
      if (moveResult) {
        console.log("Move successful!");
      } else {
        console.log("Move failed!")
      }
    } else {
      // Выбираем новую клетку
      gameStore.selectCell(cellName);
    }

  // Если фигура выбрана, выводим её в консоль
  
  };


  return (
    <div
      id="board-layout-chessboard"
      className="board-layout-chessboard board-board relative"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <img src="/assets/chessboard.png" alt="Chessboard" className="w-full h-full object-contain" />
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
      {renderedBoard.flat().map(({ image, x, y }, index) => {
        // Формируем имя ячейки в формате "xy" (например, "11", "12")
        const cellName = `${x}${y}`; 

        // Определяем цвет ячейки (светлая или темная)
        const isLight = (x + y) % 2 === 0;

        // Проверяем, выбрана ли ячейка
        const isSelected = gameStore.selectedCell === cellName;

        return (
          <div
            key={index}
            id={`chessboard-cell-${cellName}`} // Уникальный ID для ячейки
            className={`
              relative
              border border-transparent 
              hover:border-yellow-400 
              transition-colors
              ${isLight ? "bg-[#F0EAD6]/0" : "bg-[#79945D]/0"}
              ${isSelected ? "border-yellow-400 bg-red-400" : ""}
              cursor-pointer
            `}
            onClick={() => handleCellClick(cellName)} // Обработчик клика
          >
            {image && (
              <img
                src={image || "/placeholder.svg"}
                alt={`Chess piece at ${cellName}`}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        );
      })}
    </div>
    {gameStore.promotionPending && (
        <PawnPromotionForm
          color={gameStore.currentTurn === "white" ? "white" : "black"}
          onPromote={handlePromote}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
})

export default ChessBoard

