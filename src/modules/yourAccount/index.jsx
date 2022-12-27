import React, { useEffect, useState } from 'react'
import RootElement from '../../components/base-layout';
import { Link, navigate } from 'gatsby';
import { Breadcrumb, Layout, Tabs, Table, InputNumber, Button, Input, Form, Modal } from "antd";
import { getAllWishLists } from '../../service';
import WishlistTab from '../wishlist';
import WishListDetail from '../wishlist/wishlist-details'
const { Content } = Layout;

function Wishlist({
    to,
    tab,
    breadCrumb,
    title
}) {
    const [tableLoading, setTableLoading] = useState(true);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [wishlist, setWishlist] = useState([]);
    const [reloadWishlist, setReloadWishlist] = useState(null);
    const [showWishlistDetails, setShowWishListDetails] = useState(false);
    const [wishlistData, setWishlistData] = useState(null);

    const getWishlistCount = async () => {
        try {
            setTableLoading(true);
            const user = JSON.parse(localStorage.getItem("loggedUserBc"));
            const response = await getAllWishLists(user.entityId);
            setWishlist(response.data);
            setWishlistCount(response.meta.pagination.count);
            setTableLoading(false);
        } catch (e) {
            setTableLoading(false);
            console.log(e)
        }
    }
    useEffect(() => {
        getWishlistCount();
    }, [reloadWishlist]);

    const onTabChange = (key) => {
        if(key === 'wishlist') {
            navigate('/wishlist')
        } else {
            navigate(`/account?action=${key}`)
        }
    }

    const reloadWishlistFunction = () => {
        setReloadWishlist(new Date());
    }

    const viewWishListDetails = (data) => {
        setWishlistData(data);
        setShowWishListDetails(true);
    }

    const closeViewWishList = () => {
        setWishlistData(null);
        setShowWishListDetails(false);
    }
    const defaultActiveTab = tab;
    return (
        <RootElement>
            <Content>
                <div className='container'>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to={`/`}>Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to={`/`}>Your Account</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to={to} onClick={showWishlistDetails ? closeViewWishList: null}>{breadCrumb}</Link>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <div className='site-content'>
                        <h2>{title}{wishlistData ? `: ${wishlistData.name}` : null}</h2>
                        <div>

                        </div>
                        <Tabs defaultActiveKey={defaultActiveTab} onChange={onTabChange}>
                            <Tabs.TabPane tab="Orders" key="order">
                                Content of Tab Pane 1
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={`Wishlist(${wishlistCount})`} key="wishlist">
                                {showWishlistDetails ? <WishListDetail wishlistData={wishlistData} /> :
                                <WishlistTab wishlist={wishlist} reloadWishlist={reloadWishlistFunction} tableLoading={tableLoading} onClickView={viewWishListDetails}/> }
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </div>

            </Content>
        </RootElement>
    )
}

export default Wishlist