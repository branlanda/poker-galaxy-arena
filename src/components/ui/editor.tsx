
import React, { useState } from 'react';

interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ value = '', onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <textarea
      className="w-full min-h-[200px] p-2 border rounded-md"
      value={value}
      onChange={handleChange}
    />
  );
}
