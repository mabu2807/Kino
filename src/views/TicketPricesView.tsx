import { styled } from '@mui/material/styles';
import { TableCell, tableCellClasses, TableRow, TableContainer, Paper, Table, TableHead, TableBody, Container, Typography } from '@mui/material';
import * as React from 'react';
import { redTheme } from '../App';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function createData(
    name: string,
    price: number,
    condition: string,
    ) {
        return { name, price, condition};
    }
    const rows = [
        createData('Adults', 10.00, ""),
        createData('Kids', 7.00, "Kids under 16 years old"),
        createData('Students', 8.00, "Students with a student ID"),
        createData('Pensioner', 9.00, "People older than 65"),
       
];

class TicketPricesView extends React.Component {
    render() {
        return (
            <Container maxWidth='md' >
                <Typography variant='h4' align='left' sx={{paddingBottom:'3rem', paddingTop:'3rem', color: redTheme.palette.primary.contrastText}}>Ticket Prices</Typography>
                <TableContainer component={Paper} >
                    <Table aria-label="customized table">
                        <TableHead >
                            <TableRow >
                                <StyledTableCell >Ticket Category</StyledTableCell>
                                <StyledTableCell align="right">Price</StyledTableCell>
                                <StyledTableCell align="right">Condition</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <StyledTableRow key={row.name}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.name}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">{row.price} €</StyledTableCell>
                                    <StyledTableCell align="right">{row.condition}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        );
    }
}

export default TicketPricesView;