import { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle,
   MDBCardText, MDBIcon, MDBInput, MDBBtn, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from 'mdb-react-ui-kit';
import { getCurrentUser, firestore } from "../firebase/";
import { useNavigate } from 'react-router-dom';
import { arrayUnion, updateDoc, doc, getFirestore, getDoc, arrayRemove, query, collection, where, getDocs, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Publicacion({ username, contenido, fecha, publicacionId, audioURL }) {
  const [guardado, setGuardado] = useState(false);
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comentarios, setComentarios] = useState([]);
  const [comentario, setComentario] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fechaFormateada = new Date(fecha.seconds * 1000).toLocaleString();
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
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        }
      } else {
        navigate("/iniciosesion");
      }
    };

    fetchUserData();
  }, [db, navigate]);

  useEffect(() => {
    const isGuardada = async () => {
      try {
        const usuarioDocRef = doc(db, 'usuarios', userData.username);
        const usuarioDoc = await getDoc(usuarioDocRef);
        const publicacionesGuardadas = usuarioDoc.data().guardado;
        if (publicacionesGuardadas) {
          const publicacionGuardada = publicacionesGuardadas.find(
            (publicacion) => publicacion.publicacionId === publicacionId
          );
          if (publicacionGuardada) {
            setGuardado(true);
          }
        }
      } catch (error) {
        console.log('Error al obtener las publicaciones guardadas.');
      }
    };

    const isLike = async () => {
      try {
        const publicacionDocRef = doc(db, 'publicaciones', publicacionId);
        const publicacionDocSnap = await getDoc(publicacionDocRef);
        if (publicacionDocSnap.exists()) {
          const publicacionData = publicacionDocSnap.data();
          const likes = publicacionData.likes;
          setLikeCount(likes ? likes.length : 0);
          if (likes && likes.length > 0) {
            const meGusta = likes.some(
              like => like.username === userData.username
            );
            setLike(meGusta);
          }
          setComentarios(publicacionData.comentarios || []);
        }
      } catch (error) {
        console.log('Error al obtener los likes:', error);
      }
    };

    if (userData) {
      isGuardada();
      isLike();
    }
  }, [db, userData, publicacionId]);

  const handleGuardar = async () => {
    try {
      const usuarioDocRef = doc(db, 'usuarios', userData.username);
      await updateDoc(usuarioDocRef, {
        guardado: arrayUnion({
          publicacionId,
        }),
      });
      setGuardado(true);
      toast.success('Publicación guardada');
    } catch (error) {
      toast.error('Error al guardar la publicación.');
    }
  };

  const handleEliminarGuardado = async () => {
    try {
      const usuarioDocRef = doc(db, 'usuarios', userData.username);
      await updateDoc(usuarioDocRef, {
        guardado: arrayRemove({
          publicacionId,
        }),
      });
      setGuardado(false);
      toast.info('Publicación eliminada de guardados');
    } catch (error) {
      toast.error('Error al eliminar la publicación.');
    }
  };

  const handleLike = async () => {
    try {
      const publicacionDocRef = doc(db, 'publicaciones', publicacionId);
      await updateDoc(publicacionDocRef, {
        likes: arrayUnion({
          username: userData.username,
        }),
      });
      setLike(true);
      setLikeCount(likeCount + 1);
      toast.success('Te gusta');
    } catch (error) {
      toast.error('Error al dar me gusta: ' + error);
    }
  };

  const handleDislike = async () => {
    try {
      const publicacionDocRef = doc(db, 'publicaciones', publicacionId);
      await updateDoc(publicacionDocRef, {
        likes: arrayRemove({
          username: userData.username,
        }),
      });
      setLike(false);
      setLikeCount(likeCount - 1);
      toast.info('No te gusta');
    } catch (error) {
      toast.error('Error al eliminar me gusta');
    }
  };

  const handleEliminarPublicacion = async () => {
    try {
      if (userData.username === username) {
        const publicacionDocRef = doc(db, 'publicaciones', publicacionId);
        await deleteDoc(publicacionDocRef);
        toast.success('Publicación eliminada');
      } else {
        toast.error('No puedes eliminar publicaciones de otros usuarios');
      }
    } catch (error) {
      toast.error('Error al eliminar la publicación');
    }
  };

  const handleComentar = async () => {
    if (comentario.trim() === "") return;

    try {
      const publicacionDocRef = doc(db, 'publicaciones', publicacionId);
      await updateDoc(publicacionDocRef, {
        comentarios: arrayUnion({
          username: userData.username,
          comentario: comentario.trim(),
          fecha: new Date(),
        }),
      });
      setComentarios(prevComentarios => [...prevComentarios, {
        username: userData.username,
        comentario: comentario.trim(),
        fecha: new Date(),
      }]);
      setComentario("");
      toast.success('Comentario agregado');
    } catch (error) {
      toast.error('Error al agregar comentario: ' + error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <MDBContainer className="my-3">
      <MDBRow className="justify-content-center">
        <MDBCol md="8">
          <MDBCard className="p-3 rounded shadow-lg" style={{ backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}>
            <MDBCardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <MDBCardTitle className="fw-bold fs-5">{username}</MDBCardTitle>
                {userData && userData.username === username && (
                  <MDBDropdown style={{cursor: 'pointer'}} isOpen={dropdownOpen} toggle={toggleDropdown}>
                    <MDBDropdownToggle tag="div" className="p-0" onClick={toggleDropdown}>
                      <MDBIcon fas icon="ellipsis-v" size="lg" style={{ cursor: 'pointer', color: '#333' }} />
                    </MDBDropdownToggle>
                    <MDBDropdownMenu>
                      <MDBDropdownItem style={{cursor: 'pointer'}} onClick={handleEliminarPublicacion}>
                        <MDBIcon fas icon="trash-alt" className="me-2" />
                        Eliminar
                      </MDBDropdownItem>
                    </MDBDropdownMenu>
                  </MDBDropdown>
                )}
              </div>
              <MDBCardText className="fs-6">{contenido}</MDBCardText>
              {audioURL && (
                <audio controls className="my-3">
                  <source src={audioURL} type="audio/mpeg" />
                  Tu navegador no soporta archivos de audio.
                </audio>
              )}
              <hr className="my-3" />
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted fs-7">{fechaFormateada}</small>
                <div>
                  {like ? (
                    <MDBIcon
                      fas
                      icon="heart"
                      title="No me gusta"
                      onClick={handleDislike}
                      className="me-2"
                      style={{ cursor: 'pointer', color: '#dc3545', fontSize: '1.2rem' }}
                    />
                  ) : (
                    <MDBIcon
                      far
                      icon="heart"
                      title="Me gusta"
                      onClick={handleLike}
                      className="me-2"
                      style={{ cursor: 'pointer', color: '#dc3545', fontSize: '1.2rem' }}
                    />
                  )}
                  <span className="me-2 fs-6">{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
                  {guardado ? (
                    <MDBIcon
                      fas
                      icon="save"
                      title="Eliminar de guardados"
                      onClick={handleEliminarGuardado}
                      className="me-2"
                      style={{ cursor: 'pointer', color: '#ffc107', fontSize: '1.2rem' }}
                    />
                  ) : (
                    <MDBIcon
                      far
                      icon="save"
                      title="Guardar"
                      onClick={handleGuardar}
                      className="me-2"
                      style={{ cursor: 'pointer', color: '#ffc107', fontSize: '1.2rem' }}
                    />
                  )}
                </div>
              </div>
              <hr className="my-3" />
              <div className="mt-3 d-flex align-items-center">
                <MDBInput 
                  label="Añade un comentario" 
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)} 
                  textarea 
                  rows="2" 
                  className="me-2"
                  style={{ fontSize: '1rem', width: '70%' }}
                />
                <MDBIcon icon="paper-plane" className="ms-2" onClick={handleComentar} style={{ cursor: 'pointer', color: '#3373CE', fontSize: '1.2rem' }} />
              </div>
              <hr className="my-3" />
              <div className="mt-3" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                {comentarios.map((coment, index) => (
                  <div key={index} className="mb-2 p-2 rounded" style={{ backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}>
                    <p className="mb-1 fs-6">{coment.comentario}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted fs-6">{coment.username}</small>
                      <small className="text-muted fs-6">{new Date(coment.fecha.seconds * 1000).toLocaleString()}</small>
                    </div>
                  </div>
                ))}
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
  

  
  
}

export default Publicacion;
