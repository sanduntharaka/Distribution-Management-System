import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
    FaRegThumbsUp,
    FaRegThumbsDown,
    FaRegHandPointUp,
} from 'react-icons/fa';

const ExcelFileDownload = (props) => {
    //this is message component
    //to open this you shoud define this in following steps
    //  {show ? (
    //     <Message
    //     hide={setShow}
    //     success={false}
    //     error={true}
    //     title="Hii..."
    //     msg="Hello mr user how are you"
    //   />
    // ) : (
    //   ""
    // )}
    //
    const handleClick = () => {
        props.hide(false);
    };

    const downloadFile = () => {
        const url = window.URL.createObjectURL(new Blob([props.file]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${props.file_name}.xlsx`);
        document.body.appendChild(link);
        link.click();
    }
    return (
        <div className="msg" onClick={handleClick}>
            <div className="msg__content" style={{ display: "flex", flexDirection: 'column' }}>
                <div style={{ flex: 2 }}>
                    <div className="msg__content__icon">
                        {props.success ? (
                            <FaRegThumbsUp color="green" />
                        ) : props.error ? (
                            <FaRegThumbsDown color="red" />
                        ) : props.details ? (
                            <FaRegHandPointUp color="blue" />
                        ) : (
                            ''
                        )}
                    </div>
                    <div className="msg__content__close">
                        <CloseIcon onClick={handleClick} />
                    </div>

                    <div className="msg__content__title">{props.title}</div>
                    <div className="msg__content__details">{props.msg}</div>
                </div>
                {
                    props.success ?

                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <button className='btnSave' onClick={downloadFile}>Download</button>

                        </div> : ''
                }

            </div>

        </div>
    );
};

export default ExcelFileDownload;
