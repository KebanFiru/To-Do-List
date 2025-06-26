'use client';

import { useEffect, useState } from "react";
import { ComboBoxProps } from "../types/comboboxprops";

export default function ComboBox({ listOfElements, selected, onSelect }: ComboBoxProps) {

  const getTodayISO = () => {

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const isoToDisplay = (isoDate: string) => {

    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  const displayToISO = (displayDate: string) => {

    const [day, month, year] = displayDate.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const getTodayDisplay = () => {

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const getWeekdayName = (dateStr: string) => {

    const [day, month, year] = dateStr.split('/');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const todayDisplay = getTodayDisplay();

  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {

    if (selected) {

      setQuery(isoToDisplay(selected));
    } 
    else {

      const todayISO = getTodayISO();
      onSelect(todayISO);
      setQuery(todayDisplay);
    }
  }, [selected]);

  const handleSelect = (element: string) => {

    const isoDate = displayToISO(element);
    onSelect(isoDate);
    setQuery(element);
    setShowDropdown(false);
  };

  const filteredElements = listOfElements;

  return (
    
    <div className="relative w-1/2"> 
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        className="w-full border border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-blue-500 focus:ring-2 focus:ring-blue-300 box-border transition"
        placeholder="Select a date"
      />
      {showDropdown && (
        <ul className="z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-52 overflow-y-auto shadow-lg absolute box-border p-2">
          {filteredElements.length === 0 ? (
            <li className="p-2 text-gray-500 text-center">No results</li>
          ) : (
            filteredElements.map((element) => {
              const isToday = element === todayDisplay;
              const weekday = getWeekdayName(element);
              return (
                <li
                  key={element}
                  onMouseDown={() => handleSelect(element)}
                  className="p-2 cursor-pointer flex justify-between rounded hover:bg-blue-100 transition"
                >
                  <span>{element}</span>
                  <span className="text-gray-400 ml-2 italic text-sm">{weekday} {isToday && '(today)'}</span>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
