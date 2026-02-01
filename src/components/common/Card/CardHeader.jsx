export default function CardHeader({ title, subtitle, icon }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      {icon && <span className="text-[rgb(40,169,224)]">{icon}</span>}
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
      </div>
    </div>
  );
}
