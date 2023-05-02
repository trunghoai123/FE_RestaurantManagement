import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "components/Button/Button";
import { colors } from "variables";
import Search from "components/Search";
import DropdownManage from "components/Dopdown/ButtonDropDown";
import axiosClient from "utils/axios";
import AreaUpdateForm from "components/Area/AreaUpdateForm";
import { confirmAlert } from "react-confirm-alert";
import { deleteAreaById, getAllArea, getAreaByAll, getInvoiceByDate } from "utils/api";
import { enqueueSnackbar } from "notistack";
import Input from "components/Input/Input";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import SelectBox from "SelectBox/SelectBox";
import { yupResolver } from "@hookform/resolvers/yup";
import { convertToVND, renderDate } from "utils/utils";
const InvoiceStatisticStyles = styled.div`
  padding-top: 54px;
  .sum__money {
    text-align: right;
    padding: 4px 12px;
    .value__content {
      /* display: inline-block; */
      .filter__value__input {
        width: 200px;
      }
    }
  }
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
    dateTo: yup.string("hãy xem lại ngày").required("Hãy chọn ngày"),
    bookingType: yup.string("hãy xem lại hình thức đặt").required("Hãy chọn hình thức đặt"),
  })
  .required();
const InvoiceStatistic = (props) => {
  const [invoices, setInvoices] = useState();
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [sumStatistics, setSumStatistics] = useState(0);
  const [mode, setMode] = useState({ mode: 0, id: null }); // 0: noneOfBoth, 1: update. 2: add
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
      bookingType: 0,
      statisType: -1,
    },
    resolver: yupResolver(schema),
  });
  // useEffect(() => {
  //   fetchInvoices();
  // }, [mode]);
  // const fetchInvoices = async () => {
  //   try {
  //     let result;
  //     const data = {
  //       ThoiGianBatDau: null,
  //       ThoiGianKetThuc: null,
  //       LoaiHoaDon: null,
  //     };
  //     // {ThoiGianBatDau , ThoiGianKetThuc, LoaiHoaDon}
  //     result = await getInvoiceByDate(data);
  //     // if (result?.data) {
  //     //   console.log(result.data);
  //     //   setInvoices(result.data);
  //     // }
  //   } catch (error) {
  //     console.log(error);
  //     return;
  //   }
  // };

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
        await deleteAreaById({ id });
        setMode({ ...mode });
        enqueueSnackbar("Đã xóa khu vực", {
          variant: "success",
        });
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Lỗi!. Không thể xóa khu vực", {
          variant: "error",
        });
      }
    };
    confirmAlert({
      title: "Xác nhận",
      message: "Bạn có muốn xóa khu vực đã chọn không",
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

  const submitSearch = async (values) => {
    const { dateFrom, dateTo, bookingType } = values;
    try {
      let result;
      // {ThoiGianBatDau , ThoiGianKetThuc, LoaiHoaDon}
      const data = {
        ThoiGianBatDau: dateFrom,
        ThoiGianKetThuc: dateTo,
        LoaiHoaDon: Number(bookingType),
      };
      result = await getInvoiceByDate(data);
      if (result?.data) {
        console.log(result.data);
        setInvoices(result.data);
        calculateSumStatics(result.data);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const handleClearFilter = () => {
    setValue("dateFrom", "");
    setValue("dateTo", "");
    setValue("bookingType", -1);
    setValue("statisType", -1);
    // fetchInvoices();
  };

  const calculateSumStatics = (invoices) => {
    let sum = 0;
    invoices.forEach((invoice) => {
      const { LoaiHoaDon, ListThucDon, ListBan, ListPhong } = invoice;
      sum += calculateMoney(LoaiHoaDon, ListThucDon, ListBan, ListPhong);
    });
    setSumStatistics(sum);
  };

  const calculateMoney = (bookingType, dishes, tables, rooms) => {
    let sum = 0;
    console.log(getValues("statisType"));
    if (Number(getValues("statisType")) === 0) {
      if (dishes?.length) {
        dishes.forEach((dish) => {
          const { MaThucDon, SoLuong } = dish;
          sum += MaThucDon.GiaMon * SoLuong;
        });
      }
    } else if (Number(getValues("statisType")) === 1) {
      if (bookingType === 1) {
        sum += 100000 * rooms.length;
      } else if (bookingType === 2) {
        sum += 300000 * rooms.length;
      }
    } else {
      if (dishes?.length) {
        dishes.forEach((dish) => {
          const { MaThucDon, SoLuong } = dish;
          sum += MaThucDon.GiaMon * SoLuong;
        });
      }
      if (bookingType === 1) {
        // normal
        sum += 100000 * rooms.length;
      } else if (bookingType === 2) {
        // VIP
        sum += 300000 * rooms.length;
      }
    }
    return sum;
  };

  return (
    <InvoiceStatisticStyles>
      <div className="top__actions">
        <form className="filter__container" onSubmit={handleSubmit(submitSearch)}>
          <div className="filter__row">
            <div className="filter__value">
              <div className="value__content">
                <label className="filter__value__label">Mã</label>
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
            <div className="filter__value">
              <div className="value__content">
                <label className="filter__value__label">Loại hóa đơn</label>
                <SelectBox
                  padding="6px 12px"
                  className="filter__value__input"
                  name="bookingType"
                  {...register("bookingType")}
                >
                  <option className="option" value={-1}>
                    Tất cả
                  </option>
                  <option className="option" value={0}>
                    Đặt bàn
                  </option>
                  <option className="option" value={1}>
                    Đặt phòng thường
                  </option>
                  <option className="option" value={2}>
                    Đặt phòng VIP
                  </option>
                </SelectBox>
              </div>
              {errors?.bookingType && (
                <div className="error__message">{errors?.bookingType?.message}</div>
              )}
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
                  width="120px"
                >
                  <div>Thống kê</div>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="sum__money">
        Tổng tiền: {convertToVND(sumStatistics)}
        <div className="value__content">
          <label className="filter__value__label">Thống kê theo: </label>{" "}
          <SelectBox
            padding="6px 12px"
            className="filter__value__input"
            name="statisType"
            {...register("statisType")}
          >
            <option className="option" value={-1}>
              Tất cả
            </option>
            <option className="option" value={0}>
              Món
            </option>
            <option className="option" value={1}>
              Phòng
            </option>
          </SelectBox>
        </div>
      </div>
      <table className="main__table table table-striped">
        <thead className="table__head--container">
          <tr className="table__row">
            <th className="table__head item__id" scope="col">
              Mã hóa đơn
            </th>
            <th className="table__head" scope="col">
              Tên nhân viên
            </th>
            <th className="table__head" scope="col">
              Tên khách hàng
            </th>
            <th className="table__head" scope="col">
              Loại hóa đơn
            </th>
            <th className="table__head" scope="col">
              Thời gian lập
            </th>
            <th className="table__head" scope="col">
              Tổng tiền
            </th>
          </tr>
        </thead>

        <tbody className="table__body">
          {invoices?.map((invoice) => {
            return (
              <tr className="table__row" key={invoice?._id}>
                <td title={invoice?._id} className="table__data item__id">
                  {invoice?._id}
                </td>
                <td className="table__data">{invoice?.MaNhanVien?.TenNhanVien}</td>
                <td className="table__data">{invoice?.HoTen || "Khách vãng lai"}</td>
                <td className="table__data">
                  {invoice?.LoaiHoaDon === 0
                    ? "Đặt bàn"
                    : invoice?.LoaiHoaDon === 1
                    ? "Đặt phòng thường"
                    : "Đặt phòng VIP"}
                </td>
                <td className="table__data">{renderDate(invoice?.createdAt)}</td>
                <td className="table__data">
                  {convertToVND(
                    calculateMoney(
                      invoice.LoaiHoaDon,
                      invoice.ListThucDon,
                      invoice.ListBan,
                      invoice.ListPhong
                    )
                  )}
                </td>
                {/* <td className="table__data">
                  <Button
                    // to={`/admin/area/update/${area?._id}`}
                    borderRadius="8px"
                    padding="4px 8px"
                    onClick={() => handleOpenUpdate(area?._id)}
                    className="button button__update"
                    bgHover={colors.orange_1_hover}
                    bgColor={colors.orange_1}
                  >
                    <div>
                      <span className="text">Sửa</span>
                      <i className="icon__item fa-solid fa-pen-to-square"></i>
                    </div>
                  </Button>
                  <Button
                    borderRadius="8px"
                    padding="4px 8px"
                    className="button button__remove"
                    bgHover={colors.red_1_hover}
                    bgColor={colors.red_1}
                    onClick={() => handleDelete(area?._id)}
                  >
                    <div>
                      <span className="text">Xóa</span>
                      <i className="icon__item fa-solid fa-trash-can"></i>
                    </div>
                  </Button>
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
      {!invoices?.length && (
        <div style={{ textAlign: "center", marginBottom: "400px" }}>Không có hóa đơn nào</div>
      )}
      {openUpdateForm && (
        <AreaUpdateForm
          setMode={setMode}
          mode={mode}
          handleCloseForm={handleCloseUpdateForm}
        ></AreaUpdateForm>
      )}
    </InvoiceStatisticStyles>
  );
};

InvoiceStatistic.propTypes = {};

export default InvoiceStatistic;
