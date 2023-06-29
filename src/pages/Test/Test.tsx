import React from 'react'
import { Chart } from 'react-google-charts'

const database = {
  months: ['7/2022', '8/2022', '9/2022', '10/2022'],
  income: [1000, 2000, 3000, 4000],
  expense: [500, 1000, 1500, 2000]
}

const arrIndice = Object.keys(database)
const arrValores = Object.values(database)
const data: {} | undefined = []

for (let i = 0; i < arrValores[0].length; i++) {
  data[i] = arrValores.map((item) => item[i])
}

data.unshift(arrIndice)

export const options = {
  title: 'Receitas x Despesas',
  curveType: 'function',
  legend: { position: 'bottom' },
  hAxis: { format: 'currency' },
  animation: { duration: 1000, easing: 'linear', startup: true }
}

export function Test() {
  return (
    <div>
      <Chart chartType="LineChart" width="100%" height="400px" data={data} options={options} chartLanguage="pt-BR" />
    </div>
  )
}
