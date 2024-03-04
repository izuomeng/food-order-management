import { Table, Typography } from "antd"
import React from "react"

export interface IFormData {
  meal: string
  numberOfPeople: number
  restaurant: string
  dishes: { name: string; numberOfDish: number }[]
}

export const OrderDetail: React.FC<{ data: IFormData }> = (props) => {
  return (
    <>
      <Typography.Title level={3}>Preview Your Order</Typography.Title>
      <div className="grid grid-cols-2 gap-y-4 mt-8">
        <b>Meal</b>
        <div>{props.data.meal}</div>

        <b>Number of people</b>
        <div>{props.data.numberOfPeople}</div>

        <b>Restaurant</b>
        <div>{props.data.restaurant}</div>

        <b>Dishes</b>
        <Table
          size="small"
          columns={[
            { dataIndex: "name", title: "Dish" },
            { dataIndex: "numberOfDish", title: "Number of Servings" },
          ]}
          rowKey="name"
          dataSource={props.data.dishes}
          pagination={false}
        />
      </div>
    </>
  )
}
