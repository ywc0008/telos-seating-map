interface EmptySlotProps {
  className?: string;
}

export default function EmptySlot({ className = "" }: EmptySlotProps) {
  return (
    <div 
      className={`
        size-18
        border-2 
        border-dashed 
        border-gray-300 
        rounded-md 
        ${className}
      `}
    />
  );
} 