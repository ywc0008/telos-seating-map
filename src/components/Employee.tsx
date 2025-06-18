import type { EmployeeInterface } from '../types/employee';

import { useDraggable } from '@dnd-kit/core';
import { Badge } from './ui/badge';

interface EmployeeProps {
  employeeData: EmployeeInterface;
  onMiddleClick?: () => void;
}

export default function Employee({ employeeData, onMiddleClick }: EmployeeProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: employeeData.id });

  const handleMouseDown = (e: React.MouseEvent) => {
    // 휠클릭(가운데 마우스 버튼)인 경우
    if (e.button === 1 && onMiddleClick) {
      e.preventDefault();
      onMiddleClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onMouseDown={handleMouseDown}
      className={`
        cursor-grab 
        flex flex-col 
        items-center 
        select-none 
        gap-0.5
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
    >
      <Badge variant="secondary" className="text-[10px]">{employeeData.department}</Badge>
      <span className="text-[15px]">{employeeData.gender === 'male' ? '🧑‍💼' : '👩‍💼'}</span>
      <span className="text-[10px] font-bold">{employeeData.name} {employeeData.position}</span>
    </div>
  );
} 