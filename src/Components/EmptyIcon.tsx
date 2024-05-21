import { CloudOff } from "@mui/icons-material"
import { Stack, Typography } from "@mui/material"
import { ReactNode } from "react"

const EmptyIcon = (props: {children: ReactNode|string}) => {
    return (
        <Stack alignItems="center" fontSize={70}>
            <CloudOff color="disabled" fontSize="inherit"/>
            <Typography color={"gray"} fontSize={17} variant="subtitle2">{props.children}</Typography>
        </Stack>
    )
}

export default EmptyIcon