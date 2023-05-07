import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { getAllEmployee,deleteEmployee } from "utils/api";
import Loading from "components/Loading/Loading";
import { confirmAlert } from "react-confirm-alert";
import { enqueueSnackbar } from "notistack";
import ModalAddOrUpdateEmployee from "./ModalAddOrUpdateEmployee";

export const convertDate = (mongoDate) => {
    const date = new Date(mongoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  }

function EmployeeManagement() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [id, setId] = useState("0")

    useEffect(()=>{
        getData()
    },[])

    const getData =  async ()=>{
        setLoading(true);
        let result = await getAllEmployee()
        if(result && result.data){
            setData(result.data)
            setLoading(false);
        }
        else{
            setData([])
            setLoading(false);
        }
    }

    const handleDelete = async (id)=>{
        confirmAlert({
            title: "Xác nhận",
            message: "Bạn có chắc chắn muốn xóa nhân viên này ?",
            buttons: [
              {
                label: "Có",
                onClick: async () => {
                  setLoading(true);
                  let result = await deleteEmployee(id);
                  if (result.success) {
                    getData()
                    setLoading(false);
                    enqueueSnackbar("Xóa thành công", {
                      variant: "success",
                    });
                  } else {
                    setLoading(false);
                    enqueueSnackbar("Xóa thất bại", {
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
    }

    const renderHeader = () => {
        return (
          <tr>
            <th>STT</th>
            <th>Ảnh</th>
            <th>Thông tin liên lạc</th>
            <th>Thông tin khác</th>
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
                <td className="img-td" style={{width: 150}}>
                    {item.HinhAnh ? <img src={item.HinhAnh} />: "Chưa có ảnh"}
                </td>
                <td className="w-250">
                  <div>
                    <strong>Họ tên: {item.TenNhanVien ? item.TenNhanVien : 'chưa có'}</strong>
                  </div>
                  <div>Số điện thoại: {item.SoDienThoai ? item.SoDienThoai : 'chưa có'}</div>
                  <div>Email: {item.Email ? item.Email : 'chưa có'}</div>
                </td>
                <td className="w-250">
                  <div>
                    Ngày sinh: {item.NgaySinh ? convertDate(item.NgaySinh) : 'chưa có'}
                  </div>
                  <div>Giới tính: {item.GioiTinh ? item.GioiTinh === '0' ? "Nam" : "Nữ" : 'chưa có'}</div>
                  <div>Nơi ở hiện tại: {item.DiaChi ? item.DiaChi : 'chưa có'}</div>
                </td>
                <td className="w-150 text-center">
                  <button className="btn-order detail" onClick={async()=>{
                    await setId(item._id)
                    setIsModal(true);
                  }}>Sửa</button>
                  <button className="btn-order cancel" onClick={()=>{
                    handleDelete(item._id);
                  }}>Xóa</button>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>Chưa có nhân viên</tr>
        );
      };
    return ( 
        <EmployeeManagementStyles>
            {loading && <Loading />}
            {isModal && <ModalAddOrUpdateEmployee getData={getData} setLoading={setLoading} id={id} setIsModal={setIsModal} />}
            <div className="title">Quản lý nhân viên</div>
            <div className="list-order">
                <button className="btn-order detail" onClick={async()=>{
                  await setId("0")
                  setIsModal(true)}}>Thêm nhân viên</button>
                <table className="table-order">
                <thead>{renderHeader()}</thead>
                <tbody>{renderBody()}</tbody>
                </table>
            </div>
        </EmployeeManagementStyles>
     );
}
const EmployeeManagementStyles = styled.div`
  padding: 64px 10px 10px;
  background-color: #f3f3f3;
  min-height: 90vh;
  .title {
    font-size: 20px;
    font-weight: bold;
  }

  .list-order {
    margin-top: 10px;
    background-color: #ffffff;
    padding-top: 10px;
    .table-order {
      width: 100%;

      tr {
        .w-120 {
          max-width: 120px;
          width: 120px;
        }
        .w-50 {
          max-width: 50px;
          width: 50px !important;
        }
       
        .w-150 {
          max-width: 150px !important;
          min-width: 150px;
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
        .img-td{
            table-layout: fixed;
            min-width: 150px;
            img{
                width: 150px;
                aspect-ratio: 1/1;
                object-fit: contain;
            }
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

        
      }
    }
  }
  .btn-order {
    border: none;
    outline: none;
    padding: 5px 10px;
    color: #fff;
    border-radius: 10px;
    font-weight: bold;
    margin: 0 5px 10px;

    :hover {
      opacity: 0.8;
    }
    &.detail {
      background-color: #17a2b8;
    }
    &.cancel {
      background-color: #dc3545;
    }
    &.choose {
      background-color: rgb(220, 180, 110,1);
    }
  }
  
`;

export default EmployeeManagement;