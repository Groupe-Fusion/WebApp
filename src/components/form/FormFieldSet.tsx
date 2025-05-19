import { ReactNode } from 'react';

interface FormFieldsetProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function FormFieldset({ title, children, className = '' }: FormFieldsetProps) {
  return (
    // <fieldset className={`border rounded-md p-4 bg-white ${className}`}>
    <fieldset className={`${className}`}>
      {title && (
        <legend className="text-lg font-semibold mb-2">
          {title}
        </legend>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </fieldset>
  );
}