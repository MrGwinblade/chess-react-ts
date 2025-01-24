import { BasePiece, type IPiece } from "./Piece"

export class Knight extends BasePiece {
  getPossibleMoves(board: IPiece[][]): [number, number][] {
    const moves: [number, number][] = []

    // Проверка хода вперед на одну клетку
        const knightMoves = [
          [2, 1], [2, -1],
          [-2, 1], [-2, -1],
          [1, 2], [1, -2],
          [-1, 2], [-1, -2]
      ];

      knightMoves.forEach(([dx, dy]) => {
          this.checkKnightMove(board, moves, this.x + dx, this.y + dy);
      });

    return moves
  }

  private checkKnightMove(board: (IPiece | null)[][], moves: [number, number][], x: number, y: number): void {
    // 1. Проверка границ доски
    if (x < 0 || x > 7 || y < 0 || y > 7) return;

    // 2. Проверка наличия своей фигуры
    const targetPiece = board[y][x];
    if (targetPiece?.color === this.color) return;

    // 3. Добавление допустимого хода
    moves.push([x, y]);
  }
}

