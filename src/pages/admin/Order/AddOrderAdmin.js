import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { addOrder, getEmployeeByUserId, getCustomerByPhone } from "utils/api";
import Loading from "components/Loading/Loading";
import ModalAddTable from "./components/ModalAddTable";
import ModalAddRoom from "./components/ModalAddRoom";
import ModalAddMenu from "./components/ModalAddMenu";
import { enqueueSnackbar } from "notistack";
import { convertDate } from "./OrderAdmin";
import { useAuthContext } from "utils/context/AuthContext";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const LOAIPHIEUDAT = {
  BAN: 0,
  PHONGTHUONG: 1,
  PHONGVIP: 2,
};

const schema = yup
  .object({
    phone: yup
      .string("hãy xem lại số điện thoại")
      .required("hãy nhập số điện thoại")
      .matches(/[0][1-9][0-9]{8}\b/, "Số điện thoại sai"),
    fullname: yup
      .string("hãy xem lại họ tên")
      .required("hãy nhập họ tên")
      .matches(
        /^(([a-zA-Z\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*)([a-zA-Z\s\'ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*)([a-zA-Z\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]))*$/,
        "hãy kiểm tra lại họ tên"
      ),
    email: yup
      .string("hãy xem lại email")
      .required("hãy nhập email")
      .email("Hãy nhập đúng định dạng email"),
  })
  .required();
function AddOrderAdmin() {
  const [loading, setLoading] = useState(false);
  const [isModalAddMenu, setIsModalAddMenu] = useState(false);
  const [isModalAddTable, setIsModalAddTable] = useState(false);
  const [isModalAddRoom, setIsModalAddRoom] = useState(false);
  const [listThucDon, setListThucDon] = useState([]);
  const [listBan, setListBan] = useState([]);
  const [listPhongThuong, setListPhongThuong] = useState([]);
  const [listPhongVIP, setListPhongVIP] = useState([]);
  const [loaiPhieuDat, setLoaiPhieuDat] = useState(LOAIPHIEUDAT.BAN);
  const [thoiGianBatDau, setThoiGianBatDau] = useState(new Date());
  const [hoTen, setHoTen] = useState("");
  const [msgNum, setMsgNum] = useState("");
  const [msgNumPeo, setMsgNumPeo] = useState("");
  const [msgDate, setMsgDate] = useState("");
  //   const [msgHT, setMsgHT] = useState("");
  //   const [msgEmail, setMsgEmail] = useState("");
  //   const [msgSDT, setMsgSDT] = useState("");
  const [email, setEmail] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [ghiChu, setGhiChu] = useState("");
  const [soLuongNguoiTrenBanOrPhong, setSoLuongNguoiTrenBanOrPhong] = useState(0);
  const [soLuongBanOrPhong, setSoLuongBanOrPhong] = useState(0);
  const TrangThai = 0;
  const { user } = useAuthContext();
  const [idEm, setIdEm] = useState("");
  const [maKH, setMaKH] = useState("");
  const [hours, setHours] = useState(7);
  const [minutes, setMinutes] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors, isLoading, isSubmitting },
  } = useForm({
    defaultValues: {
      phone: "", //0906461526
      fullname: "", //trung hoai
      email: "",
      tableCount: "1",
      peopleCount: "2",
      note: "",
    },
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    getEmployee(user._id);
  }, []);

  const getEmployee = async (id) => {
    setLoading(true);
    let result = await getEmployeeByUserId(id);
    if (result && result.data) {
      setIdEm(result.data._id);
      setLoading(false);
    } else {
      setIdEm("");
      setLoading(false);
    }
  };

  const totalPrice = () => {
    return listThucDon?.reduce((total, menu) => total + menu?.MaThucDon?.GiaMon * menu?.SoLuong, 0);
  };

  const clearModel = () => {
    setValue("fullname", "");
    setValue("email", "");
    setValue("phone", "");
    setValue("peopleCount", "2");
    setValue("tableCount", "1");
    setValue("note", "");

    setEmail("");
    setHoTen("");
    setSoDienThoai("");
    setSoLuongNguoiTrenBanOrPhong(0);
    setSoLuongBanOrPhong(0);
    setGhiChu("");

    setListBan([]);
    setMaKH("");
    setLoaiPhieuDat(LOAIPHIEUDAT.BAN);
    setListThucDon([]);
    setListPhongThuong([]);
    setListPhongVIP([]);
  };

  const isValid = () => {
    let check = true;
    // if (!hoTen) {
    //   setMsgHT("Họ tên không được để trống");
    //   check = false;
    // } else {
    //   setMsgHT("");
    // }
    // if (!email) {
    //   // setMsgEmail("Email không được để trống")
    //   // check =  false
    // } else {
    //   setMsgEmail("");
    // }
    // if (!soDienThoai) {
    //   setMsgSDT("Số điện thoại không được để trống");
    //   check = false;
    // } else {
    //   setMsgSDT("");
    // }
    // if (!soLuongBanOrPhong) {
    //   setMsgNum("Chưa chọn số lượng");
    //   check = false;
    // } else {
    //   setMsgNum("");
    // }
    // if (!soLuongNguoiTrenBanOrPhong) {
    //   setMsgNumPeo("Chưa chọn số lượng");
    //   check = false;
    // } else {
    //   setMsgNumPeo("");
    // }
    if (thoiGianBatDau) {
      let now = new Date();
      let time = new Date(thoiGianBatDau);
      if (time.getTime() <= now.getTime()) {
        setMsgDate("Chọn ngày ở tương lai");
        check = false;
      } else {
        setMsgDate("");
      }
    } else {
      setMsgDate("Chưa chọn ngày đặt");
      check = false;
    }

    // if(!soLuongBanOrPhong < listBan?.length){
    //     enqueueSnackbar("", {
    //         variant: "warning",
    //       });
    //     check =  false
    // }

    return check;
  };

  const handleAddOrder = async () => {
    const sumbit = document.querySelector("#button__submit");
    if (sumbit) {
      sumbit.click();
    }
  };

  const onSubmit = async (values) => {
    const { phone, fullname, email, tableCount, peopleCount, note } = values;
    if (isValid()) {
      const data = {
        LoaiPhieuDat: loaiPhieuDat,
        TrangThai,
        SoLuongNguoiTrenBanOrPhong: peopleCount,
        SoLuongBanOrPhong: tableCount,
        ThoiGianBatDau: thoiGianBatDau,
        MaKhachHang: maKH ? maKH : null,
        ListThucDon: listThucDon,
        ListPhong: loaiPhieuDat == 0 ? [] : loaiPhieuDat == 1 ? listPhongThuong : listPhongVIP,
        ListBan: loaiPhieuDat == 0 ? listBan : [],
        HoTen: fullname,
        Email: email ? email : "",
        SoDienThoai: phone,
        GhiChu: note ? note : "",
        MaNhanVien: idEm,
      };
      setLoading(true);
      let result = await addOrder(data);
      if (result.success) {
        clearModel();
        enqueueSnackbar("Tạo đơn đặt thành công", {
          variant: "success",
        });

        setLoading(false);
      } else {
        enqueueSnackbar("Tạo đơn đặt thất bại", {
          variant: "error",
        });
        setLoading(false);
      }
    }
  };

  const handleOpenModal = () => {
    if (soLuongNguoiTrenBanOrPhong && thoiGianBatDau && soLuongBanOrPhong) {
      loaiPhieuDat == 0 ? setIsModalAddTable(true) : setIsModalAddRoom(true);
    }
    if (!soLuongBanOrPhong) {
      enqueueSnackbar(`Vui lòng chọn số lượng`, {
        variant: "warning",
      });
    }
    if (!soLuongNguoiTrenBanOrPhong) {
      enqueueSnackbar(`Vui lòng chọn số người`, {
        variant: "warning",
      });
    }
    if (!thoiGianBatDau) {
      enqueueSnackbar(`Vui lòng chọn ngày`, {
        variant: "warning",
      });
    }
  };

  const handleFindCustomer = async (e) => {
    if (e.charCode === 13) {
      e.preventDefault();
      let result = await getCustomerByPhone({ SoDienThoai: e.target.value });
      if (result.success && result.data) {
        setValue("fullname", result.data.TenKhachHang);
        setValue("email", result.data.Email);
        setHoTen(result.data.TenKhachHang);
        setEmail(result.data.Email);
        setMaKH(result.data._id);
      }
    }
  };

  return (
    <OrderAdminStyle>
      {loading && <Loading />}

      <div className="title">Tạo đơn đặt</div>
      <div className="btn-group">
        <button className="btn-order handle" onClick={handleAddOrder}>
          Tạo đơn
        </button>
      </div>
      <div className="info-order">
        <h6>Thông tin đơn hàng</h6>
        <form onSubmit={handleSubmit(onSubmit)} className="box-info">
          <button style={{ display: "none" }} type="submit" id="button__submit"></button>
          <div className="col">
            <div className="item">
              <div className="title">Thông tin khánh hàng</div>
              <div className="row-item">
                <span className="label">Nhập họ tên:</span>
                <input
                  type="text"
                  placeholder="vd: Đăng Khoa"
                  //   value={hoTen}
                  //   onChange={(e) => {
                  //     setHoTen(e.target.value);
                  //   }}
                  {...register("fullname")}
                />
                {errors?.fullname && <span className="error">{errors?.fullname?.message}</span>}
                {/* {msgHT && <span className="error">{msgHT}</span>} */}
              </div>
              <div className="row-item">
                <span className="label">Nhập số điện thoại:</span>
                <input
                  onKeyPress={(e) => {
                    handleFindCustomer(e);
                  }}
                  type="text"
                  //   value={soDienThoai}
                  placeholder="vd: 0923222555"
                  //   onChange={(e) => {
                  //     setSoDienThoai(e.target.value);
                  //   }}
                  {...register("phone")}
                />
                {errors?.phone && <span className="error">{errors?.phone?.message}</span>}
                {/* {msgSDT && <span className="error">{msgSDT}</span>} */}
              </div>
              <div className="row-item">
                <span className="label">Nhập email:</span>
                <input
                  type="email"
                  placeholder="vd: abc123@gmail.com"
                  //   value={email}
                  //   onChange={(e) => {
                  //     setEmail(e.target.value);
                  //   }}
                  {...register("email")}
                />
                {errors?.email && <span className="error">{errors?.email?.message}</span>}
                {/* {msgEmail && <span className="error">{msgEmail}</span>} */}
              </div>
            </div>
          </div>
          <div className="col">
            <div className="item">
              <div className="title">Thông tin đơn đặt</div>
              <div className="row-item">
                <span className="label">Loại đơn đặt:</span>
                <button
                  className={`btn-order type ${loaiPhieuDat == 0 ? "active" : "choose"}`}
                  onClick={() => {
                    setLoaiPhieuDat(0);
                  }}
                >
                  Đơn đặt bàn
                </button>
                <button
                  className={`btn-order type ${loaiPhieuDat == 1 ? "active" : "choose"}`}
                  onClick={() => {
                    setLoaiPhieuDat(1);
                  }}
                >
                  Đơn đặt phòng thường
                </button>
                <button
                  className={`btn-order type ${loaiPhieuDat == 2 ? "active" : "choose"}`}
                  onClick={() => {
                    setLoaiPhieuDat(2);
                  }}
                >
                  Đơn đặt phòng VIP
                </button>
              </div>
              <div className="row-item order pb5">
                <span className="label">Số {loaiPhieuDat == 0 ? "bàn" : "phòng"}:</span>
                <input
                  className="time-format  date"
                  type="number"
                  placeholder={`Số ${loaiPhieuDat == 0 ? "bàn" : "phòng"}`}
                  min={1}
                  //   value={soLuongBanOrPhong}
                  //   onChange={(e) => {
                  //     setSoLuongBanOrPhong(e.target.value);
                  //   }}
                  {...register("tableCount")}
                />
                {errors?.tableCount && <span className="error">{errors?.tableCount?.message}</span>}
                {/* {msgNum && <span className="error right">{msgNum}</span>} */}
              </div>
              <div className="row-item order pb5">
                <span className="label">
                  Số người trên mỗi {loaiPhieuDat == 0 ? "bàn" : "phòng"}:
                </span>
                <input
                  className="time-format  date"
                  type="number"
                  min={2}
                  placeholder={`Số người trên mỗi ${loaiPhieuDat == 0 ? "bàn" : "phòng"}`}
                  //   value={soLuongNguoiTrenBanOrPhong}
                  //   onChange={(e) => {
                  //     setSoLuongNguoiTrenBanOrPhong(e.target.value);
                  //   }}
                  {...register("peopleCount")}
                />
                {errors?.peopleCount && (
                  <span className="error">{errors?.peopleCount?.message}</span>
                )}
                {/* {msgNumPeo && <span className="error right">{msgNumPeo}</span>} */}
              </div>
              <div className="row-item order">
                <span className="label">Thời gian đặt:</span>
                <input
                  type="date"
                  className="time-format date"
                  onChange={(e) => {
                    let date = new Date(e.target.value);
                    date.setHours(hours);
                    date.setMinutes(minutes);
                    setThoiGianBatDau(date);
                    setListBan([]);
                    setListPhongThuong([]);
                    setListPhongVIP([]);
                  }}
                />

                <input
                  type="number"
                  onChange={(e) => {
                    let date = new Date(thoiGianBatDau);
                    date.setHours(e.target.value);
                    setHours(e.target.value);
                    setThoiGianBatDau(date);
                  }}
                  className="time-format mr-time"
                  min={0}
                  defaultValue={7}
                  max={23}
                  step={1}
                />
                <span>giờ</span>

                <input
                  type="number"
                  onChange={(e) => {
                    let date = new Date(thoiGianBatDau);
                    date.setMinutes(e.target.value);
                    setMinutes(e.target.value);
                    setThoiGianBatDau(date);
                  }}
                  className="time-format mr-time"
                  min={0}
                  defaultValue={0}
                  max={45}
                  step={15}
                />
                <span className="">phút</span>

                {msgDate && <span className="error left">{msgDate}</span>}
              </div>
              <div className="row-item order">
                <span className="label">Ghi chú:</span>
                <textarea
                  placeholder="Nhập ghi chú"
                  //   value={ghiChu}
                  //   onChange={(e) => {
                  //     setGhiChu(e.target.value);
                  //   }}
                  {...register("note")}
                />
              </div>
            </div>
          </div>
          <div className="col">
            <div className="item">
              <div className="title">Đơn đặt {loaiPhieuDat == 0 ? "bàn" : "phòng"}</div>

              {loaiPhieuDat == 0 ? (
                listBan?.length > 0 ? (
                  <ul className="list-menu">
                    <li>
                      <span className="title-table name-col">Mã bàn</span>
                      <span className="title-table">Số thứ tự bàn</span>
                      <span className="title-table stock-col right">Số chỗ ngồi</span>
                    </li>
                    {listBan?.map((item, index) => {
                      return (
                        <li key={index}>
                          <span className="name-col">{item.MaBan}</span>
                          <span className="">{item.SoThuTuBan}</span>
                          <span className="right stock-col">{item.SoChoNgoi}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  "Chưa có bàn"
                )
              ) : loaiPhieuDat == 1 ? (
                listPhongThuong?.length > 0 ? (
                  <ul className="list-menu">
                    <li>
                      <span className="title-table name-col">Mã phòng</span>
                      <span className="title-table">Tên phòng</span>
                      <span className="title-table stock-col right">Số chỗ ngồi</span>
                    </li>
                    {listPhongThuong?.map((item, index) => {
                      return (
                        <li key={index}>
                          <span className="name-col">{item.MaPhong}</span>
                          <span className="">{item.TenPhong}</span>
                          <span className="right stock-col">{item.SoChoNgoiToiDa}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  "Chưa có phòng"
                )
              ) : listPhongVIP?.length > 0 ? (
                <ul className="list-menu">
                  <li>
                    <span className="title-table name-col">Mã phòng</span>
                    <span className="title-table">Tên phòng</span>
                    <span className="title-table stock-col right">Số chỗ ngồi</span>
                  </li>
                  {listPhongVIP?.map((item, index) => {
                    return (
                      <li key={index}>
                        <span className="name-col">{item.MaPhong}</span>
                        <span className="">{item.TenPhong}</span>
                        <span className="right stock-col">{item.SoChoNgoiToiDa}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                "Chưa có phòng"
              )}

              <div className="btn-item">
                <button
                  className="btn-order info"
                  onClick={() => {
                    handleOpenModal();
                  }}
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="item">
              <div className="title">Thông tin thực đơn</div>
              {listThucDon ? (
                <ul className="list-menu">
                  <li>
                    <span className="title-table name-col">Tên món</span>
                    <span className="title-table">Đơn giá</span>
                    <span className="title-table stock-col right">Số lượng</span>
                    <span className="title-table right">Thành tiền</span>
                  </li>
                  {listThucDon?.map((menu, index) => {
                    return (
                      <li key={index}>
                        <span className="name-col">{menu.MaThucDon.TenMon}</span>
                        <span className="">{menu.MaThucDon.GiaMon}đ</span>
                        <span className="right stock-col">{menu.SoLuong}</span>
                        <span className="right">{menu.MaThucDon.GiaMon * menu.SoLuong}đ</span>
                      </li>
                    );
                  })}
                  <li className="total-row">
                    <span className="total">Tổng tiền</span>
                    <span className="total w-75pc right">{totalPrice()}đ</span>
                  </li>
                </ul>
              ) : (
                "Không đặt món"
              )}
              <div className="btn-item">
                <button
                  className="btn-order info"
                  onClick={() => {
                    setIsModalAddMenu(true);
                  }}
                >
                  Cập nhật món
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      {isModalAddMenu && (
        <ModalAddMenu
          setIsModalAddMenu={setIsModalAddMenu}
          setLoading={setLoading}
          listThucDon={listThucDon}
          setListThucDon={setListThucDon}
        />
      )}
      {isModalAddTable && (
        <ModalAddTable
          setIsModalAddTable={setIsModalAddTable}
          loaiPhieuDat={loaiPhieuDat}
          setLoading={setLoading}
          soNguoi={soLuongNguoiTrenBanOrPhong}
          thoiGianBatDau={thoiGianBatDau}
          listBan={listBan}
          setListBan={setListBan}
        />
      )}
      {isModalAddRoom && (
        <ModalAddRoom
          setIsModalAddRoom={setIsModalAddRoom}
          loaiPhieuDat={loaiPhieuDat}
          setLoading={setLoading}
          soNguoi={soLuongNguoiTrenBanOrPhong}
          thoiGianBatDau={thoiGianBatDau}
          listPhong={loaiPhieuDat == 1 ? listPhongThuong : listPhongVIP}
          setListPhong={loaiPhieuDat == 1 ? setListPhongThuong : setListPhongVIP}
        />
      )}
    </OrderAdminStyle>
  );
}
const OrderAdminStyle = styled.div`
  padding: 64px 10px 10px;
  background-color: #f3f3f3;
  min-height: 90vh;

  .title {
    font-size: 20px;
    font-weight: bold;
  }
  .info-order {
    clear: both;
    width: 100%;
    background-color: #fff;
    margin-top: 45px;
    padding: 10px;
    border-radius: 10px;

    .box-info {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -5px;
      .col {
        padding: 0 5px;
        width: 50%;
        min-width: 50%;
        max-width: 50%;
        margin-bottom: 10px;

<<<<<<< HEAD
        .box-info{
            display: flex;
            flex-wrap: wrap;
            margin: 0 -5px;
            .col{
                padding: 0 5px;
                width: 50%;
                min-width: 50%;
                max-width: 50%;
                margin-bottom: 10px;

                .item{
                    width: 100%;
                    border-radius:10px;
                    background-color: #f3f3f3;
                    padding: 5px;
                    margin-bottom: 5px;
                    .title{
                        font-size: 15px;
                        color: rgb(220, 180, 110 , 1);
                    }
                
                    .row-item{
                        padding:0 20px 25px;
                        display: flex;
                        align-items: flex-start;
                        position: relative;
                        &.pb5{
                            padding-bottom: 5px ;
                        }
                        &.order{
                            .label{
                                width: 35%;
                            }
                        }
                        .mr-time{
                            margin:0 10px;
                        }

                        
                        .time-format{
                            border: 1px solid rgb(220, 180, 110 , 1);
                            outline: none;
                            border-radius: 10px;

                            &.date{
                                padding: 5px;
                            }
                        }

                        .error{
                            position: absolute;
                            top: 37px;
                            font-size: 12px;
                            color: red;
                            left: 26.5%;
                            &.left{
                                left: 35.5%;
                            }
                            &.right{
                                left: unset;
                                right: 100px;
                                top: 20%;
                            }
                        }

                        textarea{
                            width: 75%;
                            border: 1px solid rgb(220, 180, 110 , 1);
                            border-radius: 10px;
                            outline: none;
                            padding: 5px 10px;
                            ::placeholder{
                                font-size: 13px;
                                opacity: 0.5;
                            }
                        }

                        .label{
                            width: 25%;
                            display: inline-block;
                            font-size: 16px;
                            text-align: left;
                        }
                        input[type="text"] , input[type="email"]{
                            border-radius: 10px;
                            padding:  5px 10px;
                            width: 75%;
                            border: 1px solid rgb(220, 180, 110 , 1);
                            outline: none;

                            :focus{
                                outline: 1px solid rgb(220, 180, 110 , 1);

                            }

                            ::placeholder{
                                opacity: 0.5;
                                font-size: 14px;
                            }


    
                        }
                    }

                    .flex-row{
                        display: flex;
                        .col-50{
                            width: 50%;
                            display: flex;
                            padding: 5px;

                            span{
                                white-space: nowrap;
                                font-size: 16px;
                            }
                            input{
                                width: 50%;
                                border-radius: 10px;
                                outline: none;
                                border: 1px solid rgb(220, 180, 110 , 1);

                            }
                        }
                    }



                    .list-menu{
                        width: 100%;
                        list-style-type: none;
                        padding: 0;
                        li{
                            span{
                                font-size:14px;
                                font-weight: 400;
                                width: 25%;
                                display: inline-block;
                            }
                            .name-col{
                                width: 35%;
                            }
                            .stock-col{
                                width: 15%;
                            }
                            .title-table{
                                font-weight: 500;
                            }
                            
                        }
                       
                        .total-row{
                            margin-top: 10px;


                            .total{
                                font-weight: 500;
                                font-size:16px;

                                
                            }
                            
                            
                        }
                        .w-75pc{
                            width: 75%;
                        }
                        .right{
                            text-align: right;
                        }
                        
                        
                    }

                    .btn-item{
                        
                        margin-top: 10px;
                        text-align: right;
                    }
                
                }



            }


        }
    }
    .btn-group{
        float: right;
        width: auto;
        
    }
    .btn-order{
        border: none;
        outline: none;
        padding: 5px 10px;
        color: #fff;
        font-weight: bold;
        border-radius: 10px;
        margin: 0 5px;
        margin-left: 10px;
        :hover {
          opacity: 0.8;
        }
        &.type{
            font-size: 14px;
        }
        &.handle{
            background-color: #007bff;
        }
        &.success{
          background-color: #28a745;
          
        }
        &.choose{
            background-color: rgb(220, 180, 110 , 0.5);
        }
        &.active{
            background-color: rgb(220, 180, 110 , 1);
            cursor: default;
            :hover{
                opacity: 1;
            }
        }
        &.cancel{
          background-color: #dc3545;
        }
        &.fail{
            background-color: #6c757d;
=======
        .item {
          width: 100%;
          border-radius: 10px;
          background-color: #f3f3f3;
          padding: 5px;
          margin-bottom: 5px;
          .title {
            font-size: 15px;
            color: rgb(220, 180, 110, 1);
          }

          .row-item {
            padding: 0 20px 25px;
            display: flex;
            align-items: flex-start;
            position: relative;
            &.pb5 {
              padding-bottom: 5px;
            }
            &.order {
              .label {
                width: 35%;
              }
            }
            .mr-time {
              margin: 0 10px;
            }

            .time-format {
              border: 1px solid rgb(220, 180, 110, 1);
              outline: none;
              border-radius: 10px;

              &.date {
                padding: 5px;
              }
            }

            .error {
              position: absolute;
              top: 37px;
              font-size: 12px;
              color: red;
              left: 26.5%;
              &.left {
                left: 35.5%;
              }
              &.right {
                left: unset;
                right: 100px;
                top: 20%;
              }
            }

            textarea {
              width: 75%;
              border: 1px solid rgb(220, 180, 110, 1);
              border-radius: 10px;
              outline: none;
              padding: 5px 10px;
              ::placeholder {
                font-size: 13px;
                opacity: 0.5;
              }
            }

            .label {
              width: 25%;
              display: inline-block;
              font-size: 16px;
              text-align: left;
            }
            input[type="text"],
            input[type="email"] {
              border-radius: 10px;
              padding: 5px 10px;
              width: 75%;
              border: 1px solid rgb(220, 180, 110, 1);
              outline: none;

              :focus {
                outline: 1px solid rgb(220, 180, 110, 1);
              }

              ::placeholder {
                opacity: 0.5;
                font-size: 14px;
              }
            }
          }

          .flex-row {
            display: flex;
            .col-50 {
              width: 50%;
              display: flex;
              padding: 5px;

              span {
                white-space: nowrap;
                font-size: 16px;
              }
              input {
                width: 50%;
                border-radius: 10px;
                outline: none;
                border: 1px solid rgb(220, 180, 110, 1);
              }
            }
          }

          .list-menu {
            width: 100%;
            list-style-type: none;
            padding: 0;
            li {
              span {
                font-size: 14px;
                font-weight: 400;
                width: 25%;
                display: inline-block;
              }
              .name-col {
                width: 35%;
              }
              .stock-col {
                width: 15%;
              }
              .title-table {
                font-weight: 500;
              }
            }

            .total-row {
              margin-top: 10px;

              .total {
                font-weight: 500;
                font-size: 16px;
              }
            }
            .w-75pc {
              width: 75%;
            }
            .right {
              text-align: right;
            }
          }

          .btn-item {
            margin-top: 10px;
            text-align: right;
>>>>>>> 82979e8d63906958418ab3a2db58b200c0257953
          }
        }
      }
    }
  }
  .btn-group {
    float: right;
  }
  .btn-order {
    border: none;
    outline: none;
    padding: 5px 10px;
    color: #fff;
    font-weight: bold;
    border-radius: 10px;
    margin: 0 5px;
    margin-left: 10px;
    :hover {
      opacity: 0.8;
    }
    &.type {
      font-size: 14px;
    }
    &.handle {
      background-color: #007bff;
    }
    &.success {
      background-color: #28a745;
    }
    &.choose {
      background-color: rgb(220, 180, 110, 0.5);
    }
    &.active {
      background-color: rgb(220, 180, 110, 1);
      cursor: default;
      :hover {
        opacity: 1;
      }
    }
    &.cancel {
      background-color: #dc3545;
    }
    &.fail {
      background-color: #6c757d;
    }
    &.info {
      background-color: #17a2b8;
    }
  }
`;
export default AddOrderAdmin;
