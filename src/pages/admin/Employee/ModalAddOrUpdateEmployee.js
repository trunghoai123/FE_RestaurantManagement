import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { getEmployeeById ,addEmployee , updateEmployee, uploadImage} from "utils/api";
import { convertToVND } from "utils/utils";
import { enqueueSnackbar } from "notistack";
import { set } from "react-hook-form";
import { convertBase64 } from "utils/utils";

const initEmployees = {
    id: "",
    TenNhanVien: "",
    HinhAnh: "" ,
    SoDienThoai: "" ,
    DiaChi: "" ,
    NgaySinh: "",
    GioiTinh: "0" ,
    Email: ''
}
function ModalAddOrUpdateEmployee({setIsModal, id , getData, setLoading}) {
    const [employee, setEmployee] = useState({})
    const [msgAvt, setMsgAvt] = useState("")
    const [msgHT, setMsgHT] = useState("")
    const [msgSDT, setMsgSDT] = useState("")
    const [msgEmail, setMsgEmail] = useState("")
    const [msgDC, setMsgDC] = useState("")
    const [msgBD, setMsgBD] = useState("")
    const [msgSex, setMsgSex] = useState("")

    useEffect(()=>{
        if(id !== "0"){
            getEmployee(id)
        }else{
            setEmployee(initEmployees)
        }
    },[id])

    const getEmployee = async (id) =>{
        setLoading(true)
        let result = await getEmployeeById(id)
        if(result && result.data){
            setEmployee({...result.data, id: result.data._id})
            setLoading(false)
        }else{
            setEmployee(initEmployees)
            setLoading(false)

        }
    }   

    const convertDate = (date) =>{
        let mongoDate = new Date(date)
        const year = mongoDate.getFullYear();
        const month = String(mongoDate.getMonth() + 1).padStart(2, "0");
        const day = String(mongoDate.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    const isValid = () =>{
        let check = true;
        if(!employee.HinhAnh){
            setMsgAvt("Chưa chọn ảnh")
            check = false;
        }else{
            setMsgAvt("")
        }
        if(!employee.TenNhanVien){
            setMsgHT("Chưa nhập tên")
            check = false;
        }else{
            setMsgHT("")
        }
        if(!employee.SoDienThoai){
            setMsgSDT("Chưa nhập số điện thoại")
            check = false;
        }else{
            setMsgSDT("")
        }
        if(!employee.Email){
            setMsgEmail("Chưa nhập email")
            check = false;
        }else{
            setMsgEmail("")
        }
        if(!employee.DiaChi){
            setMsgDC("Chưa nhập địa chỉ")
            check = false;
        }else{
            setMsgDC("")
        }
        if(!employee.NgaySinh){
            setMsgBD("Chưa chọn ngày sinh")
            check = false;
        }else{
            setMsgBD("")
        }
        if(!employee.GioiTinh){
            setMsgSex("Chưa chọn giới tính")
            check = false;
        }else{
            setMsgSex("")
        }



        return check
    }

    const handleSave = async ()=>{
        if(isValid()){
            setLoading(true)
            let result
            if(id === '0'){
                result = await addEmployee(employee)
            }else{
                result = await updateEmployee(employee)
            }
            if(result.success){
                enqueueSnackbar("Lưu thành công", {
                    variant: "success",
                });
                setLoading(false)
                getData()
                setIsModal(false)
            }else{
                enqueueSnackbar("Lưu thất bại", {
                    variant: "error",
                });
                setLoading(false)
            }
        }
    }
    const handleChangeImg = async(e)=>{
        let image = e.target.files[0]
        let img64 = await convertBase64(image);
        setLoading(true);
        let result = await uploadImage(img64);
        if (result.success && result.data) {
            setEmployee({...employee, HinhAnh: result.data});
            setLoading(false);
        } else {
            setLoading(false);
        }
    }

    return ( 
        <ModalStyle>
            <div className="modal-add-over">
                <div className="modal-add">
                    <div className="modal-add-header">
                        <h2>{id === '0' ? "Thêm" : "Cập nhật"} nhân viên</h2>
                        <div className="close" onClick={()=>setIsModal(false)}>&times;</div>
                    </div>
                    <div className="modal-add-body">
                        <div className="modal-box-img">
                            {employee.HinhAnh ? <img src={employee.HinhAnh}/> : <img src="https://res.cloudinary.com/dbar5movy/image/upload/v1683052842/RestaurantManagement/rttafiiipag4estaeuas.jpg"/>}
                            {msgAvt && <div className="error">{msgAvt}</div>}
                            <input type="file" id="img-avt" hidden onChange={(e)=>{handleChangeImg(e)}} />
                            <label className="btn-order handle" htmlFor="img-avt">Chọn ảnh</label>
                        </div>
                        <div className="modal-input">
                            <input className="input-control" type="text" value={employee.TenNhanVien} placeholder="Họ tên nhân viên" onChange={(e)=>{
                                setEmployee({...employee, TenNhanVien: e.target.value});
                            }} />
                            {msgHT && <div className="error">{msgHT}</div>}

                            <input type="text" className="input-control" value={employee.SoDienThoai} placeholder="Số điện thoại" onChange={(e)=>{
                                setEmployee({...employee, SoDienThoai: e.target.value});
                            }} />
                            {msgSDT && <div className="error">{msgSDT}</div>}

                            <input type="text" className="input-control" value={employee.Email} disabled={id === '0' ? "" : "disabled"} placeholder="Email" onChange={(e)=>{
                                setEmployee({...employee, Email: e.target.value});
                            }} />
                            {msgEmail && <div className="error">{msgEmail}</div>}

                            <textarea type="text" className="input-control area" value={employee.DiaChi} placeholder="Địa chỉ" onChange={(e)=>{
                                setEmployee({...employee, DiaChi: e.target.value});
                            }} />
                            {msgDC && <div className="error">{msgDC}</div>}

                            
                        </div>
                        
                    </div>
                    <div className="box-bottom">
                        <div className="w50">
                            Ngày sinh:
                            <input type="date" value={convertDate(employee.NgaySinh)}  onChange={(e)=>{
                                setEmployee({...employee, NgaySinh: e.target.value});
                            }} />
                            {msgBD && <div className="error">{msgBD}</div>}
                        </div>
                        <div className="w50">
                            Giới tính:
                            <input type="radio" id="gender1" checked={employee.GioiTinh === '0' ? "checked" : ""}
                            onChange={(e)=>{
                                setEmployee({...employee, GioiTinh: '0'});
                            }} name="gender"  />
                            <label for="gender1">Nam</label>
                            <input type="radio" id="gender2"
                            onChange={(e)=>{
                                setEmployee({...employee, GioiTinh: '1'});
                            }} checked={employee.GioiTinh === '1' ? "checked" : ""} name="gender" />
                            <label for="gender2">Nữ</label>

                            {msgSex && <div className="error">{msgSex}</div>}

                        </div></div>
                    <div className="btn-group">
                            <button className="btn-order detail" onClick={()=>{
                                handleSave()
                            }}>Lưu</button>
                    </div>
                </div>
            </div>
        </ModalStyle>
     );
}
const ModalStyle = styled.div`
    .modal-add-over{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;

        .modal-add{
            padding: 10px;
            width: 500px;
            border-radius: 10px;
            background-color: #fff;
            z-index: 1001;
            .modal-add-header{
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #000;
                h2{
                    font-size: 22px;
                    font-weight: 500;
                }

                .close{
                    font-size: 35px;
                    color: #000;
                    cursor: pointer;
                }
            }
        }

        .error{
            color: red;
            font-size: 14px;
        }

        .modal-add-body{
            padding: 10px 0 0 0 ;
            display: flex;

            .modal-box-img{
                width: 30%;
                img{
                    border: 1px solid rgb(220, 180, 110,1);
                    border-radius: 10px;
                    width: 100%;
                    aspect-ratio: 1/1;
                    object-fit: contain;
                }

                label{
                    margin: 5px auto 0;
                }
            }
            .modal-input{
                width: 70%;
                padding-left: 10px;
                .input-control{
                    width: 100%;
                    border-radius: 10px;
                    border: 1px solid rgb(220, 180, 110,1);
                    padding: 5px 10px;
                    margin-bottom: 5px;
                }
            }

            
        }
        .box-bottom{
            display: flex;
            
            .w50{
                width: 50%;

                input{
                    margin-left: 5px;
                }
            }
        }
      
        .btn-group{
            float: right;
            justify-content: flex-end;

           
        }
        .clear{
            clear: both;
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
    }
    

` 
export default ModalAddOrUpdateEmployee;