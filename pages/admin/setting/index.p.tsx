import type { NextPage } from 'next';
import Head from 'next/head';
import { useRef } from 'react';
import { request } from 'utils';
import { ProForm, ProFormInstance, ProFormText } from 'procomponents';

export { getServerSideProps } from 'pages/admin/utils';

const Home: NextPage = () => {
  const formRef = useRef<ProFormInstance>();

  return (
    <>
      <Head>
        <title>文章管理 - {process.env.title}</title>
        <meta name="description" content="文章管理" />
      </Head>
      <ProForm autoFocusFirstInput formRef={formRef} request={() => request.get(`/api/setting`)}>
        <ProFormText
          required
          name="name"
          label="站点名称"
          placeholder="请输入站点名称"
          rules={[{ required: true, message: '请输入站点名称' }]}
        />
        <ProFormText
          required
          name="description"
          label="站点描述"
          placeholder="请输入站点描述"
          rules={[{ required: true, message: '请输入站点描述' }]}
        />
      </ProForm>
    </>
  );
};

export default Home;
