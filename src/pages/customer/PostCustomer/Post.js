import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { getAllTypePost } from "utils/api";
import Loading from "components/Loading/Loading";
import PostDetail from "./PostDetail";
import PostList from "./PostList";

const SCREEN = {
  LIST: "list",
  DETAIL: "detail",
};

const Post = (props) => {
  const [typePost, setTypePost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState();
  const [idActive, setIdActive] = useState("");
  const [pathName, setPathName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let check = false;
    const pathname = window.location.pathname;
    const arrLocation = pathname.split("/");
    const tab = arrLocation[arrLocation.length - 1];
    if (tab) {
      Object.keys(SCREEN).forEach((value, idx, arr) => {
        if (SCREEN[value] == tab) {
          setActive(tab);
          check = true;
        }
      });
      if (!check) {
        setActive(SCREEN.LIST);
      }
    }
  }, [window.location.pathname]);

  useEffect(() => {
    const pathname = window.location.pathname;
    setPathName(pathname);
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    setIdActive(id);
    if (pathname == "/posts" || pathname == "/posts/") {
      navigate("/posts/list?id=1");
    }
  }, [window.location.pathname]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    let result = await getAllTypePost();
    if (result && result.data) {
      setTypePost(result.data);
      setLoading(false);
    } else {
      setTypePost([]);
      setLoading(false);
    }
  };

  return (
    <PostStyles>
      {loading && <Loading />}
      <div className="post-9">
        <div className="content-post">
          {active === SCREEN.LIST && <PostList />}
          {active === SCREEN.DETAIL && <PostDetail />}
        </div>
      </div>
      <div className="post-3">
        <div className="content-type">
          <ul>
            <li
              onClick={() => {
                setIdActive("1");
                navigate("/posts/list?id=1");
                setActive(SCREEN.LIST);
              }}
              className={pathName == "/posts/list" && idActive === "1" ? "active" : ""}
            >
              Bài viết nổi bật
            </li>
            <li
              onClick={() => {
                setIdActive("0");
                navigate("/posts/list?id=0");
                setActive(SCREEN.LIST);
              }}
              className={pathName == "/posts/list" && idActive === "0" ? "active" : ""}
            >
              Tất cả bài viết
            </li>
          </ul>
          <h4>Bài viết theo chủ đề</h4>
          <ul>
            {typePost?.map((item, idx) => {
              return (
                <li
                  onClick={() => {
                    setIdActive(item._id);
                    navigate(`/posts/list?id=${item._id}`);
                    setActive(SCREEN.LIST);
                  }}
                  className={pathName == "/posts/list" && idActive === item._id ? "active" : ""}
                  key={idx}
                >
                  {item.TenLoai}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </PostStyles>
  );
};

const PostStyles = styled.div`
  padding: 64px 10px 10px;
  background-color: #f3f3f3;
  min-height: 90vh;
  display: flex;

  .post-3 {
    position: relative;
    width: 25%;
    max-width: 25%;
    min-width: 25%;
    padding-right: -5px;

    .content-type {
      position: sticky;
      margin: 0 5px;
      top: 64px;
      border-radius: 10px;
      background-color: #fff;
      padding: 10px;

      h4 {
        font-size: 20px;
        margin: 10px 0;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        width: 100%;

        li {
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          padding: 0 10px;
          border-radius: 10px;
          font-weight: 400;
          cursor: pointer;

          &.active {
            background-color: #dcb46e !important;
            color: #fff;
            cursor: default;
          }

          :hover {
            background-color: rgb(220, 180, 110, 0.3);
          }
        }
      }
    }
  }
  .post-9 {
    width: 75%;
    max-width: 75%;
    min-width: 75%;
    padding-left: -5px;
    .content-post {
      margin: 0 5px;
      background-color: #fff;
      border-radius: 10px;
      min-height: 100vh;
    }
  }
  @media screen and (max-width: 889px) {
    padding: 40px 0px 0px 0px;
    flex-direction: column-reverse;
    .post-3 {
      position: relative;
      width: 100%;
      max-width: 100%;
      min-width: 100%;
      padding-right: -5px;

      .content-type {
        position: block;
        margin: 0 5px;
        top: 64px;
        border-radius: 10px;
        background-color: #fff;
        padding: 10px;

        h4 {
          font-size: 20px;
          margin: 10px 0;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          width: 100%;

          li {
            width: 100%;
            height: 40px;
            display: flex;
            align-items: center;
            padding: 0 10px;
            border-radius: 10px;
            font-weight: 400;
            cursor: pointer;

            &.active {
              background-color: #dcb46e !important;
              color: #fff;
              cursor: default;
            }

            :hover {
              background-color: rgb(220, 180, 110, 0.3);
            }
          }
        }
      }
    }
    .post-9 {
      width: 100%;
      max-width: 100%;
      min-width: 100%;
      padding-left: -5px;
      .content-post {
        margin: 0 5px;
        background-color: #fff;
        border-radius: 10px;
        min-height: 100vh;
      }
    }
  }
`;

Post.propTypes = {};

export default Post;
