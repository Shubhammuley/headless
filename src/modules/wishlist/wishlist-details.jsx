import React, { useEffect, useState } from 'react'
import DefaultLoader from '../../components/PageLoading/DefaultLoader';
import { getProductList } from '../../service';

function WishListDetail({ wishlistData }) {
    console.log(wishlistData)
  const [wishlistDetails, getWishListDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
        const response = await getProductList({ idIn: JSON.stringify(wishlistData.items.map(item => item.product_id ))});
        console.log(response);
    } catch (e) {
        console.log(e)
    }
  }
  useEffect(() => {
    if(wishlistData) {
        fetchData();
    }
  }, [wishlistData]);

  return (
    <div>
        {
            loading ? <DefaultLoader /> : (
                <>
                </>
            )
        }
    </div>
  )
}

export default WishListDetail