import styled, { css } from "styled-components";
import { Avatar, Button, Card, Input, Layout, List } from "antd";
const { Header } = Layout;

const Colors = {
    "primary": "#4b7cf3"
};

const BorderStyled = css`
    border: unset;
    border-radius: 16px; 
`

export const AntdAvatar = styled(Avatar)`
    background-color: white;
`

export const AntdButton = styled(Button)`
    ${BorderStyled};
    &.ant-btn-primary  {
        background: ${Colors.primary};
        border-color: ${Colors.primary};
        :hover {
            background: #5e8cfb;
            border-color: #5e8cfb;
        }
        :disabled {
            background: #f5f5f5;
            border-color: #f5f5f5;
            color: rgba(0, 0, 0, 0.25);
        }
    }
`

export const AntdCard = styled(Card)`
    border-radius: 20px;
    box-shadow: 0 10px 10px 0 rgb(0 0 0 / 16%);
    background: #f6f5fa;
`

export const AntdHeader = styled(Header)`
    background-color: ${Colors.primary};
    color: white;
    font-size: 20px;
    font-weight: 800;
    padding: 0 24px;
`

export const AntdInput = styled(Input)`
    ${BorderStyled};
`

export const AntdList = styled(List)`
    .ant-list-item {
        background: white;
        border-radius: 10px;
        margin-bottom: 10px;
        padding-left: 5px;
        box-shadow: 0 2px 0 rgb(0 0 0 / 5%);
    }
    .ant-list-item-meta {
        align-items: center;
    }
    .ant-list-item-meta-title {
        margin-bottom: 0;
    }
`