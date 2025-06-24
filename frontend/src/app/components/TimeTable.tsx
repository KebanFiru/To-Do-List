'use client';

import { useState, useEffect } from "react";
import { TimeTableProps } from "../types/timetableprops";
import { Todo } from "../types/todo";

export default function TimeTable({ selectedDate, onSelect, selectedTime, onTimeSelect }: TimeTableProps) {

    const [times, setTimes] = useState<string[]>([]);
    const [timeCounts, setTimeCounts] = useState<{ [time: string]: number }>({});

    const counts: { [time: string]: number } = {};

    useEffect(() => {

    async function fetchTimes() {

      const token = localStorage.getItem('token') || '';

      const res = await fetch('http://localhost:5000/api/gettodolist/', {

        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!res.ok) {

        console.error("Failed to fetch todos");
        return;
      }

    const data: Todo[] = await res.json();

    const filteredTodos = data.filter(todo => todo.date === selectedDate && todo.time);

    const counts: Record<string, number> = {};

    filteredTodos.forEach(todo => {

        const timeStr = String(todo.time!); 
        counts[timeStr] = (counts[timeStr] || 0) + 1;   
    });

    setTimeCounts(counts);

    const timeToMinutes = (timeStr: string): number => {

        const parts = timeStr.split(':').map(Number);
        if (parts.length !== 2 || parts.some(Number.isNaN)) {

            return NaN; 
        }
        const [h, m] = parts;

        return h * 60 + m;
    };

    const minutesToTime = (minutes: number): string => {

        const h = Math.floor(minutes / 60);
        const m = minutes % 60;

        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };


    const minutes = filteredTodos.map(t => timeToMinutes(String(t.time!))).filter(min => !Number.isNaN(min));

    const uniqueMinutes = Array.from(new Set(minutes));

    uniqueMinutes.sort((a, b) => a - b);

    const uniqueTimeStrings = uniqueMinutes.map(minutesToTime);

    setTimes(uniqueTimeStrings);


    }

    if (selectedDate) {

      fetchTimes();
    }
  }, [selectedDate]);

  return (
    <div className="text-center">
      <ul className="space-y-1">
        {times.map(time => {
          const count = timeCounts[time] || 1;
          const baseHeight = 40; 
          const height = baseHeight * count;

          return (
            <li
              key={time}
              className="border p-2 rounded bg-blue-500 text-white cursor-pointer text-center"
              style={{ height: `${height}px`, lineHeight: `${height}px` }}
              onClick={() => onTimeSelect(time)}
            >
              {time}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
