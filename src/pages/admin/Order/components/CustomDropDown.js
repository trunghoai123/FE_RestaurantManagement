import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getAllTypeOfDish } from "utils/api";

const allproduct = {
  TenLoai: "Tất cả sản phẩm",
};
function CustomDropDown({ selectedItem, setSelectedItem, setLoading, allMenu }) {
  const [dropdown, setDropdown] = useState(true);
  const [selected, setSelected] = useState(allproduct);
  const [menuType, setMenuType] = useState([]);

  useEffect(() => {
    setSelectedItem(allMenu);
    getMenuType();
  }, []);

  const getMenuType = async () => {
    setLoading(true);
    let result = await getAllTypeOfDish();
    if (result && result.data) {
      setLoading(false);
      setMenuType(result.data);
    } else {
      setLoading(false);
      setMenuType([]);
    }
  };

  function renderDropDown() {
    return menuType?.map((item, index) => {
      return (
        <div
          key={index}
          className={`item ${selectedItem == item._id ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            _handleClickDropdown(item);
          }}
        >
          <div className="box">
            <span className="ml-11">{item.TenLoai}</span>
          </div>
        </div>
      );
    });
  }
  function _handleClickDropdown(item) {
    setSelected(item);
    setSelectedItem(item._id);
    setDropdown(true);
  }

  return (
    <DropDown>
      <div
        onClick={() => setDropdown(!dropdown)}
        className={dropdown ? "filter-custom" : "filter-custom click"}
      >
        <div className="filter-option">
          <div className="box">
            <span>{selected.TenLoai}</span>
          </div>
          <div className="icon-down">
            <svg
              width="18"
              height="10"
              viewBox="0 0 18 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 0.999998L9 9L17 1"
                stroke="#444444"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="dropdown">
          <div
            className={`item ${selectedItem == allMenu ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setDropdown(true);
              setSelected(allproduct);
              setSelectedItem(allMenu);
            }}
          >
            <div className="box">
              <span className="ml-11">Tất cả sản phẩm</span>
            </div>
          </div>
          {renderDropDown()}
        </div>
      </div>
    </DropDown>
  );
}
CustomDropDown.propTypes = {};

const DropDown = styled.div`
  .filter-custom {
    z-index: 100;
    background: #ffffff;
    border: 1.5px solid rgb(220, 180, 110, 1);
    border-radius: 10px;
    width: 200px;
    position: relative;
    transition: all 0.2s ease-in;

    &.click .dropdown {
      padding-bottom: 10px;
      max-height: 1000px;
      border: 1.5px solid rgb(220, 180, 110, 1);
    }
    &.click .filter-option .icon-down {
      transform: rotate(180deg);
    }
    .mr--11 {
      margin-right: -11px;
    }
    .ml-11 {
      margin-left: 11px;
    }
    .filter-option {
      cursor: pointer;
      .box {
        border-radius: 10px;
        height: 40px;
        padding: 11px 16px 11px 0;
        display: flex;
        align-items: center;
        justify-content: start;
        :hover {
          background: #f1f1f1;
        }

        .icon {
          width: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: -11px;

          img {
            width: auto;
            height: auto;
          }
        }

        span {
          margin-left: 11px;
          font-weight: 400;
          font-size: 14px;
          line-height: 18px;
          letter-spacing: -0.01em;
          color: #444444;
          white-space: nowrap;
        }
      }

      .icon-down {
        height: 100%;
        display: flex;
        align-items: center;
        position: absolute;
        top: 0;
        right: 8px;
        transition: all 0.2s ease-in;
      }
    }

    .dropdown {
      position: absolute;
      border: none;
      border-radius: 10px;
      overflow: hidden;
      top: calc(100% + 10px);
      background-color: #ffffff;
      left: 0;
      max-height: 0;
      padding-bottom: 0;
      transition: 0.2s ease-in;
      width: 100%;
      height: 300px;
      overflow-y: auto;
      ::-webkit-scrollbar {
        width: 5px;
      }
      ::-webkit-scrollbar-thumb {
        background: rgb(220, 180, 110, 1);
      }

      .item {
        position: relative;
        cursor: pointer;

        &.active {
          .box {
            background: #f1f1f1;
          }
        }
        .box {
          height: 40px;
          padding: 11px 16px 11px 0;
          display: flex;
          align-items: center;
          justify-content: start;
          :hover {
            background: #f1f1f1;
          }

          .icon {
            width: 56px;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              width: auto;
              height: auto;
            }
          }

          span {
            font-weight: 400;
            font-size: 14px;
            line-height: 18px;
            letter-spacing: -0.01em;
            color: #444444;

            &.pl-11 {
              padding-left: 11px;
            }
          }
        }
        .icon-down-up {
          position: absolute;
          top: 12px;
          right: 8px;
          transition: all 0.2s ease-in;
          &.up {
            transform: rotate(180deg);
            ~ .nav {
              display: block;
            }
          }
        }

        .nav {
          display: none;
          transition: all 0.2s ease-in;
          .nav-item {
            height: 36px;
            display: flex;
            align-items: center;
            padding-left: 56px;

            span {
              font-weight: 400;
              font-size: 12px;
              line-height: 18px;
              letter-spacing: -0.01em;
              color: #929292;
            }

            :hover {
              background-color: #f1f1f1;
            }

            &.active {
              background: #f1f1f1;
            }
          }
        }
      }
    }
  }
`;
export default CustomDropDown;
