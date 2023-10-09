import schema from '../schema.json';
import uischema from '../uischema.json';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import RatingControl from '../RatingControl';
import ratingControlTester from '../ratingControlTester';
import VersionPicker from './VersionPicker';
import ListCardBase from './ListCardBase';
import { useTranslation } from 'react-i18next';
import CardButton from './CardButton';
import CardHeader from './CardHeader';
import TemplateSelect from './TemplateSelect';
import { JsonForms } from '@jsonforms/react';
import { useState } from 'react';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { Button } from '@mui/material';

const renderers = [
  ...materialRenderers,
  //register custom renderers
  { tester: ratingControlTester, renderer: RatingControl },
];

const loadJSON = (json: string) => {
  try {
    return (JSON.parse(json))
  }
  catch {
  }
}

const FormsWrapped = (props:{
  schema: string,
  uischema: string
  data: any,
  setData: (data: any) => void
}) => {

  return (
    <JsonForms
      schema={loadJSON(props.schema)}
      uischema={props.uischema==="" || props.uischema==="{}" ? undefined : loadJSON(props.uischema)}
      data={props.data}
      renderers={renderers}
      cells={materialCells}
      onChange={({ errors, data }) => props.setData(data)}
    />
  )
};

export default FormsWrapped;

