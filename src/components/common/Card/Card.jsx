export default function Card({ children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-5">
      {children}
    </div>
  );
}
