import React from 'react'
import { Chart } from 'react-google-charts'

interface GraphProps {
  vAxisTitle: string
  headers: any[]
  data: any[]
}

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let index = 0; index < 6; index++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export function Graph(props: GraphProps) {
  const { vAxisTitle, headers, data } = props

  const options = {
    title: 'Ad-Hoc',
    hAxis: { title: `Atributos de ${vAxisTitle}` },
    legend: { position: 'bottom' },
    vAxis: { title: vAxisTitle, minValue: 0, format: '0' },
    animation: { duration: 1000, easing: 'linear', startup: true }
  }

  headers.push({ role: 'style' })
  data.map((item) => item.push(getRandomColor()))

  data.unshift(headers)

  return (
    <div>
      <Chart chartType="ColumnChart" width="100%" height="800px" data={data} options={options} chartLanguage="pt-BR" />
    </div>
  )
}
