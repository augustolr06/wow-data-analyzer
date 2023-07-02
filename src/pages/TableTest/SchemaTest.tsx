import React, { useState, useEffect } from 'react'

import { getSchema } from '@/services/getSchema'

export function SchemaTest() {
  const [schema, setSchema] = useState<any>(null)

  useEffect(() => {
    const run = async () =>
      await getSchema().then((res) => {
        console.log(res)
        setSchema(res)
      })

    run()
  }, [])

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <pre>{JSON.stringify(schema, null, 2)}</pre>
    </div>
  )
}
