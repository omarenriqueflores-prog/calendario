
import React, { useState, useMemo } from 'react';
import { MONTH_NAMES_ES, DAY_NAMES_ES, getMockUnavailableDays } from '../constants';

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const unavailableDays = useMemo(() => getMockUnavailableDays(currentDate.getFullYear(), currentDate.getMonth()), [currentDate]);

  const changeMonth = (offset: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isPast = dayDate < today;
      const isUnavailable = unavailableDays.has(day);
      const isSelected = selectedDate?.toDateString() === dayDate.toDateString();
      const isToday = today.toDateString() === dayDate.toDateString();

      let buttonClasses = "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ";
      if (isPast || isUnavailable) {
        buttonClasses += "text-gray-300 cursor-not-allowed line-through";
      } else if (isSelected) {
        buttonClasses += "bg-blue-600 text-white font-bold shadow-md";
      } else if (isToday) {
        buttonClasses += "bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200";
      } else {
        buttonClasses += "text-gray-700 hover:bg-gray-100";
      }

      days.push(
        <div key={day} className="flex justify-center items-center">
          <button
            onClick={() => onDateSelect(dayDate)}
            disabled={isPast || isUnavailable}
            className={buttonClasses}
          >
            {day}
          </button>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h3 className="text-lg font-semibold text-gray-800">
          {MONTH_NAMES_ES[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center text-sm text-gray-500 mb-2">
        {DAY_NAMES_ES.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-2">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
