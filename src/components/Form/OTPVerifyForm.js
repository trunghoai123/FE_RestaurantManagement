import React, { useEffect } from "react";
import { colors } from "variables";
import styled from "styled-components";
import Button from "components/Button/Button";
import { useForm } from "react-hook-form";
import { convertBase64 } from "utils/utils";
import { resendOTP, uploadImage, verifyOTP } from "utils/api";
import { useState } from "react";
import OtpInput from "react-otp-input";
import { enqueueSnackbar } from "notistack";
import { useAuthContext } from "utils/context/AuthContext";
import { useFormStateContext } from "utils/context/FormStateContext";
const OTPVerifyFormStyles = styled.div`
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
      width: 40%;
      height: 40%;
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
        display: flex;
        align-items: center;
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
      .modal__actions {
        .resend__otp {
          cursor: pointer;
          color: blue;
          font-size: 13px;
          text-decoration: underline;
        }
      }
    }
  }
`;

const OTPVerifyForm = ({ handleCloseForm = () => {}, email = "" }) => {
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
  });
  const {
    openSignIn,
    setOpenSignIn,
    openSignUp,
    setOpenSignUp,
    openOTPVerifyForm,
    setOpenOTPVerifyForm,
  } = useFormStateContext();
  const { updateAuthUser, user } = useAuthContext();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => {
        setTimer((oldTimer) => {
          return oldTimer - 1;
        });
      }, 1000);
    }
  }, [timer]);
  const onSubmit = async () => {
    try {
      const data = await verifyOTP({ Email: email, OTP: otp });
      if (data?.success) {
        enqueueSnackbar("Xác thực thành công", {
          variant: "success",
        });
        updateAuthUser({ ...data.account, ...data.tokens });
        handleCloseAllForm();
      }
    } catch (error) {
      enqueueSnackbar("OTP bị sai hoặc quá thời hạn, hãy kiểm tra lại OTP", {
        variant: "success",
      });
      console.log(error);
    }
  };
  const handleCloseAllForm = () => {
    setOpenSignIn(false);
    setOpenSignUp(false);
    setOpenOTPVerifyForm(false);
  };
  const handleResendOTP = async () => {
    setTimer(120);
    try {
      const value = await resendOTP({ Email: email });
      if (value?.success) {
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
  return (
    <OTPVerifyFormStyles>
      <form className="main__form">
        <div className="overlay" onClick={() => setOpenOTPVerifyForm(false)}></div>
        <div className="modal__main__verify">
          <div className="modal__title">
            <span className="close__icon" onClick={() => setOpenOTPVerifyForm(false)}>
              <i className="fa-solid fa-xmark"></i>
            </span>
            <div className="title__container">
              <h4 className="title__text">Xác thực OTP</h4>
            </div>
          </div>
          <div className="modal__body">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              renderSeparator={<span>-</span>}
              renderInput={(props) => <input {...props} />}
            />
            {/* <div className="input__verify__container">
              <input className="input__verify"></input>
              <input className="input__verify"></input>
              <input className="input__verify"></input>
              <input className="input__verify"></input>
            </div> */}
          </div>
          <div className="modal__actions">
            <span className="resend__otp" onClick={timer ? () => {} : handleResendOTP}>
              Gửi lại mã {`${timer ? "(" + timer + ")" : ""}`}
            </span>
          </div>
          <div className="modal__footer">
            <div className="btn__container">
              <Button
                type="button"
                bgColor={colors.orange_2}
                bgHover={colors.orange_2_hover}
                className="btn__confirm"
                onClick={onSubmit}
              >
                <div>Hoàn tất</div>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </OTPVerifyFormStyles>
  );
};

OTPVerifyForm.propTypes = {};

export default OTPVerifyForm;
