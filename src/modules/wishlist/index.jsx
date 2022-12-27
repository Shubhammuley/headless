import React, { useState } from 'react';
import { Button, Table } from 'antd';
import { Link } from 'gatsby';

function Wishlist({
  wishlist,
  reloadWishlist,
  tableLoading,
  onClickView
}) {
    const columns = [
        {
            title: 'Wish List Name',
            dataIndex: 'name',
            render: (name, record) => {
                // console.log(record)
                return <a onClick={()=> onClickView(record)}>{name}</a>
            }
        },
        {
            title: 'Item',
            render: (item) => {
                return <span>{item.items.length}</span>
            }
        },
        {
            title: 'Shared',
            dataIndex: 'is_public',
            render: (item) => {
                return <span>{item ? 'Yes' : 'No'}</span>
            }
        },
        {
            title: 'Action',
            render: (item) => {
                return <>
                <Button>Edit</Button>
                <Button>Delete</Button>
                </>
            }
        }
    ]
  return (
    <div>
        <Table pagination={false} columns={columns} dataSource={wishlist} loading={tableLoading} />
    </div>
  )
}

export default Wishlist