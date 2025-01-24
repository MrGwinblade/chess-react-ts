import { BasePiece, type IPiece } from "./Piece"


export class Bishop extends BasePiece {
  getPossibleMoves(board: (IPiece | null)[][]): [number, number][] {
    const moves: [number, number][] = [];
    
    // Все возможные направления движения слона
    const directions = [
      [1, -1],   // Вправо-вверх
      [1, 1],    // Вправо-вниз
      [-1, -1],  // Влево-вверх
      [-1, 1]    // Влево-вниз
    ];

    // Проверяем все 4 диагональных направления
    for (const [dx, dy] of directions) {
      this.checkDirection(board, moves, dx, dy);
    }

    return moves;
  }

  // Метод для проверки движения в заданном направлении
  private checkDirection(
    board: (IPiece | null)[][],
    moves: [number, number][],
    dx: number,
    dy: number
  ): void {
    let newX = this.x + dx;
    let newY = this.y + dy;

    // Продолжаем движение пока не выйдем за пределы доски
    while (newX >= 0 && newX <= 7 && newY >= 0 && newY <= 7) {
      const targetPiece = board[newY][newX];

      // Если клетка пустая - добавляем ход
      if (!targetPiece) {
        moves.push([newX, newY]);
      } 
      // Если стоит вражеская фигура - добавляем ход и останавливаемся
      else if (targetPiece.color !== this.color) {
        moves.push([newX, newY]);
        break;
      }
      // Если стоит своя фигура - останавливаемся без добавления хода
      else {
        break;
      }

      // Переходим к следующей клетке в том же направлении
      newX += dx;
      newY += dy;
    }
  }
}

