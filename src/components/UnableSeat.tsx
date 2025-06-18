export default function UnableSeat() {

  return (
    <div
      className={`w-16 rounded-md border-2 border-gray-400 flex items-center justify-center transition-all duration-200 bg-white`}
    >
        <div className='flex flex-col items-center justify-center gap-1 my-2'>
        <div className='bg-gray-300 border-2 border-gray-400 rounded-md w-12 h-5 flex items-center justify-center'>-</div>
        </div>
    </div>
  );
} 