import * as Form from '@radix-ui/react-form';

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  errorMessage?: string;
  className?: string;
  colSpan?: boolean;
  min?: string | number;
  step?: string | number;
}

export function FormInput({ 
  name, 
  label, 
  type = 'text',
  placeholder = '',
  required = false, 
  errorMessage,
  className = '',
  colSpan = false,
  min,
  step
}: FormInputProps) {
  return (
    <Form.Field 
      className={`grid ${colSpan ? 'md:col-span-2' : ''} ${className}`} 
      name={name}
    >
      <div className="flex items-baseline justify-between mb-1">
        <Form.Label className="text-sm font-semibold">
          {label}
        </Form.Label>
        {required && (
          <Form.Message className="text-xs text-red-500" match="valueMissing">
            {errorMessage || `Veuillez entrer ${label.toLowerCase()}`}
          </Form.Message>
        )}
      </div>
      <Form.Control asChild>
        <input 
          className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          type={type} 
          placeholder={placeholder}
          required={required}
          min={min}
          step={step}
        />
      </Form.Control>
    </Form.Field>
  );
}