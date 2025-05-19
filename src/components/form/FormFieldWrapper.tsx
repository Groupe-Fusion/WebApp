import * as Form from '@radix-ui/react-form';
import { ReactNode } from 'react';

interface FormFieldWrapperProps {
  name: string;
  label: string;
  children: ReactNode;
  required?: boolean;
  errorMessage?: string;
  className?: string;
  colSpan?: boolean;
}

export function FormFieldWrapper({ 
  name, 
  label, 
  children, 
  required = false, 
  errorMessage = `Veuillez remplir ce champ`,
  className = '',
  colSpan = false
}: FormFieldWrapperProps) {
  return (
    <Form.Field 
      className={`grid ${colSpan ? 'md:col-span-2' : ''} ${className}`} 
      name={name}
    >
      <div className="flex items-baseline justify-between mb-1">
        <Form.Label className="text-sm font-medium text-gray-700">
          {label}
        </Form.Label>
        {required && (
          <Form.Message className="text-xs text-red-500" match="valueMissing">
            {errorMessage}
          </Form.Message>
        )}
      </div>
      {children}
    </Form.Field>
  );
}