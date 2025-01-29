import { makeAutoObservable } from "mobx"
import type { IPiece } from "../models/Piece"
import { Pawn } from "../models/Pawn"
import { Rook } from "../models/Rook"
import { Knight } from "../models/Knight"
import { Bishop } from "../models/Bishop"
import { Queen } from "../models/Queen"
import { King } from "../models/King"
import { INotificationService, ConsoleNotificationService } from "../Services/NotificationService";


export class GameStore {

  private notificationService: INotificationService;

  board: (IPiece | null)[][] = []
  currentTurn: "white" | "black" = "white"
  selectedCell: string | null = null
  promotionPending: { x: number; y: number } | null = null; // Новое свойство
  lastMove: { from: [number, number]; to: [number, number]; capturedPiece: (IPiece | null); pawnState?: {  // Делаем опциональным
    enPassantVulnerable: boolean;
    prevMoveCount: number;
  }; } | null = null; // Для отмены хода

  constructor(notificationService: INotificationService) {
    this.notificationService = notificationService || new ConsoleNotificationService();
    makeAutoObservable(this)
    this.initializeBoard()
  }

  resetGame() {
    this.board = []
    this.currentTurn = "white"
    this.selectedCell = null
    this.promotionPending = null
    this.lastMove = null
    this.initializeBoard()
  }

  private notifyTurnCompleted() {
    this.notificationService.notifyTurnCompleted(this.board, this.currentTurn);
  }

  private switchTurn() {
    this.currentTurn = this.currentTurn === "white" ? "black" : "white";
    this.notifyTurnCompleted();
  }


