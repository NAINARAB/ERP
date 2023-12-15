const NavBar = () => {
    return (
        <>
            <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
                <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
                    <a className="navbar-brand brand-logo" href="index.html"><img src="assets/images/logo.svg" alt="logo" /></a>
                    <a className="navbar-brand brand-logo-mini" href="index.html"><img src="assets/images/logo-mini.svg" alt="logo" /></a>
                </div>
                <div className="navbar-menu-wrapper d-flex align-items-stretch">

                    <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
                        <span className="mdi mdi-menu"></span>
                    </button>
                    <h2 className="mt-3">ERP</h2>
                    <ul className="navbar-nav navbar-nav-right">
                        <li className="nav-item d-none d-lg-block full-screen-link">
                            <a className="nav-link">
                                <i className="mdi mdi-fullscreen" id="fullscreen-button"></i>
                            </a>
                        </li>
                        <li className="nav-item nav-logout d-none d-lg-block">
                            <a className="nav-link" href="#">
                                <i className="mdi mdi-power"></i>
                            </a>
                        </li>
                        <li className="nav-item nav-settings d-none d-lg-block">
                            <a className="nav-link" href="#">
                                <i className="mdi mdi-format-line-spacing"></i>
                            </a>
                        </li>
                    </ul>
                    <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
                        <span className="mdi mdi-menu"></span>
                    </button>
                </div>
            </nav>
        </>
    )
}

export default NavBar;