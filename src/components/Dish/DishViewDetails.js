import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "variables";
import Button from "components/Button/Button";
import Input from "components/Input/Input";
import { convertToVND } from "utils/utils";
import { useDispatch } from "react-redux";
import { addToCartWidthAmount } from "store/cart/cartSlice";

const DishViewDetailsStyles = styled.div`
  transition: all ease 200ms;
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100vh;
  top: 0;
  .main__form {
    .overlay {
      transition: all ease 200ms;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.4);
    }
    .modal__main {
      transition: all ease 200ms;
      border-radius: 6px;
      padding: 20px 20px 20px 20px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      width: 60%;
      height: 70%;
      display: flex;
      flex-direction: column;
      .close__icon {
        font-size: 24px;
        position: absolute;
        right: 5px;
        top: 0;
        cursor: pointer;
        :hover {
          color: red;
          transition: all ease 150ms;
        }
      }
      .modal__title {
        .title__container {
          .title__text {
          }
        }
      }
      .modal__footer {
        padding: 20px 0 0 0;
        border-top: 1px solid ${colors.gray_1};
        .btn__container {
          display: flex;
          justify-content: flex-end;
          .btn__confirm {
          }
        }
      }
      .modal__body {
        flex: 1;
        .general__infor {
          display: flex;
          .img__container {
            width: 40%;
            height: 160px;
            border: 2px solid ${colors.gray_1};
            margin-right: 8px;
            .img__detail {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .info__container {
            width: 60%;
            .value__container {
              margin-bottom: 6px;
              &.long__value {
                max-height: 180px;
                overflow-y: auto;
              }
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 889px) {
    .main__form {
      .modal__main {
        border-radius: 6px;
        padding: 20px 20px 20px 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        width: 90%;
        height: 80%;
        display: flex;
        flex-direction: column;
        .close__icon {
          font-size: 24px;
          position: absolute;
          right: 5px;
          top: 0;
          cursor: pointer;
          :hover {
            color: red;
            transition: all ease 150ms;
          }
        }
        .modal__title {
          .title__container {
            .title__text {
            }
          }
        }
        .modal__footer {
          .btn__container {
            .btn__confirm {
            }
          }
        }
        .modal__body {
          .general__infor {
            display: block;
            .img__container {
              width: 100%;
              height: 200px;
              .img__detail {
              }
            }
            .info__container {
              .value__container {
                &.long__value {
                }
              }
            }
          }
        }
      }
    }
  }
`;

const DishViewDetails = ({ handleClose = () => {}, dish, handleApplyAmount = () => {} }) => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(1);
  const changeAmount = (e) => {
    if (!isNaN(Number(e.target.value))) {
      setAmount(Number(e.target.value));
    }
  };
  return (
    <DishViewDetailsStyles>
      <div className="main__form">
        <div className="overlay" onClick={handleClose}></div>
        <div className="modal__main">
          <span className="close__icon" onClick={handleClose}>
            <i className="fa-solid fa-xmark"></i>
          </span>
          <div className="modal__title">
            <div className="title__container">
              <h4 className="title__text">{dish?.TenMon}</h4>
            </div>
            <hr></hr>
          </div>
          <div className="modal__body">
            <div className="general__infor">
              <div className="img__container">
                <img className="img__detail" src={dish?.HinhAnh} alt="" />
              </div>
              <div className="info__container">
                <div className="value__container">
                  <span className="info__title">Giá: </span>
                  <span className="infor__value">{convertToVND(dish?.GiaMon)}</span>
                  <span className="infor__value"> - {dish?.DonViTinh}</span>
                </div>
                <div className="value__container long__value">
                  <span className="info__title">Mô tả: </span>
                  <span className="infor__value">{dish?.MoTa}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="modal__footer">
            <div className="btn__container">
              <Input
                onChange={changeAmount}
                value={amount}
                min="1"
                max="100"
                type="number"
                width="100px"
              />
              <Button
                onClick={() => handleApplyAmount(amount, dish)}
                type="submit"
                bgColor={colors.orange_2}
                bgHover={colors.orange_2_hover}
                className="btn__confirm"
              >
                <div>Thêm</div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DishViewDetailsStyles>
  );
};

DishViewDetails.propTypes = {};

export default DishViewDetails;
