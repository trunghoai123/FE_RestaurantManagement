import React, { useState } from "react";
import styled from "styled-components";
import Button from "components/Button/Button";
import { colors } from "variables";
import * as yup from "yup";
import { convertToVND } from "utils/utils";
import Input from "components/Input/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getDishByDate } from "utils/api";

const DishStatisticStyles = styled.div`
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
          &.button__container {
            margin-left: auto;
          }
          .value__content {
            margin-top: 12px;
            column-gap: 20px;
            display: flex;
            align-items: center;
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
          .error__message {
            text-align: right;
            font-size: 14px;
            color: red;
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
const schema = yup
  .object({
    dateFrom: yup.string("Hãy xem lại ngày").required("Hãy chọn ngày"),
    dateTo: yup
      .string("hãy xem lại ngày")
      .required("Hãy chọn ngày")
      .test({
        name: "is-true-date-to",
        skipAbsent: true,
        test(value, ctx) {
          if (new Date(value) < new Date(ctx.options.parent.dateFrom)) {
            return ctx.createError({ message: "Phải chọn ngày bằng hoặc sau ngày bắt đầu" });
          }
          return true;
        },
      }),
  })
  .required();
const DishStatistic = (props) => {
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
      dateFrom: "",
      dateTo: "",
    },
    resolver: yupResolver(schema),
  });

  const submitSearch = async (values) => {
    const { dateFrom, dateTo, bookingType } = values;
    try {
      let result;
      //   ThoiGianBatDau,
      //   ThoiGianKetThuc
      const data = {
        ThoiGianBatDau: dateFrom,
        ThoiGianKetThuc: dateTo,
      };
      result = await getDishByDate(data);
      if (result?.data) {
        const sortedDishes = quickSortByQuantity(result?.data);
        const addedTotal = addTotalMoney(sortedDishes);
        setDishes(addedTotal);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const handleClearFilter = () => {
    setValue("dateFrom", "");
    setValue("dateTo", "");
  };
  function quickSortByQuantity(dishes = []) {
    if (dishes.length <= 1) {
      return dishes;
    }

    const pivotIndex = Math.floor(dishes.length / 2);
    const pivot = dishes[pivotIndex].SoLuongBan;

    const less = [];
    const greater = [];

    for (let i = 0; i < dishes.length; i++) {
      if (i === pivotIndex) {
        continue;
      }

      if (dishes[i].SoLuongBan >= pivot) {
        less.push(dishes[i]);
      } else {
        greater.push(dishes[i]);
      }
    }

    return [...quickSortByQuantity(less), dishes[pivotIndex], ...quickSortByQuantity(greater)];
  }

  const addTotalMoney = (dishes = []) => {
    let clonnedDish = [];
    for (let i = 0; i < dishes.length; i++) {
      if (dishes[i].SoLuongBan) {
        clonnedDish.push({ ...dishes[i], TongTien: dishes[i].GiaMon * dishes[i].SoLuongBan });
      } else {
        clonnedDish.push({ ...dishes[i], TongTien: 0 });
      }
    }
    return clonnedDish;
  };

  const handleOpenView = (id) => {
    if (id) {
      setMode({ id, mode: 3 });
    }
    setOpenUpdateForm(true);
  };

  return (
    <DishStatisticStyles>
      <div className="top__actions">
        <form className="filter__container" onSubmit={handleSubmit(submitSearch)}>
          <div className="filter__row">
            <div className="filter__value">
              <div className="value__content">
                <label className="filter__value__label">Từ ngày</label>
                <Input
                  className="filter__value__input"
                  placeHolder="Từ ngày"
                  type="date"
                  name="dateFrom"
                  {...register("dateFrom")}
                ></Input>
              </div>
              {errors?.dateFrom && (
                <div className="error__message">{errors?.dateFrom?.message}</div>
              )}
            </div>
            <div className="filter__value">
              <div className="value__content">
                <label className="filter__value__label">Đến ngày</label>
                <Input
                  className="filter__value__input"
                  type="date"
                  name="dateTo"
                  {...register("dateTo")}
                ></Input>
              </div>
              {errors?.dateTo && <div className="error__message">{errors?.dateTo?.message}</div>}
            </div>
          </div>
          <div className="filter__row">
            <div className="filter__value button__container">
              <div className="value__content">
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
              Giá
            </th>
            <th className="table__head" scope="col">
              Đơn Vị Tính
            </th>
            <th className="table__head" scope="col">
              Số lượng bán
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
                <td className="table__data">{convertToVND(dish?.GiaMon)}</td>
                <td className="table__data">{dish?.DonViTinh}</td>
                <td className="table__data">{dish?.SoLuongBan}</td>
                <td className="table__data">{convertToVND(dish?.TongTien)}</td>
                <td className="table__data data__image">
                  <div className="img__container">
                    <img className="data__img" src={dish?.HinhAnh} alt="area-img" />
                  </div>
                </td>
                <td className="table__data">
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
      {!dishes?.length && (
        <div style={{ textAlign: "center", marginBottom: "400px" }}>Không có món nào</div>
      )}
    </DishStatisticStyles>
  );
};

DishStatistic.propTypes = {};

export default DishStatistic;
