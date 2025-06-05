import React from "react";
import { Calendar } from "lucide-react";

interface DatePickerProps {
  selected: Date;
  onChange: (date: Date) => void;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ 
  selected, 
  onChange, 
  className 
}) => {
  return (
    <input
      type="date"
      value={selected.toISOString().split('T')[0]}
      onChange={(e) => onChange(new Date(e.target.value))}
      className={className}
    />
  );
};