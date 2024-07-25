import React from 'react'

const Input = (props) => {
  return (
    <input className='border p-2 rounded-md m-1 outline-none' type={props.type} value={props.value} onChange={e => props.onChange(e.target.value)} placeholder={props.placeholder} required={true} />
  )
}

export default Input;