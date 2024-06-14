import { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { getCurrentUser, firestore } from "../firebase/";
import { useNavigate } from 'react-router-dom';
import { getFirestore, getDoc, doc, query, collection, where, getDocs, orderBy } from 'firebase/firestore';
import Publicacion from '../components/Publicacion';

function Favoritos() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        try {
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
          setLoading(false);
        }
      } else {
        navigate("/iniciosesion");
      }
    };

    fetchUserData();
  }, [db, navigate]);

  useEffect(() => {
    const fetchFavoritos = async () => {
      if (userData) {
        const publicacionesGuardadas = userData.guardado || [];
        const publicacionesData = [];
        for (const guardado of publicacionesGuardadas) {
          const publicacionDocRef = doc(db, 'publicaciones', guardado.publicacionId);
          const publicacionDoc = await getDoc(publicacionDocRef);
          if (publicacionDoc.exists()) {
            publicacionesData.push({ id: publicacionDoc.id, ...publicacionDoc.data() });
          }
        }
        // Ordenar las publicaciones por fecha en orden descendente
        const publicacionesOrdenadas = publicacionesData.sort((a, b) => b.fecha - a.fecha);
        setPublicaciones(publicacionesOrdenadas);
      }
    };

    fetchFavoritos();
  }, [db, userData]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <MDBContainer className="my-3">
      <MDBRow className="justify-content-center">
        <MDBCol md="8">
          <h2 className="text-center mb-4">Publicaciones guardadas</h2>
          {publicaciones.length > 0 ? (
            publicaciones.map((publicacion) => (
              <Publicacion
                key={publicacion.id}
                username={publicacion.username}
                contenido={publicacion.contenido}
                fecha={publicacion.fecha}
                publicacionId={publicacion.id}
                audioURL={publicacion.audioURL} // Agrega la URL del audio como una propiedad
              />
            ))
          ) : (
            <div className="text-center">No tienes publicaciones guardadas.</div>
          )}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Favoritos;
