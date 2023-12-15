import BootstrapSidebar from "./bootSidebar";
import NavBar from "./nav";


const MainContent = ({ Component }) => {
    return (
        <>
            <div class="container-scroller">
                <NavBar />
                <div class="container-fluid page-body-wrapper">
                    <BootstrapSidebar />
                    <div class="main-panel">
                        <div class="content-wrapper">
                            <div class="page-header">
                                <h3 class="page-title">
                                    <span class="page-title-icon bg-gradient-primary text-white me-2">
                                        <i class="mdi mdi-home"></i>
                                    </span> Dashboard
                                </h3>
                            </div>
                            <Component />
                        </div>

                        <footer class="footer">
                            <div class="container-fluid d-flex justify-content-between">
                                <span class="text-muted d-block text-center text-sm-start d-sm-inline-block">Copyright © bootstrapdash.com 2021</span>
                                <span class="float-none float-sm-end mt-1 mt-sm-0 text-end"> Free <a href="https://www.bootstrapdash.com/bootstrap-admin-template/" target="_blank">Bootstrap admin template</a> from Bootstrapdash.com</span>
                            </div>
                        </footer>

                    </div>
                </div>
            </div>
        </>
    )
}

export default MainContent;