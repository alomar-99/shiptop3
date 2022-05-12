
// ****************************************************
// ** CustomTableCell Component for Editing Row
// ****************************************************

import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    tableCell: {
        width: 130,
        height: 40
    },
    input: {
        width: 130,
        height: 40,
    },
    inputLarge: {
        width: 140,
        height: 40,
    }
}));



export default function CustomTableCell(props) {
    const classes = useStyles();
    const { row, name, placeholder, onInputChange } = props;
    const { isEditMode } = row;

    return (
        <TableCell align="right" className={name === "destination_phone" ? { ...classes.inputLarge } : { ...classes.tableCell }}>
            {isEditMode ? (
                <TextField
                    variant="standard"
                    key={`${row['id']}`}
                    value={row[name]}
                    name={name}
                    type={(name === "destination_phone") ? 'text' : 'text'}
                    placeholder={placeholder ? placeholder : ''}
                    inputProps={{ style: { textAlign: 'right' } }}
                    onChange={(e) => { onInputChange(e, row) }}
                    classes={name === "destination_phone" ? { ...classes.inputLarge } : { ...classes.tableCell }}
                />
            ) : (
                (row[name]) || "-"
            )}
        </TableCell>
    );
};

