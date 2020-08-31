import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Toolbar,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  Checkbox,
  Tooltip,
  IconButton,
  TablePagination,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import Swal from 'sweetalert2';

import { setHistoryCalculateShipping } from '~/store/actions/historyCalculateShipping';

import { CalculateShippingDialog } from './components';
import useStyles from './style';

const PinkCheckbox = withStyles({
  checked: {
    color: '#f50057 !important',
  },
})(Checkbox);

function HistoryCalculateShipping() {
  const historyCalculateShipping = useSelector(
    (state) => state.historyCalculateShipping
  );

  const classes = useStyles();
  const dispatch = useDispatch();

  const [history, setHistory] = useState(null);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [
    openCalculateShippingDialog,
    setOpenCalculateShippingDialog,
  ] = useState(false);

  useEffect(() => {
    if (history) {
      setOpenCalculateShippingDialog(true);
    }
  }, [history]);

  function descendingComparator(a, b) {
    if (orderBy === 'destinationZipCode') {
      if (
        b.address.destinationAddress.zipCode <
        a.address.destinationAddress.zipCode
      ) {
        return -1;
      }

      if (
        b.address.destinationAddress.zipCode >
        a.address.destinationAddress.zipCode
      ) {
        return -1;
      }

      return 0;
    }

    if (b[orderBy] < a[orderBy]) {
      return -1;
    }

    if (b[orderBy] > a[orderBy]) {
      return 1;
    }

    return 0;
  }

  function getComparator() {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function sTableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const newOrder = comparator(a[0], b[0]);

      if (newOrder !== 0) {
        return newOrder;
      }

      return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
  }

  function handleRequestSort(property) {
    const isAsc = orderBy === property && order === 'asc';

    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const { datasets } = historyCalculateShipping;

      const newSelecteds = datasets.map((n) => n.id);

      setSelected(newSelecteds);
      return;
    }

    setSelected([]);
  }

  function handleClick(id) {
    const selectedIndex = selected.indexOf(id);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  function renderItemsTableHead(numSelected, rowCount) {
    return (
      <TableRow>
        <TableCell className={classes.tableCell} padding="checkbox">
          <PinkCheckbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={handleSelectAllClick}
          />
        </TableCell>

        <TableCell
          className={classes.tableCell}
          sortDirection={orderBy === 'createdAt' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'createdAt'}
            direction={orderBy === 'createdAt' ? order : 'asc'}
            onClick={() => handleRequestSort('createdAt')}
          >
            Data/Hora
          </TableSortLabel>
        </TableCell>

        <TableCell
          className={classes.tableCell}
          sortDirection={orderBy === 'destinationZipCode' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'destinationZipCode'}
            direction={orderBy === 'destinationZipCode' ? order : 'asc'}
            onClick={() => handleRequestSort('destinationZipCode')}
          >
            CEP Destino
          </TableSortLabel>
        </TableCell>

        <TableCell className={classes.tableCell}>Ação</TableCell>
      </TableRow>
    );
  }

  function renderItemsTableBody(list) {
    const isSelected = (id) => selected.indexOf(id) !== -1;

    if (list.length > 0) {
      return sTableSort(list, getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((row) => {
          const isItemSelected = isSelected(row.id);

          return (
            <TableRow key={row.id} selected={isItemSelected}>
              <TableCell className={classes.tableCell} padding="checkbox">
                <PinkCheckbox
                  checked={isItemSelected}
                  onClick={() => handleClick(row.id)}
                />
              </TableCell>

              <TableCell className={classes.tableCell}>
                {moment(row.createdAt).format('DD/MM/YYYY H:mm:ss')}
              </TableCell>

              <TableCell className={classes.tableCell}>
                {row.address.destination.zipCode}
              </TableCell>

              <TableCell className={classes.tableCell}>
                <Tooltip title="Visualizar">
                  <IconButton onClick={() => setHistory(row)}>
                    <FontAwesomeIcon icon={faEye} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          );
        });
    }

    return (
      <TableRow>
        <TableCell colSpan={4} align="center">
          Nenhum histórico.
        </TableCell>
      </TableRow>
    );
  }

  function removeHistory() {
    if (selected.length > 4) {
      Swal.fire({
        title: `Apagar ${selected.length} itens do histórico?`,
        text: 'Esta operação é irreversível.',
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.value) {
          removeHistoryInRedux();
        }
      });
    } else {
      removeHistoryInRedux();
    }
  }

  function removeHistoryInRedux() {
    const { datasets, id } = JSON.parse(
      JSON.stringify(historyCalculateShipping)
    );

    selected.forEach((key) => {
      datasets.forEach((data, index) => {
        if (data.id === parseInt(key, 10)) {
          datasets.splice(index, 1);
        }
      });
    });

    dispatch(setHistoryCalculateShipping({ datasets, id }));
    setSelected([]);
  }

  function closeCalculateShippingDialog() {
    setHistory(null);
    setOpenCalculateShippingDialog(false);
  }

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title}>Histórico</Typography>

          <Box mt={1} mb={1}>
            <Alert severity="info">
              Ordene por data/hora ou CEP de destino.
            </Alert>
          </Box>

          <Box mt={3}>
            <Toolbar
              className={clsx(classes.toolbarContainer, {
                [classes.toolbarContainerHidden]: selected.length === 0,
              })}
            >
              <Typography
                className={classes.toolbarContainerTitle}
                color="inherit"
                variant="subtitle1"
              >
                {selected.length} selecionado(s)
              </Typography>

              <Tooltip title="Remover">
                <IconButton
                  className={classes.toolbarContainerIcon}
                  onClick={removeHistory}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </IconButton>
              </Tooltip>
            </Toolbar>

            <TableContainer>
              <Table className={classes.table}>
                <TableHead>
                  {renderItemsTableHead(
                    selected.length,
                    historyCalculateShipping.datasets.length
                  )}
                </TableHead>

                <TableBody>
                  {renderItemsTableBody(historyCalculateShipping.datasets)}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              className={classes.tablePagination}
              component="div"
              count={historyCalculateShipping.datasets.length}
              rowsPerPageOptions={[5, 10, 25]}
              rowsPerPage={rowsPerPage}
              labelRowsPerPage="Linhas por página:"
              page={page}
              labelDisplayedRows={({ from, to, count }) => {
                return `${from}-${to} de ${count}`;
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Box>
        </CardContent>
      </Card>

      {openCalculateShippingDialog && (
        <CalculateShippingDialog
          open={openCalculateShippingDialog}
          close={closeCalculateShippingDialog}
          apiData={history}
          objectType={history.objectType}
        />
      )}
    </>
  );
}

export default HistoryCalculateShipping;
