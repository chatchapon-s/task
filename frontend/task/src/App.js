import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'

function App() {
  const [popup, setPopup] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    due_date: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8000/tasks');
      const result = await response.json();
      setTasks(result.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Task created successfully",
          showConfirmButton: false,
          timer: 1500
        });
        setFormData({
          title: '',
          description: '',
          status: 'Pending',
          due_date: ''
        });
        fetchTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Task updated successfully",
          showConfirmButton: false,
          timer: 1500
        });
        setPopup(false);
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning", 
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8000/tasks`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id })
        });
        if (response.ok) {
          Swal.fire({
            title: "Deleted!",
            text: "Your task has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });
          fetchTasks();
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const updateTask = (task) => {
    setSelectedTask(task);
    setFormData({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status
    });
    setPopup(true);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const searchId = e.target.elements['default-search'].value;
    
    try {
      const response = await fetch(`http://localhost:8000/tasks/${searchId}`);
      const result = await response.json();
      if (result.data[0]) {
        setTasks([result.data[0]]);
      }
    } catch (error) {
      console.error('Error searching task:', error);
    }
  };

  return (
    <div className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 h-screen">
      <form className="max-w-sm mx-auto mb-10 pt-10" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Task Title</label>
          <input 
            type="text" 
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            required 
          />
        </div>
        <div className="mb-5">
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Task Description</label>
          <textarea 
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            
          />
        </div>
        <div className="mb-5">
          <label htmlFor="due_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Task due date</label>
          <input 
            type="datetime-local" 
            id="due_date"
            value={formData.due_date}
            onChange={(e) => setFormData({...formData, due_date: e.target.value})}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            min="2024-01-01T00:00"
            max="2025-12-31T23:59"
            
          />
        </div>
        <div className="mb-5">
          <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Task Status</label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create Task</button>
      </form>

      <form className="max-w-md mx-auto mb-10" onSubmit={handleSearch}>   
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input 
            type="search" 
            id="default-search" 
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            placeholder="Search task id" 
            onChange={(e) => {
              if (!e.target.value.trim()) {
                fetchTasks();
              }
            }}
            required 
          />
          <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
        </div>
      </form>

      <div className="relative overflow-x-auto mb-10 px-10 hidden xl:block">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Task ID</th>
              <th scope="col" className="px-6 py-3">Task Title</th>
              <th scope="col" className="px-6 py-3">Task Description</th>
              <th scope="col" className="px-6 py-3">Task Status</th>
              <th scope="col" className="px-6 py-3">Task due date</th>
              <th scope="col" className="px-6 py-3">Task created at</th>
              <th scope="col" className="px-6 py-3">Task Update</th>
              <th scope="col" className="px-6 py-3">Task Delete</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{task.id}</th>
                <td className="px-6 py-4">{task.title}</td>
                <td className="px-6 py-4">{task.description}</td>
                <td className="px-6 py-4">{task.status}</td>
                <td className="px-6 py-4">{task.due_date ? new Date(task.due_date).toLocaleString('th-TH', {
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : '-'}</td>
                <td className="px-6 py-4">{task.created_at ? new Date(task.created_at).toLocaleString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric', 
                  hour: '2-digit',
                  minute: '2-digit'
                }) : '-'}</td>
                <td className="px-6 py-4">
                  <button onClick={() => updateTask(task)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update</button>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(task.id)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="xl:hidden flex flex-wrap gap-4 bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 pb-10 px-10">
      {tasks.map(task => (
          <div key={task.id} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex justify-end px-4 pt-4">
                  <button onClick={() => updateTask(task)} className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5">
                      <span className="sr-only">Edit task</span>
                      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                  </button>
                  <button onClick={() => handleDelete(task.id)} className="ml-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5">
                      <span className="sr-only">Delete task</span>
                      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                  </button>
              </div>
              <div className="flex flex-col items-center pb-10 px-4">
                  <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{task.title}</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">{task.description}</p>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      task.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                  }`}>
                      {task.status}
                  </span>
                  <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <p>Due: {task.due_date ? new Date(task.due_date).toLocaleString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                      }) : '-'}</p>
                      <p>Created: {task.created_at ? new Date(task.created_at).toLocaleString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                      }) : '-'}</p>
                  </div>
              </div>
          </div>
      ))}
      </div>


      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 w-full max-w-md">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Update Task
              </h3>
              <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setPopup(false)}>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <form className="space-y-4" onSubmit={handleUpdate}>
                <div>
                  <label htmlFor="update-title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Task Title</label>
                  <input 
                    type="text" 
                    id="update-title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="update-description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Task Description</label>
                  <textarea 
                    id="update-description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    
                  ></textarea>
                </div>
                <div className="mb-5">
                  <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Task Status</label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update Task</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
