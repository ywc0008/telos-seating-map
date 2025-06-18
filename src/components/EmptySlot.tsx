interface EmptySlotProps {
  className?: string;
}

export default function EmptySlot({ className = "" }: EmptySlotProps) {
  return (
    <div 
      className={`
        min-w-[80px]
        min-h-[90px] 
        border-2 
        border-dashed 
        border-gray-300 
        rounded-md 
        ${className}
      `}
    />
  );
} 