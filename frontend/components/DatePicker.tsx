import { useState } from 'react';

interface DatePickerProps {
  value: string; // ISO string date
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const DatePicker = ({ value, onChange, label, placeholder, disabled = false }: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<string>(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSelectedDate(newValue);
    onChange(newValue);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type="datetime-local"
        value={selectedDate}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
      />
    </div>
  );
};