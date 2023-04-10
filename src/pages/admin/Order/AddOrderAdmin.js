import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import {addOrder} from "utils/api";
import Loading from "components/Loading/Loading";
import ModalAddTable from "./components/ModalAddTable";
import ModalAddRoom from "./components/ModalAddRoom";
import ModalAddMenu from "./components/ModalAddMenu";
import { enqueueSnackbar } from "notistack";
import {convertDate} from "./OrderAdmin"

const LOAIPHIEUDAT = {
    BAN: 0,
    PHONGTHUONG: 1,
    PHONGVIP: 2
}

function AddOrderAdmin() {
    const [loading , setLoading] = useState(false)
    const [isModalAddMenu , setIsModalAddMenu] = useState(false)
    const [isModalAddTable , setIsModalAddTable] = useState(false)
    const [isModalAddRoom , setIsModalAddRoom] = useState(false)
    const [listThucDon, setListThucDon] = useState([])
    const [listBan, setListBan] = useState([])
    const [listPhongThuong, setListPhongThuong] = useState([])
    const [listPhongVIP, setListPhongVIP] = useState([])
    const [loaiPhieuDat, setLoaiPhieuDat] = useState(LOAIPHIEUDAT.BAN)
    const [thoiGianBatDau , setThoiGianBatDau] = useState()
    const [hoTen, setHoTen] = useState("")
    const [email, setEmail] = useState("")
    const [soDienThoai, setSoDienThoai] = useState("")
    const [ghiChu, setGhiChu] = useState("")
    const [soLuongNguoiTrenBanOrPhong, setSoLuongNguoiTrenBanOrPhong] = useState(2)
    const [soLuongBanOrPhong, setSoLuongBanOrPhong] = useState(1)
    const TrangThai = 0;




    const totalPrice  = ()=>{
        return listThucDon?.reduce((total , menu) =>                   
        total + (menu?.MaThucDon?.GiaMon * menu?.SoLuong)
        ,0)
    }

    const isValid = () =>{

    }

    const handleAddOrder = async() => {
        const data = {
            LoaiPhieuDat: loaiPhieuDat,
            TrangThai,
            SoLuongNguoiTrenBanOrPhong: soLuongNguoiTrenBanOrPhong,
            SoLuongBanOrPhong : soLuongBanOrPhong,
            ThoiGianBatDau: thoiGianBatDau,
            MaKhachHang: null,
            ListThucDon: listThucDon,
            ListPhong: loaiPhieuDat == 0 ? [] : loaiPhieuDat == 1 ? listPhongThuong : listPhongVIP,
            ListBan: loaiPhieuDat == 0 ? listBan : [] ,
            HoTen : hoTen,
            Email : email,
            SoDienThoai: soDienThoai,
            GhiChu: ghiChu
        
        }
        setLoading(true)
        let result = await addOrder(data)
        if(result.success){
            enqueueSnackbar("Tạo đơn đặt thành công", {
                variant: "success",
              });
            setLoading(false)
        }else{
            enqueueSnackbar("Tạo đơn đặt thất bại", {
                variant: "error",
              });
            setLoading(false)
        }
    }

    const handleOpenModal = () => {
        if(soLuongNguoiTrenBanOrPhong>=2 && thoiGianBatDau){
            loaiPhieuDat == 0 ? 
            setIsModalAddTable(true) : setIsModalAddRoom(true)
        }
        if(!soLuongBanOrPhong || !thoiGianBatDau){
            enqueueSnackbar(`Vui lòng chọn thời gian`, {
                variant: "warning",
            });
        }
      
    }

    return ( 
        <OrderAdminStyle>
            {loading && <Loading/>}
            
            <div className="title">Tạo đơn đặt</div>
            <div className="btn-group">
                <button className="btn-order handle" onClick={handleAddOrder}>Tạo đơn</button>

            </div>
            <div className="info-order">
                <h6>Thông tin đơn hàng</h6>
                <div className="box-info">
                    <div className="col">
                        <div className="item">
                            <div className="title">Thông tin khánh hàng</div>
                            <div>Nhập họ tên: 
                            <input type="text" placeholder="Họ tên khánh hàng" onChange={(e)=>{
                                setHoTen(e.target.value)
                            }}/>
                            </div>
                            <div>Nhập số điện thoại: 
                            <input type="text" placeholder="Số điện thoại" 
                            onChange={(e)=>{
                                setSoDienThoai(e.target.value)
                            }}/>
                            </div>
                            <div> Nhập email:
                            <input type="email" placeholder="Email" 
                            onChange={(e)=>{
                                setEmail(e.target.value)
                            }}/>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Thông tin đơn đặt</div>
                            <div>Loại đơn đặt:
                                <button className={`btn-order ${loaiPhieuDat == 0 ? 'active' : "choose"}`}
                                    onClick={()=>{
                                        setLoaiPhieuDat(0)
                                    }}
                                >Đơn đặt bàn</button>
                                <button className={`btn-order ${loaiPhieuDat == 1 ? 'active' : "choose"}`}
                                onClick={()=>{
                                    setLoaiPhieuDat(1)
                                }}>Đơn đặt phòng thường</button>
                                <button className={`btn-order ${loaiPhieuDat == 2 ? 'active' : "choose"}`}
                                onClick={()=>{
                                    setLoaiPhieuDat(2)
                                }}>Đơn đặt phòng VIP</button>
                            </div>
                            <div>Số {loaiPhieuDat ==0 ? 'bàn':'phòng'}: 
                            <input type="number" defaultValue={1} min={1} placeholder={`Số ${loaiPhieuDat ==0 ? 'bàn':'phòng'}`} onChange={(e)=>{
                                setSoLuongBanOrPhong(e.target.value)
                            }}/>
                            </div>
                            <div> Số người trên mỗi {loaiPhieuDat ==0 ? 'bàn':'phòng'}: 
                            <input type="number" defaultValue={2} min={2} placeholder={`Số người trên mỗi ${loaiPhieuDat ==0 ? 'bàn':'phòng'}`}
                                onChange={(e)=>{
                                    setSoLuongNguoiTrenBanOrPhong(e.target.value)
                                }}
                            />
                            </div>
                            <div> Ghi chú: 
                            <textarea placeholder="Ghi chú" 
                                onChange={(e)=>{
                                    setGhiChu(e.target.value)
                                }}
                            />
                            </div>
                            <div>
                            Thời gian đặt: 
                            <input type="date" onChange={(e)=>{
                                    setThoiGianBatDau(e.target.value)
                                }}/>
                            </div>

                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Đơn đặt {loaiPhieuDat ==0 ? 'bàn':'phòng'}</div>
                            
                            {loaiPhieuDat == 0 ? 
                            
                            (listBan?.length>0 ? 
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
                                    )
                                })}
                           
                        </ul> : "Chưa có bàn"  )
                        
                        
                        
                        :
                        loaiPhieuDat == 1 ? 
                        (listPhongThuong?.length>0 ? 
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
                                    )
                                })}
                           
                        </ul> : "Chưa có phòng"  ) : 
                        (listPhongVIP?.length>0 ? 
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
                                    )
                                })}
                           
                        </ul> : "Chưa có phòng"  ) 

                        }
                            
                            <div className="btn-item">
                                <button className="btn-order info"
                                    onClick={()=>{
                                        handleOpenModal()

                                    }}
                                >Cập nhật</button>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Thông tin thực đơn</div>
                            {listThucDon ? 
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
            {isModalAddMenu && <ModalAddMenu 
                setIsModalAddMenu={setIsModalAddMenu}
                setLoading = {setLoading}
                listThucDon = {listThucDon}
                setListThucDon={setListThucDon}
                />}
            {isModalAddTable && <ModalAddTable
                setIsModalAddTable={setIsModalAddTable}
                loaiPhieuDat = {loaiPhieuDat}
                setLoading = {setLoading}
                soNguoi = {soLuongNguoiTrenBanOrPhong}
                thoiGianBatDau = {thoiGianBatDau}
                listBan = {listBan}
                setListBan={setListBan}
             />}
             {isModalAddRoom && <ModalAddRoom
                setIsModalAddRoom={setIsModalAddRoom}
                loaiPhieuDat = {loaiPhieuDat}
                setLoading = {setLoading}
                soNguoi = {soLuongNguoiTrenBanOrPhong}
                thoiGianBatDau = {thoiGianBatDau}
                listPhong = {loaiPhieuDat == 1 ? listPhongThuong : listPhongVIP}
                setListPhong={loaiPhieuDat == 1 ? setListPhongThuong : setListPhongVIP}
             />}
        </OrderAdminStyle>
    );
}
const OrderAdminStyle = styled.div`
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
          }
        &.info{
            background-color: #17a2b8;
        }
      }
`
export default AddOrderAdmin;