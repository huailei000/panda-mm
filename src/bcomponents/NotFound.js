/**
 * name:
 * desc:
 * date: 2018/11/22
 * author: kelvin
 */
import React from 'react';
import NotFoundImg from '../assets/404.png';
import {XBox} from 'xcomponents';

export default () => {
  return (
    <XBox className="not-found-page">
      <img src={NotFoundImg} alt="" />
      <span>抱歉，您所访问的页面已不在地球上～</span>
    </XBox>
  );
};
