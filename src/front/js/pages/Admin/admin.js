// Admin.js
import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext"; // Adjusted import path

const Admin = () => {
  const { store, actions } = useContext(Context); // Make sure to include 'actions' here
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
  });


  // Ref for the AbortController
  const controllerRef = useRef(new AbortController());

  // Flag to track whether the component is mounted
  const isMounted = useRef(true);

  useEffect(() => {
    // Component mounted
    isMounted.current = true;

    return () => {
      // Component will unmount
      isMounted.current = false;

      // Cleanup function to abort the fetch when the component is unmounted
      controllerRef.current.abort();
    };
  }, []);

  // Fetch the list of administrators from the backend
  const fetchAdmins = async () => {
    try {
      const { signal } = controllerRef.current;

      const response = await fetch(process.env.BACKEND_URL + "/api/admin", { signal });
      const data = await response.json();

      // Check if the component is still mounted before updating state
      if (isMounted.current) {
        setAdmins(data);
      }
    } catch (error) {
      console.error("Error fetching administrators:", error);
    }
  };

  useEffect(() => {
    fetchAdmins();

    // Cleanup function to abort the fetch when the component is unmounted
    return () => {
      controllerRef.current.abort();
    };
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value });
  };

  // Handle form submission to add a new administrator
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(process.env.BACKEND_URL + "/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAdmin),
      });

      if (response.ok) {
        // Refresh the list of administrators after adding a new one
        fetchAdmins();
        // Clear the form inputs
        setNewAdmin({
          name: "",
          email: "",
          password: "",
        });
      } else {
        console.error("Failed to add new administrator");
      }
    } catch (error) {
      console.error("Error adding new administrator:", error);
    }
  };





  const handleDeleteAdmin = async (adminId) => {
    try {
      const result = await actions.deleteAdmin(adminId);
      if (result) {
        // Optional: Update the list of admins or handle success as needed
        fetchAdmins();
        console.log("Admin deleted successfully");
      } else {
        console.log("Failed to delete admin");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };



  return (
    <div className="text-center mt-5">
      <h1>Admin Table</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td></td>
                <td>
                  <button className="btn btn-primary">Edit</button>
                  &nbsp;|&nbsp;
                  <button className="btn btn-danger" onClick={() => handleDeleteAdmin(admin.id)}>
                Delete
              </button>
                </td>
              </tr>
            ))}
            {/* New Admin Row */}
            <tr key="new-admin-row">
              <td> New</td>
              <td>
                <input
                  type="text"
                  name="name"
                  value={newAdmin.name}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="email"
                  name="email"
                  value={newAdmin.email}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="password"
                  name="password"
                  value={newAdmin.password}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <button type="submit" className="btn btn-success" onClick={handleAddAdmin}>
                  Add Admin
                </button>
              </td>
            </tr>
          </tbody>
      </table>
    </div>
  );
};

export default Admin;
