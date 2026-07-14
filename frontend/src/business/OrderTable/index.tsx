import React from 'react'
import { Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { AnimatedRow, GlassCard } from '../../ui'
import { themeColors } from '../../theme/config'

const { Text } = Typography

export interface OrderItem {
  id: string
  orderNo: string
  customer: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  createTime: string
}

export interface OrderTableProps {
  data: OrderItem[]
  title?: string
}

const statusMap: Record<string, { color: string; text: string }> = {
  pending: { color: 'gold', text: '待处理' },
  processing: { color: 'processing', text: '处理中' },
  completed: { color: 'success', text: '已完成' },
  cancelled: { color: 'error', text: '已取消' },
}

const columns: ColumnsType<OrderItem> = [
  {
    title: '订单号', dataIndex: 'orderNo', key: 'orderNo',
    render: (text: string) => <Text copyable={{ text }} style={{ fontFamily: 'monospace', fontSize: 13, color: themeColors.textPrimary }}>{text}</Text>,
  },
  { title: '客户', dataIndex: 'customer', key: 'customer', render: (text: string) => <Text style={{ fontWeight: 500, color: themeColors.textPrimary }}>{text}</Text> },
  { title: '金额', dataIndex: 'amount', key: 'amount', render: (val: number) => <Text style={{ color: themeColors.primaryLight, fontWeight: 600 }}>¥{val.toFixed(2)}</Text> },
  { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => { const s = statusMap[status]; return <Tag color={s.color}>{s.text}</Tag> } },
  { title: '下单时间', dataIndex: 'createTime', key: 'createTime', render: (text: string) => <Text style={{ color: themeColors.textSecondary, fontSize: 13 }}>{text}</Text> },
]

const OrderTable: React.FC<OrderTableProps> = ({ data, title = '最近订单' }) => (
  <GlassCard title={<Text style={{ fontWeight: 600, color: themeColors.textPrimary, letterSpacing: 1 }}>{title}</Text>}>
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={false}
      style={{ background: 'transparent' }}
      components={{
        body: { row: (props: any) => {
          const idx = data.findIndex(r => r.id === props['data-row-key'])
          return <AnimatedRow index={idx}>{props.children}</AnimatedRow>
        }},
      }}
    />
  </GlassCard>
)

export default OrderTable
