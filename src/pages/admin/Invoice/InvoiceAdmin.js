import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { getInvoiceByAll } from "utils/api";
import Loading from "components/Loading/Loading";

export const TAB_INVOICE_STATUS = [
  {status: 0, value:"Chờ thanh toán"},
  {status: 1, value:"Đã thanh toán"},
  {status: 2, value:"Đã hủy"},

]
export const ARR_INVOICE_STATUS = [
  "Chờ thanh toán",
  "Đã thanh toán",
  "Đã hủy"
]


export const TAB_INVOICE_TYPE = [
  { type: 0, value: "Bàn" },
  { type: 1, value: "Phòng thường" },
  { type: 2, value: "Phòng VIP" },
];

export const convertDate = (mongoDate) => {
  const date = new Date(mongoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${hour} giờ ${minute} phút ${day}-${month}-${year}`;
}

const ALL_INVOICE = -1;

const InvoiceAdmin = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(ALL_INVOICE);
  const [selectedType, setSelectedType] = useState(-1);
  const navigate = useNavigate();


  console.log(data)

  useEffect(() => {
    setSelectedType(0);
    setSelectedTab(ALL_INVOICE);
  }, []);

  useEffect(() => {
    getData(selectedTab, selectedType);
  }, [selectedTab]);

  useEffect(() => {
    getData(selectedTab, selectedType);
  }, [selectedType]);

  const getData = async (TrangThai, LoaiHoaDon) => {
    setLoading(true);
    let result = null;
    if (TrangThai == ALL_INVOICE) {
      result = await getInvoiceByAll({ LoaiHoaDon });
    } else {
      result = await getInvoiceByAll({ LoaiHoaDon, TrangThai });
    }
    if (result && result.data) {
      setData(result.data);
      setLoading(false);
    } else {
      setData([]);
      setLoading(false);
    }
  };

  function renderTabType() {
    return TAB_INVOICE_TYPE.map((item, index) => {
      return (
        <div
          key={index}
          className={`tab_item ${selectedType == item.type ? "active" : ""}`}
          onClick={() => {
            setSelectedType(item.type);
          }}
        >
          {item.value}
        </div>
      );
    });
  }
  function renderTabStatus() {
    return TAB_INVOICE_STATUS.map((item, index) => {
      return (
        <div
          key={index}
          className={`tab_item ${selectedTab == item.status ? "active" : ""}`}
          onClick={() => {
            setSelectedTab(item.status);
          }}
        >
          {item.value}
        </div>
      );
    });
  }

  const renderHeader = () => {
    return (
      <tr>
        <th>STT</th>
        <th>Khách hàng</th>
        <th>Người tạo đơn</th>
        <th>Thời gian đến</th>
        <th>Danh sách {selectedType == 0 ? "bàn" : "phòng" }</th>
        <th>Trạng thái</th>
        <th>Hành động</th>
      </tr>
    );
  };
  const renderBody = () => {
    return data ? (
      data.map((item, idx) => {
        return (
          <tr key={idx}>
            <td className="w-50 text-center">{idx + 1}</td>
            <td className="w-150">
              <div>
                <strong>{item.HoTen}</strong>
              </div>
              <div>{item.SoDienThoai}</div>
            </td>
            <td className="w-150">{item.MaNhanVien?.TenNhanVien}</td>
            <td className="w-85 text-center">{convertDate(item.ThoiGianBatDau)}</td>
            <td className="w-150">
                {selectedType == 0 ? item.ListBan && item.ListBan.length > 0 && item.ListBan.map((itm,idn)=>{
                  return (<div key={idn}>
                    Mã bàn: {itm.MaBan}
                  </div>)
                  
                }) : 
                item.ListPhong && item.ListPhong.length > 0 && item.ListPhong.map((itm,idn)=>{
                  return (<div key={idn}>
                    Mã phòng{selectedType == 2 && " VIP"}: {itm.MaPhong}
                  </div>)
                })
                }
               
             
            </td>
            <td className="w-150 text-center"><strong>{ARR_INVOICE_STATUS[item.TrangThai]}</strong></td>
            <td className="w-150 text-center">
              <button className="btn-order detail" onClick={()=>{
                navigate(`/admin/invoice/${item._id}`)
              }}>Chi Tiết</button>
            </td>
          </tr>
        );
      })
    ) : (
      <tr>Không có đơn nào</tr>
    );
  };

  return (
    <InvoiceAdminStyles>
      {loading && <Loading />}
      <div className="title">Quản lý hóa đơn</div>
      <div className="list_tab">{renderTabType()}</div>
      <div className="list_tab status">
        <div
          className={`tab_item ${selectedTab == ALL_INVOICE ? "active" : ""}`}
          onClick={() => {
            setSelectedTab(ALL_INVOICE);
          }}
        >
          Tất cả
        </div>
        {renderTabStatus()}
      </div>
      <div className="list-order">
        <table className="table-order">
          <thead>{renderHeader()}</thead>
          <tbody>{renderBody()}</tbody>
        </table>
      </div>
    </InvoiceAdminStyles>
  );
};

const InvoiceAdminStyles = styled.div`
  padding: 64px 10px 10px;
  background-color: #f3f3f3;
  min-height: 90vh;
  box-sizing: border-box;
  .title {
    font-size: 20px;
    font-weight: bold;
  }

  .list-order {
    margin-top: 10px;
    background-color: #ffffff;
    .table-order {
      width: 100%;

      tr {
        .w-85 {
          max-width: 85px;
          width: 85px;
        }
        .w-50 {
          max-width: 50px;
          width: 50px !important;
        }
        .w-150 {
          max-width: 150px;
          width: 150px;
        }
        .w-300 {
          max-width: 300px;
          width: 300px;
        }
        .w-250 {
          max-width: 250px;
          width: 250px;
        }
        .text-center {
          text-align: center !important;
        }

        th {
          text-align: center;
          padding: 10px;
          background-color: rgb(220, 180, 110, 0.4);
        }

        td {
          border: 1px solid rgb(220, 180, 110, 0.4);
          font-size: 14px;
          padding: 10px;
        }

        .btn-order {
          border: none;
          outline: none;
          padding: 5px 10px;
          color: #fff;
          border-radius: 10px;
          font-weight: bold;
          margin: 0 5px;
          :hover {
            opacity: 0.8;
          }
          &.detail {
            background-color: #17a2b8;
          }
          &.cancel {
            background-color: #dc3545;
          }
        }
      }
    }
  }

  .list_tab {
    display: flex;
    width: 100%;
    margin-top: 10px;

    .tab_item {
      min-width: 180px;
      height: 35px;
      display: grid;
      background-color: #ffffff;
      place-items: center;
      border-bottom: 5px solid rgb(220, 180, 110, 0.3);
      cursor: pointer;

      &.active {
        border-bottom-color: #dcb46e;
        background-color: rgb(220, 180, 110, 0.4);
      }

      :hover {
        background-color: rgb(220, 180, 110, 0.2);
      }
    }

    &.status {
      margin-top: 0;

      .tab_item {
        border-bottom: none;

        &.active {
          background-color: rgb(220, 180, 110, 0.4);
        }
      }
    }
  }
`;

InvoiceAdmin.propTypes = {};

export default InvoiceAdmin;
