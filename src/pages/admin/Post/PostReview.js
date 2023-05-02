import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { getPostById } from "utils/api";
import Loading from "components/Loading/Loading";
import { enqueueSnackbar } from "notistack";
import { confirmAlert } from "react-confirm-alert";
import { convertDate } from "../Order/OrderAdmin";


function PostReview() {
  const [post , setPost] = useState({})
  
  
   
  useEffect(()=>{
      const arrLocation = window.location.href.split("/");
      const Id = arrLocation[arrLocation.length - 1];
      if(Id != "0"){
          getPost(Id)
      }else{
          setPost({})
      }
  },[])

  const getPost = async(id)=>{
      let result = await getPostById({id});
      if (result && result.data) {
          setPost(result.data);
          console.log('object :>> ', result.data);
      } else {
          setPost({});
      }
  }


    return ( 
    <PostReviewStyles>
        <div><h4>Review bài viết</h4></div>
        <div className="box">
          <h3>{post?.TieuDe}</h3>
          <div className="desc">Bởi: {post?.MaNhanVien?.TenNhanVien} -  Thời gian: {convertDate(post?.createdAt)}</div>
          <div className="thumbnail">
            <img src={post?.AnhNen} alt={post?.TieuDe}/>
          </div>
          <section id="section" dangerouslySetInnerHTML={{ __html: post?.NoiDung }}>
          </section>
        </div>
    </PostReviewStyles> );
}
const PostReviewStyles = styled.div`
    padding: 64px 10px 10px;
    background-color: #f3f3f3;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .box{
      width: 90%;
      background-color: #fff;
      border-radius: 10px;
      padding: 20px;

      h3{
      }

      .desc{
        font-size: 13px;
        font-style: italic;
        margin-top: -5px;
      }

      .thumbnail{
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 10px;

        img{
          border-radius: 10px;
          height: 400px;
          object-fit: contain;
        }
      }
      section{
        margin-top: 10px;

        img{
          border-radius: 10px;
        }
      }

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
export default PostReview;