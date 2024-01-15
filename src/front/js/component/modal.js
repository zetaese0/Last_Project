// EditModal.js
import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditModal = ({ show, onHide, oferta, onEdit }) => {
  const [editedOferta, setEditedOferta] = React.useState(oferta);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedOferta((prevOferta) => ({ ...prevOferta, [name]: value }));
  };

  const handleUpdateClick = () => {
    // Call the onEdit callback with the edited oferta
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
          {/* Render editable fields here */}
          <Form.Group controlId="formTipoProyecto">
            <Form.Label>Tipo Proyecto</Form.Label>
            <Form.Control
              type="text"
              name="TipoProyecto"
              value={editedOferta.TipoProyecto}
              onChange={handleInputChange}
            />
          </Form.Group>
          {/* Add similar Form.Group elements for other fields */}
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

export default EditModal;
