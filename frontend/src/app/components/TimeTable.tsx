'use client';

import { useState, useEffect } from "react";
import { TimeTableProps } from "../types/timetableprops";
import { Todo } from "../types/todo";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export default function TimeTable({ selectedDate, onSelectedTodo, refreshKey }: TimeTableProps) {

  const [token, setToken] = useState<string | null>(null);
  const [groupedTodos, setGroupedTodos] = useState<{ [time: string]: Todo[] }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    setToken(localStorage.getItem('token'));
  }, []);

  useEffect(() => {

    if (!token || !selectedDate) {
      setGroupedTodos({});
      return;
    }

    setLoading(true);

    async function fetchTodos() {

      try {

        const res = await fetch(`${APIURL}/api/gettodolist`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {

          console.error("Failed to fetch todos");
          setGroupedTodos({});
          setLoading(false);
          return;
        }

        const data: Todo[] = await res.json();
        const filteredTodos = data.filter(todo => todo.date === selectedDate && todo.time);

        const timeGroups: { [time: string]: Todo[] } = {};
        filteredTodos.forEach(todo => {

          const timeStr = String(todo.time);
          if (!timeGroups[timeStr]) {

            timeGroups[timeStr] = [];
          }
          timeGroups[timeStr].push(todo);
        });

        const timeToMinutes = (timeStr: string) => {

          const [h, m] = timeStr.split(':').map(Number);
          return h * 60 + m;
        };

        const sortedEntries = Object.entries(timeGroups).sort(

          ([a], [b]) => timeToMinutes(a) - timeToMinutes(b)
        );

        const sortedGrouped: { [time: string]: Todo[] } = {};
        sortedEntries.forEach(([time, todos]) => {

          sortedGrouped[time] = todos;
        });

        setGroupedTodos(sortedGrouped);
      } 
      catch (error) {

        console.error("Error fetching todos:", error);
        setGroupedTodos({});
      } 
      finally {

        setLoading(false);
      }
    }

    fetchTodos();
  }, [token, selectedDate, refreshKey]);

  const toggleIsDone = async (todo: Todo) => {

    if (!token) return;

    const updatedStatus = !todo.is_done;

    try {

      const res = await fetch(`${APIURL}/api/${todo.id}/toggle_done`, {

        method: 'POST',
        headers: {

          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_done: updatedStatus }),
      });

      if (!res.ok) {

        console.error('Failed to update todo status');
        return;
      }

      setGroupedTodos(prev => {

        const newGrouped: { [time: string]: Todo[] } = {};
        Object.entries(prev).forEach(([time, todos]) => {

          newGrouped[time] = todos.map(t =>

            t.id === todo.id ? { ...t, is_done: updatedStatus } : t
          );
        });

        const timeToMinutes = (timeStr: string) => {

          const [h, m] = timeStr.split(':').map(Number);
          return h * 60 + m;
        };

        const sortedEntries = Object.entries(newGrouped).sort(

          ([a], [b]) => timeToMinutes(a) - timeToMinutes(b)
        );

        const sortedGrouped: { [time: string]: Todo[] } = {};
        sortedEntries.forEach(([time, todos]) => {

          sortedGrouped[time] = todos;
        });

        return sortedGrouped;
      });
    } catch (error) {

      console.error('Error updating todo:', error);
    }
  };

  const toDoClick = (id: number) => {

    onSelectedTodo(id);
  };

  if (token === null) return null;

  return (
    <div className="w-full space-y-4">
      {loading && <p className="text-center text-gray-500">Loading todos...</p>}
      {!loading && Object.entries(groupedTodos).length === 0 && (
        <p className="text-center text-gray-500">No todos for selected date.</p>
      )}
      {!loading &&
        Object.entries(groupedTodos).map(([time, todos]) => (
          <div key={time} className="flex items-center border rounded p-3 bg-blue-100">
            <div className="w-20 font-semibold text-blue-800">{time}</div>
            <div className="flex flex-col gap-3 ml-4">
              {todos.map(todo => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 bg-blue-500 text-white rounded px-3 py-1 text-sm font-medium"
                >
                  <input
                    type="checkbox"
                    checked={todo.is_done || false}
                    onChange={() => toggleIsDone(todo)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span
                    onClick={() => toDoClick(todo.id)}
                    className={`flex-1 cursor-pointer ${todo.is_done ? 'line-through opacity-70' : ''}`}
                  >
                    {todo.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
