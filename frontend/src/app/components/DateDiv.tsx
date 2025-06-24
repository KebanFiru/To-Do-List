'use client';

import { useEffect, useState } from "react";
import { Todo } from "../types/todo";
import ComboBox from "./ComboBox";
import TimeTable from "./TimeTable";

export default function DateDiv() {

  const [dates, setDates] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [selectedTodo, setSelectedTodo] = useState< number|null>(null);

  useEffect(() => {
    async function fetchDates() {

      const token = localStorage.getItem('token');
      if (!token) {

        console.error("Token not found");
        return;
      }

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

      const formattedDates: string[] = data.map(todo => {

        const [year, month, day] = todo.date.split('-');
        return `${day}/${month}/${year}`;
      });

      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0'); 
      const yyyy = today.getFullYear();
      const todayFormatted = `${dd}/${mm}/${yyyy}`;
      formattedDates.push(todayFormatted);

      const uniqueDates: string[] = Array.from(new Set(formattedDates));

      uniqueDates.sort((a, b) => {

        const [aDay, aMonth, aYear] = a.split('/').map(Number);
        const [bDay, bMonth, bYear] = b.split('/').map(Number);

        const dateA = new Date(aYear, aMonth - 1, aDay); 
        const dateB = new Date(bYear, bMonth - 1, bDay);

        return dateA.getTime() - dateB.getTime(); 

        });

      setDates(uniqueDates);
    }

    fetchDates();
  }, []);

  console.log(selectedTodo)

  return (
    <>
      <div>
        <ComboBox
            listOfElements={dates}
            selected={selectedValue}
            onSelect={setSelectedValue}
          />
        <TimeTable
          selectedDate={selectedValue}
          onSelect={setSelectedValue}
          selectedTodo={selectedTodo}
          onSelectedTodo={setSelectedTodo}
        />
      </div>
    </>
  );
}
