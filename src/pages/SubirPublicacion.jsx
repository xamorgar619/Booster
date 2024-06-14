import { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, addDoc, where, query, getDocs } from "firebase/firestore";
import { getCurrentUser } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function SubirPublicacion() {
  const [contenido, setContenido] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const currentUser = getCurrentUser();
  const userId = currentUser?.uid;

  useEffect(() => {
    const obtenerUsername = async () => {
      try {
        if (userId) {
          const db = getFirestore();
          const usuariosCollection = collection(db, 'usuarios');
          const consulta = query(usuariosCollection, where('userId', '==', userId));
          const querySnapshot = await getDocs(consulta);

          querySnapshot.forEach((doc) => {
            setUsername(doc.data().username);
          });
        }
      } catch (error) {
        console.error('Error al obtener el nombre de usuario:', error);
      }
    };

    obtenerUsername();
  }, [userId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAudioFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError("Debes iniciar sesión para publicar.");
      return;
    }

    if (!contenido) {
      setError("Introduce el contenido de la publicación.");
      return;
    }

    try {
      const db = getFirestore();
      const publicacionesCollection = collection(db, "publicaciones");

      let audioURL = null;

      // Si se selecciona un archivo de audio, subirlo a storage
      if (audioFile) {
        const storage = getStorage();
        const audioRef = ref(storage, `audio/${audioFile.name}`);
        await uploadBytes(audioRef, audioFile);
        audioURL = await getDownloadURL(audioRef);
      }

      // Agregar la publicación a Firestore
      await addDoc(publicacionesCollection, {
        contenido,
        username,
        userId,
        fecha: new Date(),
        audioURL, // Guardar la URL del archivo de audio si existe
      });

      setContenido("");
      setAudioFile(null);
      navigate("/novedades");
    } catch (error) {
      setError("Error al publicar.");
      console.error("Error al publicar", error);
    }
  };

  return (
    <MDBContainer fluid className="my-5 mt-5 pt-5">
      <MDBRow className="justify-content-center">
        <MDBCol md="6">
          <div className="bg-white p-5 rounded shadow-lg">
            <h2 className="mb-4 text-center">Subir Publicación</h2>
            <form onSubmit={handleSubmit}>
              <MDBInput
                label="Contenido"
                type="textarea"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                className="mb-4"
                rows={5}
              />
              <div>Sube tu música: </div>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="form-control mb-4"
              />
              {error && <p className="text-danger">{error}</p>}
              <div className="gap-2 text-center">
                <MDBBtn color="primary" type="submit">
                  Publicar
                </MDBBtn>
              </div>
            </form>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default SubirPublicacion;
