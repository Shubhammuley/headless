import React from "react";
import { Form, Radio, Select } from "antd";
import PropTypes from "prop-types";


const { Option } = Select;

// eslint-disable-next-line import/prefer-default-export
export const RenderRadio = (props) => {
  const { options, label, name } = props;
  return (
    <Form.Item colon={false} {...props}>
      <Radio.Group name={name} label={label}>
        {options.length &&
          options.map((option) => (
            <Radio key={`${option.value}`} value={`${option.value}`}>
              {option.name}
            </Radio>
          ))}
      </Radio.Group>
    </Form.Item>
  );
};

export const RenderRadioButton = (props) => {
  const { options, label, name } = props;
  const { innerKey, renderbox, ...restProps } = props;

  return (
    <Form.Item colon={false} {...restProps} key={innerKey}>
      <Radio.Group name={name} label={label} key={`radioGroup${innerKey}`}>
        {options.length &&
          options.map((option) => (
            <Radio.Button key={`${option.value}`} value={option.value}>
              {renderbox(option)}
            </Radio.Button>
          ))}
      </Radio.Group>
    </Form.Item>
  );
};

export const RenderSelect = (props) => {
    const {
      options,
      name,
      onChange,
      placeholder,
      suffixIcon,
      disabled,
      ...restProps
    } = props;
    return (
      <Form.Item name={name} colon={false} {...restProps}>
        <Select
          onChange={onChange}
          placeholder={`${placeholder}`}
          suffixIcon={suffixIcon}
          disabled={disabled}
        >
          {options.map((option) => (
            <Option value={option.value}>
              {option.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
    );
  };
  
  RenderSelect.propTypes = {
    placeholder: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    rules: PropTypes.instanceOf(Array),
    options: PropTypes.instanceOf(Array),
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
  };
  
  RenderSelect.defaultProps = {
    placeholder: "Select",
    name: "",
    label: "",
    rules: [],
    options: [],
    onChange: () => {},
    disabled: false,
  };
  


RenderRadio.propTypes = {
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  rules: PropTypes.instanceOf(Array),
  options: PropTypes.instanceOf(Array),
};

RenderRadio.defaultProps = {
  placeholder: "",
  disabled: false,
  type: "",
  name: "",
  label: "",
  rules: [],
  options: [],
};
