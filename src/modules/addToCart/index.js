import React from 'react';
import PropTypes from "prop-types";
import { Button, Form, InputNumber } from 'antd';
import { RenderRadio, RenderSelect, RenderRadioButton } from './radio';


const RenderFormField = ({ field, index, initalValues }) => {
  switch (field.type) {
    case "radio_buttons":
      return <RenderRadio key={index} {...field} />;
    case "dropdown": 
      return <RenderSelect key={index} {...field} value={initalValues} />
    case "rectangles":
    case "swatch":
      return <RenderRadioButton key={index} {...field} />;
    default:
      return null;
  }
}
 function AddToCartForm(props) {
    const {
        fields,
        initalValues,
        form,
        onSubmit,
        outOfStock,
        minQuantity,
        maxQuantity,
        inventory,
        buttonLoading,
    } = props;
    console.log(inventory)
    const maxQnt = maxQuantity > inventory ? maxQuantity : inventory;
    console.log(maxQnt)
    return (
        <Form
            form={form}
            initalValues={{ ...initalValues, quantity: 1 }}
            onFinish={onSubmit}
        >
          {
            fields && fields.length ? fields.map((field, index) => (
              <RenderFormField 
                key={index}
                initalValues={initalValues}
                field={{ ...field }}
                index={index}
              /> 
            )) : null
          }
          <Form.Item name="quantity" className='form-field--increments'>
          <InputNumber min={minQuantity > 0 ? minQuantity : 1} max={maxQnt ||  10000} defaultValue={minQuantity || 1}/>
        </Form.Item>
          <Form.Item className='form-action'>
            <Button htmlType='submit' disabled={outOfStock} loading={buttonLoading}>Add to cart</Button>
          </Form.Item>
        </Form>
    )
}

export default AddToCartForm;

AddToCartForm.propTypes = {
    fields: PropTypes.array,
    initalValues: PropTypes.object,
    form: PropTypes.object,
};

AddToCartForm.defaultProps = {
    fields: [],
    initalValues: {},
    form: {},
};