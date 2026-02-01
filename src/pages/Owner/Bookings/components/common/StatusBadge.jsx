import React from "react";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

const StatusBadge = ({ type, text }) => {
  const styles = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    overdue: "bg-red-50 text-red-600 border-red-200",
    today: "bg-amber-50 text-amber-700 border-amber-200"
  };
  
  let Icon = CheckCircle2;
  if (type === 'overdue') Icon = AlertCircle;
  if (type === 'today') Icon = Clock;

  return (
    <span className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${styles[type] || styles.active}`}>
      <Icon size={14} />
      {text}
    </span>
  );
};

export default StatusBadge;