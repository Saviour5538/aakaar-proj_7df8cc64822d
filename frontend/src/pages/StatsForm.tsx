import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createStat, updateStat, getStatById } from '../api/client';

interface StatFormValues {
  player: string;
  wins: number;
  losses: number;
  draws: number;
}

const StatsForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<StatFormValues>({
    player: '',
    wins: 0,
    losses: 0,
    draws: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchStat = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getStatById(Number(id));
          setFormValues({
            player: data.player,
            wins: data.wins,
            losses: data.losses,
            draws: data.draws,
          });
        } catch (err) {
          setError('Failed to fetch stat.');
        } finally {
          setLoading(false);
        }
      };
      fetchStat();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: name === 'player' ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (id) {
        await updateStat(Number(id), formValues);
      } else {
        await createStat(formValues);
      }
      navigate('/stats');
    } catch (err) {
      setError('Failed to save stat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Stat' : 'Add New Stat'}</h1>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Player</label>
          <input
            type="text"
            name="player"
            value={formValues.player}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Wins</label>
          <input
            type="number"
            name="wins"
            value={formValues.wins}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Losses</label>
          <input
            type="number"
            name="losses"
            value={formValues.losses}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Draws</label>
          <input
            type="number"
            name="draws"
            value={formValues.draws}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default StatsForm;