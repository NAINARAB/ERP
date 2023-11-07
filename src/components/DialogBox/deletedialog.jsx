import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

const DialogBoxComp = ({ open, close, title, content, submit  }) => {
    return (
        <Dialog
            open={open}
            onClose={close}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title ? title : "Confirmation"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <b style={{ color: 'black', padding: '0px 20px' }}>{content ? content : "Do you Want to Delete?"}</b>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>Cancel</Button>
                <Button onClick={submit} autoFocus sx={{ color: 'red' }}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogBoxComp;