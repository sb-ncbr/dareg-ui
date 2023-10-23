import { ArrowBackRounded } from "@mui/icons-material"
import { Paper, Stack, IconButton, Typography, TextField } from "@mui/material"
import { useNavigate } from "react-router-dom"

type ContentHeaderProps = {
    title?: string,
    children: JSX.Element | JSX.Element[],
    actions?: JSX.Element | JSX.Element[]
}
const ContentHeader = ({title, children, actions}:ContentHeaderProps) => {
    
    const navigate = useNavigate()

    return (
        <Paper sx={{p: 2, mt:2, background: "#9ed060"}}>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" alignItems="center">
                    <IconButton sx={{ mr: 1 }} edge="start" onClick={() => navigate(-1)}><ArrowBackRounded/></IconButton>
                    <Typography variant="h5" color="text.primary">{title}</Typography>
                </Stack>
                {actions}
            </Stack>
            {children}            
        </Paper>
    )
}

export default ContentHeader;