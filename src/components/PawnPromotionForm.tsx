import type React from "react"
import type { IPiece } from "../models/Piece"
import { Rook } from "../models/Rook"
import { Knight } from "../models/Knight"
import { Bishop } from "../models/Bishop"
import { Queen } from "../models/Queen"
import { X } from "lucide-react"

interface PawnPromotionFormProps {
  color: "white" | "black"
  onPromote: (pieceType: string) => void
  onCancel: () => void
}

const PawnPromotionForm: React.FC<PawnPromotionFormProps> = ({ color, onPromote, onCancel }) => {
    return (
      <div className="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white/25 p-4 rounded-lg grid grid-cols-2 gap-2">
          {[Queen, Rook, Bishop, Knight].map((Piece, idx) => (
            <div 
              key={idx}
              className="w-16 h-16 cursor-pointer hover:bg-gray-100"
              onClick={() => onPromote(Piece.name)}
            >
              <img 
                src={`/assets/${color[0]}${Piece.name.toLowerCase()}.png`} 
                alt={Piece.name}
                className="w-full h-full"
              />
            </div>
          ))}
          <div
            className="col-span-2 text-center py-2 cursor-pointer hover:bg-gray-100"
            onClick={onCancel}
          >
            <X className="mx-auto text-red-500" />
          </div>
        </div>
      </div>
    );
  };

export default PawnPromotionForm