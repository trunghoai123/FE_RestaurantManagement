import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "components/Button/Button";
import { colors } from "variables";
import DropdownManage from "components/Dopdown/ButtonDropDown";
import Search from "components/Search";
import axiosClient from "utils/axios";
import { deleteRoomById, getAllArea, getAllRoom, getAllTypeOfRoom, getRoomByAll } from "utils/api";
import RoomUpdateForm from "components/Room/RoomUpdateForm";
import { confirmAlert } from "react-confirm-alert";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import Input from "components/Input/Input";
import SelectBox from "SelectBox/SelectBox";

const RoomSearchStyles = styled.div`
  padding-top: 54px;
  .top__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 20px;
    .filter__container {
      padding-bottom: 30px;
      .filter__row {
        display: flex;
        .filter__value {
          display: flex;
          column-gap: 20px;
          margin-top: 12px;
          align-items: center;
          &.button__container {
            margin-left: auto;
          }
          .filter__value__label {
            text-align: right;
            display: block;
            width: 120px;
            min-width: 120px;
          }
          .filter__value__input {
            min-width: 180px;
            width: 180px;
          }
        }
      }
    }
  }
  .main__table {
    .table__head--container {
      .table__row {
        .table__head {
        }
      }
    }
    .table__body {
      .table__row {
        .table__data {
          width: 200px;
          overflow-wrap: break-word;
          &.item__id {
            width: 100px;
            max-width: 100px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          &.data__image {
            width: 200px;
            .img__container {
              width: 100%;
              .data__img {
                margin: 0px;
                object-fit: cover;
                width: 150px;
                height: 80px;
              }
            }
          }
          .button {
            margin: 0px 0px 12px 8px;
            &.button__update {
            }
            &.button__remove {
            }
            .text {
            }
            .icon__item {
              margin-left: 6px;
            }
          }
        }
      }
    }
  }
`;

