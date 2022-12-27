import { Button, Modal } from 'antd'
import React from 'react'

function ErrorModal({
    isModalOpen = false,
    onClose,
    errorMessage,
}) {
    return (
        <Modal
            open={isModalOpen}
            onCancel={onClose}
            className="Modal"
            overlayClassName="Overlay"
            footer={[<Button onClick={onClose}>OK</Button>]}
        >
            <div>
                <div>
                    <p>{errorMessage}</p>
                    
                </div>
            </div>
        </Modal>
    )
}

export default ErrorModal