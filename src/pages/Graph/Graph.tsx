import React from 'react'
import { Chart } from 'react-google-charts'

interface GraphProps {
  quantity: number
  hAxisTitle: string
  vAxisTitle: string
  database: any[]
  attribute: string
}

export function Graph(props: GraphProps) {
  const { database, attribute, hAxisTitle, vAxisTitle, quantity } = props
  console.log(database)
  console.log(attribute)
  console.log(hAxisTitle)
  console.log(vAxisTitle)
  console.log(quantity)

  const options = {
    title: 'Ad-Hoc',
    curveType: '',
    legend: { position: 'bottom' },
    hAxis: { title: hAxisTitle },
    vAxis: { title: vAxisTitle, minValue: 0, format: '0' },
    animation: { duration: 1000, easing: 'linear', startup: true }
  }

  const data = [[hAxisTitle, vAxisTitle]] as any[]

  database.forEach((element: any) => {
    const index = data.findIndex((item: any) => item[0] === element[attribute])
    if (index === -1) {
      data.push([element[attribute], 1])
    } else {
      data[index][1]++
    }
  })

  console.log(data)

  return (
    <div>
      <Chart chartType="ColumnChart" width="100%" height="400px" data={data} options={options} chartLanguage="pt-BR" />
    </div>
  )
}
