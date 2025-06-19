import { useDraggable } from "@dnd-kit/core";

interface GogiProps {
  id: string;
  name?: string;
}

export default function Gogi({ id, name = "고기" }: GogiProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  });

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
    >
      <span className="text-3xl">🐈</span>
      <span className="text-[12px] font-bold mt-1">{name}</span>
    </div>
  );
}
