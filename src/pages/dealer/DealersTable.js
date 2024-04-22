import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import { IconButton } from '@mui/material';
import { CgDetailsMore } from 'react-icons/cg';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { axiosInstance } from '../../axiosInstance';
import Modal from '@mui/material/Modal';
import DealerDetails from '../../components/details/DealerDetails';
import EditDealerDetails from '../../components/edit/EditDealerDetails';
import DealerDeleteConfirm from '../../components/userComfirm/DealerDeleteConfirm';
import Message from '../../components/message/Message';
const DealersTable = ({ columns, nextClick, user, userdetail }) => {

    //modal
    const [modalOpen, setModalOpen] = useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    //details
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [itemDetails, setItemDetails] = useState();

    //edit-details
    const [editdetailsOpen, setEditDetailsOpen] = useState(false);

    //delete-details
    const [deletedetailsOpen, setDeleteDetailsOpen] = useState(false);

    //mesage show
    const [messageOpen, setMessageOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState('');
    const [title, setTitle] = useState('');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [nextPage, setNextPage] = useState('http://localhost:8000/api/dealer/all/');
    const [prevPage, setPrevPage] = useState(null);

    const [prevPageNo, setPrevPageNo] = useState(0)
    useEffect(() => {

        if (page > prevPageNo || page === prevPageNo) {
            const url = new URL(nextPage);
            const extractedPart = url.pathname + url.search;

            fetchData_1(extractedPart);
        } else {

            const url = new URL(prevPage);
            const extractedPart = url.pathname + url.search;
            fetchData_2(extractedPart);
        }
    }, [page, rowsPerPage]); // Fetch data when page or rowsPerPage changes

    const fetchData_1 = (url_link) => {
        const url = nextPage || url_link;

        axiosInstance
            .get(url, {
                headers: {
                    Authorization: 'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setCount(res.data.count);
                setNextPage(res.data.next);
                setPrevPage(res.data.previous)
                setData(res.data.results);

                setPrevPageNo(page)
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const fetchData_2 = (url_link) => {
        const url = prevPage || url_link;

        axiosInstance
            .get(url, {
                headers: {
                    Authorization: 'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                setCount(res.data.count);
                setNextPage(res.data.next);
                setPrevPage(res.data.previous)
                setData(res.data.results);

                setPrevPageNo(page)
            })
            .catch((err) => {
                console.log(err);
            });
    };


    const renderCellContent = (column, rowData) => {
        if (column.render) {
            return column.render(rowData);
        } else {
            return rowData[column.field];
        }
    };

    const handleChangePage = (_, newPage) => {
        setPage(newPage);


    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        nextClick(true);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length);

    const handleViewDetails = (e, value) => {
        // Implement your logic for handling View Details action

        e.preventDefault();

        setItemDetails({
            id: value.id,
            name: value.name,
            contact_number: value.contact_number,
            address: value.address,
            owner_name: value.owner_name,
            company_number: value.company_number,
            owner_personal_number: value.owner_personal_number,
            owner_home_number: value.owner_home_number,
            assistant_name: value.assistant_name,
            assistant_contact_number: value.assistant_contact_number,
            added: value.added,
        });
        setMessageOpen(false);
        setEditDetailsOpen(false);
        setDeleteDetailsOpen(false);
        setDetailsOpen(true);

        handleModalOpen();
    };

    const handleEditDetails = (e, value) => {
        console.log(value);
        setItemDetails({
            id: value.id,
            name: value.name,
            contact_number: value.contact_number,
            address: value.address,
            owner_name: value.owner_name,
            grade: value.grade,
            company_number: value.company_number,
            owner_personal_number: value.owner_personal_number,
            owner_home_number: value.owner_home_number,
            assistant_name: value.assistant_name,
            assistant_contact_number: value.assistant_contact_number,
            added: value.added,
        });
        setMessageOpen(false);
        setDeleteDetailsOpen(false);
        setDetailsOpen(false);
        setEditDetailsOpen(true);
        handleModalOpen();
    };

    const handleDeleteDetails = (e, value) => {
        setItemDetails({
            id: value.id,
            name: value.name,
            contact_number: value.contact_number,
            address: value.address,
            owner_name: value.owner_name,
            company_number: value.company_number,
            owner_personal_number: value.owner_personal_number,
            owner_home_number: value.owner_home_number,
            assistant_name: value.assistant_name,
            assistant_contact_number: value.assistant_contact_number,
            added: value.added,
        });
        setMessageOpen(false);
        setDetailsOpen(false);
        setEditDetailsOpen(false);
        setDeleteDetailsOpen(true);
        handleModalOpen();
    };

    return (
        <div>
            <Modal open={modalOpen} onClose={handleModalClose}>
                {detailsOpen ? (
                    <DealerDetails
                        data={itemDetails}
                        showDetails={setDetailsOpen}
                        showEdit={setEditDetailsOpen}
                        showConfirm={setDeleteDetailsOpen}
                        closeModal={handleModalClose}
                        user={user}
                    />
                ) : editdetailsOpen ? (
                    <EditDealerDetails
                        data={itemDetails}
                        openMsg={setMessageOpen}
                        msgSuccess={setSuccess}
                        msgErr={setError}
                        msgTitle={setTitle}
                        msg={setMsg}
                        showEdit={setEditDetailsOpen}
                        closeModal={handleModalClose}
                    />
                ) : deletedetailsOpen ? (
                    <DealerDeleteConfirm
                        data={itemDetails}
                        openMsg={setMessageOpen}
                        msgSuccess={setSuccess}
                        msgErr={setError}
                        msgTitle={setTitle}
                        msg={setMsg}
                        showConfirm={setDeleteDetailsOpen}
                        closeModal={handleModalClose}
                    />
                ) : messageOpen ? (
                    <Message
                        hide={handleModalClose}
                        success={success}
                        error={error}
                        title={title}
                        msg={msg}
                    />
                ) : (
                    <p>No modal</p>
                )}
            </Modal>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.title}>{column.title}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={row.id}>
                            <TableCell>{index + 1}</TableCell>
                            {columns.slice(1).map((column) => (
                                <TableCell key={column.title}>{renderCellContent(column, row)}</TableCell>
                            ))}
                            <TableCell style={{ display: 'flex' }}>
                                <IconButton
                                    onClick={(event) => handleViewDetails(event, row)}
                                    color="primary"
                                    style={{ color: 'green' }}
                                    size="small"
                                    aria-label="View Details"
                                >
                                    <CgDetailsMore />
                                </IconButton>
                                {user.is_distributor || user.is_manager || user.is_excecutive ? (
                                    <IconButton
                                        onClick={(event) => handleEditDetails(event, row)}
                                        color="primary"
                                        style={{ color: 'orange' }}
                                        size="small"
                                        aria-label="Edit Details"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                ) : null}
                                {(user.is_manager || user.is_excecutive) ? (
                                    <IconButton
                                        onClick={(event) => handleDeleteDetails(event, row)}
                                        color="primary"
                                        style={{ color: 'red' }}
                                        size="small"
                                        aria-label="Delete Details"
                                    >
                                        <DeleteOutline />
                                    </IconButton>
                                ) : null}
                            </TableCell>
                        </TableRow>
                    ))}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={columns.length + 1} />
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default DealersTable;