  initializeBoard() {
    this.board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))

    // Initialize pawns
    for (let i = 0; i < 8; i++) {
      this.board[6][i] = new Pawn(i, 6, "white")
      this.board[1][i] = new Pawn(i, 1, "black")
    }

    // Initialize other pieces
    const pieceOrder: (new (x: number, y: number, color: "white" | "black") => IPiece)[] = [
      Rook,
      Knight,
      Bishop,
      Queen,
      King,
      Bishop,
      Knight,
      Rook,
    ]

    for (let i = 0; i < 8; i++) {
      this.board[0][i] = new pieceOrder[i](i, 0, "black")
      this.board[7][i] = new pieceOrder[i](i, 7, "white")
    }
  }

  movePiece(fromX: number, fromY: number, toX: number, toY: number): boolean {
    // 1. Проверяем, что координаты находятся в пределах доски
    if (
      fromX < 0 || fromX > 7 ||
      fromY < 0 || fromY > 7 ||
      toX < 0 || toX > 7 ||
      toY < 0 || toY > 7
    ) {
      console.log("Move is out of bounds");
      return false;
    }
  
    // 2. Получаем фигуры из ячеек
    const pieceToMove = this.board[fromY][fromX];
    const targetPiece = this.board[toY][toX];
  
    // 3. Проверяем существование перемещаемой фигуры
    if (!pieceToMove) {
      console.log("No piece to move");
      this.selectedCell = null;
      return false;
    }
  
    // 4. Проверяем принадлежность фигуры текущему игроку
    if (pieceToMove.color !== this.currentTurn) {
      console.log("Not your turn");
      this.selectedCell = null;
      return false;
    }
  
    // 5. Проверяем, что выбранное движение валидно
      const possibleMoves = pieceToMove.getPossibleMoves(this.board);
      const isMoveValid = possibleMoves.some(([x, y]) => x === toX && y === toY);
      if (!isMoveValid) {

        console.log("Invalid move");
        console.log(possibleMoves+ " pieceToMove " + pieceToMove);
        console.log(pieceToMove.moveCount);
        this.selectedCell = null;
        return false;
      }

      this.lastMove = {
        from: [fromX, fromY],
        to: [toX, toY],
        capturedPiece: targetPiece,
        ...(pieceToMove instanceof Pawn && {
          pawnState: {
            enPassantVulnerable: pieceToMove.enPassantVulnerable,
            prevMoveCount: pieceToMove.moveCount
          }
        })
      };

    if(pieceToMove instanceof King ) {
      if (isMoveValid) {
          // Проверяем рокировку
          const isCastlingMove = Math.abs(toX - fromX) === 2;
          
          if (isCastlingMove) {
              // Определяем направление рокировки
              const isKingside = toX > fromX;
              
              // Координаты ладьи
              const rookStartX = isKingside ? 7 : 0;
              const rookEndX = isKingside ? toX - 1 : toX + 1;
              
              // Перемещаем ладью
              const rook = this.board[fromY][rookStartX];
              if (rook instanceof Rook && rook.moveCount === 0) {
                  this.board[fromY][rookEndX] = rook;
                  this.board[fromY][rookStartX] = null;
                  rook.x = rookEndX;
                  rook.moveCount++;
              }
          }
  
          // Обновляем позицию короля
          pieceToMove.moveCount++;
          this.board[toY][toX] = pieceToMove;
          this.board[fromY][fromX] = null;
          pieceToMove.x = toX;
          pieceToMove.y = toY;
      }
  }
    else if(pieceToMove instanceof Pawn){
            const isEnPassant = (
              toX !== fromX && 
              this.board[toY][toX] === null && // Целевая клетка пуста
              this.board[fromY][toX] instanceof Pawn && // На соседней клетке пешка
              this.board[fromY][toX]!.enPassantVulnerable // И она уязвима для en passant
          );

          // Обычное перемещение
          pieceToMove.moveCount++;
          this.board[toY][toX] = pieceToMove;
          this.board[fromY][fromX] = null;
          pieceToMove.x = toX;
          pieceToMove.y = toY;

          // Если это взятие на проходе - удаляем пешку противника
          if (isEnPassant) {
              const capturedPawnY = pieceToMove.color === "white" ? toY + 1 : toY - 1;
              this.board[capturedPawnY][toX] = null;
          }

          // Обновление флага enPassantVulnerable
          if (Math.abs(toY - fromY) === 2) {
              pieceToMove.enPassantVulnerable = true;
          } else {
              pieceToMove.enPassantVulnerable = false;
          }

          const promotionRow = pieceToMove.color === "white" ? 0 : 7;
          if (toY === promotionRow) {
              this.promotionPending = { x: toX, y: toY };
              // Не меняем текущий ход здесь!
              return true;
          } 
    }
    else{
      // 6. Перемещаем фигуру
      pieceToMove.moveCount++;
      this.board[toY][toX] = pieceToMove;
      this.board[fromY][fromX] = null;
    
      // 7. Обновляем координаты фигуры (если у неё есть такие свойства)
      pieceToMove.x = toX;
      pieceToMove.y = toY;
    }

    // 8. Меняем игрока
    this.switchTurn();
  
    // 9. Сбрасываем выбранную клетку
    this.selectedCell = null;
  
    console.log(`Moved ${pieceToMove.constructor.name} to (${toX}, ${toY})`);
    return true;
  }

  getPieceImage(piece: IPiece | null): string {
    if (!piece) return ""
    const pieceType = piece.constructor.name.toLowerCase()
    return `/assets/${piece.color.charAt(0)}${pieceType}.png`
  }

  renderBoard() {
    return this.board.map((row, y) =>
      row.map((piece, x) => ({
        image: this.getPieceImage(piece),
        x,
        y,
      })),
    )
  }

  selectCell(cellName: string | null) {
    
    this.selectedCell = cellName;
    console.log("cellName333 "+cellName)
  }

  get selectedPiece(): IPiece | null {
    if (!this.selectedCell) return null;
    
    // Преобразуем строку вида "11" в координаты [1,1]
    const x = Number(this.selectedCell[0]);
    const y = Number(this.selectedCell[1]);
    
    // Проверяем границы
    if (x < 0 || x > 7 || y < 0 || y > 7) return null;
    
    return this.board[y][x];
  }

  completePromotion(pieceType: string) {
    if (!this.promotionPending) return false;

    const { x, y } = this.promotionPending;
    const pawn = this.board[y][x];
    
    if (!(pawn instanceof Pawn)) return false;

    const newPiece = this.createPromotionPiece(pieceType, pawn.color);
    this.board[y][x] = newPiece;
    this.promotionPending = null;
    this.switchTurn();
    return true;
  }

  cancelPromotion() {
    if (!this.promotionPending || !this.lastMove) return false;
  
    const { from, to, capturedPiece, pawnState } = this.lastMove;
    const pawn = this.board[to[1]][to[0]];
  
    // Восстановление пешки
    if (pawn instanceof Pawn) {
      // Возвращаем на исходную позицию
      this.board[from[1]][from[0]] = pawn;
      this.board[to[1]][to[0]] = capturedPiece; // Восстанавливаем взятые фигуры
      
      // Обновляем координаты
      pawn.x = from[0];
      pawn.y = from[1];
      
      // Восстанавливаем состояние если есть
      if (pawnState) {
        pawn.enPassantVulnerable = pawnState.enPassantVulnerable;
        pawn.moveCount = pawnState.prevMoveCount;
      }
    }
  
    this.promotionPending = null;
    this.lastMove = null;
    return true;
  }

  private createPromotionPiece(pieceType: string, color: "white" | "black"): IPiece {
    const pieceMap: Record<string, any> = {
      Queen,
      Rook,
      Bishop,
      Knight
    };
    
    const PieceClass = pieceMap[pieceType];
    if (!PieceClass) throw new Error("Invalid promotion piece");
    
    return new PieceClass(this.promotionPending!.x, this.promotionPending!.y, color);
  }

}

