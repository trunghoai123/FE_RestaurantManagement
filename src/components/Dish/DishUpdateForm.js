import React, { useContext } from "react";
import { colors } from "variables";
import styled from "styled-components";
import Button from "components/Button/Button";
import { useForm } from "react-hook-form";
import { AuthContext, useAuthContext } from "utils/context/AuthContext";
import { enqueueSnackbar } from "notistack";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "components/Input/Input";
import { convertBase64 } from "utils/utils";
import {
  addNewDish,
  addNewRoom,
  getAllArea,
  getAllTypeOfDish,
  getAllTypeOfRoom,
  getOneMenu,
  getRoomById,
  getRoomByRoomId,
  updateDish,
  updateRoom,
  uploadImage,
} from "utils/api";
import { useState } from "react";
import { useEffect } from "react";
import TextArea from "components/TextArea/TextArea";
import { getValue } from "@testing-library/user-event/dist/utils";
import Loading from "components/Loading/Loading";
const DishUpdateFormStyles = styled.div`
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

const DishUpdateForm = ({ handleCloseForm = () => {}, mode, setMode }) => {
  const schema = yup
    .object({
      id: yup.string("hãy xem lại mã"),
      // .test({
      //   name: "check-id",
      //   skipAbsent: true,
      //   test(value, ctx) {
      //     if (mode.mode === 2) {
      //       if (value.trim() === "") {
      //         return ctx.createError({ message: "hãy nhập mã" });
      //       }
      //     }
      //     return true;
      //   },
      // }),
      name: yup.string("Hãy kiểm tra lại tên món").required("Hãy nhập tên món"),
      dishType: yup.string("Hãy kiểm tra loại món").required("chọn loại món"),
      price: yup.string("Hãy kiểm tra lại giá món").required("Hãy nhập giá món"),
      detail: yup.string("Hãy kiểm tra lại chi tiết"),
      unit: yup.string("Hãy kiểm tra lại chi tiết").required("Hãy nhập đơn vị tính"),
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
    defaultValues: {},
    resolver: yupResolver(schema),
  });
  console.log(getValues("id"));
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isLoadedImage, setIsLoadedImage] = useState(false);
  const [imageSelecting, setImageSelecting] = useState("");
  const [dishTypeStatus, setDishTypeStatus] = useState(0);
  const [dishTypes, setDishTypes] = useState([]);
  const [roomKinds, setRoomKinds] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const loadUpdatingDish = async () => {
      try {
        const data = await getOneMenu(mode.id);
        if (data?.data) {
          setValue("name", data.data.TenMon);
          setValue("price", data.data.GiaMon);
          setValue("dishType", data.data.MaLoai);
          setValue("details", data.data.MoTa);
          setImageSelecting(data.data.HinhAnh);
          setValue("id", data.data._id);
          setValue("unit", data.data.DonViTinh);
          setIsLoadedImage(true);
        }
        if (mode.mode === 1) {
          setDishTypeStatus(2);
        } else if (mode.mode === 2) {
          setDishTypeStatus(1);
        }
      } catch (error) {
        setDishTypeStatus(1);
        console.log(error);
        return;
      }
    };
    const loadAllDishTypes = async () => {
      try {
        const data = await getAllTypeOfDish();
        if (data?.data) {
          setDishTypes(data.data);
        }
        if (mode.mode === 1 || mode.mode === 3) {
          // updating and viewing
          setDishTypeStatus(2);
        } else if (mode.mode === 2) {
          // adding
          setDishTypeStatus(1);
        }
      } catch (error) {
        console.log(error);
        return;
      }
    };
    if (dishTypeStatus === 0) {
      loadAllDishTypes();
      setDishTypeStatus(1);
    } else if (dishTypeStatus === 1) {
      setValue("dishType", dishTypes[0]._id);
      setDishTypeStatus(3);
    } else if (dishTypeStatus === 2) {
      loadUpdatingDish();
      setDishTypeStatus(3);
    }
  }, [dishTypes]);

  const loadAllKindOfRoom = async () => {
    try {
      const data = await getAllTypeOfRoom();
      if (data?.data) {
        if (mode.mode === 2) {
          setValue("kindOfRoom", data.data[2]._id);
        }
        setRoomKinds(data.data);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const loadRoomOnUpdate = async () => {
    try {
      const data = await getRoomById(mode.id);
      const room = data.data;
      setCurrentRoom(room);
      if (room) {
        console.log(room);
        setValue("id", room.MaPhong);
        setValue("size", room.SoChoNgoiToiDa);
        setValue("area", room.MaKhuVuc);
        setValue("kindOfRoom", room.MaLoai);
        setValue("status", room.TrangThai);
        setImageSelecting(room.HinhAnh);
        setIsLoadedImage(true);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  // const loadAllArea = async () => {
  //   try {
  //     const data = await getAllArea();
  //     if (data?.data) {
  //       if (mode.mode === 2) {
  //         setValue("area", data.data[0]._id);
  //       }
  //       setDishes(data.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return;
  //   }
  // };
  const onSubmit = async (values) => {
    if (!isLoadedImage) {
      setError("image", { type: "required", message: "Hãy chọn ảnh" });
    } else {
      clearErrors("image");
      if (mode.mode === 1) {
        //update
        const updatedDish = {
          id: values.id,
          TenMon: values.name,
          GiaMon: values.price,
          DonViTinh: values.unit,
          MoTa: values.details,
          HinhAnh: imageSelecting,
          MaLoai: values.dishType,
        };
        console.log(updatedDish);
        try {
          const addAreaRs = await updateDish(updatedDish);
          if (addAreaRs.data._id) {
            enqueueSnackbar("Cập nhật món thành công", {
              variant: "success",
            });
            handleCloseForm();
          }
        } catch (error) {
          console.log(error);
          enqueueSnackbar("Lỗi!. Không thể cập nhật món", {
            variant: "error",
          });
        }
      } else {
        const checkingRs = false;
        if (!checkingRs) {
          const newDish = {
            TenMon: values.name,
            GiaMon: values.price,
            DonViTinh: values.unit,
            MoTa: values.details,
            HinhAnh: imageSelecting,
            MaLoai: values.dishType,
            // MaPhong: values.id.trim(),
            // TenPhong: values.id.trim(),
            // TrangThai: Number(values.status),
            // SoChoNgoiToiDa: Number(values.size),,l
            // HinhAnh: imageSelecting,
            // MaLoai: values.kind,
            // MaKhuVuc: values.area,
            // TenMon, GiaMon, DonViTinh,MoTa, HinhAnh, MaLoai
          };
          try {
            console.log(newDish);
            const addDishRs = await addNewDish(newDish);
            if (addDishRs.data._id) {
              enqueueSnackbar("Thêm món thành công", {
                variant: "success",
              });
              handleCloseForm();
            }
          } catch (error) {
            console.log(error);
            enqueueSnackbar("Lỗi!. Không thể thêm món", {
              variant: "error",
            });
          }
        } else {
          enqueueSnackbar("Mã món bị trùng", {
            variant: "error",
          });
        }
      }
    }
  };
  const handleChangeImage = async (e) => {
    if (e.target.files.length > 0) {
      setImageLoading(true);
      setIsLoadedImage(true);
      const base64 = await convertBase64(e.target.files[0]);
      uploadImage(base64).then((image) => {
        setImageSelecting(image.data);
        setImageLoading(false);
      });
    } else {
      setIsLoadedImage(false);
      setImageSelecting(null);
    }
  };
  const { user, updateAuthUser } = useAuthContext();
  return (
    <DishUpdateFormStyles>
      {imageLoading && <Loading></Loading>}
      <form className="main__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="overlay" onClick={handleCloseForm}></div>
        <div className="modal__main">
          <div className="modal__title">
            <span className="close__icon" onClick={handleCloseForm}>
              <i className="fa-solid fa-xmark"></i>
            </span>
            <div className="title__container">
              <h4 className="title__text">{mode?.mode === 1 ? "Cập Nhật Món" : "Thêm Món"}</h4>
            </div>
          </div>
          <div className="modal__body">
            <div className="general__infor">
              <div className="row__container">
                <div className="value__container">
                  <div className="label__container">
                    <label className="label" htmlFor="size">
                      Mã
                    </label>
                  </div>
                  <div className="input__container">
                    <Input
                      disabled={true}
                      className="input"
                      id="id"
                      type="text"
                      name="id"
                      autoComplete="off"
                      {...register("id")}
                    />
                  </div>
                  {errors?.id && (
                    <div className="error__container">
                      <div className="error__message">{errors?.id?.message}</div>
                    </div>
                  )}
                </div>
                <div className="value__container">
                  <div className="label__container">
                    <label className="label" htmlFor="data">
                      Tên món
                    </label>
                  </div>
                  <div className="input__container">
                    <Input
                      disabled={mode.mode === 3}
                      autoComplete="off"
                      type="text"
                      className="input"
                      min="1"
                      id="name"
                      name="name"
                      {...register("name")}
                    />
                  </div>
                  {errors?.name && (
                    <div className="error__container">
                      <div className="error__message">{errors?.name?.message}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="row__container">
                <div className="value__container">
                  <div className="label__container">
                    <label className="label" htmlFor="size">
                      Giá món
                    </label>
                  </div>
                  <div className="input__container">
                    <div className="input__container">
                      <Input
                        disabled={mode.mode === 3}
                        autoComplete="off"
                        type="text"
                        className="input"
                        id="price"
                        name="price"
                        {...register("price")}
                      />
                    </div>
                  </div>
                  {errors?.price && (
                    <div className="error__container">
                      <div className="error__message">{errors?.price?.message}</div>
                    </div>
                  )}
                </div>
                <div className="value__container">
                  <div className="label__container">
                    <label className="label" htmlFor="size">
                      Loại
                    </label>
                  </div>
                  <div className="input__container">
                    <select
                      disabled={mode.mode === 3}
                      name="area"
                      className="select__box"
                      {...register("dishType")}
                    >
                      {dishTypes?.length > 0 &&
                        dishTypes.map((dish) => {
                          return (
                            <option key={dish?._id} className="option" value={dish?._id}>
                              {dish?.TenLoai}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  {errors?.area && (
                    <div className="error__container">
                      <div className="error__message">{errors?.area?.message}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="row__container">
                <div className="value__container">
                  <div className="label__container">
                    <label className="label">Chi tiết</label>
                  </div>
                  <div className="input__container" htmlFor="note">
                    <TextArea
                      disabled={mode.mode === 3}
                      resize="none"
                      rows="3"
                      id="details"
                      className="input"
                      {...register("details")}
                    ></TextArea>
                  </div>
                  {errors?.details && (
                    <div className="error__container">
                      <div className="error__message">{errors?.details?.message}</div>
                    </div>
                  )}
                </div>
                <div className="value__container">
                  <div className="label__container">
                    <label className="label" htmlFor="size">
                      Đơn vị tính
                    </label>
                  </div>
                  <div className="input__container">
                    <div className="input__container">
                      <Input
                        disabled={mode.mode === 3}
                        autoComplete="off"
                        type="text"
                        className="input"
                        id="unit"
                        name="unit"
                        {...register("unit")}
                      />
                    </div>
                  </div>
                  {errors?.unit && (
                    <div className="error__container">
                      <div className="error__message">{errors?.unit?.message}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="row__container">
                <div className="value__container">
                  <div className="label__container">
                    <label className="label" htmlFor="time">
                      Hình ảnh
                    </label>
                  </div>
                  <div className="input__container img__file__container">
                    <label className="label__upload" htmlFor="image">
                      <i className="fa-solid fa-upload"></i>
                    </label>
                    <Input
                      disabled={mode.mode === 3}
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
            </div>
          </div>
          <div className="modal__footer">
            <div className="btn__container">
              <Button
                type="button"
                bgColor={mode.mode === 3 ? colors.green_1 : colors.red_1}
                bgHover={mode.mode === 3 ? colors.green_1_hover : colors.red_1_hover}
                className="btn__cancel"
                onClick={handleCloseForm}
              >
                <div>{mode.mode !== 3 ? "Hủy" : "Xong"}</div>
              </Button>
              {mode.mode !== 3 && (
                <Button
                  type="submit"
                  bgColor={colors.orange_2}
                  bgHover={colors.orange_2_hover}
                  className="btn__confirm"
                >
                  <div>Xác Nhận</div>
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </DishUpdateFormStyles>
  );
};

DishUpdateForm.propTypes = {};

export default DishUpdateForm;
