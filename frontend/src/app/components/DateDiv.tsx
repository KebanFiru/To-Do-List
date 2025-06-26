'use client';

import { useEffect, useState } from "react";
import { Todo } from "../types/todo";
import ComboBox from "./ComboBox";
import TimeTable from "./TimeTable";
import ToDoDiv from "./ToDoDiv";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export default function DateDiv() {

  const [dates, setDates] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {

    setRefreshKey(prev => prev + 1);
  }

  useEffect(() => {

    async function fetchDates() {

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found')

      const res = await fetch(`${APIURL}/api/gettodolist/`, {

        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to fetch todos")

      const data: Todo[] = await res.json();

      const formattedDates = data.map(todo => {

        const [year, month, day] = todo.date.split('-');
        return `${day}/${month}/${year}`;
      });

      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0'); 
      const yyyy = today.getFullYear();
      const todayFormatted = `${dd}/${mm}/${yyyy}`;
      formattedDates.push(todayFormatted);

      const uniqueDates = Array.from(new Set(formattedDates));

      uniqueDates.sort((a, b) => {
        
        const [aDay, aMonth, aYear] = a.split('/').map(Number);
        const [bDay, bMonth, bYear] = b.split('/').map(Number);
        return new Date(aYear, aMonth - 1, aDay).getTime() - new Date(bYear, bMonth - 1, bDay).getTime();
      });

      setDates(uniqueDates);
    }

    fetchDates();
  }, [refreshKey]);

  return (
    <div className="flex flex-row items-start p-4 gap-12 max-w-5xl mx-auto w-full">
      <div className="flex flex-col gap-6 w-full max-w-lg">
        <ComboBox
          listOfElements={dates}
          selected={selectedValue}
          onSelect={setSelectedValue}
        />
        <TimeTable
          selectedDate={selectedValue}
          onSelectedTodo={setSelectedTodo}
          refreshKey={refreshKey}
        />
      </div>
      <div className="flex-1">
        <ToDoDiv
          selectedTodo={selectedTodo!}
          selectedDate={selectedValue}
          triggerRefresh={triggerRefresh}
          onDeselect={() => setSelectedTodo(null)}
        />
      </div>
    </div>
  );
}
