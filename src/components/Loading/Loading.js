import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";


function Loading() {
    return ( 
        <Wapper>
            <div className="on-loader">
                <div className="loader loader-2">
                <svg className="loader-star" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1">
                        <polygon points="29.8 0.3 22.8 21.8 0 21.8 18.5 35.2 11.5 56.7 29.8 43.4 48.2 56.7 41.2 35.1 59.6 21.8 36.8 21.8 " fill="#18ffff" />
                    </svg>
                <div className="loader-circles"></div>
                </div>
            </div>
        </Wapper>
    );
}

const Wapper = styled.div`

.on-loader{
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,0.1);
  }
  .loader {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin: 75px;
    display: inline-block;
    vertical-align: middle;
  }
  
  .loader-star {
    position: absolute;
    top: calc(50% - 12px);
  }
  .loader-2 .loader-star {
    position: static;
    width: 60px;
    height: 60px;
    -webkit-transform: scale(0.7);
    -ms-transform: scale(0.7);
        transform: scale(0.7);
    -webkit-animation: loader-2-star 1s ease alternate infinite;
    animation: loader-2-star 1s ease alternate infinite;
  }
  
  .loader-2 .loader-circles {
    width: 8px;
    height: 8px;
    background: #dcb46e;
    border-radius: 50%;
    position: absolute;
    left: calc(50% - 4px);
    top: calc(50% - 4px);
    -webkit-transition: all 1s ease;
    -o-transition: all 1s ease;
    transition: all 1s ease;
    -webkit-animation: loader-2-circles 1s ease-in-out alternate infinite;
    animation: loader-2-circles 1s ease-in-out alternate infinite;
  }
  polygon {
    fill: #dcb46e;
  }
  @keyframes loader-2-circles {
    0% {
        -webkit-box-shadow: 0 0 0 #dcb46e;
        box-shadow: 0 0 0 #dcb46e;
        opacity: 1;
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    50% {
        -webkit-box-shadow: 24px -22px #dcb46e, 30px -15px 0 -3px #dcb46e, 31px 0px #dcb46e, 29px 9px 0 -3px #dcb46e, 24px 23px #dcb46e, 17px 30px 0 -3px #dcb46e, 0px 33px #dcb46e, -10px 28px 0 -3px #dcb46e, -24px 22px #dcb46e, -29px 14px 0 -3px #dcb46e, -31px -3px #dcb46e, -30px -11px 0 -3px #dcb46e, -20px -25px #dcb46e, -12px -30px 0 -3px #dcb46e, 5px -29px #dcb46e, 13px -25px 0 -3px #dcb46e;
        box-shadow: 24px -22px #dcb46e, 30px -15px 0 -3px #dcb46e, 31px 0px #dcb46e, 29px 9px 0 -3px #dcb46e, 24px 23px #dcb46e, 17px 30px 0 -3px #dcb46e, 0px 33px #dcb46e, -10px 28px 0 -3px #dcb46e, -24px 22px #dcb46e, -29px 14px 0 -3px #dcb46e, -31px -3px #dcb46e, -30px -11px 0 -3px #dcb46e, -20px -25px #dcb46e, -12px -30px 0 -3px #dcb46e, 5px -29px #dcb46e, 13px -25px 0 -3px #dcb46e;
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
    }
    100% {
        opacity: 0;
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
        -webkit-box-shadow: 25px -22px #dcb46e, 15px -22px 0 -3px black, 31px 2px #dcb46e, 21px 2px 0 -3px black, 23px 25px #dcb46e, 13px 25px 0 -3px black, 0px 33px #dcb46e, -10px 33px 0 -3px black, -26px 24px #dcb46e, -19px 17px 0 -3px black, -32px 0px #dcb46e, -23px 0px 0 -3px black, -25px -23px #dcb46e, -16px -23px 0 -3px black, 0px -31px #dcb46e, -2px -23px 0 -3px black;
        box-shadow: 25px -22px #dcb46e, 15px -22px 0 -3px black, 31px 2px #dcb46e, 21px 2px 0 -3px black, 23px 25px #dcb46e, 13px 25px 0 -3px black, 0px 33px #dcb46e, -10px 33px 0 -3px black, -26px 24px #dcb46e, -19px 17px 0 -3px black, -32px 0px #dcb46e, -23px 0px 0 -3px black, -25px -23px #dcb46e, -16px -23px 0 -3px black, 0px -31px #dcb46e, -2px -23px 0 -3px black;
    }
  }
  
  @keyframes loader-2-star {
    0% {
      -webkit-transform: scale(0) rotate(0deg);
      transform: scale(0) rotate(0deg);
    }
    100% {
      -webkit-transform: scale(0.7) rotate(360deg);
      transform: scale(0.7) rotate(360deg);
    }
  }
  
  
  
`

export default Loading;