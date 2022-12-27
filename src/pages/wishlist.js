import React from 'react'
import YourAccount from '../modules/yourAccount';

function Wishlist() {
    return (
        <YourAccount to={'/wishlist'} tab={"wishlist"} breadCrumb="Your Wishlists" title="Wish Lists"/>
    )
}

export default Wishlist