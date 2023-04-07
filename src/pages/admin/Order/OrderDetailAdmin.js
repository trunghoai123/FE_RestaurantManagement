import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import {  } from "utils/api";
import Loading from "components/Loading/Loading";


function OrderDetailAdmin() {
    const [order, setOrder] = useState([])
    const [loading , setLoading] = useState(false)

    useEffect(() =>{

    },[])

    return ( 
        <OrderDetailAdminStyle>
            {loading && <Loading/>}
            <div className="title">Chi tiết đơn đặt</div>
            <div className="btn-group">
                <button className="btn-order handle">Xác nhận đơn</button>
                <button className="btn-order handle">Xác nhận đã đặt cọc</button>
                <button className="btn-order success">Xác nhận đơn hàng đã được nhận</button>
                <button className="btn-order cancel">Hủy đơn</button>
            </div>
            <div className="info-order">
                <h6>Thông tin đơn hàng</h6>
                <div className="box-info">
                    <div className="col">
                        <div className="item">
                            <div className="title">Thông tin khánh hàng</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Thông tin phòng</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Thông tin thực đơn</div>
                        </div>
                    </div>
                </div>
            </div>
        </OrderDetailAdminStyle>
     );
}
const OrderDetailAdminStyle = styled.div`
    padding: 64px 10px 10px ;
    background-color: #f3f3f3;
    min-height: 90vh;

    .title{
        font-size: 20px;
        font-weight: bold;
    }
    .info-order{
        clear: both;
        width: 100%;
        background-color: #fff;
        margin-top: 45px;
        padding: 10px;
        border-radius:10px;


        .box-info{
            display: flex;
            flex-wrap: wrap;
            margin: 0 -5px;
            .col{
                padding: 0 5px;
                width: 33.333333%
                min-width:33.333333%;
                max-width:33.333333%;

                .item{
                    width: 100%;
                    border-radius:10px;
                    background-color: #f3f3f3;
                    padding: 5px;

                    .title{
                        font-size: 15px;
                        color: rgb(220, 180, 110 , 1);
                    }
                }
            }


        }
    }
    .btn-group{
        float: right;

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
          }
    }
`
export default OrderDetailAdmin;