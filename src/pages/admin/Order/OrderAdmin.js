import React, {useState, useEffect} from "react";
import { useHistory} from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { getOrderByAll } from "utils/api";
import Loading from "components/Loading/Loading";


const TAB_ORDER_STATUS = [
  {status: 0, value:"Chờ xác nhận"},
  {status: 1, value:"Chờ đặt cọc"},
  {status: 2, value:"Chờ nhận đơn"},
  {status: 3, value:"Kết thúc"},
  {status: 4, value:"Đã hủy"},

]
const ARR_ORDER_STATUS = [
  "Chờ xác nhận",
  "Chờ đặt cọc",
  "Chờ nhận đơn",
  "Kết thúc",
  "Đã hủy",

]


const TAB_ORDER_TYPE = [
  {type: 0, value:"Đơn đặt bàn"},
  {type: 1, value:"Đơn đặt phòng thường"},
  {type: 2, value:"Đơn đặt phòng VIP"},
 
]

const ALL_ORDER = -1

const OrderAdmin = (props) => {
  const [data, setData] = useState([])
  const [loading , setLoading] = useState(false)
  const [selectedTab,setSelectedTab] = useState(ALL_ORDER)
  const [selectedType,setSelectedType] = useState(-1)

  useEffect(() =>{
    setSelectedType(0)
    setSelectedTab(ALL_ORDER)
  },[])

  useEffect(() =>{
    getData(selectedTab,selectedType)
  },[selectedTab])

  useEffect(() =>{
    getData(selectedTab,selectedType)
  },[selectedType])

  const getData = async (TrangThai,LoaiPhieuDat) =>{
      setLoading(true)
      let result = null
      if(TrangThai == ALL_ORDER){
        result = await getOrderByAll({LoaiPhieuDat})
      }else{
        result = await getOrderByAll({LoaiPhieuDat,TrangThai})
      }
      if(result && result.data){
        setData(result.data)
        setLoading(false)
      }else{
        setData([])
        setLoading(false)
      }
   
  }

  function renderTabType(){
    return TAB_ORDER_TYPE.map((item, index) => {
      return (
        <div key={index} className={`tab_item ${selectedType == item.type ? "active" : ""}`}
          onClick={()=>{
            setSelectedType(item.type);
          }}
        >{item.value}</div>
    )})
  }
  function renderTabStatus(){
    return TAB_ORDER_STATUS.map((item, index) => {
      return (
        <div key={index} className={`tab_item ${selectedTab == item.status ? "active" : ""}`}
          onClick={()=>{
            setSelectedTab(item.status);
          }}
        >{item.value}</div>
    )})
  }

  const renderHeader = ()=>{
      return  (
      <tr>
        <th>STT</th>
        <th>Khách hàng</th>
        <th>Thời gian đặt đơn</th>
        <th>Thời gian nhận đơn</th>
        <th>Ghi chú</th>
        <th>
          Số lượng
        </th>
        <th>Trạng thái</th>
        <th>Hành động</th>
    </tr>)
  }
  const renderBody = ()=>{
    return data ? data.map((item, idx)=>{
        return (
          <tr key={idx}>
            <td className="w-50 text-center">{idx + 1}</td>
            <td className="w-300">
              <div><strong>{item.HoTen}</strong></div>
              <div>{item.SoDienThoai}</div>
              <div>{item.Email}</div>
            </td>
            <td className="w-120 text-center">{convertDate(item.createdAt)}</td>
            <td className="w-120 text-center">{convertDate(item.ThoiGianBatDau)}</td>
            <td>{item.GhiChu}</td>
            <td className="w-150">
              <div>{`${selectedType == 0 ? "Số bàn" : "Số phòng"}: ${item.SoLuongBanOrPhong ? item.SoLuongBanOrPhong : 0}`} </div>
              <div>{`${selectedType == 0 ? "Số người/bàn" : "Số người/phòng"}: ${item.SoLuongNguoiTrenBanOrPhong ? item.SoLuongNguoiTrenBanOrPhong : 0}`}</div>
            </td>
            <td>{ARR_ORDER_STATUS[item.TrangThai]}</td>
            <td>
              <button>Chi Tiết</button>
            </td>
        </tr>
        )}
    ) : <tr>Không có đơn nào</tr>
    
  }
  function convertDate(mongoDate) {
    const date = new Date(mongoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }


  return (
  <OrderAdminStyles>
    {loading && <Loading/>}
    <div>Quản lý phiếu đặt</div>
    <div className="list_tab">
      {renderTabType()}
    </div>
    <div className="list_tab status">
      <div className={`tab_item ${selectedTab == ALL_ORDER ? "active" : ""}`}
        onClick={()=>{
          setSelectedTab(ALL_ORDER)
        }}
      >Tất cả</div>
      {renderTabStatus()}
    </div>
    <div className="list-order">
        <table className="table-order">
          {renderHeader()}
          {renderBody()}
        </table>
    </div>
  </OrderAdminStyles>)
};

const OrderAdminStyles = styled.div`
  padding: 64px 10px 10px ;
  background-color: #f3f3f3;
  min-height: 90vh;


  .list-order{
    margin-top: 10px;
    background-color: #ffffff;
    .table-order{
      width: 100%;

      tr{

        .w-120{
          max-width: 120px;
          width: 120px;
        }
        .w-50{
          max-width: 50px;
          width: 50px !important;
        }
        .w-150{
          max-width: 150px;
          width: 150px;
        }
        .w-300{
          max-width: 300px;
          width: 300px;
        }
        .text-center{
          text-align: center !important;
        }

        th{
          text-align: center;
          padding: 10px;
          background-color: rgb(220, 180, 110 , 0.4);
        }

        td{
          border: 1px solid rgb(220, 180, 110 , 0.4);
          font-size: 14px;
          padding: 10px;
        }
      }
    }
  }



  .list_tab{
    display: flex;
    width: 100%;
    margin-top: 10px;

    

    .tab_item{
      min-width: 180px;
      height: 35px;
      display: grid;
      background-color: #ffffff;
      place-items: center;
      border-bottom: 5px solid rgb(220, 180, 110 , 0.3);
      cursor: pointer;

      &.active{
        border-bottom-color: #dcb46e;
        background-color: rgb(220, 180, 110 , 0.4);
      }

      :hover{
        background-color: rgb(220, 180, 110 , 0.2);
      }
    }

    &.status{
      margin-top: 0;
      
      .tab_item{
        border-bottom: none;

        &.active{
          background-color: rgb(220, 180, 110 , 0.4);
        }
      }
    }
  }
  


`;


OrderAdmin.propTypes = {};

export default OrderAdmin;
