"use client"
import React from "react"
import { Form, Select, Steps, InputNumber, Divider, Button } from "antd"
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { OrderDetail, type IFormData } from "components/OrderDetail"

type MealCategory = "breakfast" | "lunch" | "dinner"

export interface IProps {
  meals: MealCategory[]
  allDishes: {
    id: number
    name: string
    restaurant: string
    availableMeals: IProps["meals"]
  }[]
}

export const StepForm: React.FC<IProps> = (props) => {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [form] = Form.useForm<IFormData>()

  const getAvailableRestaurants = (meal: MealCategory) => {
    return Array.from(
      new Set(props.allDishes.filter((item) => item.availableMeals.includes(meal)).map((item) => item.restaurant))
    )
  }

  const getAvailableDishes = (meal: MealCategory, restaurant: string) => {
    return Array.from(
      new Set(
        props.allDishes
          .filter((item) => item.availableMeals.includes(meal) && item.restaurant === restaurant)
          .map((item) => item.name)
      )
    )
  }

  const isLastStep = currentStep === 3

  return (
    <>
      <Steps
        current={currentStep}
        items={[{ title: "Step 1" }, { title: "Step 2" }, { title: "Step 3" }, { title: "Step 4" }]}
      />

      <Divider />

      <Form form={form} layout="vertical">
        {currentStep === 0 && (
          <Form.Item label="Please select a meal" name="meal" rules={[{ required: true, message: "Meal is required" }]}>
            <Select options={props.meals.map((item) => ({ title: item, value: item }))} />
          </Form.Item>
        )}
        {currentStep === 0 && (
          <Form.Item
            label="Please enter number of people"
            name="numberOfPeople"
            rules={[{ required: true, message: "number of people is required" }]}
          >
            <InputNumber max={10} min={1} />
          </Form.Item>
        )}
        {currentStep === 1 && (
          <Form.Item
            label="Please select a meal"
            name="restaurant"
            validateFirst
            rules={[
              { required: true, message: "Meal is required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getAvailableRestaurants(getFieldValue("meal")).includes(value)) {
                    return Promise.resolve()
                  }
                  return Promise.reject(`Restaurant is not available for ${value}`)
                },
              }),
            ]}
          >
            <Select
              options={getAvailableRestaurants(form.getFieldValue("meal")).map((item) => ({
                title: item,
                value: item,
              }))}
            />
          </Form.Item>
        )}
        {currentStep === 2 && (
          <Form.Item
            label="Dish and number of servings"
            name="_dishes"
            validateFirst
            rules={[
              ({ getFieldValue }) => ({
                validator() {
                  if (getFieldValue("dishes")?.length > 0) {
                    return Promise.resolve()
                  }
                  return Promise.reject("Dishes are required")
                },
              }),
              ({ getFieldValue }) => ({
                validator() {
                  const dishes: IFormData["dishes"] = getFieldValue("dishes")
                  const totalServings = dishes.reduce((acc, item) => acc + (item?.numberOfDish || 0), 0)
                  if (totalServings >= getFieldValue("numberOfPeople")) {
                    return Promise.resolve()
                  }
                  return Promise.reject("Total servings should be greater than or equal to number of people")
                },
              }),
              ({ getFieldValue }) => ({
                validator() {
                  const dishes: IFormData["dishes"] = getFieldValue("dishes")

                  const isDishDuplicate = dishes
                    .filter((item) => Boolean(item?.name))
                    .some((item, index) => {
                      return dishes.findIndex((dish) => dish.name === item.name) !== index
                    })

                  if (isDishDuplicate) {
                    return Promise.reject("Dish should not be duplicate")
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Form.List name="dishes">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="flex items-baseline gap-4">
                      <Form.Item
                        {...restField}
                        className="flex-1"
                        name={[name, "name"]}
                        validateFirst
                        rules={[
                          { required: true, message: "Dish is required" },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                getAvailableDishes(getFieldValue("meal"), getFieldValue("restaurant")).includes(value)
                              ) {
                                return Promise.resolve()
                              }
                              return Promise.reject("Dish is not available")
                            },
                          }),
                        ]}
                      >
                        <Select
                          placeholder="Select dish"
                          options={getAvailableDishes(form.getFieldValue("meal"), form.getFieldValue("restaurant")).map(
                            (item) => ({
                              title: item,
                              value: item,
                            })
                          )}
                          onChange={() => {
                            form.validateFields(["_dishes"])
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        className="flex-1"
                        name={[name, "numberOfDish"]}
                        rules={[{ required: true, message: "Number of servings is required" }]}
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          placeholder="Input number of servings"
                          onChange={() => {
                            form.validateFields(["_dishes"])
                          }}
                          min={1}
                        />
                      </Form.Item>
                      <MinusCircleOutlined
                        onClick={() => {
                          remove(name)
                          form.validateFields(["_dishes"])
                        }}
                      />
                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add()
                        form.validateFields(["_dishes"])
                      }}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add dish
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
        )}
        <Form.Item shouldUpdate noStyle>
          {({ getFieldsValue }) => currentStep === 3 && <OrderDetail data={getFieldsValue(true)} />}
        </Form.Item>
      </Form>
      <div className="mt-8 flex">
        {currentStep > 0 && (
          <Button
            onClick={() => {
              setCurrentStep(currentStep - 1)
            }}
          >
            Prev
          </Button>
        )}
        <div className="flex-1"></div>
        <Button
          type="primary"
          onClick={() => {
            form.validateFields().then(() => {
              if (isLastStep) {
                console.log(form.getFieldsValue(true))
              } else {
                setCurrentStep(currentStep + 1)
              }
            })
          }}
        >
          {isLastStep ? "Submit" : "Next"}
        </Button>
      </div>
    </>
  )
}
