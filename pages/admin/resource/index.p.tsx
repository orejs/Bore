import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRef } from 'react';
import { ActionType, ProTable } from 'procomponents';
import { request } from 'utils';
import Image from 'next/image';

const Home: NextPage = () => {
  const actionRef = useRef<ActionType>();

  return (
    <>
      <Head>
        <title>素材库 - {process.env.title}</title>
        <meta name="description" content="素材库" />
      </Head>
      <ProTable
        cardBordered
        rowKey="_id"
        actionRef={actionRef}
        request={(params = {}) => request.get('/api/resource', { params })}
        columns={[
          {
            title: '',
            hideInSearch: true,
            dataIndex: 'url',
            width: 240,
            render: (_, record) => (
              <Link href={record.url}>
                <a target="_blank" className="w-40 h-40 flex items-center justify-center">
                  <Image width={record.width} height={record.height} src={record.url} />
                </a>
              </Link>
            ),
          },
          {
            title: '名字',
            dataIndex: 'name',
            ellipsis: true,
          },
          {
            title: '创建时间',
            dataIndex: 'createdAt',
            width: 200,
            valueType: 'date',
            sorter: true,
            hideInSearch: true,
          },
          {
            title: '更新时间',
            dataIndex: 'updatedAt',
            width: 160,
            valueType: 'date',
            sorter: true,
            hideInSearch: true,
          },
        ]}
      />
    </>
  );
};

export default Home;
