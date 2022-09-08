import { Form, Input, Checkbox, Button } from 'antd';
import { navigate } from 'gatsby';
import React, { useState } from 'react';
import { useEffect } from 'react';
import Modal from 'react-modal';
import { createWishList, getAllWishLists, addProductToWishList } from '../../service';
import notfication from '../../components/Notification';

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
function WishListModal({
    isModalOpen = false,
    onClose,
    productId,
    variantId,
}) {
    const [isCreateWishlist, setIsCreateWishList] = useState(false);
    const [wishList, setWishList] = useState([]);
    const [loading, setLoding] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);

    const fetchWishList = async () => {
      try {
        setLoding(true);
        const user = JSON.parse(localStorage.getItem("loggedUserBc"));
        const response = await getAllWishLists(user.entityId);
        setWishList(response.data || []);
        setLoding(false);
        console.log(response)
      } catch(e) {
        console.log(e)
      }
    }

    const addToWishList = async (id) => {
        try {
            const data = {
                wishListId: id,
                wishListItem: [{ product_id: productId, variant_id: variantId }],
            }
            await addProductToWishList(data);
            notfication("success", "Added to wishlist!")
            onClose();
        }catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        const user = localStorage.getItem('loggedUserBc');
        console.log(user)
            if (user && user !== 'null' && user !== 'undefined') {
                fetchWishList();
            } else {
                navigate('/login')
            }
    },[]);


    const createNewWishList = async (value) => {
        try {
            const user = localStorage.getItem('loggedUserBc');
            if (user && user !== 'null' && user !== 'undefined') {
                const userDetails = JSON.parse(user);
                const data = {
                    name: value.name,
                    customerId: userDetails.entityId,
                    isPublic: value.share,
                };
                if (productId) {
                    data.wishListItem = [{ product_id: productId, variant_id: variantId }];
                }
                setButtonLoading(true);
                const result = await createWishList(data);
                setIsCreateWishList(false);
                setButtonLoading(false);
                notfication("success", "Added to wishlist!")
                onClose();
            }
        } catch (e) {
            setButtonLoading(false);
            console.log(e)
        }
    }
    return (
        <div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={onClose}
                contentLabel="Add to Wishlist"
                //   style={customStyles}
                className="Modal"
                overlayClassName="Overlay"
            >
                {/* <h1>{!isCreateWishlist ? "Add to Wishlist" : "New Wish List"}</h1>
          {
            isCreateWishlist ? 
            (<>
               <p>Fill in the form below to create a new Wish List. Click the "Create Wish List" button when you're done.</p>
               
            </>) : null
          } */}
                {
                    isCreateWishlist ? (
                        <>
                            <header>
                                <h1>New Wish List</h1>
                                <p>Fill in the form below to create a new Wish List. Click the "Create Wish List" button when you're done.</p>
                                <span onClick={onClose}>×</span>
                            </header>
                            <Form onFinish={createNewWishList}>
                                <Form.Item
                                    label="Wish List Name"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: "You must enter a wishlist name.",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="share"
                                >
                                    <Checkbox>Share Wish List?</Checkbox>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={buttonLoading}>
                                        Create Wish List
                                    </Button>
                                </Form.Item>

                            </Form>
                        </>
                    ) : (
                        <>
                            <div className="modal-header">
                                <h2 class="modal-header-title">Add to Wishlist</h2>
                                <span onClick={onClose}>×</span>
                            </div>
                            <div>
                                <div>
                                    {wishList && wishList.length ? (
                                        <>
                                          {
                                            wishList.map((item) => {
                                                return <Button onClick={()=> addToWishList(item.id)} key={item.id}>{item.name}</Button>
                                            })
                                          }
                                        </>
                                    ) : (
                                        <>
                                          <p>Please create a new Wishlist</p>
                                        </>
                                    )}
                                    <div>
                                    <Button onClick={() => setIsCreateWishList(true)}>CREATE NEW WISH LIST</Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
            </Modal>

        </div>
    )
}

export default WishListModal