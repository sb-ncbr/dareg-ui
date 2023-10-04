import CardHeader from "./CardHeader"
import FormsWrapped from "./FormsWrapped";
import ListCardBase from "./ListCardBase"

import schema from '../schema.json';
import uischema from '../uischema.json';
import { Divider } from "@mui/material";

const SchemeCard = (props: {
  closeSelf: () => void,
  current: { id: string, name: string, descr: string, scheme: string, ui_scheme: string }
}) => {

  return (
    <ListCardBase>
      <CardHeader closeSelf={props.closeSelf} path={[{ url: "", name: "Šablony" }]} current={props.current.name} descr={props.current.descr} />
      <Divider sx={{ mb: 1 }} />
      <FormsWrapped schema={props.current.scheme} uischema={props.current.ui_scheme} />
    </ListCardBase>
  )
};

export default SchemeCard;

