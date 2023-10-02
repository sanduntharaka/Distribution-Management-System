import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../axiosInstance';
import {
    IoIosAddCircle, IoMdRemoveCircle
} from 'react-icons/io';
import { green } from '@mui/material/colors';

const EditTerriotory = (props) => {

    const [terriotories, setTerriotories] = useState([])
    const [showMessage, setShowMessage] = useState(false);
    const [msg, setMsg] = useState("")
    const [error, setError] = useState(false)

    useEffect(() => {
        axiosInstance
            .get(
                `/users/get/terriotires/${props.user}`,
                {
                    headers: {
                        Authorization:
                            'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                    },
                }
            )
            .then((res) => {

                setTerriotories(res.data)

            })
            .catch((err) => {
                console.log(err);

            });
    }, [showMessage])



    const handleTerriotory = () => {
        setTerriotories([...terriotories, {
            terriotory_name: '',
            code: '',
            exist: null,
            old: false
        }])
    }
    const handleRemoveTerriotory = (i) => {
        const updatedTerriotories = [...terriotories];
        updatedTerriotories.splice(i, 1);
        setTerriotories(updatedTerriotories);
    }
    const handleTypeTerriotory = (e, i) => {
        const { name, value } = e.target;

        if (name === 'code' && value.length > 1) {
            axiosInstance
                .get(`/users/search/terriotory/${value}`, {
                    headers: {
                        Authorization: 'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                    },
                })
                .then((res) => {
                    const onChangeVal = [...terriotories];
                    onChangeVal[i][name] = value;

                    if (res.data.exist) {
                        onChangeVal[i]['exist'] = true;
                    } else {
                        onChangeVal[i]['exist'] = false;
                    }

                    setTerriotories(onChangeVal);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            const onChangeVal = [...terriotories];
            onChangeVal[i][name] = value;
            setTerriotories(onChangeVal);

        }
    };

    const addTerriory = (item) => {
        setShowMessage(false)
        setMsg("")
        setError(false)
        axiosInstance
            .post(`/users/add/terriotory/${props.user}`, item, {
                headers: {
                    Authorization: 'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                console.log(res.data)
                setShowMessage(true)
                setMsg("Data Saved successfully.")
                setError(false)
            })
            .catch((err) => {
                console.log(err);
                setShowMessage(true)
                setMsg("Error check your data and try again.")
                setError(true)
            }).finally(() => {
                setTimeout(() => {
                    setShowMessage(false);
                }, 3000);
            })
    }
    const removeTerriory = (item) => {
        setShowMessage(false)
        setMsg("")
        setError(false)
        axiosInstance
            .post(`/users/remove/terriotory/${props.user}`, item, {
                headers: {
                    Authorization: 'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
                },
            })
            .then((res) => {
                console.log(res.data)
                setShowMessage(true)
                setMsg("Data Saved successfully.")
                setError(false)
            })
            .catch((err) => {
                console.log(err);
                setShowMessage(true)
                setMsg("Error check your data and try again.")
                setError(true)
            }).finally(() => {
                setTimeout(() => {
                    setShowMessage(false);
                }, 3000);
            })
    }
    return (
        <div className="edit">

            <div className="edit__content">
                <dib className="edit__content__title">
                    <h4>Edit Terriotory Details</h4>
                </dib>
                <div className="edit__content__table">
                    <div className="form">
                        {
                            showMessage ?
                                <div style={error ? ({ color: 'white', background: 'red', padding: 10, boxSizing: 'border-box' }) : { color: 'white', background: 'green', padding: 10, boxSizing: 'border-box' }}>{msg}</div> : ''

                        }
                        <div className="form__row">
                            <div className="form__row__col">
                                <div className="form__row__col__label" style={{ display: "flex", gap: 5, marginBottom: 5, alignItems: "center" }}> Add Territory With Invoice Code  <IoIosAddCircle className='btn' color='blue' size={25} onClick={handleTerriotory} /> </div>

                                {terriotories.map((item, i) => (
                                    <div className="input" style={{ display: "flex", gap: 5, marginBottom: 5, alignItems: "center" }} key={i}>
                                        <div className="form__row__col__input">
                                            <input
                                                type="text"
                                                placeholder="Type terriotory here"
                                                name='terriotory_name'
                                                value={item.terriotory_name}
                                                onChange={(e) => handleTypeTerriotory(e, i)}
                                            />
                                        </div>
                                        <div className="form__row__col__input">
                                            <input
                                                type="text"
                                                placeholder="Type code here"
                                                name='code'

                                                value={item.code}
                                                onChange={(e) => handleTypeTerriotory(e, i)}
                                            />
                                        </div>
                                        <IoMdRemoveCircle color='red' size={25} onClick={() => handleRemoveTerriotory(i)} />
                                        {
                                            item.exist ? <div style={{ color: 'red' }}>Exist</div> : item.exist === null ? "" : <div style={{ color: 'green' }}>Correct</div>
                                        }
                                        {
                                            !item.old ? <button className="btnEdit" onClick={() => addTerriory(item)}>save</button> : <button className="remBtn" onClick={() => removeTerriory(item)}>remove</button>
                                        }

                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditTerriotory