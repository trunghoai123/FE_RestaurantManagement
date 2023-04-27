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
import { enqueueSnackbar } from "notistack";
import Input from "components/Input/Input";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import SelectBox from "SelectBox/SelectBox";
import { yupResolver } from "@hookform/resolvers/yup";
import { convertToVND, renderDate } from "utils/utils";
import { useNavigate } from "react-router-dom";
import { getOrderByAll } from "utils/api";
const OrderSearchStyles = styled.div`
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
// const schema = yup
//   .object({
//     dateFrom: yup.string("Hãy xem lại ngày").required("Hãy chọn ngày"),
//     dateTo: yup.string("hãy xem lại ngày").required("Hãy chọn ngày"),
//     bookingType: yup.string("hãy xem lại hình thức đặt").required("Hãy chọn hình thức đặt"),
//   })
//   .required();
const OrderSearch = (props) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState();
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
      clientId: "",
      phone: "",
      fullname: "",
      email: "",
      status: "",
      bookingType: -1,
      startTime: "",
      // startTime: "",

      // LoaiPhieuDat,
      // TrangThai,
      // HoTen,
      // Email,
      // SoDienThoai,
      // MaNhanVien,
      // MaKhachHang,
      // ThoiGianBatDau,
      // SoLuongNguoiTrenBanOrPhong,
      // SoLuongBanOrPhong,
      // GhiChu,
    },
    // resolver: yupResolver(schema),
  });
  useEffect(() => {
    fetchOrders();
  }, [mode]);
  const handleViewDetail = (id) => {
    navigate(`/admin/order/${id}`);
  };
  const fetchOrders = async () => {
    try {
      let result;
      if (
        !getValues("clientId") &&
        !getValues("phone") &&
        !getValues("status") &&
        !getValues("fullname") &&
        !getValues("bookingType") &&
        !getValues("startTime") &&
        !getValues("email")
        // !getValues("startTime")
      ) {
        const data = {
          MaKhachHang: null,
          LoaiPhieuDat: null,
          TrangThai: null,
          SoLuongNguoiTrenBanOrPhong: null,
          SoLuongBanOrPhong: null,
          ThoiGianBatDau: null,
          GhiChu: null,
          HoTen: null,
          Email: null,
          SoDienThoai: null,
          MaNhanVien: null,
        };
        result = await getOrderByAll(data);
      } else {
        const data = {
          MaKhachHang: getValues("clientId"),
          LoaiPhieuDat:
            Number(getValues("bookingType")) === -1 ? null : Number(getValues("bookingType")),
          TrangThai: Number(getValues("status")) === -1 ? null : Number(getValues("status")),
          SoLuongNguoiTrenBanOrPhong: null,
          SoLuongBanOrPhong: null,
          ThoiGianBatDau: getValues("startTime"),
          GhiChu: null,
          HoTen: getValues("fullname"),
          Email: getValues("email"),
          SoDienThoai: getValues("phone"),
          MaNhanVien: null,
          // MaPhieuDat: getValues("clientId").trim(),
          // MaNhanVien: getValues("staffId").trim(),
          // MaKhachHang: getValues("clientId").trim(),
          // HoTen: getValues("fullname").trim(),
          // SoDienThoai: getValues("phone").trim(),
          // LoaiHoaDon:
          //   Number(getValues("bookingType")) === -1 ? null : Number(getValues("bookingType")),
          // TrangThai: Number(getValues("status")) === -1 ? null : Number(getValues("status")),
          // ThoiGianBatDau: getValues("startTime"),
        };
        result = await getOrderByAll(data);
      }
      // MaKhachHang,
      // LoaiPhieuDat,
      // TrangThai,
      // SoLuongNguoiTrenBanOrPhong,
      // SoLuongBanOrPhong,
      // ThoiGianBatDau,
      // GhiChu,
      // HoTen,
      // Email,
      // SoDienThoai,
      // MaNhanVien,
      if (result?.data) {
        console.log(result.data);
        setOrders(result.data);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const handleCloseUpdateForm = () => {
    setMode({ id: null, mode: 0 });
    setOpenUpdateForm(false);
  };

  const submitSearch = async () => {
    fetchOrders();
  };

  const handleClearFilter = () => {
    setValue("clientId", "");
    setValue("phone", "");
    setValue("status", -1);
    setValue("fullname", "");
    setValue("bookingType", -1);
    setValue("startTime", "");
    setValue("email", "");
    // setValue("orderId", "");
    // setValue("clientId", "");
    // setValue("fullname", "");
    // setValue("bookingType", -1);
    // setValue("phone", "");
    // setValue("status", -1);
    // setValue("startTime", "");
    fetchOrders();
  };

  const calculateMoney = (bookingType, dishes, tables, rooms) => {
    let sum = 0;
    if (dishes?.length) {
      dishes.forEach((dish) => {
        const { MaThucDon, SoLuong } = dish;
        sum += MaThucDon.GiaMon * SoLuong;
      });
    }
    if (bookingType === 1) {
      // normal
      sum += 50000 * rooms.length;
    } else if (bookingType === 2) {
      // VIP
      sum += 100000 * rooms.length;
    }
    return sum;
  };

  return (
    <OrderSearchStyles>
      <div className="top__actions">
        <form className="filter__container" onSubmit={handleSubmit(submitSearch)}>
          <div className="filter__row">
            <div className="filter__value">
              <div className="value__content">
                <label className="filter__value__label">Mã người đặt</label>
                <Input
                  className="filter__value__input"
                  name="clientId"
                  {...register("clientId")}
                ></Input>
              </div>
              {errors?.clientId && (
                <div className="error__message">{errors?.clientId?.message}</div>
              )}
            </div>
            <div className="filter__value">
              <div className="value__content">
                <label className="filter__value__label">SĐT Khách hàng</label>
                <Input className="filter__value__input" name="phone" {...register("phone")}></Input>
              </div>
              {errors?.phone && <div className="error__message">{errors?.phone?.message}</div>}
            </div>
            <div className="filter__value">
              <div className="value__content">
                <label className="filter__value__label">Tên khách hàng</label>
                <Input
                  className="filter__value__input"
                  name="fullname"
                  {...register("fullname")}
                ></Input>
              </div>
              {errors?.fullname && (
                <div className="error__message">{errors?.fullname?.message}</div>
              )}
            </div>
          </div>
          <div className="filter__row">
            <div className="filter__value">
              <div className="value__content">
                <label className="filter__value__label">Email</label>
                <Input className="filter__value__input" name="email" {...register("email")}></Input>
              </div>
              {errors?.email && <div className="error__message">{errors?.email?.message}</div>}
            </div>
            <div className="filter__value">
              <div className="value__content">
                <label className="filter__value__label">Ngày nhận</label>
                <Input
                  type="date"
                  className="filter__value__input"
                  name="startTime"
                  {...register("startTime")}
                ></Input>
              </div>
              {errors?.startTime && (
                <div className="error__message">{errors?.startTime?.message}</div>
              )}
            </div>
            <div className="filter__value">
              <div className="value__content">
                <label className="filter__value__label">Loại phiếu đặt</label>
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
            <div className="filter__value">
              <div className="value__content">
                <label className="filter__value__label">Trạng thái</label>
                <SelectBox
                  padding="6px 12px"
                  className="filter__value__input"
                  name="status"
                  {...register("status")}
                >
                  <option className="option" value={-1}>
                    Tất cả
                  </option>
                  <option className="option" value={0}>
                    Đang tạo
                  </option>
                  <option className="option" value={1}>
                    Đã tạo
                  </option>
                  <option className="option" value={2}>
                    Đã hủy
                  </option>
                </SelectBox>
              </div>
              {errors?.status && <div className="error__message">{errors?.status?.message}</div>}
            </div>
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
      <table className="main__table table table-striped">
        <thead className="table__head--container">
          <tr className="table__row">
            <th className="table__head item__id" scope="col">
              Mã phiếu đặt
            </th>
            {/* <th className="table__head" scope="col">
              Tên người đặt
            </th> */}
            <th className="table__head" scope="col">
              Tên khách hàng
            </th>
            <th className="table__head" scope="col">
              Thời gian nhận
            </th>
            <th className="table__head" scope="col">
              Loại phiếu đặt
            </th>
            <th className="table__head" scope="col">
              Trạng thái
            </th>
            <th className="table__head" scope="col">
              Tổng tiền
            </th>
          </tr>
        </thead>

        <tbody className="table__body">
          {orders?.map((order) => {
            return (
              <tr className="table__row" key={order?._id}>
                <td title={order?._id} className="table__data item__id">
                  {order?._id}
                </td>
                <td className="table__data">{order?.HoTen || "Khách vãng lai"}</td>
                <td className="table__data">{renderDate(order?.ThoiGianBatDau)}</td>
                <td className="table__data">
                  {order?.LoaiPhieuDat === 0
                    ? "Đặt bàn"
                    : order?.LoaiPhieuDat === 1
                    ? "Đặt phòng thường"
                    : "Đặt phòng VIP"}
                </td>
                <td className="table__data">
                  {order?.TrangThai === 0
                    ? "Đang tạo"
                    : order?.LoaiHoaDon === 1
                    ? "Đã tạo"
                    : "Đã hủy"}
                </td>
                <td className="table__data">
                  {convertToVND(
                    calculateMoney(
                      order.LoaiHoaDon,
                      order.ListThucDon,
                      order.ListBan,
                      order.ListPhong
                    )
                  )}
                </td>
                <td className="table__data">
                  <Button
                    // to={`/admin/area/update/${area?._id}`}
                    borderRadius="8px"
                    padding="4px 8px"
                    onClick={() => handleViewDetail(order?._id)}
                    className="button button__update"
                    bgHover={colors.green_1}
                    bgColor={colors.green_1_hover}
                  >
                    <div>
                      <span className="text">Chi tiết</span>
                      <i className="icon__item fa-solid fa-eye"></i>
                    </div>
                  </Button>
                  {/* <Button
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
                  </Button> */}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!orders?.length && (
        <div style={{ textAlign: "center", marginBottom: "400px" }}>Không có hóa đơn nào</div>
      )}
      {openUpdateForm && (
        <AreaUpdateForm
          setMode={setMode}
          mode={mode}
          handleCloseForm={handleCloseUpdateForm}
        ></AreaUpdateForm>
      )}
    </OrderSearchStyles>
  );
};

OrderSearch.propTypes = {};

export default OrderSearch;
