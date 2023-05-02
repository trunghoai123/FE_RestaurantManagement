import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { getPostById , updatePost } from "utils/api";
import Loading from "components/Loading/Loading";
import { enqueueSnackbar } from "notistack";
import { type } from "@testing-library/user-event/dist/type";



function ModalChangePost({id , setIsModal,setIdSelected, getData}) {
    const [post, setPost] = useState({})
    const [err, setErr] = useState("")
    useEffect(()=>{
        getPost()
    },[])

    const getPost = async()=>{
        let result = await getPostById({id});
        if (result && result.data) {
            setPost(result.data);
        } else {
            setPost({});
        }
    }


    const handleSave= async ()=>{
        if(!post.ThuTuBaiViet && post.ThuTuBaiViet !== 0){
            setErr("Vui lòng nhập thứ tự bài viết")
        }else{
            setErr("")
            let result = await updatePost({id , ThuTuBaiViet: post.ThuTuBaiViet,
            NoiBat: post.NoiBat, HienThi: post.HienThi})
            if(result && result.success){
                getData()
                setIsModal(false)
                enqueueSnackbar("Thành công", {
                    variant: "success",
                });
            }else{
                enqueueSnackbar("Thất bại", {
                    variant: "error",
                });
            }

        }
        
        
       
    }
    return ( 
        <ModalStyle>
            <div className="modal-add-over">
                <div className="modal-add">
                    <div className="modal-add-header">
                        <h2>Cập nhật trạng thái</h2>
                        <div className="close" onClick={()=>setIsModal(false)}>&times;</div>
                    </div>
                    <div className="modal-add-body">
                        <input type="number" placeholder="Thứ tự hiển thị"  min={0}  value={post.ThuTuBaiViet} 
                            onChange={(e)=>{
                                setPost({...post, ThuTuBaiViet: e.target.value});
                            }}
                        />
                        {err && <span className="error-msg">{err}</span>}
                        Hiển thị: <input type="checkbox" checked={post.HienThi} onChange={(e)=>{
                                setPost({...post, HienThi: !post.HienThi});
                            }}/>
                        Nổi bật: <input type="checkbox" checked={post.NoiBat} 
                        onChange={(e)=>{
                            setPost({...post, NoiBat: !post.NoiBat});
                        }}/>

                        <button className="btn-order info bottom-position"
                            onClick={handleSave}
                        >Lưu</button>
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

        .modal-add-body{
            padding: 10px 0;
            
            input{
                width: 100%;
                height: 35px;
                border: 1px solid #dcb46e;
                outline: none;
                padding: 0 10px;
                border-radius: 10px;

            }

            input[type="checkbox"] {
                background-color: #fff;

               
            }
              
            
            

            .bottom-position{
                float: right;
                margin: 0;
                margin-top: 20px;
            }
           
                
          
            
        }
        .error-msg{
            color: red;
            display: block;
        }
        
        .modal-add-footer{
            text-align : right;
        }
        .btn-group{
            float: right;
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
export default ModalChangePost;