import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Link} from "react-router-dom";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});


function ComTable(props) {

    const classes = useStyles();

    const countryId = props.rowsData[0].id;
    const countryLink = `country/${countryId}`;

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        {props.columnNames.map((columnName)=>(
                            <TableCell key={columnName} align="right">{columnName}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {props.rowsData.map((row) => (
                        <TableRow key={row.countryId}>
                            <TableCell component="th" scope="row">
                                <Link to={countryLink} >
                                    {row.country}
                                </Link>
                            </TableCell>
                            <TableCell align="right">{row.total}</TableCell>
                            <TableCell align="right">{row.recovered}</TableCell>
                            <TableCell align="right">{row.deaths}</TableCell>
                            <TableCell align="right">{row.mortality}</TableCell>
                            <TableCell align="right">{row.active}</TableCell>
                            <TableCell align="right">{row.serious}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </TableContainer>
    );

}

export default ComTable;
