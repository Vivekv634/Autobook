import React from 'react'

const page = ({ params }) => {
    const { notebookID } = params;
  return (
      <div>{notebookID}</div>
  )
}

export default page;