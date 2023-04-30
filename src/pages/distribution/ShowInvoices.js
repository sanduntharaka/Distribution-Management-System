import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../axiosInstance';
import { CgDetailsMore } from 'react-icons/cg';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Invoice from '../../components/invoice/Invoice';
import Modal from '@mui/material/Modal';
const style = {
  base: {
    width: '100%',
    height: '100vh',
    background: 'red',
  },
};
const ShowInvoices = () => {
  //show inv
  const [showinv, setShowInv] = useState(false);
  const handleCloseInv = () => {
    setShowInv(false);
  };
  const showInvoice = () => {
    setShowInv(true);
  };

  const [recodes, setRecodes] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showMenuIndex, setShowMenuIndex] = useState('');
  const [distributor, setDistributor] = useState({ user: '' });
  const [items, setItems] = useState([]);
  useEffect(() => {
    axiosInstance
      .get('/company/invoice/all/', {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log(res.data);
        setRecodes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleShowMenu = (i) => {
    setShowMenuIndex(i);
    setShowMenu(true);
  };

  const handleShowDetails = (item) => {
    console.log(item);
    items.splice(0, items.length);
    setDistributor({
      user: item.solled_to,
    });
    axiosInstance
      .get(`/company/invoice/items/${item.id}`, {
        headers: {
          Authorization:
            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
        },
      })
      .then((res) => {
        console.log(res.data);
        res.data.map((item, i) =>
          items.push({
            item_code: item.item,
            description: item.description,
            qty: item.qty,
            whole_sale_price: item.unit_price,
          })
        );
        showInvoice();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const MyInvoice = React.forwardRef((props, ref) => {
    return <Invoice distributor={props.distributor} items={props.items} />;
  });
  return (
    <div className="page">
      <div className="page__title">
        <p>View invoice history</p>
      </div>
      <div className="page__pcont">
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Inv number</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recodes.map((item, index) => (
                <tr className="sp">
                  <td scope="row">{index + 1}</td>
                  <td>
                    {item.invoice_code}
                    {item.invoice_number}
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <div>
                      {' '}
                      <button
                        className="btn details"
                        title="see more details"
                        onClick={() => handleShowDetails(item)}
                      >
                        <CgDetailsMore />
                      </button>
                    </div>

                    <div
                      className="action_btn"
                      onClick={() => handleShowMenu(index)}
                    >
                      <BsThreeDotsVertical />
                    </div>
                  </td>
                  {showMenu && index === showMenuIndex ? (
                    <div
                      className="tbl_side_menu"
                      onClick={() => setShowMenu(false)}
                    >
                      <div
                        className="tbl_side_menu__row"
                        onClick={() => handleShowDetails(item)}
                      >
                        Details
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showinv} onClose={() => handleCloseInv()}>
        <MyInvoice distributor={distributor} items={items} oldinv={true} />
      </Modal>
    </div>
  );
};

export default ShowInvoices;
