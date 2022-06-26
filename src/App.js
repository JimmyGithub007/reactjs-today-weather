import './App.css';
import 'antd/dist/antd.min.css';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { AntdAvatar, AntdButton, AntdCard, AntdHeader, AntdInput, AntdList } from './styled';
import { Col, Divider, Empty, Form, Layout, message, Popconfirm, Row, Spin, Typography } from 'antd';
import { CloseOutlined, DeleteOutlined, HistoryOutlined, LoadingOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { AnimatePresence, motion } from 'framer-motion';

const { Text, Title } = Typography;
const { Content } = Layout;
//call from env - start
const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;
const ICON_URL = process.env.REACT_APP_ICON_URL;
//call from env - end

const styled = {
  maxWidth: {
    maxWidth: "768px"
  },
  content: {
    padding: "24px", 
    minHeight: "calc(100vh - 64px)"
  },
  h300: {
    height: "300px"
  },
  pt60: {
    paddingTop: "60px"
  }
};

const defaultData = {
  city: "",
  country: "",
  time: "",
  weather: null
}

const variants = {
  initial: {
    y: -20,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.3
    }
  },
  exit: {
    y: 20, opacity: 0
  }
}

const SearchDataGrid = ({ title, value }) => (
  <Row gutter={24} justify="space-between">
    <Col xs={10} sm={10} md={8} lg={6}>
      <b>{title}:</b>
    </Col>
    <Col sm={14} md={16} lg={18}>
      {value}
    </Col>
  </Row>
);

