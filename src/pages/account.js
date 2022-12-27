import React, { useMemo } from 'react'
import YourAccount from '../modules/yourAccount';

const tabInfo = [
    {
        name: 'order',
        to: '/account?action=order',
        breadCrumb: 'Your Orders',
        title: 'Orders'
    }
]
function Account({ location }) {
    const selectedtabInfo = useMemo(() => {
        const params = new URLSearchParams(location.search);
        const parameter1 = params.get("action");
        return tabInfo.find((item) => parameter1 || 'order')
    }, [location]);

    return (
        <YourAccount to={selectedtabInfo.to} tab={selectedtabInfo.name} breadCrumb={selectedtabInfo.breadCrumb} title={selectedtabInfo.title} />
    )
}

export default Account