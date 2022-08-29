import { Button } from 'antd';
import React from 'react'
import { getCountries } from '../service/big-commerce';


function Demo() {
  return (
    <div>
        <Button onClick={getCountries}>Click me to call big commerce api</Button>  
    </div>
  )
}

export default Demo