function App() {
  const [form] = Form.useForm();
  const [count, setCount] = useState(5);
  const [data, setData] = useState(defaultData);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);

  const fetchData = value => {
    setLoading(true);
    axios.get(`${API_URL}q=${value.city},${value.country}&appid=${API_KEY}`)
      .then(response => {
        setLoading(false);
        const resp = response.data;
        let arrHistory = history;
        const respData = {
          id: arrHistory.length > 0 ? arrHistory[0].id + 1 : 1,
          city: resp.name,
          country: resp.sys.country,
          weather: {
            main: resp.weather[0].main,
            description: resp.weather[0].description,
            humidity: resp.main.humidity + "%",
            temp: resp.main.temp_min + "°C~" + resp.main.temp_max + "°C",
            icon: resp.weather[0].icon
          }
        };
        setData({ ...respData, time: moment().format("YYYY-MM-DD hh:mm A") });
        arrHistory.unshift({ ...respData, time: moment().format("hh:mm:ss A") });
        setHistory(arrHistory);
        localStorage.setItem("History", JSON.stringify(arrHistory));
      }).catch(error => {
        setLoading(false);
        setData(defaultData);
        message.error(error.response.data.message);
      })
  }

  //remove record from search history
  const removeData = value => {
    const filterHistory = history.filter(h => h.id !== value.id);
    setHistory(filterHistory);
    localStorage.setItem("History", JSON.stringify(filterHistory));
  }

  //clear the input field and search data
  const clearData = () => {
    form.setFieldsValue({
      city: "",
      country: ""
    });
    setData(defaultData);
  }

  const searchFromHistory = value => {
    form.setFieldsValue({
      city: value.city,
      country: value.country
    });
    fetchData(value);
  }

  const onLoadMore = () => {
    setMoreLoading(true);
    setTimeout(() => {
      let newCount = count;
      newCount += 5;
      setCount(newCount > history.length ? history.length : newCount);
      setMoreLoading(false)
    }, 500);
  }

  //initial get the history record from localStorage
  useEffect(() => {
    const lsHistory = localStorage.getItem("History");
    if (lsHistory) {
      setHistory(JSON.parse(lsHistory));
    }
  }, [])

  return (
    <Layout className="App">
      <motion.div key="header" {...variants}>
        <AntdHeader>
          <Row gutter={24} justify="center">
            <Col xs={24} sm={22} style={styled.maxWidth}>
              Today's Weather
            </Col>
          </Row>
        </AntdHeader>        
      </motion.div>
      <Content style={styled.content}>
        <Row gutter={24} justify="center">
          <Col xs={24} sm={22} style={styled.maxWidth}>
            <Form
              form={form}
              layout="horizontal"
              onFinish={fetchData}
            >
              <motion.div key="result" {...variants}>
                <Row gutter={24}>
                  <Col xs={24} sm={12} md={12} lg={8}>
                    <Form.Item
                      name="city"
                      rules={[{ required: true, message: "City is required!" }]}
                    >
                      <AntdInput placeholder="City" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={8}>
                    <Form.Item
                      name="country"
                      rules={[{ required: true, message: "Country is required!" }]}
                    >
                      <AntdInput placeholder="Country" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={8}>
                    <Row gutter={24}>
                      <Col span={12}>
                        <AntdButton block htmlType="submit" loading={loading} type="primary">{!loading && <SearchOutlined />} Search</AntdButton>
                      </Col>
                      <Col span={12}>
                        <AntdButton block onClick={clearData}><CloseOutlined /> Clear</AntdButton>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </motion.div>
            </Form><br />
            <Row gutter={24} justify="center">
              <Col xs={24} sm={22} md={20} lg={18} xl={16} xxl={14} style={styled.h300}>
                <Spin spinning={loading}>
                  <AnimatePresence>
                    {
                      data.weather ?
                        <motion.div key="result" {...variants}>
                          <AntdCard title={data.city + ", " + data.country} extra={<AntdButton icon={<ReloadOutlined />} shape="circle" type="primary" onClick={() => fetchData(data)} />}>
                            <Title>
                              <AntdAvatar
                                size={50}
                                src={`${ICON_URL}${data.weather.icon}.png`}
                              />
                              {" " + data.weather.main}
                            </Title>
                            <SearchDataGrid title="Description" value={data.weather.description} />
                            <SearchDataGrid title="Temperature" value={data.weather.temp} />
                            <SearchDataGrid title="Humidity" value={data.weather.humidity} />
                            <SearchDataGrid title="Time" value={data.time} />
                          </AntdCard>
                        </motion.div> :
                        <motion.div key="no_result" {...variants}>
                          <Empty description="Not Found" style={styled.pt60} />
                        </motion.div>
                    }
                  </AnimatePresence>
                </Spin>
              </Col>
            </Row>
            <motion.div key="search_history" {...variants}>
              <Divider><HistoryOutlined /> <b>Search History</b></Divider>
            </motion.div>
            <AntdList
              itemLayout="horizontal"
              dataSource={history}
              locale={{
                emptyText: <motion.div key="empty" {...variants}><Empty description="No Record" /></motion.div>
              }}
              loadMore={history.length > 5 ? <Row gutter={24} justify="center">
                <motion.div key="load_more" {...variants}>
                  <AntdButton disabled={history.length <= count ? true : false} type="primary" onClick={onLoadMore}>{moreLoading && <LoadingOutlined />} {history.length > count ? "Loading More" : "No More Record"}</AntdButton>
                </motion.div>
              </Row> : ""}
              renderItem={(item, key) => {
                if (key < count) {
                  return <motion.div key={key} {...variants}>
                    <AntdList.Item
                      actions={[
                        <Text type="secondary">{item.time}</Text>,
                        <AntdButton icon={<SearchOutlined />} shape="circle" type="primary" onClick={() => searchFromHistory(item)} />,
                        <Popconfirm
                          placement="topRight"
                          title="Are you sure to delete this record?"
                          onConfirm={() => removeData(item)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <AntdButton icon={<DeleteOutlined />} shape="circle" type="danger" />
                        </Popconfirm>
                      ]}
                    >
                      <AntdList.Item.Meta
                        avatar={<AntdAvatar src={`${ICON_URL}${item.weather.icon}.png`} />}
                        title={(key + 1) + ". " + item.city + "," + item.country}
                      />
                    </AntdList.Item>
                  </motion.div>
                }
              }}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default App;
