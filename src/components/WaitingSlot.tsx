import { useDroppable } from '@dnd-kit/core';

interface WaitingSlotProps {
  id: string;
  children?: React.ReactNode;
}

export default function WaitingSlot({ id, children }: WaitingSlotProps) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        bg-white p-2 rounded-md border-2 
        min-w-[120px] min-h-[90px] 
        flex items-center justify-center transition-all
        ${isOver 
          ? 'border-orange-400 bg-orange-100 scale-105' 
          : 'border-orange-200 hover:border-orange-300'
        }
      `}
    >
      {children}
    </div>
  );
} 