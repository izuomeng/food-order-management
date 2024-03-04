import { Metadata } from "next"
import React from "react"
import { StepForm } from "components/StepForm"
import type { IProps as IStepFormProps } from "components/StepForm"
import { mockDishes } from "./utils"

export const metadata: Metadata = {
  title: "Food Order Management",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    url: "https://next-enterprise.vercel.app/",
    images: [
      {
        width: 1200,
        height: 630,
        url: "https://raw.githubusercontent.com/Blazity/next-enterprise/main/.github/assets/project-logo.png",
      },
    ],
  },
}

async function getData() {
  return Promise.resolve(mockDishes)
}

export default async function Web() {
  const dishes = await getData()
  const meals: IStepFormProps["meals"] = ["breakfast", "lunch", "dinner"]

  return (
    <div className="mx-auto mt-32 max-w-[720px]">
      <StepForm meals={meals} allDishes={dishes as IStepFormProps['allDishes']} />
    </div>
  )
}
