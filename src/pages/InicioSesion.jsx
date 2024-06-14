import { useState } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { Link, useNavigate } from "react-router-dom";

import { signInUser } from "../firebase"; 

function InicioSesion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInUser(email, password); 
      navigate("/novedades"); 
    } catch (error) {
      setError("Error al iniciar sesión. Por favor, verifica los datos");
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <MDBContainer className="my-5">
      <MDBRow className="justify-content-center">
        <MDBCol md="4">
          <div className="bg-light p-5 rounded shadow-lg">
            <h2 className="mb-4">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
              <MDBInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <br />
              <MDBInput
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <MDBBtn color="primary" type="submit" className="mt-3">
                Iniciar Sesión
              </MDBBtn>
            </form>
            {error && <p className="text-danger mt-3">{error}</p>}
            <p className="mt-3">
              ¿Aún no tienes cuenta? <Link to="/registro">Regístrate</Link>
            </p>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default InicioSesion;