const RoomSearch = (props) => {
  const [rooms, setRoms] = useState();
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [mode, setMode] = useState({ mode: 0, id: null });
  const [areaFilter, setAreaFilter] = useState([]);
  const [typeOfRoom, setTypeOfRoom] = useState([]);
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors, isValid, isLoading, isSubmitting },
  } = useForm({
    defaultValues: {
      id: "",
      //   name: "",
      status: -1,
      numberOfPeople: 2,
      type: 0,
      area: 0,
    },
  });

  const fetchRooms = async () => {
    // {MaPhong,TenPhong , TrangThai , SoChoNgoiToiDa , MaLoai , MaKhuVuc}
    try {
      let result;
      if (!getValues("id") && !getValues("name") && !getValues("status")) {
        result = await getAllRoom();
      } else {
        const filter = {
          MaPhong: getValues("id"),
          //   TenPhong: getValues("name"),
          TrangThai: Number(getValues("status")) === -1 ? null : Number(getValues("status")),
          SoChoNgoiToiDa: Number(getValues("numberOfPeople")),
          MaLoai: Number(getValues("type")) === 0 ? null : getValues("type"),
          MaKhuVuc: Number(getValues("area")) === 0 ? null : getValues("area"),
        };
        console.log(filter);
        result = await getRoomByAll(filter);
      }
      if (result?.data) {
        setRoms(result.data);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [mode]);

  useEffect(() => {
    const fetchAreas = async () => {
      // {MaPhong,TenPhong , TrangThai , SoChoNgoiToiDa , MaLoai , MaKhuVuc}
      try {
        let result = await getAllArea();
        if (result?.data) {
          setAreaFilter(result.data);
        }
      } catch (error) {
        console.log(error);
        return;
      }
    };

    fetchAreas();
  }, []);

  useEffect(() => {
    const fetchAreas = async () => {
      // {MaPhong,TenPhong , TrangThai , SoChoNgoiToiDa , MaLoai , MaKhuVuc}
      try {
        let result = await getAllTypeOfRoom();
        if (result?.data) {
          setTypeOfRoom(result.data);
        }
      } catch (error) {
        console.log(error);
        return;
      }
    };

    fetchAreas();
  }, []);

  const handleOpenUpdate = (id) => {
    if (id) {
      setMode({ id, mode: 1 });
    } else {
      setMode({ id: null, mode: 2 });
    }
    setOpenUpdateForm(true);
  };

  const handleCloseUpdateForm = () => {
    setMode({ id: null, mode: 0 });
    setOpenUpdateForm(false);
  };

  const handleDelete = (id) => {
    const deleteArea = async (id) => {
      try {
        await deleteRoomById({ id });
        setMode({ ...mode });
        enqueueSnackbar("Đã xóa phòng", {
          variant: "success",
        });
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Lỗi!. Không thể xóa phòng", {
          variant: "error",
        });
      }
    };
    confirmAlert({
      title: "Xác nhận",
      message: "Bạn có muốn xóa phòng đã chọn không",
      buttons: [
        {
          label: "Có",
          onClick: () => deleteArea(id),
        },
        {
          label: "Không",
          onClick: () => {},
        },
      ],
    });
  };

  const submitSearch = () => {
    fetchRooms();
  };

  const handleClearFilter = () => {
    setValue("id", "");
    // setValue("name", "");
    setValue("status", -1);
    setValue("numberOfPeople", 1);
    setValue("type", 0);
    setValue("area", 0);
    fetchRooms();
  };

  return (
    <RoomSearchStyles>
      <div className="top__actions">
        <form className="filter__container" onSubmit={handleSubmit(submitSearch)}>
          <div className="filter__row">
            <div className="filter__value">
              <label className="filter__value__label">Mã</label>
              <Input
                className="filter__value__input"
                placeHolder="Mã"
                name="id"
                {...register("id")}
              ></Input>
            </div>
            {/* <div className="filter__value">
              <label className="filter__value__label">Tên phòng</label>
              <Input
                className="filter__value__input"
                placeHolder="Tên Phòng"
                name="name"
                {...register("name")}
              ></Input>
            </div> */}
            <div className="filter__value">
              <label className="filter__value__label">Trạng thái</label>
              <SelectBox
                padding="6px 12px"
                className="filter__value__input"
                name="status"
                {...register("status")}
              >
                <option className="option" value="-1">
                  Tất cả
                </option>
                <option className="option" value="0">
                  Còn trống
                </option>
                <option className="option" value="1">
                  Đang dùng
                </option>
              </SelectBox>
            </div>
            <div className="filter__value">
              <label className="filter__value__label">Số chỗ ngồi</label>{" "}
              <Input
                min="1"
                max="100"
                type="number"
                className="filter__value__input"
                placeHolder="Số chỗ ngồi"
                name="numberOfPeople"
                {...register("numberOfPeople")}
              ></Input>
            </div>
          </div>
          <div className="filter__row">
            <div className="filter__value">
              <label className="filter__value__label">Loại phòng</label>
              <SelectBox
                padding="6px 12px"
                className="filter__value__input"
                name="type"
                {...register("type")}
              >
                <option className="option" value={0}>
                  Tất cả
                </option>
                {typeOfRoom?.length &&
                  typeOfRoom.map((type) => {
                    return (
                      <option className="option" value={type?._id}>
                        {type?.TenLoai}
                      </option>
                    );
                  })}
              </SelectBox>
            </div>
            <div className="filter__value">
              <label className="filter__value__label">Khu vực</label>
              <SelectBox
                padding="6px 12px"
                className="filter__value__input"
                name="area"
                {...register("area")}
              >
                <option value={0} className="option">
                  Tất cả
                </option>
                {areaFilter?.length &&
                  areaFilter.map((area) => {
                    return (
                      <option key={area?._id} value={area?._id} className="option">
                        {area?.TenKhuVuc}
                      </option>
                    );
                  })}
              </SelectBox>
            </div>
            <div className="filter__value button__container">
              <Button
                bgColor={colors.orange_1}
                bgHover={colors.orange_1_hover}
                borderRadius="5px"
                padding="4px 20px"
                width="100px"
                type="button"
                onClick={handleClearFilter}
              >
                <div>Xóa</div>
              </Button>
              <Button
                type="submit"
                bgColor={colors.green_1}
                bgHover={colors.green_1_hover}
                borderRadius="5px"
                padding="4px 20px"
                width="100px"
              >
                <div>Tìm</div>
              </Button>
            </div>
          </div>
        </form>
      </div>
      <table className="main__table table table-striped">
        <thead className="table__head--container">
          <tr className="table__row">
            <th className="table__head item__id" scope="col">
              Mã Phòng
            </th>
            {/* <th className="table__head" scope="col">
              Tên Phòng
            </th> */}
            <th className="table__head" scope="col">
              Khu vực
            </th>
            <th className="table__head" scope="col">
              Loại phòng
            </th>
            <th className="table__head" scope="col">
              Trạng thái
            </th>
            <th className="table__head" scope="col">
              Số Chỗ Ngồi Tối Đa
            </th>
            <th className="table__head" scope="col">
              Hình Ảnh
            </th>
          </tr>
        </thead>
        <tbody className="table__body">
          {rooms?.map((room) => {
            return (
              <tr className="table__row" key={room?._id}>
                <td className="table__data item__id">{room?.MaPhong}</td>
                {/* <td className="table__data">{room?.TenPhong}</td> */}
                <td className="table__data">{room?.MaKhuVuc?.TenKhuVuc}</td>
                <td className="table__data">{room?.MaLoai?.TenLoai}</td>
                <td className="table__data">
                  {room?.TrangThai === 0 ? "Còn trống" : "Đang sử dụng"}
                </td>
                <td className="table__data">{room?.SoChoNgoiToiDa}</td>
                <td className="table__data data__image">
                  <div className="img__container">
                    <img className="data__img" src={room?.HinhAnh} alt="area-img" />
                  </div>
                </td>
                <td className="table__data">
                  <Button
                    padding="4px 8px"
                    borderRadius="7px"
                    className="button button__update"
                    bgHover={colors.orange_1_hover}
                    bgColor={colors.orange_1}
                    onClick={() => handleOpenUpdate(room?._id)}
                  >
                    <div>
                      <span className="text">Sửa</span>
                      <i className="icon__item fa-solid fa-pen-to-square"></i>
                    </div>
                  </Button>
                  <Button
                    padding="4px 8px"
                    borderRadius="7px"
                    onClick={() => handleDelete(room?._id)}
                    className="button button__remove"
                    bgHover={colors.red_1_hover}
                    bgColor={colors.red_1}
                  >
                    <div>
                      <span className="text">Xóa</span>
                      <i className="icon__item fa-solid fa-trash-can"></i>
                    </div>
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {openUpdateForm && (
        <RoomUpdateForm
          setMode={setMode}
          mode={mode}
          handleCloseForm={handleCloseUpdateForm}
        ></RoomUpdateForm>
      )}
    </RoomSearchStyles>
  );
};

RoomSearch.propTypes = {};

export default RoomSearch;
