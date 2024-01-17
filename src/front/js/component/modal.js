// modal.js
import React, { useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalComponent = ({ show, onHide, oferta, onEdit }) => {
  const [editedOferta, setEditedOferta] = React.useState({});

  // Update the editedOferta state when the oferta prop changes
  useEffect(() => {
    setEditedOferta(oferta || {});
  }, [oferta]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedOferta((prevOferta) => ({ ...prevOferta, [name]: value }));
  };

  const handleUpdateClick = () => {
    // Call the onEdit callback with the edited oferta
    console.log("Pulsando desde el modal y su valor", editedOferta);
    onEdit(editedOferta);
    // Close the modal
    onHide();

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
            <Form.Control
              type="text"
              name="Pais"
              value={editedOferta.Pais || ""}
              onChange={handleInputChange}
            />
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
