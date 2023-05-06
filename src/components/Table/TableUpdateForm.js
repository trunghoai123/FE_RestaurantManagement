import React, { useContext, useRef } from "react";
import { colors } from "variables";
import styled from "styled-components";
import Button from "components/Button/Button";
import { set, useForm } from "react-hook-form";
import { AuthContext, useAuthContext } from "utils/context/AuthContext";
import { signIn } from "store/auth/authSlice";
import { enqueueSnackbar } from "notistack";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "components/Input/Input";
import { convertBase64 } from "utils/utils";
import {
  addNewArea,
  addNewRoom,
  addNewTable,
  getAllArea,
  getAllTypeOfRoom,
  getAreaByAreaId,
  getAreaById,
  getRoomByAreaId,
  getRoomById,
  getRoomByRoomId,
  getTableById,
  getTableByRoomId,
  getTableByTableId,
  updateArea,
  updateRoom,
  updateTable,
  uploadImage,
} from "utils/api";
import { useState } from "react";
import { useEffect } from "react";
import { getValue } from "@testing-library/user-event/dist/utils";
const TableUpdateFormStyles = styled.div`
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

const schema = yup
  .object({
    id: yup.string("hãy xem lại mã").required("hãy nhập mã"),
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
    size: yup.string("hãy xem lại số chỗ ngồi").required("hãy chọn số chỗ ngồi"),
    number: yup.string("hãy xem lại số thứ tự bàn").required("hãy chọn số thứ tự bàn"),
    // .test({
    //   name: "check-size",
    //   skipAbsent: true,
    //   test(value, ctx) {
    //     if (isNaN(Number(value)) || Number(value) === 0) {
    //       return ctx.createError({ message: "hãy nhập số lượng phù hợp" });
    //     }
    //     return true;
    //   },
    // }),
    // area: yup.string("Hãy kiểm tra lại khu vực").required("Hãy chọn khu vực"),
    // room: yup.string("Hãy kiểm tra lại phòng").required("Hãy chọn phòng"),
    status: yup.string("Hãy kiểm tra lại trạng thái").required("Hãy chọn trạng thái"),
  })
  .required();

const TableUpdateForm = ({ handleCloseForm = () => {}, mode, setMode }) => {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    getValues,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: "",
      size: 2,
      status: 0,
      number: 1,
    },
    resolver: yupResolver(schema),
  });

  const [currentTable, setCurrentTable] = useState(null);
  const [areas, setAreas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoadedArea, setIsLoadedArea] = useState(1);
  const [isLoadedRoom, setIsLoadedRoom] = useState(1);
  useEffect(() => {
    const loadAllRoom = async (area) => {
      try {
        const data = await getRoomByAreaId(area._id);
        if (data?.data) {
          if (mode.mode === 2) {
            const newRooms = getRoomOfRoomType(data?.data);
            setRooms(newRooms);
            setSelectedRoom(newRooms[0]);
          } else {
            setRooms(data.data);
            setSelectedRoom(data.data[0]);
          }
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
          setAreas(data.data);
          if (mode.mode === 2) {
            setSelectedArea(data.data[0]);
            await loadAllRoom(data.data[0]);
            setIsLoadedArea(3);
          } else {
            setIsLoadedArea(2);
          }
        }
      } catch (error) {
        console.log(error);
        setIsLoadedArea(2);
        return;
      }
    };
    if (isLoadedArea === 1) {
      loadAllArea();
    } else if (isLoadedArea === 2) {
      const loadData = async () => {
        const tableData = await getTableById(mode.id);
        const table = tableData.data;
        if (table) {
          const room = await getRoomById(table.MaPhong);
          if (room?.data?._id) {
            const area = await getAreaById(room.data.MaKhuVuc);
            if (area?.data?._id) {
              // setValue("area", room.MaKhuVuc);
              // setValue("room", room._id);
              setValue("id", table.MaBan);
              setValue("size", table.SoChoNgoi);
              setValue("status", table.TrangThai === 0 ? 0 : 1);
              setValue("number", table.SoThuTuBan);
              setSelectedArea(area.data);
              setIsLoadedRoom(2);
            }
          }
        }
      };
      loadData();
    }
  }, [areas]);

  const getRoomOfRoomType = (rooms = [], typeId = "641ed8bd029d9e5652b7a468") => {
    const length = rooms?.length || 0;
    let newRooms = [];
    for (let i = 0; i < length; i++) {
      // _id phòng ăn = 641ed8bd029d9e5652b7a468
      if (rooms[i].MaLoai._id === typeId) {
        newRooms.push(rooms[i]);
      }
    }
    return newRooms;
  };
  useEffect(() => {
    const loadRooms = async () => {
      const data = await getRoomByAreaId(selectedArea._id);
      if (data?.data) {
        if (mode.mode === 2) {
          const newRooms = getRoomOfRoomType(data?.data);
          setRooms(newRooms);
        } else {
          setRooms(data.data);
        }
      }
      setIsLoadedRoom(3);
    };
    const selectRoom = async () => {
      const tableData = await getTableById(mode.id);
      const table = tableData.data;
      if (table) {
        const room = await getRoomById(table.MaPhong);
        if (room?.data?._id) {
          setSelectedRoom(room.data);
        }
      }
    };
    if (isLoadedRoom === 2) {
      loadRooms();
    } else if (isLoadedRoom === 3) {
      selectRoom();
      setIsLoadedRoom(1);
    }
  }, [selectedArea, rooms]);

  // const loadAllRoom = async () => {
  //   try {
  //     if (areas && areas?.length > 0) {
  //       const data = await getRoomByAreaId(getValues("area"));
  //       if (data?.data && data?.data?.length > 0) {
  //         setRooms(data.data);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return;
  //   }
  // };

  // const loadRoomOnUpdate = async () => {
  //   try {
  //     if (getValues("room")) {
  //     } else {
  //       const data = await getTableByTableId(mode.id);
  //       const table = data.data;
  //       if (table && mode.mode === 1) {
  //         setValue("room", table.MaPhong.MaPhong);
  //       }
  //     }
  //     // const data = await getTableById(mode.id);
  //   } catch (error) {
  //     console.log(error);
  //     return;
  //   }
  // };

  // const loadTableOnUpdate = async () => {
  //   try {
  //     // const data = await getTableById(mode.id);
  //     const data = await getTableByTableId(mode.id);
  //     const table = data.data;
  //     setCurrentTable(table);
  //     if (table) {
  //       // setValue("area", table.MaKhuVuc.MaKhuVuc);
  //       const area = await getAreaById(table.MaPhong.MaKhuVuc);
  //       if (area?.data) {
  //         // console.log(area);
  //         setValue("area", table.MaPhong.MaKhuVuc);
  //         // setValue("room", table.MaPhong.MaPhong);
  //         setValue("id", table.MaBan);
  //         setValue("size", table.SoChoNgoi);
  //         setValue("status", table.TrangThai === 0 ? 0 : 1);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return;
  //   }
  // };

  const onChangeArea = async (e) => {
    // setSelectedArea()
    const { value } = e.target;
    const area = await getAreaById(value);
    if (area?.data) {
      setSelectedArea(area.data);
    }
    const data = await getRoomByAreaId(value);
    if (data?.data) {
      if (mode.mode === 2) {
        const newRooms = getRoomOfRoomType(data?.data);
        setRooms(newRooms);
        setSelectedRoom(newRooms[0]);
      } else {
        setRooms(data.data);
        setSelectedRoom(data.data[0]);
      }
    }
  };

  const onChangeRoom = async (e) => {
    const room = await getRoomById(e.target.value);
    if (room?.data) {
      setSelectedRoom(room.data);
    }
  };

  const onSubmit = async (values) => {
    if (selectedRoom?._id && selectedArea?._id) {
      if (mode.mode === 1) {
        //update
        const updatedTableValue = {
          id: mode.id,
          SoChoNgoi: Number(values.size),
          SoThuTuBan: Number(values.number),
          TrangThai: Number(values.status),
          MaPhong: selectedRoom._id,
          // {id,SoThuTuBan , TrangThai  , SoChoNgoi , MaPhong}
        };
        try {
          const updatedTable = await updateTable(updatedTableValue);
          if (updatedTable?.data?._id) {
            enqueueSnackbar("Cập nhật bàn thành công", {
              variant: "success",
            });
            handleCloseForm();
          }
        } catch (error) {
          console.log(error);
          enqueueSnackbar("Lỗi!. Không thể cập nhật bàn", {
            variant: "error",
          });
        }
      } else {
        // mode.mode = 2 - add
        const checkTableById = async () => {
          try {
            const data = await getTableByTableId(values.id.trim());
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
        const checkingRs = await checkTableById();
        if (!checkingRs) {
          const tablesOfRoom = await getTableByRoomId();
          // let count = 0;
          // console.log(tablesOfRoom);
          // if (tablesOfRoom?.data) {
          //   for (let i = 0; i < tablesOfRoom.data.length; i++) {
          //     if (tablesOfRoom.data[i].SoThuTuBan >= count) {
          //       count = tablesOfRoom.data[i].SoThuTuBan + 1;
          //     }
          //   }
          // }
          const newTable = {
            MaBan: values.id.trim(),
            SoChoNgoi: Number(values.size),
            SoThuTuBan: Number(values.number),
            TrangThai: Number(values.status),
            MaPhong: selectedRoom._id,
            // ----------
            //   MaPhong: values.id.trim(),
            //   TenPhong: values.id.trim(),
            //   TrangThai: Number(values.status),
            //   SoChoNgoiToiDa: Number(values.size),
            //   MaLoai: values.kind,
            //   MaKhuVuc: values.area,
            // -----
            //   MaBan,
            //   SoThuTuBan,
            //   TrangThai,
            //   SoChoNgoi,
            //   MaPhong,
          };
          try {
            console.log(newTable);
            const addTableRs = await addNewTable(newTable);
            if (addTableRs?.data?._id) {
              enqueueSnackbar("Thêm bàn thành công", {
                variant: "success",
              });
              handleCloseForm();
            }
          } catch (error) {
            console.log(error);
            enqueueSnackbar("Lỗi!. Không thể thêm bàn", {
              variant: "error",
            });
          }
        } else {
          enqueueSnackbar("Mã bàn bị trùng", {
            variant: "error",
          });
        }
      }
    } else {
      if (!selectedArea?._id) {
        enqueueSnackbar("Hãy chọn khu vực", {
          variant: "warning",
        });
      } else {
        enqueueSnackbar("Hãy chọn phòng", {
          variant: "warning",
        });
      }
    }
  };

  const { user, updateAuthUser } = useAuthContext();
  return (
    <TableUpdateFormStyles>
      <form className="main__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="overlay" onClick={handleCloseForm}></div>
        <div className="modal__main">
          <div className="modal__title">
            <span className="close__icon" onClick={handleCloseForm}>
              <i className="fa-solid fa-xmark"></i>
            </span>
            <div className="title__container">
              <h4 className="title__text">{mode?.mode === 1 ? "Cập Nhật Bàn" : "Thêm Bàn"}</h4>
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
                      Số chỗ ngồi
                    </label>
                  </div>
                  <div className="input__container">
                    <select name="size" className="select__box" {...register("size")}>
                      <option className="option" value={2}>
                        2
                      </option>
                      <option className="option" value={4}>
                        4
                      </option>
                      <option className="option" value={5}>
                        5
                      </option>
                      <option className="option" value={8}>
                        8
                      </option>
                      <option className="option" value={10}>
                        10
                      </option>
                    </select>
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
                    <select
                      name="area"
                      className="select__box"
                      onChange={onChangeArea}
                      value={selectedArea?._id}
                      //  {...register("area")}
                    >
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
                      Phòng
                    </label>
                  </div>
                  <div className="input__container">
                    <select
                      name="room"
                      className="select__box"
                      onChange={onChangeRoom}
                      value={selectedRoom?._id}
                      //  {...register("room")}
                    >
                      {rooms?.length > 0 &&
                        rooms.map((room) => {
                          return (
                            <option key={room?._id} className="option" value={room?._id}>
                              {room?.MaPhong}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  {errors?.room && (
                    <div className="error__container">
                      <div className="error__message">{errors?.room?.message}</div>
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
                    <label className="label" htmlFor="size">
                      Số thứ tự
                    </label>
                  </div>
                  <div className="input__container">
                    <Input
                      className="input"
                      id="number"
                      type="number"
                      name="number"
                      min="0"
                      autoComplete="off"
                      {...register("number")}
                    />
                  </div>
                  {errors?.number && (
                    <div className="error__container">
                      <div className="error__message">{errors?.number?.message}</div>
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
    </TableUpdateFormStyles>
  );
};

TableUpdateForm.propTypes = {};

export default TableUpdateForm;
