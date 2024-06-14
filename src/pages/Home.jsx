import { Outlet } from "react-router-dom";
import Menu from "../components/Menu";

function Home() {
  return (
    <>
        <Menu />
        <div style={{ paddingTop: '80px', textAlign: 'center' }}>
          
          <Outlet />
        </div>
        <div style={{ position: 'fixed', bottom: '0', width: '100%', textAlign: 'center', backgroundColor: 'white', padding: '10px' }}>
            <p>Antonio Luis Morales García 2024©</p>
        </div>
    </>
  );
}

export default Home;
