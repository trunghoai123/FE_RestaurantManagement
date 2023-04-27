import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { getAllTypePost , deleteTypePost } from "utils/api";
import Loading from "components/Loading/Loading";
import { enqueueSnackbar } from "notistack";
import ModalAddTypePost from "./ModalAddTypePost";
import { confirmAlert } from "react-confirm-alert";

function TypePost() {
    const [data, setData] = useState([])
    const [loading , setLoading] = useState(false)
    const [isModal, setIsModal] = useState(false)
    const [idType, setIdType] = useState("")

    useEffect(()=>{
        getData()
    },[])

    const getData = async () => {
        setLoading(true);
        let result = await getAllTypePost();
        if (result && result.data) {
          setData(result.data);
          setLoading(false);
        } else {
          setData([]);
          setLoading(false);
        }
    };
    


    const handleRemove = async (id) => {
        confirmAlert({
            title: "Xác nhận",
            message: `Xác nhận xóa?`,
            buttons: [
              {
                label: "Có",
                onClick: async() => {
                    setLoading(true);
                    let result = await deleteTypePost({id});
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
        
    };


    const renderHeader = () => {
        return (
          <tr>
            <th>STT</th>
            <th>Tên loại</th>
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
                  <td className="w-250">
                      <strong>{item.TenLoai}</strong>
                  </td>
                  <td>
                    <button className="btn-order handle"
                    onClick={async()=>{
                        await setIdType(item._id)
                        setIsModal(true)
                    }}>Sửa tên</button>
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
            <tr>Chưa có loại bài viết nào</tr>
          );
    }

    return ( 
        <TypePostStyles>
            {loading && <Loading />}
            {isModal && <ModalAddTypePost id={idType} setIsModal={setIsModal} getData={getData} />}
            <div className="title">Quản lý loại bài viết</div>
            <button className="btn-order detail mt-3" onClick={async()=>{
                await setIdType("")
                setIsModal(true)
            }}>Thêm loại bài viết</button>
            <div className="list-order">
                <table className="table-order">
                    <thead>{renderHeader()}</thead>
                    <tbody>{renderBody()}</tbody>
                </table>
            </div>

        </TypePostStyles>
    );
}
const TypePostStyles = styled.div`
    padding: 64px 10px 10px;
    background-color: #f3f3f3;
    min-height: 90vh;

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


export default TypePost;