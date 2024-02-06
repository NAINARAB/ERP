import React from "react";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidenav/sidebar"
import CurrentPage from '../../components/currentPage'


const TableueComp = () => {

    const tableau = `
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <title></title>
        </head>
        <body>
            <script 
                type='module' 
                src='https://prod-apnortheast-a.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js'>
            </script>
            <tableau-viz 
                id='tableau-viz' 
                src='https://prod-apnortheast-a.online.tableau.com/t/kapilansmt/views/SM-ITEMVIZDAYVIZ/Sheet1' 
                width='1920' 
                height='915' 
                hide-tabs 
                toolbar='bottom' >
            </tableau-viz>
        </body>
    </html>`
    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <Header />
                </div>
                <div className="col-md-2">
                    <Sidebar mainMenuId={'REPORTS'} subMenuId={'TABLEAU REPORTS'} childMenuId={'REPORT 1'} />
                </div>
                <div className="col-md-10 p-3">
                    
                    <CurrentPage MainMenu={'REPORTS'} SubMenu={'TABLEAU REPORTS'} />

                    <iframe title="HTML Viewer" srcDoc={tableau} style={{ height: 750, width: '100%' }} />

                </div>
            </div>
        </>
    )
}

export default TableueComp;