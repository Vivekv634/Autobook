import React from 'react'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const InputField = (props) => {
  return (
    <div className='relative mt-6'>
      <Label htmlFor={props.id} className='absolute left-1 -top-5'>{ props.label}</Label>
      <Input id={props.id} className='outline-none text-md' type={props.type} value={props.value} onChange={e => props.onChange(e.target.value)} placeholder={props.placeholder} required={true} />
    </div>
  )
}

export default InputField;