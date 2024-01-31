// modal.js
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalComponent = ({ show, onHide, oferta, onEdit, fetchCountries, fetchCities, countries, cities }) => {
  const [editedOferta, setEditedOferta] = useState({});

  useEffect(() => {
    setEditedOferta(oferta || {});
  }, [oferta]);

  useEffect(() => {
    // Fetch countries when the component mounts
    fetchCountries();
  }, [fetchCountries]);

  useEffect(() => {
    // Fetch cities based on the selected country
    if (editedOferta.Pais) {
      fetchCities(editedOferta.Pais);
    }
  }, [editedOferta.Pais, fetchCities]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedOferta((prevOferta) => ({ ...prevOferta, [name]: value }));
  };

  const handleUpdateClick = () => {
    onEdit(editedOferta);
    onHide();
  };

  const handleCountryInputChange = (e) => {
    const countryInput = e.target.value;
    setEditedOferta({
      ...editedOferta,
      Pais: countryInput,
      Ciudad: "", // Clear the city when the country changes
    });
    fetchCities(countryInput);
  };

  const handleCityInputChange = (e) => {
    setEditedOferta({
      ...editedOferta,
      Ciudad: e.target.value,
    });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Oferta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
        <Form.Group controlId="formTipoProyecto">
            <Form.Label>Tipo Proyecto</Form.Label>
            <Form.Control
              type="text"
              name="TipoProyecto"
              value={editedOferta.TipoProyecto || ""}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formTipoEquipo">
            <Form.Label>Tipo Equipo</Form.Label>
            <Form.Control
              type="text"
              name="TipoEquipo"
              value={editedOferta.TipoEquipo || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formPais">
            <Form.Label>Pais</Form.Label>
            <div className="country-input">
              <input
                type="text"
                list="countryListModal"
                placeholder="Search or Select Country"
                value={editedOferta.Pais || ""}
                onChange={handleCountryInputChange}
              />
              <datalist id="countryListModal">
                {countries &&
                  countries
                    .filter((country) => country && country.toLowerCase().startsWith((editedOferta.Pais || "").toLowerCase()))
                    .map((filteredCountry, index) => (
                      <option key={index} value={filteredCountry} />
                    ))}
              </datalist>
            </div>
          </Form.Group>

          <Form.Group controlId="formCiudad">
            <Form.Label>Ciudad</Form.Label>
            <div className="city-input">
              <input
                type="text"
                list="cityListModal"
                placeholder="Search or Select City"
                value={editedOferta.Ciudad || ""}
                onChange={handleCityInputChange}
              />
              <datalist id="cityListModal">
                {cities &&
                  cities
                    .filter((city) => city && city.toLowerCase().startsWith((editedOferta.Ciudad || "").toLowerCase()))
                    .map((filteredCity, index) => (
                      <option key={index} value={filteredCity} />
                    ))}
              </datalist>
            </div>
          </Form.Group>
          <Form.Group controlId="formFechaOferta">
            <Form.Label>Fecha Oferta</Form.Label>
            <Form.Control
              type="text"
              name="FechaOferta"
              value={editedOferta.FechaOferta || ""}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formPrecio">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="text"
              name="Precio"
              value={editedOferta.Precio || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpdateClick}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
