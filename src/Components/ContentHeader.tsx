import { ArrowBackRounded } from "@mui/icons-material"
import { Paper, Stack, IconButton, Typography, SxProps } from "@mui/material"
import { useNavigate } from "react-router-dom"

type ContentHeaderProps = {
    title?: string,
    backAction?: () => void,
    children: JSX.Element | JSX.Element[],
    actions?: JSX.Element | JSX.Element[],
    sx?: SxProps
}
const ContentHeader = ({title, children, sx, backAction, actions}:ContentHeaderProps) => {
    
    const navigate = useNavigate()

    const handleBackClick = (): void => {
        if (backAction){
            backAction()
        } else {
            navigate(-1)
        }
    }
  
    return (
        <Paper sx={{p: 2, mt:2, background: "#9ed060", ...sx}}>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" alignItems="center">
                    <IconButton sx={{ mr: 1 }} edge="start" onClick={() => handleBackClick()}><ArrowBackRounded/></IconButton>
                    <Typography variant="h5" color="text.primary">{title}</Typography>
                </Stack>
                {actions}
            </Stack>
            {children}            
        </Paper>
    )
}

export default ContentHeader;