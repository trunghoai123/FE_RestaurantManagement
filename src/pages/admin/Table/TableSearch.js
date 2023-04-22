import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Search from "components/Search";
import DropdownManage from "components/Dopdown/ButtonDropDown";
import { colors } from "variables";
import Button from "components/Button/Button";
import axiosClient from "utils/axios";
import {
  deleteRoomById,
  deleteTableById,
  getAllArea,
  getAllRoom,
  getAllTable,
  getRoomByAreaId,
  getTableByAll,
} from "utils/api";
import { confirmAlert } from "react-confirm-alert";
import { enqueueSnackbar } from "notistack";
import TableUpdateForm from "components/Table/TableUpdateForm";
import SelectBox from "SelectBox/SelectBox";
import { useForm } from "react-hook-form";
import Input from "components/Input/Input";

const TableSearchStyles = styled.div`
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

const TableSearch = (props) => {
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [mode, setMode] = useState({ mode: 0, id: null });
  const [tables, setTables] = useState();
  const [roomFilter, setRoomFilter] = useState([]);
  const [areaFilter, setAreaFilter] = useState([]);
  const [hasRoom, setHasRoom] = useState(0);
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
      //   number: 1,
      status: -1,
      numberOfPeople: 2,
      room: "",
      area: "",
    },
  });
  const fetchTable = async () => {
    // {MaBan,SoThuTuBan , TrangThai , SoChoNgoi , MaPhong }
    try {
      let result;
      if (
        !getValues("id") &&
        // !getValues("number") &&
        !getValues("numberOfPeople") &&
        !getValues("status") &&
        !getValues("room")
      ) {
        result = await getAllTable();
      } else {
        const filter = {
          MaBan: getValues("id"),
          //   SoThuTuBan: Number(getValues("number")),
          TrangThai: Number(getValues("status")) === -1 ? null : Number(getValues("status")),
          SoChoNgoi: Number(getValues("numberOfPeople")),
          MaPhong: getValues("room"),
        };
        result = await getTableByAll(filter);
      }

      if (result?.data) {
        setTables(result.data);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };
  useEffect(() => {
    fetchTable();
  }, [mode]);

  useEffect(() => {
    const fetchAreas = async () => {
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

  const fetchRooms = async (areaId = "") => {
    try {
      let result;
      if (areaId) {
        result = await getRoomByAreaId(areaId);
      } else {
        result = await getAllRoom();
      }
      if (result?.data) {
        setRoomFilter(result.data);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };
  useEffect(() => {
    const fetchRoom = async () => {
      await fetchRooms();
      setHasRoom(1);
    };
    if (hasRoom === 0) {
      fetchRoom();
    } else if (hasRoom === 1) {
      setValue("room", roomFilter[0]._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        await deleteTableById({ id });
        setMode({ ...mode });
        enqueueSnackbar("Đã xóa bàn", {
          variant: "success",
        });
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Lỗi!. Không thể xóa bàn", {
          variant: "error",
        });
      }
    };
    confirmAlert({
      title: "Xác nhận",
      message: "Bạn có muốn xóa bàn đã chọn không",
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
    fetchTable();
  };

  const handleClearFilter = () => {
    setValue("id", "");
    // setValue("number", 1);
    setValue("numberOfPeople", 1);
    setValue("room", null);
    setValue("area", 0);
    setValue("status", -1);
    fetchTable();
    setHasRoom(0);
    fetchRooms();
  };

  const handleChangeArea = (e) => {
    const areaId = e.target.value;
    console.log("change arrea");
    if (Number(areaId) !== 0) {
      setValue("area", areaId);
      fetchRooms(areaId);
    } else {
      setValue("area", 0);
      fetchRooms();
    }
  };

  return (
    <TableSearchStyles>
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
              <label className="filter__value__label">Số thứ tự</label>
              <Input
                className="filter__value__input"
                placeHolder="Tên Phòng"
                name="number"
                type="number"
                min="1"
                max="100"
                {...register("number")}
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
              <label className="filter__value__label">Số chỗ ngồi</label>
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
              <label className="filter__value__label">Khu vực</label>
              <SelectBox
                padding="6px 12px"
                className="filter__value__input"
                name="area"
                {...register("area")}
                onChange={handleChangeArea}
              >
                <option className="option" value={0}>
                  Tất cả
                </option>
                {areaFilter?.length &&
                  areaFilter.map((area) => {
                    return (
                      <option key={area?._id} className="option" value={area?._id}>
                        {area?.TenKhuVuc}
                      </option>
                    );
                  })}
              </SelectBox>
            </div>
            <div className="filter__value">
              <label className="filter__value__label">Phòng</label>
              <SelectBox
                padding="6px 12px"
                className="filter__value__input"
                name="room"
                {...register("room")}
              >
                {roomFilter?.length &&
                  roomFilter.map((room) => {
                    return (
                      <option key={room?._id} value={room?._id} className="option">
                        {room?.MaPhong}
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
          <div className="filter__row"></div>
        </form>
      </div>
      <table className="main__table table table-striped">
        <thead className="table__head--container">
          <tr className="table__row">
            <th className="table__head item__id" scope="col">
              Mã Bàn
            </th>
            <th className="table__head" scope="col">
              Số Thứ Tự
            </th>
            <th className="table__head" scope="col">
              Phòng
            </th>
            <th className="table__head" scope="col">
              Trạng thái
            </th>
            <th className="table__head" scope="col">
              Số Chỗ Ngồi
            </th>
          </tr>
        </thead>
        <tbody className="table__body">
          {tables?.map((table, index) => {
            return (
              <tr className="table__row" key={table?._id}>
                <td className="table__data item__id" title={table?.MaBan}>
                  {table?.MaBan}
                </td>
                <td className="table__data">{table?.SoThuTuBan}</td>
                <td className="table__data">{table?.MaPhong?.MaPhong}</td>
                <td className="table__data">
                  {table?.TrangThai === 0 ? "Còn trống" : "Đang dùng"}
                </td>
                <td className="table__data">{table?.SoChoNgoi}</td>
                <td className="table__data">
                  <Button
                    padding="4px 8px"
                    borderRadius="7px"
                    className="button button__update"
                    bgHover={colors.orange_1_hover}
                    bgColor={colors.orange_1}
                    onClick={() => handleOpenUpdate(table?._id)}
                  >
                    <div>
                      <span className="text">Cập Nhật</span>
                      <i className="icon__item fa-solid fa-pen-to-square"></i>
                    </div>
                  </Button>
                  <Button
                    padding="4px 8px"
                    borderRadius="7px"
                    className="button button__remove"
                    bgHover={colors.red_1_hover}
                    bgColor={colors.red_1}
                    onClick={() => handleDelete(table?._id)}
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
        <TableUpdateForm
          setMode={setMode}
          mode={mode}
          handleCloseForm={handleCloseUpdateForm}
        ></TableUpdateForm>
      )}
    </TableSearchStyles>
  );
};

TableSearch.propTypes = {};

export default TableSearch;
