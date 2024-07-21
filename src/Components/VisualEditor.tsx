import { Button, Dialog, Stack } from "@mui/material";
import ContentHeader from "./ContentHeader";
import { useTranslation } from "react-i18next";
import { SchemasData } from "../types/global";
import { SaveRounded, UndoRounded } from "@mui/icons-material";
import AdamantMain from "../Pages/Templates/Adamant/pages/AdamantMain";
import { useState } from "react";

interface VisualEditorProps {
    open: boolean,
    closeSelf: () => void,
    data: SchemasData,
    setData: (arg: SchemasData) => void,
}

const VisualEditor = ({open, closeSelf, data, setData}: VisualEditorProps) => {
    const { t } = useTranslation()

    const [dataFormEditor, setDataFormEditor] = useState<SchemasData>(data)

    const saveData = () => {
        if (Object.keys(dataFormEditor.schema).length !== 0) {
            setData(dataFormEditor)
        }
        closeSelf()
    }

    return (
        <Dialog open={open} onClose={closeSelf} fullScreen>
            <ContentHeader
                title={`${t("TemplateEditor.editingTemplate")}: ${data.name}`}
                actions={
                    <Stack direction={"row"} gap={1}>
                        <Button startIcon={<UndoRounded />} color="error" onClick={closeSelf}>{t("TemplateEditor.discard")}</Button>
                        <Button startIcon={<SaveRounded />} variant="contained" onClick={saveData}>{t("TemplateEditor.save")}</Button>
                    </Stack>
                }
                sx={{
                    position: "sticky",
                    top: "3px",
                    zIndex: 1000,
                    m: 2
                }}
                backAction={closeSelf}
            >
            </ContentHeader>
            <AdamantMain data={data as any} setData={setDataFormEditor} isVisible={open as any}/>
        </Dialog>
    )
}

export default VisualEditor;
