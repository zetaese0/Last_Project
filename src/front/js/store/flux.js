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
            
                    if (!resp.ok) {
                        throw new Error(`Error loading ofertas from backend. Status: ${resp.status}`);
                    }
            
                    const data = await resp.json();
                    setStore({ ofertas: data.data || [] });
                } catch (error) {
                    console.error("Error loading ofertas from backend", error);
                }
            }
        }
    };
};

export default getState;
