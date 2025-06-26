'use client';

import { useState, useEffect } from 'react';
import { ToDoDivProps } from '../types/tododiv';
import { Todo } from '../types/todo';

const APIURL = process.env.NEXT_PUBLIC_API_URL;

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

        const res = await fetch(`${APIURL}/api/${selectedTodo}/gettodo`, {
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
        selectedTodo? `${APIURL}/api/${selectedTodo}/updatetodo`: `${APIURL}/api/addtodo`,
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

      const res = await fetch(`${APIURL}/api/${selectedTodo}/deletetodo`, {
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
    <div className="p-8 bg-white rounded-xl shadow-lg max-w-2xl w-full min-w-[400px]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter todo title"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[140px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter detailed description"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6 items-center">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-center">Time</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
          >
            {selectedTodo ? 'Update Todo' : 'Add Todo'}
          </button>

          {selectedTodo && (
            <>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md transition"
              >
                Remove
              </button>

              <button
                type="button"
                onClick={onDeselect}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-md transition"
              >
                Deselect
              </button>
            </>
          )}
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-2 font-medium text-center">{error}</p>
        )}

        {loading && (
          <p className="text-gray-500 text-sm mt-2 text-center">Loading...</p>
        )}
      </form>
    </div>
  );
}
