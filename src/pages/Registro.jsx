import { useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";

import { createUser } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc } from "firebase/firestore";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !nombre || !apellido || !username) {
      setError("Introduce todos los campos");
      return;
    }

    try {
      // Crear un nuevo usuario en Firebase auth
      let registerResponse = await createUser(
        email,
        password,
      );

      // Guardar los datos del usuario en la colección de usuarios
      const db = getFirestore();
      // const usuariosCollection = collection(db, "usuarios");
      await setDoc(doc(db, "usuarios", username), {
        userId: registerResponse.user.uid, 
        email,
        nombre,
        apellido,
        username,
      });

      // Limpiar los campos del formulario
      setEmail("");
      setPassword("");
      setNombre("");
      setApellido("");
      setUsername("");

      navigate("/usuario");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <MDBContainer className="my-5">
      <MDBRow className="justify-content-center">
        <MDBCol md="4">
          <div className="bg-light p-5 rounded shadow-lg">
            <h2 className="mb-4">Registro</h2>
            <form onSubmit={handleSubmit}>
              <MDBInput
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <br />
              <MDBInput
                label="Nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <br />
              <MDBInput
                label="Apellido"
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
              <br />
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
                Registrarse
              </MDBBtn>
            </form>
            {error && <p className="text-danger mt-3">{error}</p>}
            <p className="mt-3">
              ¿Ya tienes una cuenta? <a href="/inicioSesion">Inicia sesión</a>
            </p>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Registro;
