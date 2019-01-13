import React, { Component } from 'react';
import logo from './logo.svg';
// import Header from './components/header/Header';
import './App.css';
import './style/main.css';
import Dashboard from './dashboard';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChartLine,
  faChartPie,
  faUsers,
  faListAlt
} from '@fortawesome/free-solid-svg-icons';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css'; // Import whole style

library.add(faChartLine, faChartPie, faUsers, faListAlt);

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
class App extends Component {
  constructor() {
    super();
    this.state = {
      collapsed: false
    };
  }

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    return (
      <div className="App">
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1">
                <Icon type="pie-chart" />
                <span>Option 1</span>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="desktop" />
                <span>Option 2</span>
              </Menu.Item>
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="user" />
                    <span>User</span>
                  </span>
                }
              >
                <Menu.Item key="3">Tom</Menu.Item>
                <Menu.Item key="4">Bill</Menu.Item>
                <Menu.Item key="5">Alex</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                title={
                  <span>
                    <Icon type="team" />
                    <span>Team</span>
                  </span>
                }
              >
                <Menu.Item key="6">Team 1</Menu.Item>
                <Menu.Item key="8">Team 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="9">
                <Icon type="file" />
                <span>File</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
              {' '}
              <div className="logo" />
              Git Scene
            </Header>
            <Content style={{ margin: '0 16px' }}>
              <div
                style={{ padding: 24, background: '#f0f2f5', minHeight: 360 }}
              >
                <Dashboard />
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              Git Scene ©2018 Created by Passionate Engineers
            </Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default App;
