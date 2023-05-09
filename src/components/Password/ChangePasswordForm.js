import React from "react";
import { colors } from "variables";
import styled from "styled-components";
import Button from "components/Button/Button";
import { useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "components/Input/Input";
import TextArea from "components/TextArea/TextArea";
import { convertBase64 } from "utils/utils";
import {
  addNewArea,
  changePassword,
  getAreaByAreaId,
  getAreaById,
  updateArea,
  uploadImage,
} from "utils/api";
import { useState } from "react";
import { useEffect } from "react";
import { useAuthContext } from "utils/context/AuthContext";
const ChangePasswordFormStyles = styled.div`
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
      width: 30%;
      height: 70%;
      display: flex;
      flex-direction: column;
      .modal__title {
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
              align-self: start;
              position: relative;
              width: 100% !important;
              .label__container {
                padding-bottom: 6px;
                min-width: 20%;
                .label {
                }
              }
              .input__container {
                &.img__file__container {
                  position: relative;
                  input[type="file"] {
                    cursor: pointer;
                  }
                  .label__upload {
                    cursor: pointer;
                    position: absolute;
                    top: 50%;
                    left: 90px;
                    font-size: 22px;
                    text-align: center;
                    transform: translate(-50%, -50%);
                    color: black;
                    background-color: rgba(0, 0, 0, 0.15);
                    padding: 10px;
                    height: 50px;
                    width: 50px;
                    border-radius: 50%;
                  }
                }
                &.phone__input__container {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  column-gap: 12px;
                  .shared__place {
                    /* width: auto; */
                    /* flex: 1; */
                  }
                  .btn__search--phone {
                    /* margin-left: auto; */
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
                  width: 100%;
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

const ChangePasswordForm = ({ handleCloseForm = () => {} }) => {
  const schema = yup
    .object({
      oldPassword: yup.string("hãy xem lại số lượng chỗ ngồi").required("Hãy nhập mật khẩu"),
      newPassword: yup
        .string("hãy xem lại mật khẩu")
        .min(8, "Mật khẩu yêu cầu ít nhất 8 ký tự")
        .required("Hãy nhập mật khẩu"),
      retypePassword: yup
        .string("hãy xem lại mật khẩu")
        .required("hãy nhập mật khẩu xác nhận")
        .test({
          name: "is-retyped",
          skipAbsent: true,
          test(value, ctx) {
            // console.log(value);
            // console.log(ctx.options.parent);
            if (!(value === ctx.options.parent.newPassword)) {
              return ctx.createError({ message: "Mật khẩu xác nhận sai" });
            }
            return true;
          },
        }),
    })
    .required();
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      maxSize: 50,
    },
    resolver: yupResolver(schema),
  });
  const { user } = useAuthContext();
  const onSubmit = async (values) => {
    const { oldPassword, newPassword, retypePassword } = values;
    console.log(user);
    const updatedPassword = {
      Email: user.Email,
      MatKhauCu: oldPassword.trim(),
      MatKhauMoi: newPassword.trim(),
    };
    try {
      const data = await changePassword(updatedPassword);
      if (data?.success) {
        enqueueSnackbar("Đổi mật khẩu thành công", {
          variant: "success",
        });
        handleCloseForm();
      }
    } catch (error) {
      enqueueSnackbar("Đổi mật khẩu không thành công, hãy kiểm tra lại mật khẩu", {
        variant: "error",
      });
    }
  };

  return (
    <ChangePasswordFormStyles>
      <form className="main__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="overlay" onClick={handleCloseForm}></div>
        <div className="modal__main">
          <div className="modal__title">
            <span className="close__icon" onClick={handleCloseForm}>
              <i className="fa-solid fa-xmark"></i>
            </span>
            <div className="title__container">
              <h4 className="title__text">Đổi mật khẩu</h4>
            </div>
          </div>
          <div className="modal__body">
            <div className="general__infor">
              <div className="row__container">
                <div className="value__container">
                  <div className="label__container">
                    <label className="label" htmlFor="size">
                      Mật khẩu cũ
                    </label>
                  </div>
                  <div className="input__container">
                    <Input
                      className="input"
                      id="id"
                      type="password"
                      name="oldPassword"
                      autoComplete="off"
                      {...register("oldPassword")}
                    />
                  </div>
                  {errors?.oldPassword && (
                    <div className="error__container">
                      <div className="error__message">{errors?.oldPassword?.message}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="row__container">
                <div className="value__container">
                  <div className="label__container">
                    <label className="label" htmlFor="data">
                      Mật khẩu mới
                    </label>
                  </div>
                  <div className="input__container">
                    <Input
                      autoComplete="off"
                      type="password"
                      className="input"
                      id="newPassword"
                      name="newPassword"
                      {...register("newPassword")}
                    />
                  </div>
                  {errors?.newPassword && (
                    <div className="error__container">
                      <div className="error__message">{errors?.newPassword?.message}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="row__container">
                <div className="value__container">
                  <div className="label__container">
                    <label className="label" htmlFor="data">
                      Nhập lại mật khẩu mới
                    </label>
                  </div>
                  <div className="input__container">
                    <Input
                      autoComplete="off"
                      newPassword
                      type="password"
                      className="input"
                      id="retypePassword"
                      name="retypePassword"
                      {...register("retypePassword")}
                    />
                  </div>
                  {errors?.retypePassword && (
                    <div className="error__container">
                      <div className="error__message">{errors?.retypePassword?.message}</div>
                    </div>
                  )}
                </div>
              </div>
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
    </ChangePasswordFormStyles>
  );
};

ChangePasswordForm.propTypes = {};

export default ChangePasswordForm;
