import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosconfig';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatsAndTasks = async () => {
      try {
        toast.promise(
          axiosInstance.get('/tasks/dashboard')
            .then((response) => {
              setStats(response.data);
            }),
          {
            loading: 'Loading stats...',
            success: 'Stats loaded successfully!',
            error: 'Error loading stats',
          }
        );

        toast.promise(
          axiosInstance.get('/tasks')
            .then((response) => {
              setCompletedTasks(response.data);
            }),
          {
            loading: 'Loading tasks...',
            success: 'Tasks loaded successfully!',
            error: 'Error loading tasks',
          }
        );
      } catch (error) {
        console.error('Error fetching stats or tasks:', error);
        toast.error('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchStatsAndTasks();
  }, []);

  const handleSignOut = async () => {
    document.cookie = 'token=; Max-Age=0';
    await axiosInstance.get('/users/logout')
    localStorage.clear();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Navbar - Kept unchanged as requested */}
      <nav className="bg-indigo-600 text-white p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-lg font-bold">Task Manager</div>
          <div className="hidden md:flex space-x-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="hover:bg-indigo-500 px-3 py-2 rounded"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/tasks')}
              className="hover:bg-indigo-500 px-3 py-2 rounded"
            >
              Tasks
            </button>
            <button
              onClick={handleSignOut}
              className="hover:bg-indigo-500 px-3 py-2 rounded"
            >
              Sign Out
            </button>
          </div>
          <div className="md:hidden">
            <button
              className="text-white"
              onClick={() => toast('Mobile menu toggle clicked!')}
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Enhanced Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Stats Cards with enhanced styling */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-4xl font-bold text-indigo-600 mb-2">{stats?.totalTasks || 0}</h3>
            <p className="text-gray-600 font-medium">Total tasks</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-4xl font-bold text-indigo-600 mb-2">{stats?.tasksCompleted || '0%'}</h3>
            <p className="text-gray-600 font-medium">Tasks completed</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-4xl font-bold text-indigo-600 mb-2">{stats?.tasksPending || '0%'}</h3>
            <p className="text-gray-600 font-medium">Tasks pending</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-4xl font-bold text-indigo-600 mb-2">{stats?.averageTime || '0'} hrs</h3>
            <p className="text-gray-600 font-medium">Average time per task</p>
          </div>
        </div>

        {/* Pending Task Summary with enhanced styling */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold mb-6">Pending task summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-3xl font-bold text-indigo-600 mb-2">{stats?.pendingTasks || 0}</h4>
              <p className="text-gray-600 font-medium">Pending tasks</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-3xl font-bold text-indigo-600 mb-2">{stats?.totalTimeLapsed || 0} hrs</h4>
              <p className="text-gray-600 font-medium">Total time lapsed</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-3xl font-bold text-indigo-600 mb-2">{stats?.timeToFinish || 0} hrs</h4>
              <p className="text-gray-600 font-medium">Total time to finish</p>
            </div>
          </div>
        </div>

        {/* Completed Tasks Table with enhanced styling */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold mb-6">Completed Tasks</h2>
          {completedTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl text-gray-500 mb-2">No completed tasks yet</p>
              <p className="text-gray-400">Complete some tasks to see them here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Taken</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {completedTasks.map((task) => (
                    <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(task.startTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(task.endTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {((new Date(task.endTime) - new Date(task.startTime)) / 1000 / 60 / 60).toFixed(2)} hrs
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

