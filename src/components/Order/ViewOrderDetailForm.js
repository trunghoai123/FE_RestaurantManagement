import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TextArea from "components/TextArea/TextArea";
import Button from "components/Button/Button";
import { colors } from "variables";
import Input from "components/Input/Input";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosClient from "utils/axios";
import { getDishById, getLinkFromImageFile } from "store/dish/dishSlice";
import { useDispatch, useSelector } from "react-redux";
import { addOrder } from "store/order/orderSlice";
import { enqueueSnackbar } from "notistack";
import { redirect, useNavigate } from "react-router";
import axios from "axios";
import { useAuthContext } from "utils/context/AuthContext";
import SelectBox from "SelectBox/SelectBox";
import { clearCart } from "store/cart/cartSlice";
import { useFormStateContext } from "utils/context/FormStateContext";
const ViewModalDetailFormStyles = styled.div`
  transition: all ease 200ms;
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100vh;
  top: 0px;
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
      padding: 20px 5px 20px 20px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      width: 60%;
      height: 90%;
      display: flex;
      flex-direction: column;
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
        overflow: auto;
        padding-right: 10px;
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: lightgrey;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background: #888;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .general__infor {
          .group__title {
            padding-bottom: 20px;
            text-align: center;
            border-top: 1px solid lightgray;
          }
          .row__container {
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            column-gap: 20px;
            .value__container {
              position: relative;
              width: 50%;
              .label__container {
                padding-bottom: 6px;
                min-width: 20%;
                .label {
                }
              }
              .input__container {
                &.phone__input__container {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  column-gap: 12px;
                  .shared__place {
                  }
                  .btn__search--phone {
                  }
                }
                &.time__picker__container {
                  position: relative;
                  display: flex;
                  align-items: center;
                  .time__picker {
                    padding-right: 60px;
                  }
                  .additonal__tail {
                    padding-left: 20px;
                    flex: 1;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: 20px;
                  }
                }
                .input__text {
                }
              }
              .error__container {
                position: absolute;
                bottom: -20px;
                left: 0px;
                color: red;
                font-size: 13px;
                .error__message {
                }
              }
            }
          }
        }
        .main__infor {
          .type__tabs {
            padding-bottom: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            user-select: none;
            border-bottom: 1px solid ${colors.gold_1};
            margin-bottom: 10px;
            .type__tab {
              min-width: 76px;
              text-align: center;
              background-color: ${colors.light_gray_1};
              border: 1px solid ${colors.gray_1};
              padding: 4px 10px;
              &.left {
                border-radius: 5px 0px 0px 0px;
              }
              &.right {
                border-radius: 0px 5px 0px 0px;
              }
              &.active {
                background-color: ${colors.gold_1};
                color: white;
              }
            }
          }
          .row__container {
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            column-gap: 20px;
            .value__container {
              position: relative;
              place-self: flex-start;
              width: 50%;
              .label__container {
                padding-bottom: 6px;
                min-width: 20%;
                .label {
                }
              }
              .input__container {
                .select__box {
                  width: 100%;
                  border: 1px solid lightGray;
                  padding: 6px 12px;
                  outline: none;
                }
                &.time__picker__container {
                  position: relative;
                  display: flex;
                  align-items: center;
                  .time__picker {
                    padding-right: 60px;
                  }
                  .additonal__tail {
                    padding-left: 20px;
                    flex: 1;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: 20px;
                  }
                }
                &.radio__group {
                  display: flex;
                  justify-content: space-around;
                  align-items: center;
                  .radio__container {
                    display: flex;
                    align-items: center;
                    .radio__label {
                      user-select: none;
                      padding-right: 20px;
                    }
                    .input__radio {
                    }
                  }
                }
                .input__text {
                }
              }
              .error__container {
                position: absolute;
                bottom: -20px;
                left: 0px;
                color: red;
                font-size: 13px;
                .error__message {
                }
              }
            }
          }
        }
      }
    }
  }
`;

const ViewModalDetailForm = ({ handleCloseForm = () => {}, cartItems = [] }) => {
  return (
    <ViewModalDetailFormStyles>
      <form className="main__form">
        <div className="overlay" onClick={handleCloseForm}></div>
        <div className="modal__main">
          <div className="modal__title">
            <div className="title__container">
              <h4 className="title__text">Đặt Bàn</h4>
            </div>
          </div>
          <div className="modal__body">
            {/* {user?.LoaiTaiKhoan === 1 && ( */}
            <div className="general__infor customer__infor"></div>
            <hr></hr>
            <div className="general__infor">
              <div className="row__container"></div>
            </div>
          </div>
          <div className="modal__footer">
            <div className="btn__container">
              <Button
                type="submit"
                bgColor={colors.orange_2}
                bgHover={colors.orange_2_hover}
                className="btn__confirm"
              >
                <div>Xác Nhận</div>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </ViewModalDetailFormStyles>
  );
};

ViewModalDetailForm.propTypes = {};

export default ViewModalDetailForm;
