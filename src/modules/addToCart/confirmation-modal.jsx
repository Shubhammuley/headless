import { Button } from 'antd';
import React from 'react';
import Modal from 'react-modal';

function CartConfirmationModal(props) {
    const {
        isModalOpen,
        onClose,
        cartDetails,
        productId,
    } = props;

    let totalItemInCart = 0;
    const productDetails = cartDetails && cartDetails.line_items && cartDetails.line_items.physical_items.find((item) => item.product_id === productId);
    cartDetails && cartDetails.line_items && cartDetails.line_items.physical_items.map((item) => {
        totalItemInCart = totalItemInCart + item.quantity;
    });

    return (
        <div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={onClose}
                contentLabel="cart confirmation"
                //   style={customStyles}
                className="Modal"
                overlayClassName="Overlay"
            >
                <div className="modal-header">
                    <h2 className="modal-header-title">Ok, {totalItemInCart} items were added to your cart. What's next?</h2>
                    <span onClick={onClose}>×</span>
                </div>
                <div>
                    <div>
                        <section>
                            <div>
                                <div>
                                    <img src={productDetails.image_url} alt={productDetails.name} />
                                </div>
                                <div>
                                    <h4>{productDetails.name}</h4>
                                    <div>Brand (have to add later)</div>
                                    <div>{productDetails.quantity} x {productDetails.original_price.toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                        minimumFractionDigits: 0,
                                    })}</div>
                                </div>
                            </div>
                        </section>
                        <section>
                            <div>
                                <div>
                                    <Button>PROCEED TO CHECKOUT</Button>
                                </div>
                                <div>
                                    <span>Order subtotal</span>
                                    <strong>{cartDetails.cart_amount.toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                        minimumFractionDigits: 0,
                                    })}</strong>
                                    <p>Your Cart contains {totalItemInCart} items</p>
                                    <Button onClick={onClose}>Continue Shopping</Button>
                                    <Button>View or edit your cart</Button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

            </Modal>

        </div>
    )
}

export default CartConfirmationModal