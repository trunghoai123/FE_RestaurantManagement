import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const DropdownManageStyles = styled.div`
  .dropdown__manage {
    .dropdown__list {
      border-radius: 3px;
    }
    .button__main {
      border-radius: ${(props) => props.borderRadius};
    }
    .dropdown__item {
      cursor: pointer;
      user-select: none;
    }
  }
`;

const DropdownManage = ({ borderRadius = "0px", children, ...rest }) => {
  return (
    <DropdownManageStyles borderRadius={borderRadius}>
      <div className="dropdown dropdown__manage">
        <button
          className="btn btn-primary dropdown-toggle button__main"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Quản Lý
        </button>
        <ul className="dropdown-menu dropdown__list" aria-labelledby="dropdownMenuButton">
          {children}
        </ul>
      </div>
    </DropdownManageStyles>
  );
};

DropdownManage.propTypes = {};

export default DropdownManage;
