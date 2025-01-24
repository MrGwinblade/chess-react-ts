import React from "react"
import { useState, useEffect } from "react"

const Chessboard : React.FC = () => {
  const [size, setSize] = useState(1600)

  useEffect(() => {
    const updateSize = () => {
      const minDimension = Math.min(window.innerWidth, window.innerHeight)
      setSize(Math.min(minDimension * 0.9, 1600))
    }

    window.addEventListener("resize", updateSize)
    updateSize()

    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return (
    <div className="bg-[#312e2b] flex items-center justify-center min-h-screen">
      <div
        id="board-layout-chessboard"
        className="board-layout-chessboard board-board relative"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <img
          src="/assets/chessboard.png"
          alt="Chessboard"
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
        {[...Array(64)].map((_, index) => {
            const row = Math.floor(index / 8); // Строка (0-7)
            const col = index % 8; // Столбец (0-7)

            // Преобразуем строку в букву (a-h)
            const columnLetter = String.fromCharCode(97 + col); // 97 — это код символа 'a'
            const rowNumber = 8 - row; // Преобразуем в шахматную нумерацию от 1 до 8
            
            // Генерация имени клетки (например, a1, b2 и т.д.)
            const cellName = `${columnLetter}${rowNumber}`;

            // Определение светлого и темного цвета клетки
            const isLight = (row + col) % 2 === 0;

            return (
                <div
                key={index}
                id={`chessboard-cell-${cellName}`} // Присваиваем ID с именем клетки
                className={`
                    border border-transparent 
                    hover:border-yellow-400 
                    transition-colors
                    ${isLight ? "bg-[#F0EAD6]/0" : "bg-[#79945D]/0"}
                `}
                />
            );
        })}
        </div>
      </div>
    </div>
  )
}
export default Chessboard