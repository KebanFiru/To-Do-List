'use client';

import { useState, useEffect } from 'react';
import { ComboBoxProps } from '../types/comboboxprops';

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
    <div className="relative w-72 p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
        className="w-full border border-gray-300 rounded px-3 py-2 p-4 box-border"
        placeholder="Select a date"
      />
      {showDropdown && (
        <ul className="z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto shadow absolute box-border p-4">
          {filteredElements.length === 0 ? (
            <li className="p-2 text-gray-500">No results</li>
          ) : (
            filteredElements.map((element) => {
              const isToday = element === todayDisplay;
              const weekday = getWeekdayName(element);
              return (
                <li
                  key={element}
                  onMouseDown={() => handleSelect(element)}
                  className="p-2 hover:bg-blue-100 cursor-pointer flex justify-between"
                >
                  <span>{element}</span>
                  <span className="text-gray-500 ml-2">{weekday} {isToday && '(today)'}</span>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
