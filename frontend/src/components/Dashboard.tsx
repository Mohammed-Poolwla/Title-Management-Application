import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTitles } from '../hooks/useTitles';
import { useMetaMask } from '../hooks/useMetaMask';

const TitleItem: React.FC<{ title: { uuid: string; title: string; subject: string; details: string }; onDelete: (id: string) => void }> = React.memo(({ title, onDelete }) => (
  <li className="bg-white shadow overflow-hidden sm:rounded-lg">
    <div className="px-4 py-5 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">{title.title} - {title.subject}</h3>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">{title.details}</p>
    </div>
    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
      <button
        onClick={() => onDelete(title.uuid)}
        className="bg-red-500  hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Delete
      </button>
    </div>
  </li>
));

const Dashboard: React.FC = () => {
  const [newTitle, setNewTitle] = useState({ subject: '', details: '' });
  const { logout } = useAuth();
  const { titles, fetchTitles, addTitle, deleteTitle } = useTitles();
  const { account, connectWallet, disconnectWallet } = useMetaMask();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTitles();
  }, [fetchTitles]);

  const handleAddTitle = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      alert('Please connect your MetaMask wallet first.');
      return;
    }
    try {
      await addTitle(newTitle.subject, newTitle.details);
      setNewTitle({ subject: '', details: '' });
    } catch (error) {
      console.error('Error adding title:', error);
    }
  }, [account, addTitle, newTitle]);

  const handleDeleteTitle = useCallback(async (id: string) => {
    if (!account) {
      alert('Please connect your MetaMask wallet first.');
      return;
    }
    try {
      await deleteTitle(id);
    } catch (error) {
      console.error('Error deleting title:', error);
    }
  }, [account, deleteTitle]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const memoizedTitles = useMemo(() => titles.map(title => (
    <TitleItem key={title.uuid} title={title} onDelete={handleDeleteTitle} />
  )), [titles, handleDeleteTitle]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Title Manager</h1>
              </div>
            </div>
            <div className="flex items-center">
              {account ? (
                <>
                  <span className="text-sm text-gray-500 mr-4">Connected: {account.slice(0, 6)}...{account.slice(-4)}</span>
                  <button
                    onClick={disconnectWallet}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4"
                  >
                    Disconnect Wallet
                  </button>
                </>
              ) : (
                <button
                  onClick={connectWallet}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                >
                  Connect Wallet
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900">Your Titles</h2>
          <form onSubmit={handleAddTitle} className="mt-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Subject"
              value={newTitle.subject}
              onChange={(e) => setNewTitle(prev => ({ ...prev, subject: e.target.value }))}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              required
            />
            <input
              type="text"
              placeholder="Details"
              value={newTitle.details}
              onChange={(e) => setNewTitle(prev => ({ ...prev, details: e.target.value }))}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded block w-full max-w-52 sm:max-w-full"
            >
              Add Title
            </button>
          </form>

          <ul className="mt-4 space-y-4">
            {memoizedTitles}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);