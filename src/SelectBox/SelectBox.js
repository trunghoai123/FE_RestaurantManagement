import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "variables";
const SelectBoxStyles = styled.select`
  border: 1px solid ${colors.gray_1};
  outline: none;
  padding: ${(props) => props.padding};
  width: ${(props) => props.width};
`;

const SelectBox = React.forwardRef(
  ({ children, name = "", width = "100%", padding = "0px", ...rest }, ref) => {
    return (
      <SelectBoxStyles {...rest} ref={ref} width={width} padding={padding} name={name}>
        {children}
      </SelectBoxStyles>
    );
  }
);

SelectBox.propTypes = {};

export default SelectBox;
