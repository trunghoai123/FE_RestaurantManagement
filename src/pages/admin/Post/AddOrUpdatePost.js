import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  addPost,
  updatePost,
  getPostById,
  getAllTypePost,
  uploadImage,
  getEmployeeByUserId,
} from "utils/api";
import Loading from "components/Loading/Loading";
import { enqueueSnackbar } from "notistack";
import { confirmAlert } from "react-confirm-alert";
import CustomDropDown from "./CustomDropDown";
import { convertBase64 } from "utils/utils";
import { Editor } from "@tinymce/tinymce-react";
import { useAuthContext } from "utils/context/AuthContext";

const initPost = {
  TieuDe: "",
  ThuTuHienThi: 0,
  HienThi: false,
  NoiBat: false,
  NoiDung: "",
  MaLoai: "",
  MaNhanVien: "",
  AnhNen: "",
};

function AddOrUpdatePost() {
  const [post, setPost] = useState({ ...initPost });
  const [typePosts, setTypePosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [id, setId] = useState("");
  const [errTitle, setErrTitle] = useState("");
  const [errContent, setErrContent] = useState("");
  const [errImg, setErrImg] = useState("");
  const [errLoai, setErrLoai] = useState("");
  const { user } = useAuthContext();
  const [idEm, setIdEm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getEmployee(user._id);
  }, []);

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

  useEffect(() => {
    const arrLocation = window.location.href.split("/");
    const Id = arrLocation[arrLocation.length - 1];
    if (Id != "0") {
      setId(Id);
      getPost(Id);
    } else {
      setId("0");
      setPost({ initPost });
    }
  }, []);

  useEffect(() => {
    getTypePosts();
  }, []);

  useEffect(() => {
    setPost({ ...post, MaLoai: selectedItem });
  }, [selectedItem]);

  const getPost = async (id) => {
    setLoading(true);
    let result = await getPostById({ id });
    if (result && result.data) {
      setPost(result.data);
      setSelectedItem(result.data.MaLoai._id);
      setLoading(false);
    } else {
      setPost({ ...initPost });
      setSelectedItem("");
      setLoading(false);
    }
  };

  const getTypePosts = async () => {
    setLoading(true);
    let result = await getAllTypePost();
    if (result && result.data) {
      setTypePosts(result.data);
      setLoading(false);
    } else {
      setTypePosts([]);
      setLoading(false);
    }
  };

  const handleChangeImage = async (e) => {
    let image = e.target.files[0];
    let img64 = await convertBase64(image);
    setLoading(true);
    let result = await uploadImage(img64);
    if (result.success && result.data) {
      setPost({ ...post, AnhNen: result.data });
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const isValid = () => {
    let check = true;
    if (!post.TieuDe) {
      setErrTitle("Tiêu đề không được để trống");
      check = false;
    } else {
      setErrTitle("");
    }
    if (!post.MaLoai) {
      setErrLoai("Chọn loại bài viết");
      check = false;
    } else {
      setErrLoai("");
    }
    if (!post.AnhNen) {
      setErrImg("Ảnh không được để trống");
      check = false;
    } else {
      setErrImg("");
    }
    if (!post.NoiDung) {
      setErrContent("Nội dung không được để trống");
      check = false;
    } else {
      setErrContent("");
    }
    return check;
  };

  const handleSave = async () => {
    if (isValid()) {
      setLoading(true);
      let result;
      if (id === "0") {
        result = await addPost({
          TieuDe: post.TieuDe,
          NoiDung: post.NoiDung,
          AnhNen: post.AnhNen,
          MaNhanVien: idEm,
          MaLoai: post.MaLoai,
          NoiBat: post.NoiBat,
          ThuTuBaiViet: post.ThuTuHienThi,
          HienThi: post.HienThi,
        });
      } else {
        result = await updatePost({
          id: post._id,
          TieuDe: post.TieuDe,
          NoiDung: post.NoiDung,
          AnhNen: post.AnhNen,
          MaLoai: post.MaLoai,
          NoiBat: post.NoiBat,
          ThuTuBaiViet: post.ThuTuHienThi,
          HienThi: post.HienThi,
        });
      }
      if (result.success) {
        enqueueSnackbar("Thành công", {
          variant: "success",
        });
        navigate("/admin/post/manage-post");
        setLoading(false);
      } else {
        enqueueSnackbar("Thất bại", {
          variant: "error",
        });
        setLoading(false);
      }
    }
  };

  return (
    <AddOrUpdateStyles>
      {loading && <Loading />}

      <div className="title">Bài viết</div>
      <div className="right-layout">
        <button
          onClick={() => {
            handleSave();
          }}
          className="btn-order handle"
        >
          {id != "0" ? "Cập nhật" : "Tạo"} bài viết
        </button>
      </div>
      <div className="box-container">
        <div className="img-box">
          <label className="title-input" for="img">
            Thumbnail
          </label>
          <img
            src={
              post.AnhNen
                ? post.AnhNen
                : "https://res.cloudinary.com/dbar5movy/image/upload/v1683052842/RestaurantManagement/rttafiiipag4estaeuas.jpg"
            }
          />
          <input
            hidden
            type="file"
            name="img"
            id="img"
            onChange={(e) => {
              handleChangeImage(e);
            }}
          />
          <label className="btn-order info mt-1" for="img">
            Chọn ảnh
          </label>
          {errImg && <span className="message">{errImg}</span>}
        </div>
        <div className="img-text">
          <div>
            <label className="title-input" for="title">
              Tiêu đề
            </label>
            <textarea
              name="title"
              id="title"
              rows={5}
              value={post.TieuDe}
              onChange={(e) => {
                setPost({ ...post, TieuDe: e.target.value });
              }}
            />
            {errTitle && <span className="message">{errTitle}</span>}
          </div>
          <div>
            <label className="title-input">Loại bài viết</label>
            <CustomDropDown
              selectedItem={selectedItem}
              typePosts={typePosts}
              setSelectedItem={setSelectedItem}
            />
            {errLoai && <span className="message">{errLoai}</span>}
          </div>
        </div>
      </div>

      <div>
        <label className="title-input" for="content">
          Nội dung bài viết
        </label>
        {errContent && <span className="message">{errContent}</span>}
        <Editor
          id="content"
          value={post.NoiDung}
          onEditorChange={(content) => {
            setPost({ ...post, NoiDung: content });
          }}
          init={{
            selector: "textarea#full-featured-non-premium",
            importcss_append: true,
            plugins:
              "anchor toc advlist autolink paste charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss link media",
            toolbar:
              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat | paste | fontsizeselect",
            tinycomments_mode: "embedded",
            tinycomments_author: "DangKhoa",
            imagetools_cors_hosts: ["picsum.photos"],
            menubar: "file edit view insert format tools table help",
            toolbar_sticky: true,
            image_advtab: true,
            content_style: "body { font-family: 'Tahoma'; }",
            fontsize_formats:
              "8px 10px 12px 13px 14px 15px 16px 17px 18px 19px 20px 21px 22px 23px 24px 25px 26px 27px 28px 29px 30px 31px 32px 33px 34px 35px 36px 38px 40px 42px 44px 50px",
            font_formats:
              "Lexend; Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; SVN-Helvetica=SVN-Helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
            formats: {
              bold: { inline: "span", styles: { "font-weight": "bold" } },
            },

            file_picker_callback: function (callback, value, meta) {
              var input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");

              input.onchange = async function () {
                var file = this.files[0];
                setLoading(true);
                const base64 = await convertBase64(file);
                await uploadImage(base64).then((image) => {
                  callback(image.data);
                  setLoading(false);
                });
              };
              input.click();
            },
            importcss_append: true,
            template_cdate_format: "[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]",
            template_mdate_format: "[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]",
            image_caption: true,
            quickbars_selection_toolbar:
              "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
            noneditable_noneditable_class: "mceNonEditable",
            toolbar_drawer: "sliding",
            contextmenu: "link image imagetools table",
            height: 600,
            toolbar_sticky: true,
          }}
        />
        <input type="file" hidden id="input-image" />
      </div>
    </AddOrUpdateStyles>
  );
}
const AddOrUpdateStyles = styled.div`
  padding: 64px 10px 10px;
  background-color: #f3f3f3;
  min-height: 90vh;

  .right-layout {
    display: flex;
    justify-content: flex-end;
  }

  .title-input {
    font-weight: 500;
  }

  .box-container {
    display: flex;
    margin-bottom: 10px;
    .img-box {
      width: 15%;
      img {
        width: 100%;
        aspect-ratio: 1/1;
        object-fit: contain;
        border-radius: 10px;
      }
    }
    .img-text {
      width: calc(85% - 20px);
      margin-left: 20px;
      textarea {
        width: 100%;
        border-radius: 10px;
        padding: 0 10px;
        outline: none;
      }
      label {
        display: block;
      }
    }
  }
  .message {
    color: red;
    font-size: 12px;
    display: block;
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
    &.choose {
      background-color: rgb(220, 180, 110, 0.5);
    }
    &.info {
      background-color: #17a2b8;
    }
  }
`;
export default AddOrUpdatePost;
