import { Button } from 'antd';
import React, { useState } from 'react';
import { getCountries } from '../service/big-commerce';
import Modal from 'react-modal';

function Demo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };
  return (
    <div>
        <Button onClick={getCountries}>Click me to call big commerce api</Button>  
        <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCancel}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <button onClick={handleCancel}>close</button>
        <div>I am a modal</div>
      </Modal>
    </div>
  )
}

export default Demo