import { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBTypography,
  MDBBtn,
  MDBSpinner,
  MDBCol,
  MDBCard,
  MDBRow,
  MDBCardBody,
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, firestore, signOutUser } from "../firebase/";
import { getFirestore, collection, query, where, getDocs, setDoc, doc} from "firebase/firestore";

function Usuario() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Pantalla de carga
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        try {
          // Consulta la colección usuarios para buscar el id del usuario autenticado y obtenemos sus datos
          const consulta = query(
            collection(firestore, "usuarios"),
            where("userId", "==", currentUser.uid)
          );
          const querySnapshot = await getDocs(consulta);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setUserData(userDoc.data());
          } else {
            console.log("El usuario no tiene datos en Firestore");
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        } finally {
          // Pantalla de carga
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        }
      } else {
        navigate("/iniciosesion");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOutUser(); // Cierra sesión
      navigate("/iniciosesion");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Para registrar el cambio de valor de los input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = async () => {
    try {
      // const userRef = doc(db, "usuarios", userData.username);
      await setDoc(doc(db, "usuarios", userData.username), {
        username: userData.username,
        email: userData.email,
        nombre: userData.nombre,
        apellido: userData.apellido,
        userId : userData.userId,
      });

    } catch (error) {
      console.error("Error al actualizar los datos del usuario:", error);
    }
  }

  // Mostrar la pantalla de carga si loading es true, de lo contrario, mostrar los datos del usuario
  let contenido;
  if (loading) {
    contenido = (
      <MDBContainer>
        <MDBSpinner grow className="text-primary" />
      </MDBContainer>
    );
  } else {
    contenido = (
      <MDBContainer>
        <MDBRow className="justify-content-center">
          <MDBCol md="6">
            <MDBCard className="p-5 rounded" style={{ backgroundColor: "#F0F0F0", border: "1px solid #CCCCCC", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
              <MDBCardBody>
                <MDBTypography tag="h5" className="mb-4 text-center text-uppercase" style={{ color: "#333333", fontSize: "1.5rem" }}>
                  Tus datos
                </MDBTypography>
                <form>
                  {userData && (
                    <>
                      <div className="mb-3 d-flex align-items-center">
                        <MDBInput 
                          label="Username" 
                          id="username" 
                          name="username" 
                          value={userData.username} 
                          onChange={handleChange}
                          style={{ backgroundColor: "#FFFFFF" }} 
                        />
                      </div>
                      <div className="mb-3 d-flex align-items-center">
                        <MDBInput 
                          label="Email" 
                          id="email" 
                          name="email" 
                          value={userData.email} 
                          onChange={handleChange}
                          style={{ backgroundColor: "#FFFFFF" }} 
                        />
                      </div>
                      <div className="mb-3 d-flex align-items-center">
                        <MDBInput 
                          label="Nombre" 
                          id="nombre" 
                          name="nombre" 
                          value={userData.nombre} 
                          onChange={handleChange}
                          style={{ backgroundColor: "#FFFFFF" }} 
                        />
                      </div>
                      <div className="mb-3 d-flex align-items-center">
                        <MDBInput 
                          label="Apellido" 
                          id="apellido" 
                          name="apellido" 
                          value={userData.apellido} 
                          onChange={handleChange}
                          style={{ backgroundColor: "#FFFFFF" }} 
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="d-grid gap-2 d-md-flex justify-content-md-between align-items-center">
                    <MDBBtn 
                      className="btn btn-outline-danger mb-2 mb-md-0" 
                      onClick={handleLogout} 
                      style={{ borderRadius: "10px", fontSize: "0.9rem", padding: "0.5rem" }}
                    >
                      Cerrar sesión <MDBIcon fas icon="sign-out-alt" className="fa-lg" />
                    </MDBBtn>
                    <MDBBtn 
                      className="btn btn-outline-primary" 
                      onClick={(e) => { e.preventDefault(); handleEdit(); }} 
                      style={{ borderRadius: "10px", fontSize: "0.9rem", padding: "0.5rem" }}
                    >
                      Guardar <MDBIcon fas icon="save" className="fa-lg" />
                    </MDBBtn>
                  </div>
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {contenido}
    </div>
  );
}

export default Usuario;
