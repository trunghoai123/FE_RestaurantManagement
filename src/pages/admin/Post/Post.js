import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { getAllPost , deletePost } from "utils/api";
import Loading from "components/Loading/Loading";
import { enqueueSnackbar } from "notistack";
import { confirmAlert } from "react-confirm-alert";
import { convertDate } from "../Order/OrderAdmin";
import ModalChangePost from "./ModalChangePost";

function Post() {
    const [data, setData] = useState([])
    const [loading , setLoading] = useState(false)
    const [isModal, setIsModal] = useState(false)
    const [idSelected, setIdSelected] = useState("")
    const navigate = useNavigate()
    useEffect(()=>{
        getData()
    },[])

    const getData = async () => {
        setLoading(true);
        let result = await getAllPost({});
        if (result && result.data) {
          setData(result.data);
          setLoading(false);
        } else {
          setData([]);
          setLoading(false);
        }
    };

    const renderHeader = () => {
        return (
          <tr>
            <th>STT</th>
            <th>Ảnh nền</th>
            <th>Tiêu đề</th>
            <th>Loại bài viết</th>
            <th>Nội dung</th>
            <th>Thông tin đăng bài</th>
            <th>Thiết lập</th>
            <th>Hành động</th>
          </tr>
        );
    };
    const handleRemove = async (id)=>{
      confirmAlert({
        title: "Xác nhận",
        message: `Xác nhận xóa bài viết?`,
        buttons: [
          {
            label: "Có",
            onClick: async() => {
                setLoading(true);
                let result = await deletePost({id});
                if (result.success) {
                    getData()
                    enqueueSnackbar("Xóa thành công", {
                        variant: "success",
                    });
                    setLoading(false);
                } else {
                    enqueueSnackbar("Xóa thất bại", {
                        variant: "error",
                    });
                    setLoading(false);
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
    const renderBody = () => {
        return data && data.length>0 ? (
            data.map((item, idx) => {
              return (
                <tr key={idx}>
                  <td className="w-50 text-center">{idx + 1}</td>
                  <td className="img-post">
                      <img src={item.AnhNen} alt={item.TieuDe} />
                  </td>
                  <td className="w-250">
                      <strong>{item.TieuDe}</strong>
                  </td>
                  <td>
                    {item.MaLoai.TenLoai}
                  </td>
                  <td style={{textAlign: 'center'}}>
                    <button onClick={()=>{
                      navigate(`/admin/post/review/${item._id}`)
                    }} className="btn-order choose">Xem nội dung</button>
                  </td>
                    <td>
                        <div>Người đăng bài: {item.MaNhanVien.TenNhanVien}</div>
                        <div>Thời gian: {convertDate(item.createdAt)}</div>
                    </td>
                    <td>
                        <div>Thứ tự hiển thị: {item.ThuTuBaiViet}</div>
                        <div>Trạng thái: <span className="status-style">{item.HienThi ? "Hiển thị" : "Ẩn" }</span></div>
                        <div>Nổi bật: <span className="status-style">{item.NoiBat ? "Nổi bật" : "Không" }</span></div>
                        <div className="btn-box">
                          <button onClick={async()=>{
                            await setIdSelected(item._id)
                            setIsModal(true)
                          }} className="btn-order choose">Thiết lập</button>
                        </div>
                    </td>
                  <td>
                    <button className="btn-order handle"
                    onClick={()=>{
                        navigate(`/admin/post/${item._id}`)
                    }}>Sửa</button>
                    <button className="btn-order cancel"
                        onClick={()=>{
                            handleRemove(item._id)
                        }}
                    >Xóa</button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>Chưa có bài viết nào</tr>
          );
    }

    return ( 
        <PostStyles>
            {loading && <Loading />}
            <div className="title">Quản lý bài viết</div>
            <button className="btn-order detail mt-3" onClick={()=>{
                navigate(`/admin/post/0`)
            }}>Thêm bài viết</button>
            <div className="list-order">
                <table className="table-order">
                    <thead>{renderHeader()}</thead>
                    <tbody>{renderBody()}</tbody>
                </table>
            </div>
            {isModal && <ModalChangePost id={idSelected} setIdSelected={setIdSelected} setIsModal={setIsModal} getData={getData}/>}
        </PostStyles>
    );
}
const PostStyles = styled.div`
    padding: 64px 10px 10px;
    background-color: #f3f3f3;
    min-height: 90vh;


    .status-style{
      color: red;
    }
    .btn-box{
      margin-top: 5px;
      text-align: center;
    }

    .img-post{
        width: 150px;
        height: 150px;

        img{
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }

    .title {
        font-size: 20px;
        font-weight: bold;
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
        &.handle {
            background-color: #007bff;
        }
        &.choose{
            background-color: rgb(220, 180, 110 , 1);
        }
        &.info {
            background-color: #17a2b8;
          }
      }
      .list-order {
        margin-top: 10px;
        background-color: #ffffff;
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
    
            
          }
        }
      }
`
export default Post;