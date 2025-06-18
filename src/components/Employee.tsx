import type { EmployeeInterface } from '../types/employee';

import { useDraggable } from '@dnd-kit/core';
import { Badge } from './ui/badge';

interface EmployeeProps {
  employeeData: EmployeeInterface;
  onMiddleClick?: () => void;
}

// 팀별 색상 매핑
const teamColors: Record<string, string> = {
  '전략경영팀': 'bg-purple-500 hover:bg-purple-600 text-white',
  '디자인팀': 'bg-pink-500 hover:bg-pink-600 text-white',
  '마케팅팀': 'bg-orange-500 hover:bg-orange-600 text-white',
  '그래픽팀': 'bg-cyan-500 hover:bg-cyan-600 text-white',
  '메타개발팀': 'bg-blue-500 hover:bg-blue-600 text-white',
  'R&D팀': 'bg-green-500 hover:bg-green-600 text-white',
  '서비스팀': 'bg-yellow-500 hover:bg-yellow-600 text-white',
  '메타기획팀': 'bg-indigo-500 hover:bg-indigo-600 text-white',
  '전북영업본부': 'bg-red-500 hover:bg-red-600 text-white',
};

export default function Employee({ employeeData, onMiddleClick }: EmployeeProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: employeeData.id });

  const handleMouseDown = (e: React.MouseEvent) => {
    // 휠클릭(가운데 마우스 버튼)인 경우
    if (e.button === 1 && onMiddleClick) {
      e.preventDefault();
      onMiddleClick();
    }
  };

  // 팀별 색상 가져오기 (기본값은 회색)
  const badgeColor = teamColors[employeeData.department] || 'bg-gray-500 hover:bg-gray-600 text-white';

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
        w-full
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
    >
      <Badge className={`text-[10px] min-w-[50px] text-center ${badgeColor}`}>{employeeData.department}</Badge>
      <span className="text-[15px]">{employeeData.gender === 'male' ? '🧑‍💼' : '👩‍💼'}</span>
      <span className="text-[10px] font-bold text-center">{employeeData.name} {employeeData.position}</span>
    </div>
  );
} 