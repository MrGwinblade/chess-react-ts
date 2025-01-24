import { BasePiece, type IPiece } from "./Piece"
import { Rook } from "./Rook"
import { Bishop } from "./Bishop"

export class Queen extends BasePiece {
  getPossibleMoves(board: IPiece[][]): [number, number][] {
    const rookMoves = new Rook(this.x, this.y, this.color).getPossibleMoves(board)
    const bishopMoves = new Bishop(this.x, this.y, this.color).getPossibleMoves(board)
    return [...rookMoves, ...bishopMoves]
  }
}

