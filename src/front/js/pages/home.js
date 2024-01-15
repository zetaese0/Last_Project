import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const Home = () => {
    const { store, actions } = useContext(Context);
    const [selectedOferta, setSelectedOferta] = useState(null);
    const [editedOferta, setEditedOferta] = useState(null);

    useEffect(() => {
        // Fetch ofertas when the component mounts
        actions.getOfertas();
    }, []);

    const handleEditClick = (oferta) => {
        console.log("Editing oferta:", oferta);
        // Set the selectedOferta and create a copy for editing
        setSelectedOferta(oferta);
        setEditedOferta({ ...oferta });
    };

    const handleUpdateClick = () => {
        // Call the update action with the edited oferta
        console.log("Updating oferta:", editedOferta);
        actions.updateOferta(editedOferta);
        // Clear the selectedOferta and editedOferta states
        setSelectedOferta(null);
        setEditedOferta(null);
    };

    const handleInputChange = (e) => {
        // Update the corresponding property in the editedOferta state
        setEditedOferta({
            ...editedOferta,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="text-center mt-5">
            <h1>Ofertas Table</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tipo Proyecto</th>
                        <th>Tipo Equipo</th>
                        <th>Pais</th>
                        <th>Fecha Oferta</th>
                        <th>Precio</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {store.ofertas.map((oferta) => (
                        <tr key={oferta.id}>
                            <td>{oferta.id}</td>
                            <td>{oferta.TipoProyecto}</td>
                            <td>{oferta.TipoEquipo}</td>
                            <td>{oferta.Pais}</td>
                            <td>{oferta.FechaOferta}</td>
                            <td>{oferta.Precio}</td>
                            <td>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleEditClick(oferta)}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Render a modal or a form for editing */}
            {selectedOferta && (
                <div className="modal">
                    {/* Add your editing form or modal here */}
                    <h2>Edit Oferta</h2>
                    <p>ID: {selectedOferta.id}</p>
                    <label>
                        Tipo Proyecto:
                        <input
                            type="text"
                            name="TipoProyecto"
                            value={editedOferta.TipoProyecto}
                            onChange={handleInputChange}
                        />
                    </label>
                    {/* Add input fields for other properties */}
                    <button onClick={handleUpdateClick}>Update</button>
                    <button onClick={() => setSelectedOferta(null)}>Close</button>
                </div>
            )}
        </div>
    );
};
