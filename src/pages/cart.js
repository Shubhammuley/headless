import React, { useState, useEffect } from 'react'
import RootElement from '../components/base-layout';
import { Link } from 'gatsby';
import { Breadcrumb, Layout, Table, InputNumber, Button, Input, Form, Modal } from "antd";
import { getCart, deleteCartItem } from '../service';
import DefaultLoader from '../components/PageLoading/DefaultLoader';
import { updateCart } from '../service';
import ErrorModal from '../modules/ErrorModal';

const { Content } = Layout;

function Cart() {
    const [cartDetails, setCartDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(true);
    const [showCouponField, setShowCouponField] = useState(false);
    const [showGiftCartField, setShowGiftCartField] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const fetchCart = async (cartId) => {
        try {
            const result = await getCart(cartId);
            // console.log(result)
            if (result && result.data && result.data.line_items && result.data.line_items.physical_items) {
                setCartDetails(result.data);
                setLoading(false);
                setTableLoading(false);
            }
        } catch (e) {
            setLoading(false);
            setTableLoading(false);
            console.log(e)
        }
    }

    const onModalClose = () => {
        setErrorMessage(null);
        setShowErrorModal(false);
    }

    const onChangeQuantity = async (itemId, quantity, item) => {
        try {
            const cartId = localStorage.getItem("cartId");
            setTableLoading(true);
            const result = await updateCart({
                line_item: {
                    quantity,
                    product_id: item.product_id
                }
            }, cartId, itemId);
            await fetchCart(cartId);
            setTableLoading(false);
        } catch (e) {
        setTableLoading(false);
            console.log(e)
        }
    }

    const removeItem = async (itemId) => {
      try {
          const cartId = localStorage.getItem("cartId");
          setTableLoading(true);
        await deleteCartItem(cartId, itemId);
        await fetchCart(cartId);
        setTableLoading(false);
        
      } catch(e) {
        console.log(e)
        setTableLoading(false);
      }
    }
    useEffect(() => {
        const cartId = localStorage.getItem("cartId");
        console.log(cartId)
        setLoading(true);
        if (cartId && cartId !== 'null') {
            fetchCart(cartId);
        } else {
            setLoading(false);
            setTableLoading(false);
        }
    }, []);

    const onSubmitApplyCoupon = (value) => {
        if(value.couponCode) {
            // Apply coupon
        } else {
            setErrorMessage('Please enter your coupon code.');
            setShowErrorModal(true);
        }
    }

    const onSubmitGiftCart = (value) => {
        if(value.giftCard) {
            // Apply coupon
        } else {
            setErrorMessage('The gift certificate does not exist');
            setShowErrorModal(true);
        }
    }
    const columns = [
        {
            title: 'Item',
            render: (item) => {
                return <div>
                    <img src={item.image_url} />
                </div>
            }
        },
        {
            render: (item) => {
                return <div>
                    {item.name}
                </div>
            }
        },
        {
            title: 'Price',
            render: (item) => {
                return <div>{item.sale_price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                })}</div>
            }
        },
        {
            title: 'Quantity',
            render: (item) => {
                return <div><InputNumber defaultValue={item.quantity} onChange={(value) => onChangeQuantity(item.id, value, item)} /></div>
            }
        },
        {
            title: 'Total',
            render: (item) => {
                return <>{item.extended_sale_price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                })}
                {" "}
                <a><span onClick={() => removeItem(item.id)}>x</span></a>
                </>
            }
        }
    ]
    return (
        <RootElement>
            <Content>
                <div className='container'>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to={`/`}>Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to={`/cart`}>Your Cart</Link>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <div className='site-content'>
                        <div>
                            <h1>Your Cart ({loading ? <DefaultLoader /> : cartDetails && cartDetails.line_items && cartDetails.line_items.physical_items ? cartDetails.line_items.physical_items.length : 0} items)</h1>
                        </div>
                        <div>
                            {
                                loading ? <DefaultLoader /> : (
                                    <div>
                                        {cartDetails && cartDetails.line_items && cartDetails.line_items.physical_items ? (<>
                                            <div>
                                                <Table pagination={false} columns={columns} dataSource={cartDetails.line_items.physical_items} loading={tableLoading} />
                                                <div>
                                                    <div>
                                                        <ul class="cart-totals">
                                                            <li class="cart-total">
                                                                <div class="cart-total-label">
                                                                    <strong>Subtotal:</strong>
                                                                </div>
                                                                <div class="cart-total-value">
                                                                    <span>{cartDetails.base_amount.toLocaleString("en-US", {
                                                                        style: "currency",
                                                                        currency: "USD",
                                                                        minimumFractionDigits: 0,
                                                                    })}</span>
                                                                </div>
                                                            </li>
                                                            <li class="cart-total">
                                                                <div class="cart-total-label">
                                                                    <strong>Shipping:</strong>
                                                                </div>
                                                                <div class="cart-total-value">
                                                                    <div class="subtotal shipping-estimate-show">
                                                                        <a href="#" class="shipping-estimate-value">$0.00</a>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li class="cart-total">
                                                                <div class="cart-total-label">
                                                                    <strong>Coupon Code:</strong>
                                                                </div>
                                                                <div class="cart-total-value">

                                                                    {showCouponField ? <><a><span onClick={() =>setShowCouponField(false)}>Cancel</span></a></> : <a><span onClick={()=> setShowCouponField(true)}>Add Coupon</span></a>}

                                                                </div>
                                                                {
                                                                    showCouponField ? <>
                                                                        <div class="cart-form coupon-code">
                                                                            <Form onFinish={onSubmitApplyCoupon}>
                                                                                <Form.Item name="couponCode">
                                                                                    <Input placeholder='Enter your coupon code'/>
                                                                                </Form.Item>
                                                                                <Form.Item>
                                                                                    <Button htmlType='submit'>Apply</Button>
                                                                                </Form.Item>
                                                                            </Form>
                                                                        </div>
                                                                    </> : null
                                                                }

                                                            </li>
                                                            <li class="cart-total">
                                                                <div class="cart-total-label">
                                                                    <strong>Gift Certificate:</strong>
                                                                </div>
                                                                <div class="cart-total-value">
                                                                
                                                                {showGiftCartField ? <><a><span onClick={() =>setShowGiftCartField(false)}>Cancel</span></a></> : <a><span onClick={()=> setShowGiftCartField(true)}>Gift Certificate</span></a>}


                                                                </div>

                                                                <div class="cart-form gift-certificate-code">
                                                                {
                                                                    showGiftCartField    ? <>
                                                                        <div class="cart-form coupon-code">
                                                                            <Form onFinish={onSubmitGiftCart}>
                                                                                <Form.Item name="giftCard">
                                                                                    <Input placeholder='Add Certificate'/>
                                                                                </Form.Item>
                                                                                <Form.Item>
                                                                                    <Button htmlType='submit'>Apply</Button>
                                                                                </Form.Item>
                                                                            </Form>
                                                                        </div>
                                                                    </> : null
                                                                }
                                                                </div>
                                                            </li>
                                                            <li class="cart-total">
                                                                <div class="cart-total-label">
                                                                    <strong>Grand total:</strong>
                                                                </div>
                                                                <div class="cart-total-value cart-total-grandTotal">
                                                                    <span>{cartDetails.cart_amount.toLocaleString("en-US", {
                                                                        style: "currency",
                                                                        currency: "USD",
                                                                        minimumFractionDigits: 0,
                                                                    })}</span>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                        <Button> Check out</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </>) : (<>
                                            <div>
                                                Your cart is empty
                                            </div>
                                        </>)}
                                    </div>
                                )
                            }
                            {showErrorModal? <ErrorModal isModalOpen={showErrorModal} onClose={onModalClose} errorMessage={errorMessage}/> : null}
                        </div>
                    </div>
                </div>
                
            </Content>
        </RootElement>
    )
}

export default Cart