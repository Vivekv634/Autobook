import React from 'react'
import { Input } from '@/components/ui/input';

const InputField = (props) => {
  return (
    <Input className='border border-[#31363F] text-[#EEEEEE] p-2 rounded-md m-1 outline-none bg-[#31363F] md:bg-[#222831] md:border-[#222831]' type={props.type} value={props.value} onChange={e => props.onChange(e.target.value)} placeholder={props.placeholder} required={true} />
  )
}

export default InputField;