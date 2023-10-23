import { Table, TableBody, TableCell, TableHead, TableRow, Skeleton, TableProps } from '@mui/material';
import { ReactFragment } from 'react';

interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    renderCell?: (params: any) => ReactFragment;
}

interface Data {
    [key: string]: any;
}

interface Props extends TableProps {
    columns: Column[];
    data: Data[];
    loading?: boolean;
}

const DaregTable = ({ columns, data, loading = false, ...other }: Props) => {
    if (!loading && data) {
        return (
            <Table sx={{ minWidth: 650 }} aria-label="simple table" {...other}>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, i) => {
                        return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={`id-${i}`}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                        <TableCell key={column.id} align={column.align}>
                                            {column.renderCell ? column.renderCell(row) : value}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
    } else {
        return (
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[...Array(5)].map((_, i) => (
                        <TableRow hover role="checkbox" tabIndex={-1} key={`skeleton-${i}`}>
                            {columns.map((column) => (
                                <TableCell key={column.id} align={column.align}>
                                    <Skeleton variant="text" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );  
    }
}

export default DaregTable;