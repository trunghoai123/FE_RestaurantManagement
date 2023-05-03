import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { getPostByAll } from "utils/api";
import Loading from "components/Loading/Loading";
import { useNavigate } from "react-router-dom";


const PostList = ({}) => {
    const [data, setData] = useState([])
    const navigate = useNavigate()

    useEffect(() =>{
        window.scrollTo(0, 0)
        const url = new URL(window.location.href);
        const id =url.searchParams.get("id")
        if(id != null ){
            getData(id)
        }
        else{
            setData([])
        }
    },[window.location.href])

    const getData = async (id) => {
        let result
        if(id === "0"){
            result = await getPostByAll({HienThi: true});
        }
        else if(id === "1"){
            result = await getPostByAll({HienThi: true , NoiBat: true});
        }else{
            result = await getPostByAll({HienThi: true , MaLoai: id});
        }
        if(result && result.data){
            setData(result.data)
        }else{
            setData([])
        }
    }

    const convertDate = (mongoDate) => {
        const date = new Date(mongoDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${day}-${month}-${year}`;
      }
    
    function renderPostList(){
        return data && data?.length > 0 ? data.map((item, idx)=>{
            return (
                <div key={idx} onClick={()=>{
                    navigate(`/posts/detail?id=${item._id}`);
                }} className="col-post">
                <div className="item-post">
                    <div className="box-img">
                        <img src={item.AnhNen} alt={item.TieuDe} />
                    </div>
                    <p className="title">{item.TieuDe}</p>
                    <p className="date">{convertDate(item.createdAt)}</p>
                </div>
            </div>
            )
        }) : <div>Chưa có bài viết cho chủ đề này</div>
    }

    return(
        <PostListStyles>
            <div className="row-post">
                {renderPostList()}
            </div>
        </PostListStyles>
    )


}

const PostListStyles = styled.div`
    padding: 10px;
    width: 100%;

    .row-post{
        display: flex;
        padding: 0 -5px;

        .col-post{
            width: 33.3333%;
            min-width: 33.3333%;
            max-width: 33.3333%;
            margin: 0 5px;
    
         
            .item-post{
                width: 100%;
                border-radius: 10px;
                border: 1px solid #dcb46e;
                padding: 10px;
                cursor: pointer;
                transition: transform 0.2s linear;

                :hover{
                   
                    transform: scale(1.03);
                       
                    
                }

                .box-img{
                    width: 100%;
                    aspect-ratio: 1/1;
                    overflow: hidden;
                    img{
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        border-radius: 10px;
                        transition: transform 0.2s linear;
                    }
                }
                .title{
                    margin: 5px 0 0 0;
                    font-size: 18px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    height: 50px; 
                }
                .date{
                    font-size: 14px;
                    font-style: italic;
                    margin: 5px 0 0 0;

                }
            }
            
        }
    }

`;

PostList.propTypes = {};


export default PostList;