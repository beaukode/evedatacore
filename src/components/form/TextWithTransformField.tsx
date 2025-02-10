

import React from 'react';
import { FieldPath, Control } from 'react-hook-form';

interface TextWithTransformFieldProps<TInput extends string, TOutput> {
    
        transform: {
          input: (value: TOutput) => TInput;
          output: (value: React.ChangeEvent<HTMLInputElement>) => TOutput;
        };
        name: FieldPath;
        control: Control;
        defaultValue?: any;
      
}


const TextWithTransformField: React.FC<TextWithTransformFieldProps> =  <TInput extends string, TOutput>({
    control,
    transform,
    name,
    defaultValue
  }) => {
    return (
      <Controller
        defaultValue={defaultValue}
        control={control}
        name={name}
        render={({ field }) => (
          <input
            {...field}
            placeholder="number"
            onChange={(e) => field.onChange(transform.output(e))}
            value={transform.input(field.value)}
          />
        )}
      />
    );
  };

export default TextWithTransformField;