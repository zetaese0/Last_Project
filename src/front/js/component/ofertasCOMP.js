// Ofertas.js
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import EditModal from "../component/modal";
import { Link } from "react-router-dom";
import "../../styles/ofertas.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const Ofertas = () => {
    const { store, actions } = useContext(Context);
    const [selectedOferta, setSelectedOferta] = useState(null);
    const [editedOferta, setEditedOferta] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [newOferta, setNewOferta] = useState({
        TipoProyecto: "",
        TipoEquipo: "",
        Pais: "",
        Ciudad: "",
        FechaOferta: new Date(),
        Precio: ""
    });

    useEffect(() => {
        // Fetch ofertas when the component mounts
        actions.getOfertas();
        actions.getCountries();
    }, []);

    useEffect(() => {
        // Fetch cities based on the selected country in newOferta
        if (newOferta.Pais) {
            actions.getCities(newOferta.Pais);
        }
    }, [newOferta.Pais]);

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

    // Filter countries based on input text

    useEffect(() => {
        console.log("After Update - newOferta:", newOferta);
    }, [newOferta]);


    const handleNewOfertaInputChange = (e) => {
        if (e.target.name === "Pais") {
            const selectedCountryValue = e.target.value;
            const newCityValue = selectedCountryValue === "All" ? "" : newOferta.Ciudad;
            setNewOferta({
                ...newOferta,
                Pais: selectedCountryValue,
                Ciudad: newCityValue,
            });
        } else if (e.target.name === "Ciudad") {
            setNewOferta({
                ...newOferta,
                Ciudad: e.target.value,
            });
        } else {
            setNewOferta({
                ...newOferta,
                [e.target.name]: e.target.value,
            });
        }
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
            Ciudad: "",
            FechaOferta: "",
            Precio: ""
        });

        // Reset selectedCountry to an empty string
        setSelectedCountry("");
    };

    const handleCityInputChange = (e) => {
        setSelectedCity(e.target.value);
        setShowCityDropdown(e.target.value.trim() !== '');
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
                        <th>Ciudad</th>
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
                            <td>{oferta.Ciudad}</td>
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
                            <div className="country-input">
                                <input
                                    type="text"
                                    list="countryList"
                                    placeholder="Search or Select Country"
                                    value={newOferta.Pais}  /* Change here */
                                    onChange={(e) => {
                                        setNewOferta({
                                            ...newOferta,
                                            Pais: e.target.value,
                                            Ciudad: "",  // Clear the city when the country changes
                                        });
                                        setShowDropdown(e.target.value.trim() !== ''); // Show the dropdown when typing
                                    }}
                                    onClick={() => {
                                        setShowDropdown(false); // Show dropdown only if there are multiple options
                                    }}
                                />
                                <datalist id="countryList">
                                    {store.countries &&
                                        store.countries
                                            .filter((country) =>
                                                country.toLowerCase().startsWith(newOferta.Pais.toLowerCase())  /* Change here */
                                            )
                                            .map((filteredCountry, index) => (
                                                <option key={index} value={filteredCountry} />
                                            ))}
                                </datalist>
                            </div>
                        </td>

                        <td>
                            <div className="city-input">
                            <input
                                type="text"
                                list="cityList"
                                placeholder="Search or Select City"
                                value={newOferta.Ciudad}
                                onChange={(e) => {
                                    setNewOferta({
                                        ...newOferta,
                                        Ciudad: e.target.value,
                                    });
                                    setShowCityDropdown(e.target.value.trim() !== ''); // Show the city dropdown when typing
                                }}
                                disabled={!newOferta.Pais}
                            />
                                    <datalist id="cityList">
                                        {store.cities &&
                                            store.cities
                                                .filter((city) =>
                                                    city.toLowerCase().startsWith(newOferta.Ciudad.toLowerCase())
                                                )
                                                .map((filteredCity, index) => (
                                                    <option key={index} value={filteredCity} />
                                                ))}
                                    </datalist>

                            </div>
                        </td>


                                <td>
                                    <DatePicker
                                        selected={newOferta.FechaOferta}
                                        onChange={(date) => setNewOferta({ ...newOferta, FechaOferta: date })}
                                        showTimeInput
                                        dateFormat="yyyy-MM-dd HH:mm"
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
                fetchCountries={actions.getCountries} // Pass the fetchCountries action
                fetchCities={actions.getCities} // Pass the fetchCities action
                countries={store.countries} // Pass the countries from the store
                cities={store.cities} // Pass the cities from the store
            />
        </div>
    );
};

export default Ofertas;
