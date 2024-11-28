import { useEffect, useState } from "react";
import axiosInstance from "../config/axiosconfig";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    startTime: "",
    endTime: "",
    priority: 3,
    status: "pending",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get("/tasks");
        setTasks(response.data);
      } catch (error) {
        toast.error("Error fetching tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Add a new task
  const addTask = async () => {
    if (!newTask.title.trim()) {
      toast.error("Task title cannot be empty");
      return;
    }

    if (newTask.priority < 1 || newTask.priority > 5) {
      toast.error("Priority must be a number between 1 and 5");
      return;
    }

    if (!newTask.startTime || !newTask.endTime) {
      toast.error("Please set both start and end times");
      return;
    }

    try {
      const response = await axiosInstance.post("/tasks", newTask);
      setTasks([...tasks, response.data]);
      setNewTask({
        title: "",
        startTime: "",
        endTime: "",
        priority: 3,
        status: "pending",
      });
      toast.success("Task added successfully");
      fetchTasks();
    } catch (error) {
      toast.error("Error adding task");
    }
  };

  const handleSignOut = async () => {
    try {
      document.cookie = 'token=; Max-Age=0';
      await axiosInstance.get('/users/logout');
      localStorage.clear();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Error signing out');
      navigate('/login');
    }
  };

  // Update the status of an existing task
  const updateStatus = async (task) => {
    try {
      const updatedTask = { ...task, status: task.status };
      const response = await axiosInstance.put(`/tasks`, updatedTask, {
        params: { id: task._id },
      });
      setTasks(tasks.map((t) => (t._id === task._id ? response.data : t)));
      setEditingTask(null);
      toast.success("Task status updated successfully");
    } catch (error) {
      toast.error("Error updating task status");
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks`, {
        params: { id: taskId },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success("Task deleted successfully");
      fetchTasks();
    } catch (error) {
      toast.error("Error deleting task");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
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

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Task</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <input
            type="datetime-local"
            className="border border-gray-300 p-2 rounded-lg w-full"
            value={newTask.startTime}
            onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
          />
          <input
            type="datetime-local"
            className="border border-gray-300 p-2 rounded-lg w-full"
            value={newTask.endTime}
            onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
          />
          <input
            type="number"
            className="border border-gray-300 p-2 rounded-lg w-full"
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                priority: Math.max(1, Math.min(5, parseInt(e.target.value) || 1)),
              })
            }
            min={1}
            max={5}
            placeholder="Priority (1-5)"
          />
          <select
            className="border border-gray-300 p-2 rounded-lg w-full"
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="finished">Finished</option>
          </select>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            onClick={addTask}
          >
            Add Task
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Tasks List</h2>
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-500 mb-2">No tasks available</p>
            <p className="text-gray-400">Add your first task using the form above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Task</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Start Time</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">End Time</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Priority</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className="border-t border-gray-200">
                    <td className="px-4 py-2 text-sm">{task._id}</td>
                    <td className="px-4 py-2 text-sm">{task.title}</td>
                    <td className="px-4 py-2 text-sm">{new Date(task.startTime).toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm">{new Date(task.endTime).toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm">{task.priority}</td>
                    <td className="px-4 py-2 text-sm">
                      {editingTask === task._id ? (
                        <select
                          value={task.status}
                          onChange={(e) => updateStatus({ ...task, status: e.target.value })}
                          className="border border-gray-300 p-2 rounded-lg"
                        >
                          <option value="pending">Pending</option>
                          <option value="finished">Finished</option>
                        </select>
                      ) : (
                        task.status
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm space-x-2">
                      {editingTask === task._id ? (
                        <>
                          <button
                            className="text-green-600"
                            onClick={() => updateStatus(task)}
                          >
                            Save
                          </button>
                          <button
                            className="text-red-600"
                            onClick={() => setEditingTask(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="text-blue-600"
                          onClick={() => setEditingTask(task._id)}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="text-red-600"
                        onClick={() => deleteTask(task._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
