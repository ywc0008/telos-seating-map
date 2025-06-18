import { useDroppable } from '@dnd-kit/core';

interface SeatProps {
  id: string;
  children?: React.ReactNode;
}

export default function Seat({ id, children }: SeatProps) {
  const { isOver, setNodeRef, active } = useDroppable({ 
    id,
    // disabled 제거 - 자리 교체를 위해 항상 드롭 가능하게 함
  });

  const isOccupied = !!children;
  const isDraggingOverOccupied = isOver && isOccupied && active;

  return (
    <div
      ref={setNodeRef}
      className={`
        relative
        min-h-[80px] 
        border-2 
        rounded-md 
        flex 
        items-center 
        justify-center 
        transition-all
        ${isOccupied 
          ? 'bg-white border-gray-300' 
          : 'bg-white border-gray-400'
        }
        ${isOver && !isOccupied
          ? 'border-blue-500 bg-blue-50 scale-105' 
          : ''
        }
        ${isDraggingOverOccupied
          ? 'border-yellow-500 bg-yellow-50' 
          : ''
        }
        ${!isOccupied && !isOver
          ? 'hover:bg-gray-50'
          : ''
        }
      `}
    >
      {isDraggingOverOccupied && (
        <div className="absolute inset-0 flex items-center justify-center bg-yellow-400 bg-opacity-20 rounded-md pointer-events-none">
          <span className="text-yellow-700 font-bold text-xs">자리 교체</span>
        </div>
      )}
      {children}
    </div>
  );
} 