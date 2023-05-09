import React, { useEffect } from "react";
import { colors } from "variables";
import styled from "styled-components";
import Button from "components/Button/Button";
import { useForm } from "react-hook-form";
import { convertBase64 } from "utils/utils";
import { resendOTP, uploadImage, verifyForgetPassword, verifyOTP } from "utils/api";
import { useState } from "react";
import OtpInput from "react-otp-input";
import { enqueueSnackbar } from "notistack";
import { useAuthContext } from "utils/context/AuthContext";
import { useFormStateContext } from "utils/context/FormStateContext";
import * as yup from "yup";
import Input from "components/Input/Input";
import { yupResolver } from "@hookform/resolvers/yup";
const OTPForgetPasswordFormStyles = styled.div`
  transition: all ease 200ms;
  position: fixed;
  z-index: 1000;
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
    .modal__main__verify {
      transition: all ease 200ms;
      border-radius: 6px;
      padding: 20px 5px 20px 20px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      width: 35%;
      height: 55%;
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
        /* display: flex; */
        /* align-items: center; */
        flex: 1;
        overflow: auto;
        padding-right: 10px;
        .otp__container {
          div {
            width: 100%;
            display: flex;
            justify-content: space-around;
            input {
              background-color: white;
              border: 1px solid gray;
              outline: none;
              font-size: 22px;
            }
          }
        }
        .row__container {
          margin-bottom: 30px;
          width: 100%;
          display: block;
          /* display: flex;
          align-items: center;
          column-gap: 20px; */
          .value__container {
            display: block;

            align-self: start;
            position: relative;
            width: 100%;
            .label__container {
              padding-bottom: 6px;
              min-width: 20%;
              display: block;
              text-align: left;
              .label {
              }
            }
            .input__container {
              width: 100%;
              .input {
                font-size: 16px;
              }
            }
            .error__container {
              position: absolute;
              bottom: -20px;
              left: 0px;
              color: red;
              font-size: 13px;
              display: block;
              .error__message {
                display: block;
              }
            }
          }
        }
        .modal__actions {
          display: block;
          padding-bottom: 12px;
          .resend__otp {
            border: none;
            background-color: transparent;
            cursor: pointer;
            color: blue;
            font-size: 13px;
            text-decoration: underline;
          }
        }
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
      }
    }
  }
`;
const schema = yup
  .object({
    email: yup
      .string("Hãy xem lại email")
      .required("Hãy nhập email")
      .email("Hãy xem lại địa chỉ Email"),
  })
  .required();

const OTPForgetPasswordForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "voprogamethu911@gmail.com",
    },
    resolver: yupResolver(schema),
  });
  const {
    openSignIn,
    setOpenSignIn,
    openSignUp,
    setOpenSignUp,
    openOTPVerifyForm,
    setOpenOTPVerifyForm,
    openOTPForgetPasswordForm,
    setOpenOTPForgetPasswordForm,
  } = useFormStateContext();
  const { updateAuthUser, user } = useAuthContext();
  const [otp, setOtp] = useState("");
  const [sendedEmail, setSendedEmail] = useState("");
  const [timer, setTimer] = useState(0);
  const onSubmit = async (values) => {
    setTimer(120);
    try {
      const value = await resendOTP({ Email: values.email.trim() });
      if (value?.success) {
        setSendedEmail(values.email.trim());
        enqueueSnackbar("Gửi OTP mới thành công", {
          variant: "success",
        });
      }
    } catch (error) {
      enqueueSnackbar("Không thể gửi lại mã", {
        variant: "warning",
      });
      console.log(error);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => {
        setTimer((oldTimer) => {
          return oldTimer - 1;
        });
      }, 1000);
    }
  }, [timer]);

  const onSubmitOTP = async () => {
    if (sendedEmail) {
      try {
        const data = await verifyForgetPassword({ Email: sendedEmail, OTP: otp });
        if (data?.success) {
          enqueueSnackbar("Mật khẩu mới đã được gửi về Email" + sendedEmail, {
            variant: "success",
          });
          setOpenOTPForgetPasswordForm(false);
        }
      } catch (error) {
        enqueueSnackbar("OTP bị sai hoặc quá thời hạn, hãy kiểm tra lại OTP", {
          variant: "success",
        });
        console.log(error);
      }
    } else {
      enqueueSnackbar("Chưa gửi mã OTP về email", {
        variant: "warning",
      });
    }
  };

  return (
    <OTPForgetPasswordFormStyles>
      <form className="main__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="overlay" onClick={() => setOpenOTPForgetPasswordForm(false)}></div>
        <div className="modal__main__verify">
          <div className="modal__title">
            <span className="close__icon" onClick={() => setOpenOTPForgetPasswordForm(false)}>
              <i className="fa-solid fa-xmark"></i>
            </span>
            <div className="title__container">
              <h4 className="title__text">Quên mật khẩu</h4>
            </div>
          </div>
          <div className="modal__body">
            <div className="row__container">
              <div className="value__container">
                <div className="label__container">
                  <label className="label" htmlFor="data">
                    Email
                  </label>
                </div>
                <div className="input__container">
                  <Input
                    autoComplete="off"
                    type="email"
                    className="input"
                    id="email"
                    {...register("email")}
                  />
                </div>
                {errors?.email && (
                  <div className="error__container">
                    <div className="error__message">{errors?.email?.message}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal__actions">
              <button type={timer === 0 ? `submit` : "button"} className="resend__otp">
                Gửi mã {`${timer ? "(" + timer + ")" : ""}`}
              </button>
            </div>
            <div className="otp__container">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
              />
            </div>
          </div>
          <div className="modal__footer">
            <div className="btn__container">
              <Button
                type="button"
                bgColor={colors.orange_2}
                bgHover={colors.orange_2_hover}
                className="btn__confirm"
                onClick={onSubmitOTP}
              >
                <div>Hoàn tất</div>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </OTPForgetPasswordFormStyles>
  );
};

OTPForgetPasswordForm.propTypes = {};

export default OTPForgetPasswordForm;
