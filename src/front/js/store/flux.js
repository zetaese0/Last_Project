const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            ofertas: [],
            // ... other store properties
        },
        actions: {
            // ... other actions

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
            
        }
    };
};

export default getState;
