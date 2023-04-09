import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { changeStatus ,getOrderDetailByOrder} from "utils/api";
import Loading from "components/Loading/Loading";
import { enqueueSnackbar } from "notistack";


function AddOrderAdmin() {
    return ( 
        <OrderAdminStyle>
            alo
        </OrderAdminStyle>
    );
}
const OrderAdminStyle = styled.div`
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
                width: 50%;
                min-width: 50%;
                max-width: 50%;
                margin-bottom: 10px;

                .item{
                    width: 100%;
                    border-radius:10px;
                    background-color: #f3f3f3;
                    padding: 5px;

                    .title{
                        font-size: 15px;
                        color: rgb(220, 180, 110 , 1);
                    }
                
                
                    .list-menu{
                        width: 100%;
                        list-style-type: none;
                        padding: 0;
                        li{
                            span{
                                font-size:14px;
                                font-weight: 400;
                                width: 25%;
                                display: inline-block;
                            }
                            .name-col{
                                width: 35%;
                            }
                            .stock-col{
                                width: 15%;
                            }
                            .title-table{
                                font-weight: 500;
                            }
                            
                        }
                       
                        .total-row{
                            margin-top: 10px;


                            .total{
                                font-weight: 500;
                                font-size:16px;

                                
                            }
                            
                            
                        }
                        .w-75pc{
                            width: 75%;
                        }
                        .right{
                            text-align: right;
                        }
                        
                        
                    }

                    .btn-item{
                        
                        margin-top: 10px;
                        text-align: right;
                    }
                
                }



            }


        }
    }
    .btn-group{
        float: right;

        
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
`
export default AddOrderAdmin;