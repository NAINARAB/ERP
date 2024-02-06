import { NavigateNext } from '@mui/icons-material';


const CurrentPage = ({ MainMenu, SubMenu, ChildMenu, Button }) => {
    return (
        <div
            className="text-uppercase fw-bold mb-3 shadow-sm p-2 rounded-2 d-flex align-items-center justify-content-between"
            style={{ color: 'rgb(15, 11, 42)', fontSize: '11px', backgroundColor: '#f2f2f2' }}
        >
            <div>
                {MainMenu && (
                    <span
                        className="mx-2"
                        style={!SubMenu ? { fontSize: '13px' } : { fontSize: '11px' }}
                    >
                        {MainMenu}
                    </span>
                )}

                {SubMenu && (
                    <>
                        <NavigateNext sx={{ fontSize: '20px' }} />

                        <span
                            className="mx-2"
                            style={!ChildMenu ? { fontSize: '13px' } : { fontSize: '11px' }}
                        >
                            {SubMenu}
                        </span>
                    </>
                )}

                {(ChildMenu && SubMenu) && (
                    <>
                        <NavigateNext sx={{ fontSize: '20px' }} />
                        <span className="mx-2" style={{ fontSize: '14px' }}> {ChildMenu}</span>
                    </>
                )}
            </div>

            {Button && (
                <div className='text-end'>{Button}</div>
            )}
        </div>
    )
}


export default CurrentPage;