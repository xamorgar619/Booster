import { useEffect, useState } from "react";
import { MDBContainer } from "mdb-react-ui-kit";
import Publicacion from "../components/Publicacion";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";

function Novedades() {
  const [publicaciones, setPublicaciones] = useState([]);

  useEffect(() => {
    const obtenerPublicaciones = async () => {
      try {
        const db = getFirestore();
        const publicacionesRef = collection(db, "publicaciones");
        const q = query(publicacionesRef, orderBy("fecha", "desc"));

        const querySnapshot = await getDocs(q);
        const datos = [];

        querySnapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();
          const documento = { id, publicacionId: id, ...data };
          datos.push(documento);
        });

        setPublicaciones(datos);
      } catch (error) {
        console.error("Error al obtener las publicaciones:", error);
      }
    };

    obtenerPublicaciones();
  }, []);

  return (
    <MDBContainer className="mt-1 pt-1">
      <h2 className="text-center my-4">Novedades</h2>
      {publicaciones.map((publicacion) => (
        <Publicacion key={publicacion.id} {...publicacion} />
      ))}
    </MDBContainer>
  );
}

export default Novedades;
