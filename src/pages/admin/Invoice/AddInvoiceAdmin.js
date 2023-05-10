import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import {addInvoice,getEmployeeByUserId , updateManyTable, updateManyRoom,getCustomerByPhone} from "utils/api";
import Loading from "components/Loading/Loading";
import ModalAddTable from "./components/ModalAddTable";
import ModalAddRoom from "./components/ModalAddRoom";
import ModalAddMenu from "./components/ModalAddMenu";
import { enqueueSnackbar } from "notistack";
import {convertDate} from "../Order/OrderAdmin"
import { useAuthContext } from "utils/context/AuthContext";

const LOAIHOADON = {
    BAN: 0,
    PHONGTHUONG: 1,
    PHONGVIP: 2
}

function AddInvoiceAdmin() {
    const [loading , setLoading] = useState(false)
    const [isModalAddMenu , setIsModalAddMenu] = useState(false)
    const [isModalAddTable , setIsModalAddTable] = useState(false)
    const [isModalAddRoom , setIsModalAddRoom] = useState(false)
    const [listThucDon, setListThucDon] = useState([])
    const [listBan, setListBan] = useState([])
    const [listPhongThuong, setListPhongThuong] = useState([])
    const [listPhongVIP, setListPhongVIP] = useState([])
    const [loaiHoaDon, setLoaiHoaDon] = useState(LOAIHOADON.BAN)
    const [thoiGianBatDau , setThoiGianBatDau] = useState(new Date())
    const [hoTen, setHoTen] = useState("")
    const [msgHT, setMsgHT] = useState("")
    const [msgSDT, setMsgSDT] = useState("")
    const [soDienThoai, setSoDienThoai] = useState("")
    const TrangThai = 0;
    const { user } = useAuthContext();
    const [idEm, setIdEm] = useState("")
    const [maKh, setMaKh] = useState("")

  useEffect(()=>{
    getEmployee(user._id)
  },[])


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




    const totalPrice  = ()=>{
        return listThucDon?.reduce((total , menu) =>                   
        total + (menu?.MaThucDon?.GiaMon * menu?.SoLuong)
        ,0)
    }

    const isValid = () =>{
        let check = true;
        // if(!hoTen){
        //     setMsgHT("Họ tên không được để trống")
        //     check =  false
        // }else{
        //     setMsgHT("")
        // }
        // if(!soDienThoai){
        //     setMsgSDT("Số điện thoại không được để trống")
        //     check =  false
        // }else{
        //     setMsgSDT("")
        // }
        if(loaiHoaDon === 0 && listBan?.length === 0){
            enqueueSnackbar("Chưa chọn bàn", {
                variant: "warning",
              });
            check =  false
        }
        if(loaiHoaDon === 1 && listPhongThuong?.length === 0){
            enqueueSnackbar("Chưa chọn phòng", {
                variant: "warning",
              });
            check =  false
        }
        if(loaiHoaDon === 2 && listPhongVIP?.length === 0){
            enqueueSnackbar("Chưa chọn phòng", {
                variant: "warning",
              });
            check =  false
        }
        if(listThucDon?.length === 0){
            enqueueSnackbar("Chưa chọn món ăn", {
                variant: "warning",
              });
            check =  false
        }


        return check;
    }
    const clearModel = ( ) =>{
        setMaKh("")
        setListThucDon([])
        setHoTen("")
        setSoDienThoai("")
        setLoaiHoaDon(LOAIHOADON.BAN)
        setListBan([])
        setListPhongThuong([])
        setListPhongVIP([])
    }
    const handleAddOrder = async() => {
        if(isValid()) {
            const data = {
                LoaiHoaDon: loaiHoaDon,
                TrangThai,
                ThoiGianBatDau: thoiGianBatDau,
                MaKhachHang: maKh ? maKh :  null,
                ListThucDon: listThucDon,
                ListPhong: loaiHoaDon == 0 ? [] : loaiHoaDon == 1 ? listPhongThuong : listPhongVIP,
                ListBan: loaiHoaDon == 0 ? listBan : [] ,
                HoTen : hoTen,
                SoDienThoai: soDienThoai,
                MaPhieuDat: null,
                MaNhanVien: idEm , 
            
            }
            setLoading(true)
            let result = await addInvoice(data)
            if(result.success){


                let reslt
                let ids
                if(loaiHoaDon === 0){
                    ids = listBan.map(obj => obj._id);
                    reslt = await updateManyTable({ ids , TrangThai: 1})
                }else if(loaiHoaDon === 1){
                    ids = listPhongThuong.map(obj => obj._id);
                    reslt = await updateManyRoom({ ids , TrangThai: 1})
                }
                else{
                    ids = listPhongVIP.map(obj => obj._id);
                    reslt = await updateManyRoom({ ids , TrangThai: 1})
                }

                if(reslt.success){
                    enqueueSnackbar("Tạo hóa đơn thành công", {
                        variant: "success",
                    });
                    clearModel()
                }
                else{
                    enqueueSnackbar("Chuyển trạng thái thất bại", {
                        variant: "error",
                    });
                }


                
                setLoading(false)
            }else{
                enqueueSnackbar("Tạo hóa đơn thất bại", {
                    variant: "error",
                  });
                setLoading(false)
            }
        }
    }

    const handleOpenModal = () => {
        if(loaiHoaDon === 0){
            setIsModalAddTable(true)  
        }
        else{
            setIsModalAddRoom(true)
        }
   

      
    }
    const handleFindCustomer = async (e)=>{
        if(e.charCode === 13){
            let result = await getCustomerByPhone({SoDienThoai: e.target.value})
            if(result.success && result.data){
                setHoTen(result.data.TenKhachHang)
                setMaKh(result.data._id)
            }
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
                            <div className="row-item">
                                <span className="label">
                                    Nhập họ tên: 
                                </span>
                                <input type="text" placeholder="vd: Đăng Khoa" value={hoTen} onChange={(e)=>{
                                    setHoTen(e.target.value)
                                }}/>
                                {msgHT && <span className="error">{msgHT}</span>}
                            </div>
                            <div className="row-item">
                                <span className="label">
                                    Nhập số điện thoại: 
                                </span>
                                <input type="text" value={soDienThoai} placeholder="vd: 0923222555" onKeyPress={(e)=>{handleFindCustomer(e)}}
                                onChange={(e)=>{
                                    setSoDienThoai(e.target.value)
                                }}/>
                                {msgSDT && <span className="error">{msgSDT}</span>}

                            </div>
                            
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Thông tin hóa đơn</div>
                            <div className="row-item">
                                <span className="label">
                                Loại hóa đơn:
                                </span>
                                <button className={`btn-order type ${loaiHoaDon == 0 ? 'active' : "choose"}`}
                                    onClick={()=>{
                                        setLoaiHoaDon(0)
                                    }}
                                >Đơn đặt bàn</button>
                                <button className={`btn-order type ${loaiHoaDon == 1 ? 'active' : "choose"}`}
                                onClick={()=>{
                                    setLoaiHoaDon(1)
                                }}>Đơn đặt phòng thường</button>
                                <button className={`btn-order type ${loaiHoaDon == 2 ? 'active' : "choose"}`}
                                onClick={()=>{
                                    setLoaiHoaDon(2)
                                }}>Đơn đặt phòng VIP</button>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Đơn đặt {loaiHoaDon ==0 ? 'bàn':'phòng'}</div>
                            
                            {loaiHoaDon == 0 ? 
                            
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
                        loaiHoaDon == 1 ? 
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
                isSave = {false}
                />}
            {isModalAddTable && <ModalAddTable
                setIsModalAddTable={setIsModalAddTable}
                loaiHoaDon = {loaiHoaDon}
                setLoading = {setLoading}
                soNguoi = {0}
                thoiGianBatDau = {thoiGianBatDau}
                listBan = {listBan}
                setListBan={setListBan}
                isSave = {false}

             />}
             {isModalAddRoom && <ModalAddRoom
                setIsModalAddRoom={setIsModalAddRoom}
                loaiHoaDon = {loaiHoaDon}
                setLoading = {setLoading}
                soNguoi = {0}
                thoiGianBatDau = {thoiGianBatDau}
                listPhong = {loaiHoaDon == 1 ? listPhongThuong : listPhongVIP}
                setListPhong={loaiHoaDon == 1 ? setListPhongThuong : setListPhongVIP}
                isSave = {false}
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
          }
        &.info{
            background-color: #17a2b8;
        }
      }
`
export default AddInvoiceAdmin;