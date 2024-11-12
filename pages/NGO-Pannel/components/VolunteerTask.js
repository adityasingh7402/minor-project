import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const VolunteerTask = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [previousTasks, setPreviousTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskEndDate, setTaskEndDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ngoProfile, setNgoProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNgoProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('ngoToken');
        if (!token) {
          router.push('/Login');
          return;
        }

        const profileResponse = await fetch('/api/ngoProfile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch NGO profile');
        }

        const ngoData = await profileResponse.json();
        setNgoProfile(ngoData);

        const hiredVolunteersResponse = await fetch(`/api/hiredVolunteers/${ngoData._id}`);
        if (!hiredVolunteersResponse.ok) {
          throw new Error('Failed to fetch hired volunteers');
        }

        const data = await hiredVolunteersResponse.json();
        const acceptedVolunteers = data.filter(volunteer => volunteer.status === 'Accepted');

        const volunteersWithDetails = await Promise.all(
          acceptedVolunteers.map(async (hire) => {
            const volunteerResponse = await fetch(`/api/getVolunteerProfile/${hire.volunteerId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            if (!volunteerResponse.ok) {
              throw new Error('Failed to fetch volunteer details');
            }
            const volunteerData = await volunteerResponse.json();
            return { ...hire, volunteerProfile: volunteerData };
          })
        );

        setVolunteers(volunteersWithDetails);
      } catch (error) {
        console.error('Error fetching NGO profile or volunteers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNgoProfile();
  }, [router]);

  const fetchPreviousTasks = async (volunteerId) => {
    try {
      const response = await fetch(`/api/getTasksByVolunteer?volunteerId=${volunteerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch previous tasks');
      }
      const tasks = await response.json();
      setPreviousTasks(tasks);
    } catch (error) {
      console.error('Error fetching previous tasks:', error);
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch('/api/getTasksByVolunteer', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ taskId }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete task');
        }

        const result = await response.json();
        alert(result.message);

        // Refresh the list of tasks after deletion
        fetchPreviousTasks(selectedVolunteer.volunteerId);
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      }
    }
  };

  const handleOpenVolunteerDetails = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsModalOpen(true);
    fetchPreviousTasks(volunteer.volunteerId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVolunteer(null);
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();

    if (!taskTitle || !taskDescription || !taskEndDate || !selectedVolunteer) {
      alert('Please fill in all fields');
      return;
    }

    const taskData = {
      taskTitle,
      taskDescription,
      taskEndDate,
      volunteerId: selectedVolunteer.volunteerId,
      ngoId: ngoProfile._id,
    };

    try {
      const response = await fetch('/api/createTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      alert('Task assigned successfully');
      handleCloseModal();
    } catch (error) {
      console.error('Error assigning task:', error);
      alert('Failed to assign task');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Volunteer Task Management</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div>
          <h3 className="text-2xl font-medium mb-4">Accepted Volunteers</h3>
          <ul className="space-y-4">
            {volunteers.map((volunteer) => (
              <li
                key={volunteer._id}
                className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 flex justify-between items-center"
              >
                <div>
                  <p><strong>Name:</strong> {volunteer.volunteerProfile?.name}</p>
                  <p><strong>Email:</strong> {volunteer.volunteerProfile?.email}</p>
                  <p><strong>Status:</strong> {volunteer.status}</p>
                </div>
                <button
                  onClick={() => handleOpenVolunteerDetails(volunteer)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  View & Assign Task
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal for Volunteer Details */}
      {isModalOpen && selectedVolunteer && (
        <div className="fixed pt-28 inset-0 bg-black bg-opacity-50 flex justify-center overflow-y-scroll items-center z-50">
          <div className="bg-white p-8 rounded-lg w-3/4 max-w-4xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Volunteer Details</h3>
            <p><strong>Name:</strong> {selectedVolunteer.volunteerProfile?.name}</p>
            <p><strong>Email:</strong> {selectedVolunteer.volunteerProfile?.email}</p>
            <p><strong>Status:</strong> {selectedVolunteer.status}</p>

            {/* Previous Tasks */}
            <div className="mt-6">
              <h4 className="text-xl font-medium mb-4">Previous Tasks</h4>
              {previousTasks.length > 0 ? (
                <ul>
                  {previousTasks.map((task) => (
                    <li key={task._id} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                      <p><strong>Title:</strong> {task.taskTitle}</p>
                      <p><strong>Description:</strong> {task.taskDescription}</p>
                      <p><strong>End Date:</strong> {new Date(task.taskEndDate).toLocaleDateString()}</p>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                      >
                        Delete Task
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No previous tasks found</p>
              )}
            </div>

            {/* Assign Task Form */}
            <form onSubmit={handleAssignTask} className="mt-5 space-y-2">
              <div>
                <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700">Task Title</label>
                <input
                  type="text"
                  id="taskTitle"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">Task Description</label>
                <textarea
                  id="taskDescription"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="taskEndDate" className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  id="taskEndDate"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={taskEndDate}
                  onChange={(e) => setTaskEndDate(e.target.value)}
                />
              </div>
              <div className="flex justify-end mt-4">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
                  Assign Task
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="ml-4 bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerTask;
