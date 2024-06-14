import { useState } from 'react';
import { MDBContainer, MDBNavbar, MDBNavbarBrand, MDBNavbarToggler, MDBIcon, MDBNavbarNav, MDBNavbarItem, MDBCollapse, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

function Menu() {
    const [openNavCentred, setOpenNavCentred] = useState(false);

    return (
        <div className='fixed-top'>
            <MDBNavbar expand='lg' light bgColor='light' className='py-2 shadow-sm'>
                <MDBContainer fluid className="d-flex justify-content-between align-items-center">
                    <MDBNavbarBrand>
                        <Link to="/">
                            <img src={logo} alt="Logo" style={{ height: '50px' }} />
                        </Link>
                    </MDBNavbarBrand>
                    <MDBNavbarToggler
                        type='button'
                        data-target='#navbarCenteredExample'
                        aria-controls='navbarCenteredExample'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                        onClick={() => setOpenNavCentred(!openNavCentred)}
                    >
                        <MDBIcon icon='bars' fas />
                    </MDBNavbarToggler>

                    <MDBCollapse navbar open={openNavCentred} center id='navbarCenteredExample'>
                        <MDBNavbarNav fullWidth={false}>
                            {/* <MDBNavbarItem>
                                <Link to="/" className="nav-link">
                                    Inicio
                                </Link>
                            </MDBNavbarItem> */}
                            <MDBNavbarItem>
                                <Link to="/novedades" className="nav-link">
                                    Novedades
                                </Link>
                            </MDBNavbarItem>
                            {/* <MDBNavbarItem>
                                <Link to="/informacion" className="nav-link">
                                    Información
                                </Link>
                            </MDBNavbarItem> */}
                        </MDBNavbarNav>
                    </MDBCollapse>

                    <Link to ="/subirpublicacion">
                        <MDBIcon fas icon="cloud-upload-alt" title="Subir" color="dark" className="me-3 fa-2x" />
                    </Link>
                    
                    <MDBDropdown className='mx-2'>
                        <MDBDropdownToggle style={{ cursor: 'pointer' }} tag="a" color="none">
                            <MDBIcon fas icon="user-cog" color="dark" className="fa-2x"/>
                        </MDBDropdownToggle>
                        <MDBDropdownMenu className="dropdown-menu-end" responsive="lg-start">
                            <MDBDropdownItem>
                                <Link to="/usuario" className="dropdown-item">
                                    Perfil
                                </Link>
                            </MDBDropdownItem>
                            <MDBDropdownItem>
                                <Link to="/mispublicaciones" className="dropdown-item">
                                    Mis publicaciones
                                </Link>
                            </MDBDropdownItem>
                            <MDBDropdownItem>
                                <Link to="/favoritos" className="dropdown-item">
                                    Guardado
                                </Link>
                            </MDBDropdownItem>
                            
                        </MDBDropdownMenu>
                    </MDBDropdown>
                    
                </MDBContainer>
            </MDBNavbar>
        </div>
    );
}

export default Menu;
