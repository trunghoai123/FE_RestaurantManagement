import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  getInvoiceById,
  updateInvoice,
  getOrderDetailByOrder,
  updateManyRoom,
  updateManyTable,
} from "utils/api";
import Loading from "components/Loading/Loading";
import ModalAddTable from "./components/ModalAddTable";
import ModalAddRoom from "./components/ModalAddRoom";
import { confirmAlert } from "react-confirm-alert";
import ModalAddMenu from "./components/ModalAddMenu";
import { enqueueSnackbar } from "notistack";
import { convertDate } from "../Order/OrderAdmin";
import { convertToVND } from "utils/utils";
import { useAuthContext } from "utils/context/AuthContext";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import Button from "components/Button/Button";
import { colors } from "variables";
import PDFFile from "components/PDFFile/PDFFile";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

function InvoiceDetailAdmin(props) {
  const [invoice, setInvoice] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalAddMenu, setIsModalAddMenu] = useState(false);
  const [isModalAddTable, setIsModalAddTable] = useState(false);
  const [isModalAddRoom, setIsModalAddRoom] = useState(false);
  const [order, setOrder] = useState({});
  const [listThucDon, setListThucDon] = useState([]);
  const [listBan, setListBan] = useState([]);
  const [listPhongThuong, setListPhongThuong] = useState([]);
  const [listPhongVIP, setListPhongVIP] = useState([]);

  useEffect(() => {
    const arrLocation = window.location.href.split("/");
    const Id = arrLocation[arrLocation.length - 1];
    getInvoice(Id);
  }, [window.location.href]);

  const getOrder = async (id) => {
    setLoading(true);
    let result = await getOrderDetailByOrder(id);
    if (result && result.data) {
      setOrder(result.data[0]);
      setLoading(false);
    } else {
      setOrder({});
      setLoading(false);
    }
  };

  const getInvoice = async (id) => {
    setLoading(true);
    let result = await getInvoiceById(id);
    if (result && result.data) {
      setInvoice(result.data);
      setListThucDon(result.data.ListThucDon);
      if (result.data.MaPhieuDat) {
        getOrder(result.data.MaPhieuDat);
      }
      setLoading(false);
    } else {
      setInvoice({});
      setLoading(false);
    }
  };

  const totalPay = () => {
    let dish = totalPrice(invoice?.ListThucDon);
    let room = 0;
    if (invoice?.LoaiHoaDon == 1) {
      room = 100000 * invoice?.ListPhong.length;
    }
    if (invoice?.LoaiHoaDon == 2) {
      room = 300000 * invoice?.ListPhong.length;
    }

    return convertToVND(dish + room - totalDeposit());
  };

  const totalDeposit = () => {
    if (invoice?.MaPhieuDat) {
      let dish = (totalPrice(order?.ListThucDon) * 30) / 100;
      let room = 0;
      if (order?.MaPhieuDat?.LoaiPhieuDat == 1) {
        room = 50000 * order?.ListPhong.length;
      }
      if (order?.MaPhieuDat?.LoaiPhieuDat == 2) {
        room = 100000 * order?.ListPhong.length;
      }
      return dish + room;
    }
    return 0;
  };

  const renderButton = () => {
    switch (invoice?.TrangThai) {
      case 0:
        return (
          <>
            {renderPay()}
            <div className="right-btn hidden">
              <button className="btn-order handle" onClick={handleOrderDeposit}>
                Xác nhận đã thanh toán
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
            {renderPay()}
            <div className="right-btn hidden">
              <span className="btn-order success">Thành công</span>

              <PDFDownloadLink
                fileName={"invoice" + Math.floor(Math.random() * 10000) + ""}
                document={
                  <PDFFile
                    wasPay={totalDeposit()}
                    dishPrice={totalPrice(invoice?.ListThucDon)}
                    invoice={invoice}
                  ></PDFFile>
                }
              >
                <button className="button__print__invoice btn-order success">In hóa đơn</button>
              </PDFDownloadLink>
            </div>
          </>
        );
        break;
      case 2:
        return (
          <>
            {renderPay()}
            <div className="right-btn">
              <span className="btn-order fail">Hóa đơn bị hủy</span>
            </div>
          </>
        );
        break;

      default:
        break;
    }
  };

  const renderPay = () => {
    return (
      <div className="deposit hidden">
        <div>Khánh hàng phải thanh toán:</div>
        <div className="w60pc-depo">
          <span>Tổng giá trị món ăn</span>
          {convertToVND(totalPrice(invoice?.ListThucDon))}
        </div>
        {invoice?.LoaiHoaDon == 1 ? (
          <div className="w60pc-depo">
            <span>150.000đ mỗi phòng</span>
            {convertToVND(100000 * invoice?.ListPhong.length)}
          </div>
        ) : (
          ""
        )}
        {invoice?.LoaiHoaDon == 2 ? (
          <div className="w60pc-depo">
            <span>300.000đ mỗi phòng</span>
            {convertToVND(300000 * invoice?.ListPhong.length)}
          </div>
        ) : (
          ""
        )}
        {invoice?.MaPhieuDat ? (
          <div className="w60pc-depo">
            <span>Số tiền đã đặt cọc trước: </span>
            {convertToVND(totalDeposit())}
          </div>
        ) : (
          ""
        )}
        <div className="w60pc-depo">
          <span>Tổng cộng phải trả:</span>
          <strong>{totalPay()}</strong>
        </div>
      </div>
    );
  };

  const totalPrice = (menus) => {
    return menus?.reduce((total, menu) => total + menu?.MaThucDon?.GiaMon * menu?.SoLuong, 0);
  };

  const handleOrderDeposit = async () => {
    confirmAlert({
      title: "Xác nhận",
      message: `Xác nhận đã nhận ${totalPay()} tiền thanh toán?`,
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            setLoading(true);
            let id = invoice?._id;
            let status = 1;
            let result = await updateInvoice({ id, TrangThai: status });
            if (result.success) {
              let ids =
                invoice?.LoaiHoaDon === 0
                  ? invoice?.ListBan.map((obj) => obj._id)
                  : invoice?.ListPhong.map((obj) => obj._id);

              let rs = handleChangeStatus(ids, 0, invoice?.LoaiHoaDon);
              if (rs) {
                const btnPrint = document.querySelector(".button__print__invoice");
                if (btnPrint) {
                  btnPrint.click();
                }
                enqueueSnackbar("Thanh toán thành công", {
                  variant: "success",
                });
              } else {
                enqueueSnackbar("Chuyển trạng thái thất bại", {
                  variant: "error",
                });
              }

              getInvoice(invoice?._id);
              setLoading(false);
            } else {
              setLoading(false);
              enqueueSnackbar("Thanh toán thất bại", {
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

  const handleChangeStatus = async (ids, TrangThai, loaiHoaDon) => {
    let reslt;
    if (loaiHoaDon === 0) {
      reslt = await updateManyTable({ ids, TrangThai });
    } else {
      reslt = await updateManyRoom({ ids, TrangThai });
    }
    return reslt.success;
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
            let status = 2;
            let id = invoice?._id;
            let result = await updateInvoice({ id, TrangThai: status });
            if (result.success) {
              let ids =
                invoice?.LoaiHoaDon === 0
                  ? invoice?.ListBan.map((obj) => obj._id)
                  : invoice?.ListPhong.map((obj) => obj._id);

              let rs = handleChangeStatus(ids, 0, invoice?.LoaiHoaDon);
              if (rs) {
                enqueueSnackbar("Hủy hóa đơn thành công", {
                  variant: "success",
                });
              } else {
                enqueueSnackbar("Chuyển trạng thái thất bại", {
                  variant: "error",
                });
              }

              getInvoice(invoice?._id);
              setLoading(false);
            } else {
              setLoading(false);
              enqueueSnackbar("Hủy hóa đơn thất bại", {
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
  const component = useRef();

  const handlePrint = () => {
    window.print();
  };
  console.log(invoice);
  const handlePrintInvoice = useReactToPrint({
    content: () => component.current,
  });
  return (
    <InvoiceDetailAdminStyle ref={component}>
      {loading && <Loading />}

      <PDFDownloadLink
        fileName={"invoice" + Math.floor(Math.random() * 10000) + ""}
        document={
          <PDFFile
            wasPay={totalDeposit()}
            dishPrice={totalPrice(invoice?.ListThucDon)}
            invoice={invoice}
          ></PDFFile>
        }
      >
        <button style={{ display: "none" }} className="button__print__invoice btn-order success">
          In hóa đơn
        </button>
      </PDFDownloadLink>
      {/* <PDFViewer>
        <PDFFile dishPrice={totalPrice(invoice?.ListThucDon)} invoice={invoice}></PDFFile>
      </PDFViewer> */}
      {/* <PDFFile /> */}
      {/* <Button
        className="hidden"
        bgColor={colors.green_1}
        bgHover={colors.green_1_hover}
        // onClick={() => component.current && component.current.ownerDocument.defaultView.print()}
        onClick={handlePrintInvoice}
      >
        Print invoice 1
      </Button> */}
      {/* <div>
        <ReactToPrint
        ref={component}
        content={() => component.current}
        trigger={() => {
          return <button>Print invoice 2</button>;
        }}
        />
        
      </div> */}
      <div className="title hidden">Chi tiết hóa đơn</div>
      <div className="btn-group hidden">{renderButton()}</div>
      <div className="info-order">
        <h6>Thông tin hóa đơn</h6>
        <div className="box-info">
          <div className="col">
            <div className="item">
              <div className="title">Thông tin khánh hàng</div>
              <p className="desc">
                <span className="w160px">Họ tên khách hàng:</span>
                <strong>{invoice?.HoTen}</strong>
              </p>
              <p className="desc">
                <span className="w160px">Số điện thoại:</span>
                <strong>{invoice?.SoDienThoai}</strong>
              </p>
            </div>
          </div>
          <div className="col">
            <div className="item">
              <div className="title">Thông tin hóa đơn</div>
              <p className="desc">
                <span className="w220px">Thời gian vào: </span>
                <strong>{convertDate(invoice?.ThoiGianBatDau)}</strong>
              </p>
              <p className="desc">
                <span className="w220px">Loại hóa đơn: </span>
                <strong>
                  {invoice?.LoaiHoaDon == 0
                    ? "đơn đặt bàn"
                    : invoice?.LoaiHoaDon == 1
                    ? "đơn đặt phòng thường"
                    : "đơn đặt phòng vip"}
                </strong>
              </p>
            </div>
          </div>
          <div className="col">
            <div className="item">
              <div className="title">{`Thông tin ${
                invoice?.LoaiHoaDon == 0 ? "bàn" : "phòng"
              }`}</div>

              {invoice?.LoaiHoaDon == 0 ? (
                invoice?.ListBan?.length > 0 ? (
                  <ul className="list-menu">
                    <li>
                      <span className="title-table name-col">Mã bàn</span>
                      <span className="title-table">Số thứ tự bàn</span>
                      <span className="title-table stock-col right">Số chỗ ngồi</span>
                    </li>
                    {invoice?.ListBan.map((item, index) => {
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
              ) : invoice?.ListPhong?.length > 0 ? (
                <ul className="list-menu">
                  <li>
                    <span className="title-table name-col">Mã phòng</span>
                    <span className="title-table">Tên phòng</span>
                    <span className="title-table stock-col right">Số chỗ ngồi</span>
                  </li>
                  {invoice?.ListPhong?.map((item, index) => {
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

              {invoice?.TrangThai == 0 ? (
                <div className="btn-item">
                  <button
                    className="btn-order info"
                    onClick={() => {
                      invoice?.LoaiHoaDon == 0 ? setIsModalAddTable(true) : setIsModalAddRoom(true);
                    }}
                  >{`Cập nhật ${invoice?.LoaiHoaDon == 0 ? "bàn" : "phòng"}`}</button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="col">
            <div className="item">
              <div className="title">Thông tin thực đơn</div>
              {invoice?.ListThucDon ? (
                <ul className="list-menu">
                  <li>
                    <span className="title-table name-col">Tên món</span>
                    <span className="title-table">Đơn giá</span>
                    <span className="title-table stock-col right">Số lượng</span>
                    <span className="title-table right">Thành tiền</span>
                  </li>
                  {invoice?.ListThucDon?.map((menu, index) => {
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
                    <span className="total w-75pc right">
                      {convertToVND(totalPrice(invoice?.ListThucDon))}
                    </span>
                  </li>
                </ul>
              ) : (
                "Không đặt món"
              )}
              {invoice?.TrangThai == 0 ? (
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
          invoiceId={invoice._id}
          setLoading={setLoading}
          listThucDon={listThucDon}
          setListThucDon={setListThucDon}
          getInvoice={getInvoice}
          isSave={isModalAddMenu}
        />
      )}
      {isModalAddTable && (
        <ModalAddTable
          setIsModalAddTable={setIsModalAddTable}
          loaiHoaDon={invoice?.LoaiHoaDon}
          setLoading={setLoading}
          soNguoi={0}
          thoiGianBatDau={invoice?.ThoiGianBatDau}
          listBan={invoice?.ListBan}
          setListBan={setListBan}
          isSave={isModalAddTable}
          invoiceId={invoice._id}
          getInvoice={getInvoice}
        />
      )}
      {isModalAddRoom && (
        <ModalAddRoom
          setIsModalAddRoom={setIsModalAddRoom}
          loaiHoaDon={invoice?.LoaiHoaDon}
          setLoading={setLoading}
          soNguoi={0}
          thoiGianBatDau={invoice?.ThoiGianBatDau}
          listPhong={invoice?.ListPhong}
          setListPhong={invoice?.LoaiHoaDon == 1 ? setListPhongThuong : setListPhongVIP}
          isSave={isModalAddRoom}
          invoiceId={invoice._id}
          getInvoice={getInvoice}
        />
      )}
    </InvoiceDetailAdminStyle>
  );
}
const InvoiceDetailAdminStyle = styled.div`
  padding: 64px 10px 10px;
  background-color: #f3f3f3;
  min-height: 90vh;
  @media print {
    .hidden {
      display: none;
    }
  }
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
export default InvoiceDetailAdmin;
