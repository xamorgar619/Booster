import { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBIcon } from 'mdb-react-ui-kit';
import { getCurrentUser, firestore } from '../firebase/';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MisPublicaciones() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        try {
          const consulta = query(
            collection(firestore, 'usuarios'),
            where('userId', '==', currentUser.uid)
          );
          const querySnapshot = await getDocs(consulta);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setUserData(userDoc.data());
            fetchPublicaciones(userDoc.data().username);
          } else {
            console.log('El usuario no tiene datos en Firestore');
          }
        } catch (error) {
          console.error('Error al obtener los datos del usuario:', error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/iniciosesion');
      }
    };

    const fetchPublicaciones = async (username) => {
      try {
        const publicacionesQuery = query(
          collection(firestore, 'publicaciones'),
          where('username', '==', username)
        );
        const querySnapshot = await getDocs(publicacionesQuery);
        const userPublicaciones = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setPublicaciones(userPublicaciones);
      } catch (error) {
        console.error('Error al obtener las publicaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [db, navigate]);

  const handleEliminarPublicacion = async (publicacionId) => {
    try {
      const publicacionDocRef = doc(db, 'publicaciones', publicacionId);
      await deleteDoc(publicacionDocRef);
      setPublicaciones(publicaciones.filter(pub => pub.id !== publicacionId));
      toast.success('Publicación eliminada');
    } catch (error) {
      toast.error('Error al eliminar la publicación');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MDBContainer fluid className="my-3 mt-5 pt-5">
      <MDBRow className="g-4">
        {publicaciones.length === 0 ? (
          <div className="text-center">No tienes publicaciones.</div>
        ) : (
          publicaciones.map(({ id, username, contenido, fecha, audioURL }) => (
            <MDBCol key={id} lg="4" md="6" sm="12" className="mb-4">
              <MDBCard style={{ backgroundColor: '#EEEEEE', border: '1px solid #9E9E9E', position: 'relative' }}>
                <MDBCardBody>
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <MDBIcon
                      fas
                      icon="trash-alt"
                      color="danger"
                      className="fa-lg"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEliminarPublicacion(id)}
                    ></MDBIcon>
                  </div>
                  <MDBCardTitle className="fw-bold">{username}</MDBCardTitle>
                  <MDBCardText>{contenido}</MDBCardText>
                  {audioURL && (
                    <audio controls>
                      <source src={audioURL} type="audio/mpeg" />
                      Tu navegador no soporta archivos de audio.
                    </audio>
                  )}
                  <hr className="my-3" />
                  <small className="text-muted">{new Date(fecha.seconds * 1000).toLocaleString()}</small>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))
        )}
      </MDBRow>
    </MDBContainer>
  );
}

export default MisPublicaciones;
