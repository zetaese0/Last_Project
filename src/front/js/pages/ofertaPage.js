// OfertaPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card } from "react-bootstrap"; // Assuming you have Bootstrap installed


const OfertaPage = () => {
  const { ofertaId } = useParams();
  const [oferta, setOferta] = useState(null);

  useEffect(() => {
    // Fetch oferta details based on ofertaId
    const fetchOfertaDetails = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/ofertas/${ofertaId}`);
        const data = await response.json();

        // Assuming the response structure has a 'data' property
        setOferta(data.data);
      } catch (error) {
        console.error("Error fetching oferta details", error);
      }
    };

    fetchOfertaDetails();
  }, [ofertaId]);

  // Render loading state while fetching data
  if (!oferta) {
    return (
      <Container className="mt-5">
        <p>Loading oferta details...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Oferta Details</h2>
      <Card>
        <Card.Body>
          <Card.Title>{oferta.TipoProyecto}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">ID: {oferta.id}</Card.Subtitle>
          <Card.Text>
            <strong>Tipo Equipo:</strong> {oferta.TipoEquipo}
          </Card.Text>
          <Card.Text>
            <strong>Pais:</strong> {oferta.Pais}
          </Card.Text>
          <Card.Text>
            <strong>Fecha Oferta:</strong> {oferta.FechaOferta}
          </Card.Text>
          <Card.Text>
            <strong>Precio:</strong> {oferta.Precio}
          </Card.Text>
          {/* Add more fields as needed */}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OfertaPage;
