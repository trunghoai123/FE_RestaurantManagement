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
  addNewRoom,
  getAllArea,
  getAllTypeOfRoom,
  getRoomById,
  getRoomByRoomId,
  updateRoom,
  uploadImage,
} from "utils/api";
import { useState } from "react";
import { useEffect } from "react";
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
      id: yup.string("hãy xem lại mã").test({
        name: "check-id",
        skipAbsent: true,
        test(value, ctx) {
          if (mode.mode === 2) {
            if (value.trim() === "") {
              return ctx.createError({ message: "hãy nhập mã" });
            }
          }
          return true;
        },
      }),
      size: yup
        .string("hãy xem lại số người")
        .required("hãy nhập số người")
        .test({
          name: "check-size",
          skipAbsent: true,
          test(value, ctx) {
            if (isNaN(Number(value)) || Number(value) === 0) {
              return ctx.createError({ message: "hãy nhập số lượng phù hợp" });
            }
            return true;
          },
        }),
      area: yup.string("Hãy kiểm tra lại khu vực").required("Hãy chọn khu vực"),
      kindOfRoom: yup.string("Hãy kiểm tra lại loại phòng").required("Hãy chọn loại phòng"),
      status: yup.string("Hãy kiểm tra lại trạng thái").required("Hãy chọn trạng thái"),
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
    defaultValues: {},
    resolver: yupResolver(schema),
  });

  const [currentRoom, setCurrentRoom] = useState(null);
  const [isLoadedImage, setIsLoadedImage] = useState(false);
  const [imageSelecting, setImageSelecting] = useState("");
  const [areas, setAreas] = useState([]);
  const [roomKinds, setRoomKinds] = useState([]);

  useEffect(() => {
    if (mode.mode === 1) {
      loadRoomOnUpdate();
    }
    loadAllArea();
    loadAllKindOfRoom();
  }, []);
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

  const loadAllArea = async () => {
    try {
      const data = await getAllArea();
      if (data?.data) {
        if (mode.mode === 2) {
          setValue("area", data.data[0]._id);
        }
        setAreas(data.data);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const onSubmit = async (values) => {
    if (!isLoadedImage) {
      setError("image", { type: "required", message: "Hãy chọn ảnh" });
    } else {
      clearErrors("image");
      if (mode.mode === 1) {
        //update
        const updatedArea = {
          id: currentRoom._id,
          TenPhong: currentRoom._id,
          TrangThai: Number(values.status),
          SoChoNgoiToiDa: values.size,
          HinhAnh: imageSelecting,
          MaLoai: values.kindOfRoom,
          MaKhuVuc: values.area,
          //-------------------
          // id: currentArea?._id,
          // TenKhuVuc: values.name.trim(),
          // HinhAnh: imageSelecting,
          // MoTa: values.description.trim(),
          // ViTriCuThe: values.detail.trim(),
          // SoNguoiToiDa: currentArea?.SoNguoiToiDa,
          //-------------
          // id,
          // TenPhong,
          // TrangThai,
          // SoChoNgoiToiDa,
          // HinhAnh,
          // MaLoai,
          // MaKhuVuc,
        };
        try {
          const addAreaRs = await updateRoom(updatedArea);
          if (addAreaRs.data._id) {
            enqueueSnackbar("Cập nhật phòng thành công", {
              variant: "success",
            });
            handleCloseForm();
          }
        } catch (error) {
          console.log(error);
          enqueueSnackbar("Lỗi!. Không thể cập nhật phòng", {
            variant: "error",
          });
        }
      } else {
        // mode.mode = 2 - add
        const checkRoomById = async () => {
          try {
            const data = await getRoomByRoomId(values.id.trim());
            if (data.data) {
              return true;
            } else {
              return false;
            }
          } catch (error) {
            console.log(error);
            return false;
          }
        };
        const checkingRs = await checkRoomById();
        if (!checkingRs) {
          const newRoom = {
            MaPhong: values.id.trim(),
            TenPhong: values.id.trim(),
            TrangThai: Number(values.status),
            SoChoNgoiToiDa: Number(values.size),
            HinhAnh: imageSelecting,
            MaLoai: values.kind,
            MaKhuVuc: values.area,
            //-------------
            // MaKhuVuc: values.id.trim(),
            // TenKhuVuc: values.name.trim(),
            // HinhAnh: imageSelecting,
            // MoTa: values.description.trim(),
            // ViTriCuThe: values.detail.trim(),
            // SoNguoiToiDa: 0,
            // ---------------
            // MaPhong,
            // TenPhong,
            // TrangThai,
            // SoChoNgoiToiDa,
            // HinhAnh,
            // MaLoai,
            // MaKhuVuc,
          };
          try {
            const addRoomRs = await addNewRoom(newRoom);
            if (addRoomRs.data._id) {
              enqueueSnackbar("Thêm phòng thành công", {
                variant: "success",
              });
              handleCloseForm();
            }
          } catch (error) {
            console.log(error);
            enqueueSnackbar("Lỗi!. Không thể thêm phòng", {
              variant: "error",
            });
          }
        } else {
          enqueueSnackbar("Mã phòng bị trùng", {
            variant: "error",
          });
        }
      }
    }
  };
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
  const { user, updateAuthUser } = useAuthContext();
  return (
    <DishUpdateFormStyles>
      <form className="main__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="overlay" onClick={handleCloseForm}></div>
        <div className="modal__main">
          <div className="modal__title">
            <span className="close__icon" onClick={handleCloseForm}>
              <i className="fa-solid fa-xmark"></i>
            </span>
            <div className="title__container">
              <h4 className="title__text">{mode?.mode === 1 ? "Cập Nhật Phòng" : "Thêm Phòng"}</h4>
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
                      disabled={mode?.mode === 1 ? true : false}
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
                      Số người
                    </label>
                  </div>
                  <div className="input__container">
                    <Input
                      autoComplete="off"
                      type="number"
                      className="input"
                      min="1"
                      id="size"
                      name="size"
                      {...register("size")}
                    />
                  </div>
                  {errors?.size && (
                    <div className="error__container">
                      <div className="error__message">{errors?.size?.message}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="row__container">
                <div className="value__container">
                  <div className="label__container">
                    <label className="label" htmlFor="size">
                      Khu vực
                    </label>
                  </div>
                  <div className="input__container">
                    <select name="area" className="select__box" {...register("area")}>
                      {areas?.length > 0 &&
                        areas.map((area) => {
                          return (
                            <option key={area?._id} className="option" value={area?._id}>
                              {area?.MaKhuVuc}
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
                <div className="value__container">
                  <div className="label__container">
                    <label className="label" htmlFor="data">
                      Loại phòng
                    </label>
                  </div>
                  <div className="input__container">
                    <select name="kindOfRoom" className="select__box" {...register("kindOfRoom")}>
                      {roomKinds?.length > 0 &&
                        roomKinds.map((kind) => {
                          // console.log(kind);
                          return (
                            <option key={kind?._id} className="option" value={kind?._id}>
                              {kind?.TenLoai}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  {errors?.kindOfRoom && (
                    <div className="error__container">
                      <div className="error__message">{errors?.kindOfRoom?.message}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="row__container">
                <div className="value__container">
                  <div className="label__container">
                    <label className="label" htmlFor="data">
                      Trạng thái
                    </label>
                  </div>
                  <div className="input__container">
                    <select name="status" className="select__box" {...register("status")}>
                      <option className="option" value="0">
                        Còn trống
                      </option>
                      <option className="option" value="1">
                        Đang sử dụng
                      </option>
                    </select>
                  </div>
                  {errors?.status && (
                    <div className="error__container">
                      <div className="error__message">{errors?.status?.message}</div>
                    </div>
                  )}
                </div>
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
              </div>
            </div>
          </div>
          <div className="modal__footer">
            <div className="btn__container">
              <Button
                type="button"
                bgColor={colors.red_1}
                bgHover={colors.red_1_hover}
                className="btn__cancel"
                onClick={handleCloseForm}
              >
                <div>Hủy</div>
              </Button>
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
    </DishUpdateFormStyles>
  );
};

DishUpdateForm.propTypes = {};

export default DishUpdateForm;
