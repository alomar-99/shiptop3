
// ****************************************************
// ** CustomDateTableCell Component for Editing Date Row
// ****************************************************

import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    tableCell: {
        width: 130,
        height: 40
    },
    datePicker: {
        marginTop: "5px !important"
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



export default function CustomDateTableCell(props) {
    const classes = useStyles();
    const { row, name, dateFormat, momentFormat, onInputChange } = props;
    const { isEditMode } = row;

    return (
        <TableCell align="right" className={classes.inputLarge}>
            {isEditMode ? (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        className={classes.datePicker}
                        autoOk
                        contentEditable="false"
                        disableToolbar
                        variant="inline"
                        format={dateFormat}
                        margin="normal"
                        id="date-picker-inline"
                        value={row[name]}
                        onChange={(dateValue) => onInputChange({ target: { name: name, value: dateValue } }, row)}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider>
            ) : (
                row[name] ? (moment(row[name]).format(momentFormat)) : "-"
            )}
        </TableCell>
    );
};

