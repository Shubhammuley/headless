import React from 'react';
import PropTypes from "prop-types";
import { Button, Form } from 'antd';
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
    } = props;
    return (
        <Form
            form={form}
            initalValues={initalValues}
            onFinish={(value) => {console.log(value)}}
        >
          {
            fields && fields.length && fields.map((field, index) => (
              <RenderFormField 
                key={index}
                initalValues={initalValues}
                field={{ ...field }}
                index={index}
              /> 
            ))
          }
          <Form.Item>
            <Button htmlType='submit'>Add to cart</Button>
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