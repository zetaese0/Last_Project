import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import EditModal from "../component/modal";
import { Link } from "react-router-dom";


export const Home = () => {
    const { store, actions } = useContext(Context);
    const [selectedOferta, setSelectedOferta] = useState(null);
    const [editedOferta, setEditedOferta] = useState(null);
    const [newOferta, setNewOferta] = useState({
        TipoProyecto: "",
        TipoEquipo: "",
        Pais: "",
        FechaOferta: "",
        Precio: ""
    });

    useEffect(() => {
        // Fetch ofertas when the component mounts
        actions.getOfertas();
    }, []);

    const handleEditClick = (oferta) => {
        console.log("Editing oferta PULSANDO EN FRONT ANTES MODAL:", oferta);
        // Set the selectedOferta and create a copy for editing
        setSelectedOferta(oferta);
        setEditedOferta({ ...oferta });
    };
    const handleUpdateClick = (updatedOferta) => {
        console.log("Updated oferta received in home.js:", updatedOferta);
        // Your logic to update the state or perform further actions
        // For example, you can call the updateOferta action here:
        actions.updateOferta(updatedOferta);

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

    const handleNewOfertaInputChange = (e) => {
        // Update the corresponding property in the newOferta state
        setNewOferta({
            ...newOferta,
            [e.target.name]: e.target.value
        });
    };

    const handleAddNewOferta = () => {
        // Call the add new oferta action with the newOferta
        console.log("Adding new oferta:", newOferta);
        actions.addNewOferta(newOferta);
        // Clear the newOferta state
        setNewOferta({
            TipoProyecto: "",
            TipoEquipo: "",
            Pais: "",
            FechaOferta: "",
            Precio: ""
        });
    };

    const handleDeleteClick = (ofertaId) => {
        // Call the delete action with the oferta ID
        actions.deleteOferta(ofertaId);
    };

    return (
        <div className="text-center mt-5">
            <h1>Ofertas Table</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Link</th>
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
                            <td>
                                <Link to={`/oferta/${oferta.id}`}>View Details</Link>
                            </td>
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
                                &nbsp;|&nbsp;
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteClick(oferta.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {/* New Record Row */}
                    <tr>
                        <td></td>
                        <td>New</td>
                        <td>
                            <input
                                type="text"
                                name="TipoProyecto"
                                value={newOferta.TipoProyecto}
                                onChange={handleNewOfertaInputChange}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="TipoEquipo"
                                value={newOferta.TipoEquipo}
                                onChange={handleNewOfertaInputChange}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="Pais"
                                value={newOferta.Pais}
                                onChange={handleNewOfertaInputChange}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="FechaOferta"
                                value={newOferta.FechaOferta}
                                onChange={handleNewOfertaInputChange}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="Precio"
                                value={newOferta.Precio}
                                onChange={handleNewOfertaInputChange}
                            />
                        </td>
                        <td>
                            <button
                                className="btn btn-success"
                                onClick={handleAddNewOferta}
                            >
                                Add
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Render the EditModal */}
            <EditModal
                show={!!selectedOferta}
                onHide={() => setSelectedOferta(null)}
                oferta={selectedOferta}
                onEdit={handleUpdateClick}
            />
        </div>
    );
};
