import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { updateOrder , getTableMatchTimeAndSeat } from "utils/api";
import { enqueueSnackbar } from "notistack";


function ModalAddTable({setIsModalAddTable, loaiPhieuDat , orderId , setLoading,
    soNguoi , thoiGianBatDau , soBan , listBan , getOrderDetail}) {
    const [data, setData] = useState([])
    const [dataUse , setDataUse] =useState([])

    useEffect(() => {
        setDataUse(listBan)
        getData()
    },[])


    const getData = async ()=>{
        setLoading(true)
        let result = await getTableMatchTimeAndSeat({ SoNguoi : soNguoi , ThoiGianBatDau : thoiGianBatDau , LoaiPhieuDat : loaiPhieuDat })
        if(result && result.data){
            setLoading(false)
            setData(result.data)
        }
        else{
            setLoading(false)
            setData([])

        }
    }
    const handleSave= async ()=>{
        setLoading(true)
        let result = await updateOrder({id: orderId , ListBan: dataUse})
        if(result.success){
            setLoading(false)
            setIsModalAddTable(false)
            getOrderDetail(orderId)
            enqueueSnackbar("Cập nhật bàn cho đơn đặt thành công", {
                variant: "success",
              });
        }
        else{
            setLoading(false)
            enqueueSnackbar("Cập nhật bàn cho đơn đặt thất bại", {
                variant: "error",
              });
        }
    }

    return ( 
        <ModalStyle>
            <div className="modal-add-over">
                <div className="modal-add">
                    <div className="modal-add-header">
                        <h2>Thêm bàn</h2>
                        <div className="close" onClick={()=>setIsModalAddTable(false)}>&times;</div>
                    </div>
                    <div className="modal-add-body">
                        <div className="modal-col-70">
                            <h5>{`Danh sách bàn hợp lệ`}</h5>
                            <ul>
                                {
                                data?.map((item, idx)=>{
                                    return (
                                        <li key={idx}>
                                            <div className="item">
                                                <div>
                                                    <span>Mã bàn:</span>
                                                    {item.MaBan}
                                                </div>
                                                <div>
                                                    <span>Số thứ tự bàn:</span>
                                                    {item.SoThuTuBan}
                                                </div>
                                                <div>
                                                    <span>Số chỗ ngồi:</span>
                                                    {item.SoChoNgoi}
                                                </div>
                                                <div className="btn-group">
                                                    <button className="btn-order handle"
                                                    onClick={()=>{
                                                        if(!dataUse?.some((itm)=>
                                                            item.MaBan == itm.MaBan

                                                        ))
                                                        setDataUse([...dataUse, item])
                                                    }}
                                                    >Gán</button>
                                                </div>
                                                <div className="clear"></div>
                                            </div>
                                </li>
                                    )
                                })
                                
                                }
                                
                                
                            </ul>
                        </div>
                        <div className="modal-col-30">
                            <h5>{`Danh sách bàn đã gán`}</h5>
                            <ul>
                                {
                                    dataUse ? dataUse.map((item,index)=>{
                                        return (
                                            <li key={index}>
                                                <div><span>Mã bàn:</span>
                                                    {item.MaBan}
                                                </div>
                                                <div><span>Số thứ tự bàn:</span>
                                                {item.SoThuTuBan}</div>
                                                <div><span>Số chỗ ngồi:</span>
                                                {item.SoChoNgoi}</div>
                                                <div className="btn-group">
                                                    <button className="btn-order cancel"
                                                        onClick={()=>{
                                                            setDataUse(dataUse?.filter((itm)=>
                                                            item.MaBan != itm.MaBan
                                                        ))
                                                        }}
                                                    >Gỡ</button>
                                                </div>
                                                <div className="clear"></div>
                                            </li>
                                        )
                                    }) : "Chưa gán bàn"
                                }
                                
                            </ul>
                        </div>


                    </div>
                    <div className="modal-add-footer">
                        <button className="btn-order info"
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
            width: 90%;
            height: 90%;
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
            padding: 10px 0 0 0 ;
            display: flex;
            height: inherit;


            .modal-col-70{
                width: calc(70% - 10px);
                min-width: calc(70% - 10px);
                margin-right: 10px;
                height: 100%;
                overflow-y : auto;

                ::-webkit-scrollbar {
                    display: none;
                }

                ul{
                    list-style-type: none;
                    padding : 0;
                    
                    margin: 0 -5px;
                    display: flex;
                    flex-wrap: wrap;

                    li{
                        padding: 0 5px;
                        width: 50%;
                        min-width:50%;
                        max-width:50%;
                        margin-bottom: 10px;
                        .item{
                            width: 100%;
                            background-color: #f3f3f3;
                            border-radius : 5px;
                            padding : 5px;
                        }
                    }
                }
            }
            .modal-col-30{
                width: 30%;
                min-width: 30%;
                height: 100%;
                overflow-y : auto;

                ::-webkit-scrollbar {
                    display: none;
                }
                ul{
                    list-style-type: none;
                    padding : 0;

                    li{
                        background-color: #f3f3f3;
                        border-radius : 5px;
                        padding : 5px;
                        margin-bottom: 10px;
                    }
                }
            }
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

export default ModalAddTable;