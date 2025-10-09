/*import { InputHTMLAttributes } from 'react';
import { FieldValues, UseFormRegister, Path } from 'react-hook-form';

interface InputProps<T extends FieldValues> extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  label?: string;
}

function Input<T extends FieldValues>({  name, register, error, label, ...rest }: InputProps<T>) {
  return (
    <div className="flex flex-col w-full mt-2 mb-2">
      {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <input
        {...register(name,)}
        {...rest}
        className={`border  border-gray-300 p-2 rounded-md focus:border-[#ef7464] focus:outline-none ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default Input;*/

import { InputHTMLAttributes } from 'react';
import { FieldValues, UseFormRegister, Path } from 'react-hook-form';

interface InputProps<T extends FieldValues> extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  label?: string;
  bgColor?: string; 
}

function Input<T extends FieldValues>({ name, register, error, label, bgColor, ...rest }: InputProps<T>) {
  return (
    <div className="flex flex-col w-full my-2">
      {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <input
        {...register(name)}
        {...rest}
        className={`border-2 border-gray-300 p-3 rounded-md focus:border-[#ef7464] focus:outline-none ${
          error ? 'border-red-500' : ''
        } ${bgColor ? bgColor : 'bg-white'}`} 
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default Input;

