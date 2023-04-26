import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "components/Button/Button";
import { colors } from "variables";
import DropdownManage from "components/Dopdown/ButtonDropDown";
import Search from "components/Search";
import axiosClient from "utils/axios";
import {
  deleteDishById,
  deleteRoomById,
  getAllDish,
  getAllRoom,
  getAllTypeOfDish,
  getMenuByAll,
} from "utils/api";
import RoomUpdateForm from "components/Room/RoomUpdateForm";
import { confirmAlert } from "react-confirm-alert";
import { enqueueSnackbar } from "notistack";
import DishUpdateForm from "components/Dish/DishUpdateForm";
import { convertToVND } from "utils/utils";
import SelectBox from "SelectBox/SelectBox";
import Input from "components/Input/Input";
import { useForm } from "react-hook-form";

const DishSearchStyles = styled.div`
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

const DishSearch = (props) => {
  const [dishes, setDishes] = useState();
  const [dishTypes, setDishTypes] = useState();
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [mode, setMode] = useState({ mode: 0, id: null });
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors, isValid, isLoading, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      price: 0,
      type: 0,
    },
  });
  const fetchDishes = async () => {
    try {
      let result;
      if (!getValues("name") && !getValues("price") && !getValues("type")) {
        result = await getAllDish();
      } else {
        const filter = {
          TenMon: getValues("name"),
          GiaMon: getValues("price"),
          MaLoai: Number(getValues("type")) === 0 ? null : getValues("type"),
        };
        console.log(filter);
        result = await getMenuByAll(filter);
        // {TenMon,GiaMon , DonViTinh , MoTa , MaLoai }
      }
      if (result?.data) {
        setDishes(result.data);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  useEffect(() => {
    fetchDishes();
  }, [mode]);
  useEffect(() => {
    const fetchDisheType = async () => {
      try {
        const result = await getAllTypeOfDish();
        if (result?.data) {
          setDishTypes(result.data);
        }
      } catch (error) {
        console.log(error);
        return;
      }
    };
    fetchDisheType();
  }, []);

  const submitSearch = () => {
    fetchDishes();
  };

  const handleClearFilter = () => {
    // {TenMon,GiaMon , DonViTinh , MoTa , MaLoai }
    setValue("id", "");
    setValue("price", 0);
    setValue("type", 0);
    fetchDishes();
  };
  const handleOpenUpdate = (id) => {
    if (id) {
      setMode({ id, mode: 1 });
    } else {
      setMode({ id: null, mode: 2 });
    }
    setOpenUpdateForm(true);
  };
  const handleOpenView = (id) => {
    if (id) {
      setMode({ id, mode: 3 });
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
        await deleteDishById({ id });
        setMode({ ...mode });
        enqueueSnackbar("Đã xóa món", {
          variant: "success",
        });
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Lỗi!. Không thể xóa món", {
          variant: "error",
        });
      }
    };
    confirmAlert({
      title: "Xác nhận",
      message: "Bạn có muốn xóa món đã chọn không",
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
  return (
    <DishSearchStyles>
      <div className="top__actions">
        <form className="filter__container" onSubmit={handleSubmit(submitSearch)}>
          <div className="filter__row">
            <div className="filter__value">
              <label className="filter__value__label">Tên món</label>
              <Input
                className="filter__value__input"
                placeHolder="Mã"
                name="name"
                {...register("name")}
              ></Input>
            </div>

            <div className="filter__value">
              <label className="filter__value__label">Giá từ</label>
              <Input
                min="0"
                max="9999999"
                type="number"
                className="filter__value__input"
                name="price"
                {...register("price")}
              ></Input>
            </div>
            <div className="filter__value">
              <label className="filter__value__label">Loại món</label>
              <SelectBox
                padding="6px 12px"
                className="filter__value__input"
                name="type"
                {...register("type")}
              >
                <option className="option" value="0">
                  Tất cả
                </option>
                {dishTypes?.length &&
                  dishTypes.map((type) => {
                    return (
                      <option key={type?._id} className="option" value={type?._id}>
                        {type?.TenLoai}
                      </option>
                    );
                  })}
              </SelectBox>
            </div>
          </div>
          <div className="filter__row">
            {/* <div className="filter__value">
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

                <option className="option">a</option>
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
                <option className="option">b</option>
              </SelectBox>
            </div> */}
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
              Mã
            </th>
            <th className="table__head" scope="col">
              Tên Món
            </th>
            <th className="table__head" scope="col">
              Loại
            </th>
            <th className="table__head" scope="col">
              Giá
            </th>
            <th className="table__head" scope="col">
              Đơn Vị Tính
            </th>
            <th className="table__head" scope="col">
              Hình Ảnh
            </th>
          </tr>
        </thead>
        <tbody className="table__body">
          {dishes?.map((dish) => {
            return (
              <tr className="table__row" key={dish?._id}>
                <td className="table__data item__id">{dish?._id}</td>
                <td className="table__data">{dish?.TenMon}</td>
                <td className="table__data">{dish?.MaLoai?.TenLoai}</td>
                <td className="table__data">{convertToVND(dish?.GiaMon)}</td>
                <td className="table__data">{dish?.DonViTinh}</td>
                <td className="table__data data__image">
                  <div className="img__container">
                    <img className="data__img" src={dish?.HinhAnh} alt="area-img" />
                  </div>
                </td>
                <td className="table__data">
                  <Button
                    padding="4px 8px"
                    borderRadius="7px"
                    className="button button__update"
                    bgHover={colors.orange_1_hover}
                    bgColor={colors.orange_1}
                    onClick={() => handleOpenUpdate(dish?._id)}
                  >
                    <div>
                      <span className="text">Sửa</span>
                      <i className="icon__item fa-solid fa-pen-to-square"></i>
                    </div>
                  </Button>
                  <Button
                    padding="4px 8px"
                    borderRadius="7px"
                    onClick={() => handleDelete(dish?._id)}
                    className="button button__remove"
                    bgHover={colors.red_1_hover}
                    bgColor={colors.red_1}
                  >
                    <div>
                      <span className="text">Xóa</span>
                      <i className="icon__item fa-solid fa-trash-can"></i>
                    </div>
                  </Button>
                  <Button
                    padding="4px 8px"
                    borderRadius="7px"
                    onClick={() => handleOpenView(dish?._id)}
                    className="button button__view"
                    bgHover={colors.green_1}
                    bgColor={colors.green_1_hover}
                  >
                    <div>
                      <span className="text">Xem</span>
                      <i className="icon__item fa-solid fa-eye"></i>
                    </div>
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {openUpdateForm && (
        <DishUpdateForm
          setMode={setMode}
          mode={mode}
          handleCloseForm={handleCloseUpdateForm}
        ></DishUpdateForm>
      )}
    </DishSearchStyles>
  );
};

DishSearch.propTypes = {};

export default DishSearch;
