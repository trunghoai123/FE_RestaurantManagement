import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { changeStatus ,getOrderDetailByOrder} from "utils/api";
import Loading from "components/Loading/Loading";
import ModalAddTable from "./ModalAddTable";
import ModalAddRoom from "./ModalAddRoom";
import ModalAddMenu from "./ModalAddMenu";
import { enqueueSnackbar } from "notistack";



function OrderDetailAdmin(props) {
    const [orderDetail, setOrderDetail] = useState({})
    const [loading , setLoading] = useState(false)
    const [orderId , setOrderId] = useState('')
    const [isModalAddMenu , setIsModalAddMenu] = useState(false)
    const [isModalAddTable , setIsModalAddTable] = useState(false)
    const [isModalAddRoom , setIsModalAddRoom] = useState(false)


    useEffect(() =>{
        const arrLocation  = window.location.href.split('/')
        const Id = arrLocation[arrLocation.length-1]
        setOrderId(Id)
        getOrderDetail(Id)
      
    },[window.location.href])


    const getOrderDetail = async(id)=>{
        setLoading(true)
        let result = await getOrderDetailByOrder(id)
        if(result && result.data){
            setOrderDetail(result.data[0])
            setLoading(false)
        }else{
            setData([])
            setLoading(false)
        }
    }

    const renderButton = ()=>{
        switch(orderDetail?.MaPhieuDat?.TrangThai){
            case 0:
                return (
                    <>
                        <button className="btn-order handle" onClick={handleOrder}>Xác nhận đơn</button>
                        <button className="btn-order cancel" onClick={handleOrderCancel}>Hủy đơn</button>
                    </>
                )
                break;
            case 1:
                return (
                    <>
                        <button className="btn-order handle" onClick={handleOrder}>Xác nhận đã đặt cọc</button>
                        <button className="btn-order cancel" onClick={handleOrderCancel}>Hủy đơn</button>
                    </>
                )
                break;
            case 2:
                return (
                    <>
                        <button className="btn-order success" onClick={handleOrder}>Xác nhận đơn hàng đã được nhận</button>
                        <button className="btn-order cancel" onClick={handleOrderCancel}>Hủy đơn</button>
                    </>
                )
                break;    
            case 3:
                return (
                    <>
                        <button className="btn-order success" >Thành công</button>
                    </>
                )
                break;    
            case 4:
                return (
                    <>
                        <button className="btn-order fail" >Đơn hàng bị hủy</button>
                    </>
                )
                break;  
            default:
                break;            
        }
    }

    const totalPrice  = ()=>{
        return orderDetail?.ListThucDon?.reduce((total , menu) =>                   
        total + (menu?.MaThucDon?.GiaMon * menu?.SoLuong)
        ,0)
    }

    const handleOrder = async()=>{
        setLoading(true)
        let status = -1;
        let id = orderDetail?.MaPhieuDat?._id;
        if(orderDetail?.MaPhieuDat?.TrangThai == 0)
            status = 1;
        if(orderDetail?.MaPhieuDat?.TrangThai == 1)
            status = 2;
        if(orderDetail?.MaPhieuDat?.TrangThai == 2)
            status = 3;
        let result = await changeStatus(id,status)
        if(result.success){
            getOrderDetail(orderId)
            setLoading(false)
            enqueueSnackbar("Thay đổi trạng thái đơn hàng thành công", {
                variant: "success",
              });
        }else{
            setLoading(false)
            enqueueSnackbar("Thay đổi trạng thái đơn hàng thất bại", {
                variant: "error",
              });
        }
    }
    const handleOrderCancel = async()=>{
        const request = confirm("Bạn có chắc chắn muốn hủy đơn ?")
        if(request){
            setLoading(true)
            let status = 4;
            let id = orderDetail?.MaPhieuDat?._id;
            let result = await changeStatus(id,status)
            if(result.success){
                getOrderDetail(orderId)
                setLoading(false)
                enqueueSnackbar("Hủy đơn hàng thành công", {
                    variant: "success",
                });
            }else{
                setLoading(false)
                enqueueSnackbar("Hủy đơn hàng thất bại", {
                    variant: "error",
                });
            }
        }
    }
    
    return ( 
        <OrderDetailAdminStyle>
            {loading && <Loading/>}
            
            <div className="title">Chi tiết đơn đặt</div>
            <div className="btn-group">
                {renderButton()}
            </div>
            <div className="info-order">
                <h6>Thông tin đơn hàng</h6>
                <div className="box-info">
                    <div className="col">
                        <div className="item">
                            <div className="title">Thông tin khánh hàng</div>
                            <p className="">Họ tên: {orderDetail?.MaPhieuDat?.HoTen}</p>
                            <p className="">Số điện thoại: {orderDetail?.MaPhieuDat?.SoDienThoai}</p>
                            <p className="">Email: {orderDetail?.MaPhieuDat?.Email}</p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Thông tin đơn đặt</div>
                            
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">{`Thông tin ${orderDetail?.MaPhieuDat?.LoaiPhieuDat == 0 ? "bàn" : "phòng"}`}</div>
                            <div className="btn-item">
                                <button className="btn-order info"
                                    onClick={()=>{
                                        orderDetail?.MaPhieuDat?.LoaiPhieuDat == 0 ? 
                                        setIsModalAddTable(true) : setIsModalAddRoom(true)
                                    }}
                                >{`Cập nhật ${orderDetail?.MaPhieuDat?.LoaiPhieuDat == 0 ? "bàn" : "phòng"}`}</button>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Thông tin thực đơn</div>
                            {orderDetail?.ListThucDon ? 
                                <ul className="list-menu">
                                    <li>
                                        <span className="title-table name-col">Tên món</span>
                                        <span className="title-table">Đơn giá</span>
                                        <span className="title-table stock-col right">Số lượng</span>
                                        <span className="title-table right">Thành tiền</span>
                                    </li>
                                    {orderDetail?.ListThucDon?.map((menu, index) => {
                                        return (
                                            <li key={index}>
                                                <span className="name-col">{menu.MaThucDon.TenMon}</span>
                                                <span className="">{menu.MaThucDon.GiaMon}đ</span>
                                                <span className="right stock-col">{menu.SoLuong}</span>
                                                <span className="right">{menu.MaThucDon.GiaMon * menu.SoLuong}đ</span>
                                            </li>
                                        )
                                    })}
                                    <li className="total-row">
                                        <span className="total">Tổng tiền</span>
                                        <span className="total w-75pc right">{totalPrice()}đ</span>
                                    </li>
                                </ul> : "Không đặt món"    
                            }
                            <div className="btn-item">
                                <button className="btn-order info"
                                    onClick={()=>{
                                        setIsModalAddMenu(true)
                                    }}
                                >Cập nhật món</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isModalAddMenu && <ModalAddMenu setIsShow={setIsModalAddMenu} />}
            {isModalAddTable && <ModalAddTable
             setIsModalAddTable={setIsModalAddTable}
             loaiPhieuDat = {orderDetail?.MaPhieuDat?.LoaiPhieuDat}
             orderId = {orderId}
             setLoading = {setLoading}
             soNguoi = {orderDetail?.MaPhieuDat?.SoLuongNguoiTrenBanOrPhong}
             thoiGianBatDau = {orderDetail?.MaPhieuDat?.ThoiGianBatDau}
             soBan = {orderDetail?.MaPhieuDat?.SoLuongBanOrPhong}
             listBan = {orderDetail?.ListBan}
             getOrderDetail = {getOrderDetail}
             />}
             {isModalAddRoom && <ModalAddRoom
             setIsModalAddRoom={setIsModalAddRoom}
             loaiPhieuDat = {orderDetail?.MaPhieuDat?.LoaiPhieuDat}
             orderId = {orderId}
             setLoading = {setLoading}
             soNguoi = {orderDetail?.MaPhieuDat?.SoLuongNguoiTrenBanOrPhong}
             thoiGianBatDau = {orderDetail?.MaPhieuDat?.ThoiGianBatDau}
             soPhong = {orderDetail?.MaPhieuDat?.SoLuongBanOrPhong}
             listPhong = {orderDetail?.ListPhong}
             getOrderDetail = {getOrderDetail}
             />}
        </OrderDetailAdminStyle>
        
     );
}
const OrderDetailAdminStyle = styled.div`
    padding: 64px 10px 10px ;
    background-color: #f3f3f3;
    min-height: 90vh;

    .title{
        font-size: 20px;
        font-weight: bold;
    }
    .info-order{
        clear: both;
        width: 100%;
        background-color: #fff;
        margin-top: 45px;
        padding: 10px;
        border-radius:10px;


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

                    .title{
                        font-size: 15px;
                        color: rgb(220, 180, 110 , 1);
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

        &.handle{
            background-color: #007bff;
        }
        &.success{
          background-color: #28a745;
          
        }
        &.cancel{
          background-color: #dc3545;
        }
        &.fail{
            background-color: #6c757d;
          }
        &.info{
            background-color: #17a2b8;
        }
      }
`
export default OrderDetailAdmin;