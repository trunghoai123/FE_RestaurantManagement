import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "components/Button/Button";
import Input from "components/Input/Input";
import TextArea from "components/TextArea/TextArea";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { convertBase64 } from "utils/utils";
import {
  getCustomerByUserId,
  getUserByAccessToken,
  getUserById,
  updateCustomer,
  updateDish,
  uploadImage,
} from "utils/api";
import { colors } from "variables";
import * as yup from "yup";
import { useAuthContext } from "utils/context/AuthContext";
import { enqueueSnackbar } from "notistack";
const ProfileStyles = styled.div`
  padding-top: 54px;
  display: flex;
  justify-content: center;
  .main__form {
    width: 80%;
    .modal__main {
      transition: all ease 200ms;
      border-radius: 6px;
      padding: 20px 5px 20px 20px;
      background-color: white;
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
            margin-left: 8px;
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
              width: 50%;
              .label__container {
                padding-bottom: 6px;
                min-width: 20%;
                .label {
                }
              }
              .input__container {
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
                .select__box {
                  width: 100%;
                  border: 1px solid lightGray;
                  padding: 6px 12px;
                  outline: none;
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

const Profile = (props) => {
  const schema = yup
    .object({
      // email: yup.string("hãy xem lại email").required(),
      phone: yup
        .string("Hãy kiểm tra lại số điện thoại")
        .required("Hãy nhập số điện thoại")
        .matches(/[0][1-9][0-9]{8}\b/g, "Số điện thoại sai"),
      // .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "Số điện thoại sai"),
      fullname: yup
        .string("Hãy kiểm tra họ tên")
        .required("chọn họ tên")
        .matches(
          /^(([a-zA-Z\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*)([a-zA-Z\s\'ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*)([a-zA-Z\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]))*$/,
          "hãy kiểm tra lại họ tên"
        ),
      sex: yup.string("Hãy kiểm tra lại giới tính").required("Hãy nhập giới tính"),
      dob: yup.string("Hãy kiểm tra lại ngày sinh").required("Hãy chọn ngày sinh"),
      address: yup.string("Hãy kiểm tra lại địa chỉ"),
      // detail: yup.string("Hãy kiểm tra lại chi tiết"),
      // unit: yup.string("Hãy kiểm tra lại chi tiết").required("Hãy nhập đơn vị tính"),
    })
    .required();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      dob: "2000-01-01",
      sex: "0",
    },
    resolver: yupResolver(schema),
  });
  const { user, updateAuthUser } = useAuthContext();
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadedImage, setIsLoadedImage] = useState(false);
  const [imageSelecting, setImageSelecting] = useState("");

  const handleChangeImage = async (e) => {
    if (e.target.files.length > 0) {
      setIsLoadedImage(true);
      const base64 = await convertBase64(e.target.files[0]);
      uploadImage(base64).then((image) => {
        setImageSelecting(image.data);
      });
    } else {
      setIsLoadedImage(false);
      setImageSelecting(null);
    }
  };

  useEffect(() => {
    const loadAllDishTypes = async () => {
      try {
        // const accountData = await getUserByAccessToken(user.accessToken);
        // setCurrentUser(accountData.data);
        if (true) {
          const customerData = await getCustomerByUserId(user._id);
          if (customerData?.data) {
            const customer = customerData.data;
            let dob = customer.NgaySinh.split("T")[0];
            // let dobValue = dob[0] + "-" + dob[2] + "-" + dob[1];
            // console.log(dob);
            setCurrentCustomer(customer);
            setValue("dob", dob || "2000-01-01");
            setValue("sex", customer.GioiTinh || "0");
            setValue("phone", customer.SoDienThoai || "");
            setValue("address", customer.DiaChi || "");
            setValue("email", customer.Email || "");
            setValue("fullname", customer.TenKhachHang || "");
            setImageSelecting(customer.HinhAnh);
            setIsLoadedImage(customer.HinhAnh && true);
          }
        }
      } catch (error) {
        console.log(error);
        return;
      }
    };
    if (user) {
      loadAllDishTypes();
    }
  }, [user]);
  const onSubmit = async (values) => {
    // console.log(values);
    if (!isLoadedImage) {
      setError("image", { type: "required", message: "Hãy chọn ảnh" });
    } else {
      clearErrors("image");
      const updatedCustomer = {
        id: currentCustomer._id,
        TenKhachHang: values.fullname.trim(),
        SoDienThoai: values.phone.trim(),
        DiaChi: values.address.trim(),
        NgaySinh: values.dob,
        GioiTinh: values.sex,
        HinhAnh: imageSelecting,
      };
      try {
        const addAreaRs = await updateCustomer(updatedCustomer);
        if (addAreaRs.data._id) {
          enqueueSnackbar("Cập nhật thông tin thành công", {
            variant: "success",
          });
        }
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Lỗi!. Không thể cập nhật thông tin", {
          variant: "error",
        });
      }
    }
  };
  return (
    <ProfileStyles>
      <form className="main__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="overlay"></div>
        <div className="modal__main">
          <div className="modal__title">
            <span className="close__icon">
              <i className="fa-solid fa-xmark"></i>
            </span>
            <div className="title__container">
              <h4 className="title__text">Cập Nhật Thông Tin</h4>
            </div>
          </div>
          <div className="modal__body">
            <div className="general__infor">
              <div className="row__container">
                <div className="value__container">
                  <div className="label__container">
                    <label className="label" htmlFor="time">
                      Ảnh đại diện
                    </label>
                  </div>
                  <div className="input__container img__file__container">
                    <label className="label__upload" htmlFor="image">
                      <i className="fa-solid fa-upload"></i>
                    </label>
                    <Input
                      width="180px"
                      isImgFile={true}
                      type="file"
                      imgUrl={imageSelecting}
                      className="input"
                      name="image"
                      id="image"
                      {...register("image", {
                        onChange: (e) => handleChangeImage(e),
                      })}
                    />
                  </div>
                  {errors?.image && (
                    <div className="error__container">
                      <div className="error__message">{errors?.image?.message}</div>
                    </div>
                  )}
                </div>
                <div className="value__container"></div>
              </div>
              <div className="row__container">
                <div className="value__container">
                  <div className="label__container">
                    <label className="label" htmlFor="size">
                      Họ Tên
                    </label>
                  </div>
                  <div className="input__container">
                    <div className="input__container">
                      <Input
                        autoComplete="off"
                        type="text"
                        className="input"
                        id="fullname"
                        name="fullname"
                        {...register("fullname")}
                      />
                    </div>
                  </div>
                  {errors?.fullname && (
                    <div className="error__container">
                      <div className="error__message">{errors?.fullname?.message}</div>
                    </div>
                  )}
                </div>
                <div className="value__container">
                  <div className="label__container">
                    <span className="label">Giới tính</span>
                  </div>
                  <div className="input__container radio__group">
                    <div className="radio__container">
                      <label htmlFor="male" className="radio__label">
                        Nam
                      </label>
                      <input
                        id="male"
                        className="input__radio"
                        value="0"
                        type="radio"
                        name="sex"
                        {...register("sex")}
                      />
                    </div>
                    <div className="radio__container">
                      <label htmlFor="female" className="radio__label">
                        Nữ
                      </label>
                      <input
                        id="female"
                        className="input__radio"
                        value="1"
                        name="sex"
                        type="radio"
                        {...register("sex")}
                      />
                    </div>
                  </div>
                  {errors?.sex && (
                    <div className="error__container">
                      <div className="error__message">{errors?.sex?.message}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="row__container">
                <div className="value__container">
                  <div className="label__container">
                    <label className="label" htmlFor="size">
                      Email
                    </label>
                  </div>
                  <div className="input__container">
                    <Input
                      disabled={true}
                      className="input"
                      id="email"
                      type="text"
                      name="email"
                      autoComplete="off"
                      {...register("email")}
                    />
                  </div>
                  {errors?.email && (
                    <div className="error__container">
                      <div className="error__message">{errors?.email?.message}</div>
                    </div>
                  )}
                </div>
                <div className="value__container">
                  <div className="label__container">
                    <label className="label" htmlFor="data">
                      Số điện thoại
                    </label>
                  </div>
                  <div className="input__container">
                    <Input
                      autoComplete="off"
                      type="text"
                      className="input"
                      id="phone"
                      name="phone"
                      {...register("phone")}
                    />
                  </div>
                  {errors?.phone && (
                    <div className="error__container">
                      <div className="error__message">{errors?.phone?.message}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="row__container">
                <div className="value__container">
                  <div className="label__container">
                    <label className="label" htmlFor="data">
                      Ngày sinh
                    </label>
                  </div>
                  <div className="input__container">
                    <Input type="date" className="input" id="dob" {...register("dob")} />
                  </div>
                  {errors?.dob && (
                    <div className="error__container">
                      <div className="error__message">{errors?.dob?.message}</div>
                    </div>
                  )}
                </div>
                <div className="value__container">
                  <div className="label__container">
                    <label className="label" htmlFor="data">
                      Địa chỉ
                    </label>
                  </div>
                  <div className="input__container">
                    <TextArea
                      autoComplete="off"
                      resize="none"
                      className="input"
                      id="address"
                      name="address"
                      {...register("address")}
                    />
                  </div>
                  {errors?.address && (
                    <div className="error__container">
                      <div className="error__message">{errors?.address?.message}</div>
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
                <div>Lưu</div>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </ProfileStyles>
  );
};

Profile.propTypes = {};

export default Profile;
