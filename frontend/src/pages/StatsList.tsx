import React, { useState, useEffect } from 'react';
import { getStats, deleteStat } from '../api/client';
import { useNavigate } from 'react-router-dom';

interface Stat {
  id: number;
  player: string;
  wins: number;
  losses: number;
  draws: number;
  created_at: string;
}

const StatsList: React.FC = () => {
  const [items, setItems] = useState<Stat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStats();
        setItems(data);
      } catch (err) {
        setError('Failed to fetch stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteStat(id);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (err) {
      setError('Failed to delete stat.');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) =>
    item.player.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Statistics</h1>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by player"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        />
        <button
          onClick={() => navigate('/stats/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New
        </button>
      </div>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Player</th>
            <th className="border border-gray-300 px-4 py-2">Wins</th>
            <th className="border border-gray-300 px-4 py-2">Losses</th>
            <th className="border border-gray-300 px-4 py-2">Draws</th>
            <th className="border border-gray-300 px-4 py-2">Created At</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-4 py-2">{item.player}</td>
              <td className="border border-gray-300 px-4 py-2">{item.wins}</td>
              <td className="border border-gray-300 px-4 py-2">{item.losses}</td>
              <td className="border border-gray-300 px-4 py-2">{item.draws}</td>
              <td className="border border-gray-300 px-4 py-2">{item.created_at}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatsList;