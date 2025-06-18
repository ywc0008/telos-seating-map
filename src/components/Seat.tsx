import { useDroppable } from '@dnd-kit/core';

interface SeatProps {
  id: string;
  children?: React.ReactNode;
}

export default function Seat({ id, children }: SeatProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`w-18 h-18 rounded-md border-2 border-gray-400 flex items-center justify-center transition-all duration-200 ${isOver ? 'bg-blue-100' : 'bg-white'}`}
    >
      <div>{children ? children : <div className='flex flex-col items-center justify-center gap-1'>
        <div className='bg-gray-300 border-2 border-gray-400 rounded-md w-12 h-5 flex items-center justify-center'>-</div>
        <span className='text-sm'>🚫 공석</span>
        </div>}</div>
    </div>
  );
} 