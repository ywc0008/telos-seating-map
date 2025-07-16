import { useDraggable } from "@dnd-kit/core";
import { useEffect, useState } from "react";

interface GogiProps {
  id: string;
  name?: string;
  isPlaced?: boolean;
}

export default function Gogi({ id, name = "고기", isPlaced = false }: GogiProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  });

  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isPlaced) return;

    const moveRandomly = () => {
      const directions = [
        { x: 1, y: 0 },   // 우
        { x: -1, y: 0 },  // 좌
        { x: 0, y: 1 },   // 하
        { x: 0, y: -1 },  // 상
        { x: 1, y: 1 },   // 우하
        { x: -1, y: 1 },  // 좌하
        { x: 1, y: -1 },  // 우상
        { x: -1, y: -1 }, // 좌상
      ];
      
      const randomDirection = directions[Math.floor(Math.random() * directions.length)];
      const moveDistance = Math.random() * 50 + 50; // 50-100px 랜덤 이동
      
      setPosition(prev => ({
        x: prev.x + randomDirection.x * moveDistance,
        y: prev.y + randomDirection.y * moveDistance,
      }));
    };

    const interval = setInterval(moveRandomly, 2000 + Math.random() * 3000); // 2-5초 랜덤 간격
    return () => clearInterval(interval);
  }, [isPlaced]);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        cursor-grab 
        flex flex-col 
        items-center 
        select-none 
        ${isDragging ? "opacity-50" : "opacity-100"}
      `}
      style={{
        transform: isPlaced ? `translate(${position.x}px, ${position.y}px)` : undefined,
        transition: isPlaced ? "transform 0.5s ease-in-out" : undefined,
      }}
    >
      <span className="text-3xl">🐈</span>
      <span className="text-[12px] font-bold mt-1">{name}</span>
    </div>
  );
}
