const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            ofertas: [],
            
            // ... other store properties
        },
        actions: {
            // ... other actions


            checkForToken: () => {
              const storedToken = localStorage.getItem("token");
              if (storedToken) {
                  setStore({ token: storedToken });
                  getActions().getUserProfile();
              }
          },


            getIsLogin: () => {
                return getStore();
              },
        
              resetLocalStorage: () => {
                const store = getStore();
                localStorage.removeItem("token");
                setStore({ ...store, token: null, profile: null });
              },
              loginUser: async ({ email, password }) => {
                try {
                  // fetching data from the backend
                  const resp = await fetch(process.env.BACKEND_URL + "/api/token", {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ email, password }),
                  });
              
                  const data = await resp.json();
              
                  if (data.authorize) {
                      // Login successful, handle hashed and plaintext passwords
                      setStore({ token: data.token });
                      localStorage.setItem("token", data.token);
                      getActions().getUserProfile();
                      return true;
                  } else {
                      // Handle login failure
                      console.log("Invalid credentials");
                      return false;
                  }
              } catch (error) {
                  console.log("Error loading message from backend", error);
                  console.error(error); // Log the full error object
                  return false;
              }
            },
              getUserProfile: async () => {
                const store = getStore();
                console.log(store.token);
                try {
                  const resp = await fetch(
                    process.env.BACKEND_URL + "/api/profile/user",
                    {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + store.token,
                      },
                    }
                  );
                  if (resp.status == 200) {
                    const data = await resp.json();
                    setStore({ profile: data });
                    return true;
                  }
                  console.log("expired");
                  return false;
                } catch (error) {
                  console.log("Error loading message from backend", error);
                  return false;
                }
              },
              createUser: async (user) => {
                try {
                  const resp = await fetch(process.env.BACKEND_URL + "/api/register", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(user),
                  });
                  const data = await resp.json();
                  return true;
                } catch (error) {
                  console.log("Error sending customer to back backend", error);
                }
              },

              logOut: () => {
                localStorage.removeItem("token");
                setStore({ token: null, profile: null });
              },


            getOfertas: async () => {
                const store = getStore();

                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/ofertas", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + store.token,
                        },
                    });

                    const data = await resp.json();
                    setStore({ ofertas: data.data || [] }); // Assuming the data is structured with a "data" property
                } catch (error) {
                    console.error("Error loading ofertas from backend", error);
                }
            },

            updateOferta: async (editedOferta, callback) => {
                try {
                    console.log("desde API")
                    
                    const store = getStore();  // Retrieve the store
                    console.log(store)

                    // Make a PUT request to update the oferta
                    const resp = await fetch(`${process.env.BACKEND_URL}/ofertas/${editedOferta.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + (store.token || ""),  // Ensure token is available
                        },
                        body: JSON.stringify(editedOferta),
                    });
            
                    const data = await resp.json();
                    console.log("Response from updateOferta:", data);
                    // You might want to handle the response or update the store accordingly
                    getActions().getOfertas();  // Optionally, refresh the ofertas list after updating
            
                    // Call the callback function to clear the state
                    callback();
                } catch (error) {
                    console.error("Error updating oferta", error);
                }
                console.log("Oferta updated:", editedOferta);
            },
            

            addNewOferta: async (newOferta) => {
                try {
                    const store = getStore();  // Retrieve the store

                    // Make a POST request to add a new oferta
                    const resp = await fetch(process.env.BACKEND_URL + "/ofertas", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + (store.token || ""),  // Ensure token is available
                        },
                        body: JSON.stringify(newOferta),
                    });

                    const data = await resp.json();
                    console.log("Response from addNewOferta:", data);
                    // You might want to handle the response or update the store accordingly
                } catch (error) {
                    console.error("Error adding new oferta", error);
                }
                console.log("New oferta added:", newOferta);
                getActions().getOfertas();
            },

            deleteOferta: async (ofertaId) => {
                try {

                    const store = getStore();

                    // Make a DELETE request to delete the oferta
                    const resp = await fetch(`${process.env.BACKEND_URL}/ofertas/${ofertaId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + store.token,
                        },
                    });
            
                    const data = await resp.json();
                    console.log('Oferta eliminada:', data);
                    getActions().getOfertas();

                } catch (error) {
                    console.error('Error deleting oferta', error);
                }
            },
            
            
            // PARTE ADMIN

            checkForTokenAdmin: () => {
              const storedTokenAdmin = localStorage.getItem("tokenAdmin");
              if (storedTokenAdmin) {
                  setStore({ tokenAdmin: storedTokenAdmin });
                  getActions().getAdminProfile();
              }
          },
      
          loginAdmin: async ({ email, password }) => {
            try {
                // fetching data from the backend
                const resp = await fetch(process.env.BACKEND_URL + "/api/admin/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });
            
                const data = await resp.json();
            
                if (data.authorize) {
                    // Login successful, handle hashed and plaintext passwords
                    setStore({ tokenAdmin: data.tokenAdmin });
                    localStorage.setItem("tokenAdmin", data.tokenAdmin); // Ensure that the tokenAdmin is stored in localStorage
                    getActions().getAdminProfile();
                    return true;
                } else {
                    // Handle login failure
                    console.log("Invalid credentials");
                    return false;
                }
            } catch (error) {
                console.log("Error loading message from backend", error);
                console.error(error); // Log the full error object
                return false;
            }
        },
      
          getAdminProfile: async () => {
              const store = getStore();
              try {
                  const resp = await fetch(
                      process.env.BACKEND_URL + "/api/admin/profile/user",
                      {
                          method: "GET",
                          headers: {
                              "Content-Type": "application/json",
                              Authorization: "Bearer " + store.tokenAdmin,
                          },
                      }
                  );
                  if (resp.status === 200) {
                      const data = await resp.json();
                      setStore({ profile: data });
                      return true;
                  }
                  console.log("expired");
                  return false;
              } catch (error) {
                  console.log("Error loading message from backend", error);
                  return false;
              }
          },
      
          createAdmin: async (user) => {
              try {
                  const resp = await fetch(process.env.BACKEND_URL + "/api/admin/register", {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify(user),
                  });
                  const data = await resp.json();
                  return true;
              } catch (error) {
                  console.log("Error sending customer to back backend", error);
              }
          },

        // New function to delete an admin
        deleteAdmin: async (adminId) => {
            try {
            const resp = await fetch(`${process.env.BACKEND_URL}/api/admin/${adminId}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + getStore().tokenAdmin,
                },
            });

            if (resp.ok) {
                // Admin deletion successful
                console.log("Admin deleted successfully");
                // Optionally, you can call another action to refresh the list of admins or update the state as needed.
                // Example: actions.getAdmins();
                return true;
            } else {
                // Handle admin deletion failure
                console.log("Failed to delete admin");
                return false;
            }
            } catch (error) {
            console.error("Error deleting admin:", error);
            return false;
            }
        },
        







        }
    };
};

export default getState;
