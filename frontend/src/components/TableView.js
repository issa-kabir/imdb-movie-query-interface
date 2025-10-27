import React, { useMemo, useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Box,
    TablePagination
} from '@mui/material';

const TableView = ({ loading: dbLoading, tableData, columns }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    // Reset to first page when data changes
    useEffect(() => {
        setPage(0);
    }, [tableData]);

    // Calculate visible rows for current page
    const visibleRows = useMemo(() => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return tableData.slice(startIndex, endIndex);
    }, [tableData, page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (dbLoading) {
        return (
            <Paper elevation={2} sx={{ p: 3, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>Connecting database...</Typography>
                </Box>
            </Paper>
        );
    }

    return (
        <Paper elevation={2} sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" component="h2">
                    Dataset View ({tableData.length} rows)
                </Typography>
            </Box>
            <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                                    {column}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map((row, index) => (
                            <TableRow key={page * rowsPerPage + index} hover>
                                {columns.map((column, colIndex) => (
                                    <TableCell key={column} sx={{
                                        maxWidth: 200,
                                        overflow: 'auto',
                                        textOverflow: 'auto',
                                        whiteSpace: 'nowrap',
                                        scrollbarWidth: 'none'
                                    }}>
                                        {row[colIndex] || ''}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={tableData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 50, 100]}
                sx={{ borderTop: 1, borderColor: 'divider' }}
            />
        </Paper>
    );
};

export default TableView;