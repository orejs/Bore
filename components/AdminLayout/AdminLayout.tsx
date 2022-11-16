import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRequest } from 'ahooks';
import { useRouter } from 'next/router';
import { useState, createElement, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Layout, Menu, Spin, Button, Result, MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  RocketFilled,
  BookFilled,
  CloudFilled,
  TagsFilled,
} from '@ant-design/icons';

import 'antd/dist/antd.variable.min.css';

interface Props {
  children?: React.ReactNode;
}

const items: MenuProps['items'] = [
  {
    key: 'blog',
    icon: <BookFilled />,
    label: '文章',
  },
  {
    key: 'tag',
    icon: <TagsFilled />,
    label: '标签',
  },
  {
    key: 'release',
    icon: <RocketFilled />,
    label: '发布',
  },
  {
    key: 'resource',
    icon: <CloudFilled />,
    label: '素材库',
  },
  {
    key: 'setting',
    icon: <SettingOutlined />,
    label: '设置',
  },
];

const keys = items.map((item) => item?.key!);

const AdminLayout = ({ children }: Props) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const signOutReq = useRequest(() => signOut(), { manual: true });
  const loading = status === 'loading';

  useEffect(() => {
    const selectedKey = router.asPath.replace('/admin/', '');
    if (keys.includes(selectedKey)) {
      setSelectedKeys([selectedKey]);
    }
  }, [router.asPath]);

  return (
    <Spin spinning={loading}>
      <div className="w-screen h-screen bg-white">
        {session?.user?.access ? (
          router.route.indexOf('/admin/blog/') === 0 ? (
            children
          ) : (
            <Layout className="w-screen h-screen bg-white">
              <Layout.Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="h-8 m-4 bg-gray-500" />
                <Menu
                  theme="dark"
                  mode="inline"
                  items={items}
                  selectedKeys={selectedKeys}
                  onClick={({ key }) => router.push(`/admin/${key}`)}
                />
              </Layout.Sider>
              <Layout>
                <Layout.Header className="p-0 bg-white">
                  {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className:
                      'px-6 text-[18px] leading-[64px] cursor-pointer transition-colors hover:text-teal-500',
                    onClick: () => setCollapsed(!collapsed),
                  })}
                </Layout.Header>
                <Layout.Content className="my-6 mx-4 p-6 min-h-[280px] bg-white">
                  {children}
                </Layout.Content>
              </Layout>
            </Layout>
          )
        ) : (
          <Result
            status="403"
            title="403"
            subTitle="抱歉，你还没有后台管理权限，请联系管理员开通～"
            extra={
              <Link href="/">
                <Button type="primary">返回首页</Button>
              </Link>
            }
          />
        )}
      </div>
    </Spin>
  );
};

export default AdminLayout;
