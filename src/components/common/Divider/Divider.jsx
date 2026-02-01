export default function Divider({ text }) {
  return (
    <div className="flex items-center gap-2 my-4">
      <div className="flex-1 h-[1px] bg-gray-200"></div>
      {text && <span className="text-gray-400 text-sm">{text}</span>}
      <div className="flex-1 h-[1px] bg-gray-200"></div>
    </div>
  );
}
