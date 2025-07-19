import React from "react";

interface DisplayTableContentProps {
  table: {
    schema: Record<string, { type: string; internalType: string }>;
    key: string[];
  };
}

function buildFieldText(fieldCount: number, keyCount: number) {
  let fieldText = `${fieldCount} field`;
  if (fieldCount > 1) {
    fieldText += "s";
  }
  fieldText += `, ${keyCount} key`;
  if (keyCount > 1) {
    fieldText += "s";
  }
  return fieldText;
}

const DisplayTableContent: React.FC<DisplayTableContentProps> = ({ table }) => {
  return (
    <>{buildFieldText(Object.keys(table.schema).length, table.key.length)}</>
  );
};

export default DisplayTableContent;
