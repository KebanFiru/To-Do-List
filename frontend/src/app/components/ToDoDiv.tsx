'use client';

import { useState, useEffect } from 'react';
import { ToDoDivProps } from '../types/tododiv';
import { Todo } from '../types/todo';

export default function ToDoDiv({ selectedTodo, selectedDate, triggerRefresh, onDeselect }: ToDoDivProps) {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(selectedDate || '');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    async function fetchTodo() {

      if (!selectedTodo) {

        setTitle('');
        setDescription('');
        setDate(selectedDate || '');
        setTime('');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found');

      setLoading(true);
      setError(null);

      try {

        const res = await fetch(`http://localhost:5000/api/${selectedTodo}/gettodo`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to fetch todo');

        const data: Todo = await res.json();
        setTitle(data.title);
        setDescription(data.description || '');
        setDate(data.date);
        setTime(String(data.time));
      } 
      catch (err: any) {

        console.error(err);
        setError(err.message);
      } 
      finally {

        setLoading(false);
      }
    }

    fetchTodo();
  }, [selectedTodo, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const payload = { title, description, date, time };

    try {

      const res = await fetch(
        selectedTodo? `http://localhost:5000/api/${selectedTodo}/updatetodo`: 'http://localhost:5000/api/addtodo',
        {

          method: selectedTodo ? 'PUT' : 'POST',
          headers: {

            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) throw new Error(`${selectedTodo ? 'Update' : 'Add'} failed`);

      triggerRefresh();

      setTitle('');
      setDescription('');
      setDate(selectedDate || '');
      setTime('');

      if (onDeselect) onDeselect();

    } 
    catch (err: any) {

      console.error(err);
      setError(err.message);
    }
  };

  const handleDelete = async () => {

    if (!selectedTodo) return;

    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    try {

      const res = await fetch(`http://localhost:5000/api/${selectedTodo}/deletetodo`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Delete failed');

      triggerRefresh();

      setTitle('');
      setDescription('');
      setDate(selectedDate || '');
      setTime('');

      if (onDeselect) onDeselect();

    } 
    catch (err: any) {

      console.error(err);
      setError(err.message);
    }
  };

  return (
    
    <div className="p-6 bg-white rounded shadow w-full max-w-2xl min-w-[400px]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1 min-h-[120px] resize-y"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div className="flex flex-col items-center">
          <label className="block font-medium text-center">Time</label>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="mt-1 w-40 border rounded px-2 py-1 text-center"
            required
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600"
          >
            {selectedTodo ? 'Update Todo' : 'Add Todo'}
          </button>

          {selectedTodo && (
            <>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white font-medium py-2 px-4 rounded hover:bg-red-600"
              >
                Remove
              </button>

              <button
                type="button"
                onClick={onDeselect}
                className="bg-gray-400 text-white font-medium py-2 px-4 rounded hover:bg-gray-500"
              >
                Deselect
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
