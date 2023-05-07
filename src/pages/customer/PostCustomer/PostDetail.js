import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { getPostById } from "utils/api";
import Loading from "components/Loading/Loading";

export const convertDate = (mongoDate) => {
    const date = new Date(mongoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${hour} giờ ${minute} phút ${day}-${month}-${year}`;
  }

const PostDetail = () => {
    const [post , setPost] = useState({})
   
    useEffect(() =>{
        window.scrollTo(0, 0)
        const url = new URL(window.location.href);
        const id =url.searchParams.get("id")
        if(id != null ){
            getPost(id)
        }
        else{
        }
    },[window.location.href])
  
    const getPost = async(id)=>{
        let result = await getPostById({id});
        if (result && result.data) {
            setPost(result.data);
        } else {
            setPost({});
        }
    }
  
  
    return <PostDetailStyles>
        <div className="box">
          <h3>{post?.TieuDe}</h3>
          <div className="desc">Bởi: {post?.MaNhanVien?.TenNhanVien} -  Thời gian: {convertDate(post?.createdAt)}</div>
          <div className="thumbnail">
            <img src={post?.AnhNen} alt={post?.TieuDe}/>
          </div>
          <section id="section" dangerouslySetInnerHTML={{ __html: post?.NoiDung }}>
          </section>
        </div>
    </PostDetailStyles>
}

const PostDetailStyles = styled.div`
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    padding: 10px;

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

`;

PostDetail.propTypes = {};


export default PostDetail;