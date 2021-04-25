import React from 'react';
import { Title } from 'react-admin';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Importer } from './components/Importer';

export const PageCsvImporter: React.FC = () => {
  return (
    <Card>
      <Title title="Import records from csv" />
      <CardContent>
        <Importer />
      </CardContent>
    </Card>
  );
};
