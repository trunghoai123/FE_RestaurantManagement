import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  changeStatus,
  getOrderDetailByOrder,
  updateOrder,
  addInvoice,
  getEmployeeByUserId,
  updateManyRoom,
  updateManyTable,
} from "utils/api";
import Loading from "components/Loading/Loading";
import ModalAddTable from "./components/ModalAddTable";
import ModalAddRoom from "./components/ModalAddRoom";
import { confirmAlert } from "react-confirm-alert";
import ModalAddMenu from "./components/ModalAddMenu";
import { enqueueSnackbar } from "notistack";
import { convertDate } from "./OrderAdmin";
import { convertToVND } from "utils/utils";
import { useAuthContext } from "utils/context/AuthContext";

function OrderDetailAdmin(props) {
  const [orderDetail, setOrderDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isModalAddMenu, setIsModalAddMenu] = useState(false);
  const [isModalAddTable, setIsModalAddTable] = useState(false);
  const [isModalAddRoom, setIsModalAddRoom] = useState(false);
  const [listThucDon, setListThucDon] = useState([]);
  const [listBan, setListBan] = useState([]);
  const [listPhong, setListPhong] = useState([]);
  const { user } = useAuthContext();
  const [idEm, setIdEm] = useState("");

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

  useEffect(() => {
    const arrLocation = window.location.href.split("/");
    const Id = arrLocation[arrLocation.length - 1];
    setOrderId(Id);
    getOrderDetail(Id);
  }, [window.location.href]);

  const getOrderDetail = async (id) => {
    setLoading(true);
    let result = await getOrderDetailByOrder(id);
    if (result && result.data) {
      setOrderDetail(result.data[0]);
      setListThucDon(result.data[0].ListThucDon);
      setListBan(result.data[0].ListBan);
      setListPhong(result.data[0].ListPhong);
      setLoading(false);
    } else {
      setOrderDetail({});
      setLoading(false);
    }
  };

  const totalDeposit = () => {
    let dish = (totalPrice() * 30) / 100;
    let room = 0;
    if (orderDetail?.MaPhieuDat?.LoaiPhieuDat == 1) {
      room = 50000 * listPhong.length;
    }
    if (orderDetail?.MaPhieuDat?.LoaiPhieuDat == 2) {
      room = 100000 * listPhong.length;
    }

    return convertToVND(dish + room);
  };

  const renderButton = () => {
    switch (orderDetail?.MaPhieuDat?.TrangThai) {
      case 0:
        return (
          <>
            <div className="deposit"></div>
            <div className="right-btn">
              <button className="btn-order handle" onClick={handleOrderConfirm}>
                Xác nhận đơn
              </button>
              <button className="btn-order cancel" onClick={handleOrderCancel}>
                Hủy đơn
              </button>
            </div>
          </>
        );
        break;
      case 1:
        return (
          <>
            {renderDeposit()}
            <div className="right-btn">
              <button className="btn-order handle" onClick={handleOrderDeposit}>
                Xác nhận đã đặt cọc
              </button>
              <button className="btn-order cancel" onClick={handleOrderCancel}>
                Hủy đơn
              </button>
            </div>
          </>
        );
        break;
      case 2:
        return (
          <>
            {renderDeposit()}
            <div className="right-btn">
              <button className="btn-order handle" onClick={handleOrderReceive}>
                Chuyển đơn đặt thành hóa đơn
              </button>
              <button className="btn-order handle" onClick={handleOrderNoReceive}>
                Khánh hàng không đến
              </button>
              <button className="btn-order cancel" onClick={handleOrderCancel}>
                Hủy đơn
              </button>
            </div>
          </>
        );
        break;
      case 3:
        return (
          <>
            {renderDeposit()}
            <div className="right-btn">
              <span className="btn-order success">Thành công</span>
            </div>
          </>
        );
        break;
      case 4:
        return (
          <>
            <div className="deposit"></div>
            <div className="right-btn">
              <span className="btn-order fail">Đơn hàng bị hủy</span>
            </div>
          </>
        );
        break;
      case 5:
        return (
          <>
            <div className="deposit"></div>
            <div className="right-btn">
              <button className="btn-order fail">Khách hàng không nhận đơn</button>
            </div>
          </>
        );
        break;
      default:
        break;
    }
  };

  const renderDeposit = () => {
    return (
      <div className="deposit">
        <div>Khánh hàng phải đặt cọc:</div>
        <div className="w60pc-depo">
          <span>30% tổng giá trị món ăn</span>
          {convertToVND((totalPrice() * 30) / 100)}
        </div>
        {orderDetail?.MaPhieuDat?.LoaiPhieuDat == 1 ? (
          <div className="w60pc-depo">
            <span>50.000đ mỗi phòng</span>
            {convertToVND(50000 * listPhong.length)}
          </div>
        ) : (
          ""
        )}
        {orderDetail?.MaPhieuDat?.LoaiPhieuDat == 2 ? (
          <div className="w60pc-depo">
            <span>100.000đ mỗi phòng</span>
            {convertToVND(100000 * listPhong.length)}
          </div>
        ) : (
          ""
        )}
        <div className="w60pc-depo">
          <span>Tổng cộng:</span>
          <strong>{totalDeposit()}</strong>
        </div>
      </div>
    );
  };

  const totalPrice = () => {
    return listThucDon?.reduce((total, menu) => total + menu?.MaThucDon?.GiaMon * menu?.SoLuong, 0);
  };

  const handleOrderDeposit = async () => {
    confirmAlert({
      title: "Xác nhận",
      message: `Xác nhận đã nhận ${totalDeposit()} tiền đặt cọc?`,
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            setLoading(true);
            let id = orderDetail?.MaPhieuDat?._id;
            let status = 2;
            let result = await changeStatus(id, status);
            if (result.success) {
              getOrderDetail(orderId);
              setLoading(false);
              enqueueSnackbar("Xác nhận đặt cọc thành công", {
                variant: "success",
              });
            } else {
              setLoading(false);
              enqueueSnackbar("Xác nhận đặt cọc thất bại", {
                variant: "error",
              });
            }
          },
        },
        {
          label: "Không",
          onClick: () => {},
        },
      ],
    });
  };

  const handleOrderConfirm = async () => {
    confirmAlert({
      title: "Xác nhận",
      message: "Bạn có chắc chắn chuyển đơn hàng sang trạng thái chờ đặt cọc ?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            if (
              orderDetail?.MaPhieuDat?.LoaiPhieuDat == 0 &&
              listBan.length < orderDetail?.MaPhieuDat?.SoLuongBanOrPhong
            ) {
              enqueueSnackbar("Cần cập nhật bàn cho đơn hàng đủ với số lượng", {
                variant: "warning",
              });
            } else if (
              orderDetail?.MaPhieuDat?.LoaiPhieuDat != 0 &&
              listPhong.length < orderDetail?.MaPhieuDat?.SoLuongBanOrPhong
            ) {
              enqueueSnackbar("Cần cập nhật phòng cho đơn hàng đủ với số lượng", {
                variant: "warning",
              });
            } else {
              setLoading(true);
              let status = 1;
              let id = orderDetail?.MaPhieuDat?._id;
              let result = await updateOrder({
                id,
                TrangThai: status,
                ListThucDon: listThucDon,
                ListBan: listBan,
                ListPhong: listPhong,
              });
              if (result.success) {
                getOrderDetail(orderId);
                setLoading(false);
                enqueueSnackbar("Xác nhận đơn đặt thành công", {
                  variant: "success",
                });
              } else {
                setLoading(false);
                enqueueSnackbar("Xác nhận đơn đặt thất bại", {
                  variant: "error",
                });
              }
            }
          },
        },
        {
          label: "Không",
          onClick: () => {},
        },
      ],
    });
  };

  const handleOrderReceive = async () => {
    confirmAlert({
      title: "Xác nhận",
      message: "Xác nhận khách hàng đã đến nhận đơn?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            setLoading(true);
            let status = 3;
            let id = orderDetail?.MaPhieuDat?._id;
            let result = await changeStatus(id, status);
            if (result.success) {
              let invoice = {
                MaPhieuDat: orderDetail?.MaPhieuDat?._id,
                MaNhanVien: idEm,
                MaKhachHang: orderDetail?.MaPhieuDat?.MaKhachHang,
                HoTen: orderDetail?.MaPhieuDat?.HoTen,
                SoDienThoai: orderDetail?.MaPhieuDat?.SoDienThoai,
                LoaiHoaDon: orderDetail?.MaPhieuDat?.LoaiPhieuDat,
                TrangThai: 0,
                ThoiGianBatDau: new Date(),
                ListThucDon: listThucDon,
                ListPhong: listPhong,
                ListBan: listBan,
              };
              let rs = await addInvoice(invoice);
              if (rs.success) {
                let reslt;
                let ids;
                if (orderDetail?.MaPhieuDat?.LoaiPhieuDat === 0) {
                  ids = listBan.map((obj) => obj._id);
                  reslt = await updateManyTable({ ids, TrangThai: 1 });
                } else {
                  ids = listPhong.map((obj) => obj._id);
                  reslt = await updateManyRoom({ ids, TrangThai: 1 });
                }

                if (reslt.success) {
                  getOrderDetail(orderId);
                  setLoading(false);
                  enqueueSnackbar("Đơn đặt đã chuyển thành hóa đơn thành công", {
                    variant: "success",
                  });
                } else {
                  getOrderDetail(orderId);
                  setLoading(false);
                  enqueueSnackbar("Chuyển trạng thái thất bại", {
                    variant: "error",
                  });
                }
              } else {
                setLoading(false);
                enqueueSnackbar("Tạo hóa đơn thất bại", {
                  variant: "error",
                });
              }
            } else {
              setLoading(false);
              enqueueSnackbar("Xác nhận khách hàng nhận đơn thất bại", {
                variant: "error",
              });
            }
          },
        },
        {
          label: "Không",
          onClick: () => {},
        },
      ],
    });
  };

  const handleOrderNoReceive = async () => {
    confirmAlert({
      title: "Xác nhận",
      message: "Xác nhận khách hàng không đến nhận đơn?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            setLoading(true);
            let status = 5;
            let id = orderDetail?.MaPhieuDat?._id;
            let result = await changeStatus(id, status);
            if (result.success) {
              getOrderDetail(orderId);
              setLoading(false);
              enqueueSnackbar("Xác nhận khách hàng không nhận đơn thành công", {
                variant: "success",
              });
            } else {
              setLoading(false);
              enqueueSnackbar("Xác nhận khách hàng không nhận đơn thất bại", {
                variant: "error",
              });
            }
          },
        },
        {
          label: "Không",
          onClick: () => {},
        },
      ],
    });
  };

  const handleOrderCancel = async () => {
    // eslint-disable-next-line no-restricted-globals

    confirmAlert({
      title: "Xác nhận",
      message: "Bạn có chắc chắn muốn hủy đơn ?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            setLoading(true);
            let status = 4;
            let id = orderDetail?.MaPhieuDat?._id;
            let result = await changeStatus(id, status);
            if (result.success) {
              getOrderDetail(orderId);
              setLoading(false);
              enqueueSnackbar("Hủy đơn hàng thành công", {
                variant: "success",
              });
            } else {
              setLoading(false);
              enqueueSnackbar("Hủy đơn hàng thất bại", {
                variant: "error",
              });
            }
          },
        },
        {
          label: "Không",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <OrderDetailAdminStyle>
      {loading && <Loading />}

      <div className="title">Chi tiết đơn đặt</div>
      <div className="btn-group">{renderButton()}</div>
      <div className="info-order">
        <h6>Thông tin đơn hàng</h6>
        <div className="box-info">
          <div className="col">
            <div className="item">
              <div className="title">Thông tin khánh hàng</div>
              <p className="desc">
                <span className="w160px">Họ tên khách hàng:</span>
                <strong>{orderDetail?.MaPhieuDat?.HoTen}</strong>
              </p>
              <p className="desc">
                <span className="w160px">Số điện thoại:</span>
                <strong>{orderDetail?.MaPhieuDat?.SoDienThoai}</strong>
              </p>
              <p className="desc">
                <span className="w160px">Email:</span>
                <strong>{orderDetail?.MaPhieuDat?.Email}</strong>
              </p>
            </div>
          </div>
          <div className="col">
            <div className="item">
              <div className="title">Thông tin đơn đặt</div>
              <p className="desc">
                <span className="w220px">Thời gian đặt: </span>
                <strong>{convertDate(orderDetail?.MaPhieuDat?.createdAt)}</strong>
              </p>
              <p className="desc">
                <span className="w220px">
                  Thời gian nhận {orderDetail?.MaPhieuDat?.LoaiPhieuDat == 0 ? "bàn" : "phòng"}:
                </span>
                <strong>{convertDate(orderDetail?.MaPhieuDat?.ThoiGianBatDau)}</strong>
              </p>

              <p className="desc">
                <span className="w220px">
                  Số {orderDetail?.MaPhieuDat?.LoaiPhieuDat == 0 ? "bàn" : "phòng"}:
                </span>
                <strong>{orderDetail?.MaPhieuDat?.SoLuongBanOrPhong}</strong>
              </p>
              <p className="desc">
                <span className="w220px">
                  Số lượng người trên mỗi{" "}
                  {orderDetail?.MaPhieuDat?.LoaiPhieuDat == 0 ? "bàn" : "phòng"}:
                </span>
                <strong>{orderDetail?.MaPhieuDat?.SoLuongNguoiTrenBanOrPhong}</strong>
              </p>
              <p className="desc">
                <span className="w220px">Ghi chú:</span>
                <strong>{orderDetail?.MaPhieuDat?.GhiChu}</strong>
              </p>
            </div>
          </div>
          <div className="col">
            <div className="item">
              <div className="title">{`Thông tin ${
                orderDetail?.MaPhieuDat?.LoaiPhieuDat == 0 ? "bàn" : "phòng"
              }`}</div>

              {orderDetail?.MaPhieuDat?.LoaiPhieuDat == 0 ? (
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
              ) : listPhong?.length > 0 ? (
                <ul className="list-menu">
                  <li>
                    <span className="title-table name-col">Mã phòng</span>
                    <span className="title-table">Tên phòng</span>
                    <span className="title-table stock-col right">Số chỗ ngồi</span>
                  </li>
                  {listPhong?.map((item, index) => {
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

              {orderDetail?.MaPhieuDat?.TrangThai == 0 ? (
                <div className="btn-item">
                  <button
                    className="btn-order info"
                    onClick={() => {
                      orderDetail?.MaPhieuDat?.LoaiPhieuDat == 0
                        ? setIsModalAddTable(true)
                        : setIsModalAddRoom(true);
                    }}
                  >{`Cập nhật ${
                    orderDetail?.MaPhieuDat?.LoaiPhieuDat == 0 ? "bàn" : "phòng"
                  }`}</button>
                </div>
              ) : (
                ""
              )}
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
                        <span className="">{convertToVND(menu.MaThucDon.GiaMon)}</span>
                        <span className="right stock-col">{menu.SoLuong}</span>
                        <span className="right">
                          {convertToVND(menu.MaThucDon.GiaMon * menu.SoLuong)}
                        </span>
                      </li>
                    );
                  })}
                  <li className="total-row">
                    <span className="total">Tổng tiền</span>
                    <span className="total w-75pc right">{convertToVND(totalPrice())}</span>
                  </li>
                </ul>
              ) : (
                "Không đặt món"
              )}
              {orderDetail?.MaPhieuDat?.TrangThai == 0 ? (
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
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalAddMenu && (
        <ModalAddMenu
          setIsModalAddMenu={setIsModalAddMenu}
          orderId={orderId}
          setLoading={setLoading}
          listThucDon={listThucDon}
          setListThucDon={setListThucDon}
        />
      )}
      {isModalAddTable && (
        <ModalAddTable
          setIsModalAddTable={setIsModalAddTable}
          loaiPhieuDat={orderDetail?.MaPhieuDat?.LoaiPhieuDat}
          setLoading={setLoading}
          soNguoi={orderDetail?.MaPhieuDat?.SoLuongNguoiTrenBanOrPhong}
          thoiGianBatDau={orderDetail?.MaPhieuDat?.ThoiGianBatDau}
          listBan={listBan}
          setListBan={setListBan}
        />
      )}
      {isModalAddRoom && (
        <ModalAddRoom
          setIsModalAddRoom={setIsModalAddRoom}
          loaiPhieuDat={orderDetail?.MaPhieuDat?.LoaiPhieuDat}
          orderId={orderId}
          setLoading={setLoading}
          soNguoi={orderDetail?.MaPhieuDat?.SoLuongNguoiTrenBanOrPhong}
          thoiGianBatDau={orderDetail?.MaPhieuDat?.ThoiGianBatDau}
          soPhong={orderDetail?.MaPhieuDat?.SoLuongBanOrPhong}
          listPhong={listPhong}
          setListPhong={setListPhong}
        />
      )}
    </OrderDetailAdminStyle>
  );
}
const OrderDetailAdminStyle = styled.div`
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
        .item {
          width: 100%;
          border-radius: 10px;
          background-color: #f3f3f3;
          padding: 5px;
          .title {
            font-size: 15px;
            color: rgb(220, 180, 110, 1);
          }
          .desc {
            font-size: 15px;
            margin: 5px 0;
          }

          .w160px {
            width: 165px;
            display: inline-block;
          }
          .w220px {
            width: 220px;
            display: inline-block;
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
          }
        }
      }
    }
  }
  .btn-group {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .right-btn {
      float: right;
    }

    .deposit {
      float: left;

      width: 50%;

      .w60pc-depo {
        width: 100%;
        span {
          width: 60%;
          display: inline-block;
        }
      }
    }
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
    &.handle {
      background-color: #007bff;
    }
    &.success {
      background-color: #28a745;
      :hover {
        opacity: 1;
      }
    }
    &.cancel {
      background-color: #dc3545;
    }
    &.fail {
      background-color: #6c757d;
      :hover {
        opacity: 1;
      }
    }
    &.info {
      background-color: #17a2b8;
    }
  }
`;
export default OrderDetailAdmin;
