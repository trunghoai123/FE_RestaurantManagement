import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
const SelectBoxStyles = styled.select``;

const SelectBox = ({ children }) => {
  return <SelectBoxStyles>{children}</SelectBoxStyles>;
};

SelectBox.propTypes = {};

export default SelectBox;
