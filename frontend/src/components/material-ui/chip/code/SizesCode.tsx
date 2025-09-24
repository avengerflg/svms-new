import CodeDialog from 'src/components/shared/CodeDialog';
const SizesCode = () => {
  return (
    <>
      <CodeDialog>
        {`

import React from 'react';
import { 
Avatar, 
Chip, 
}  from '@mui/material';
import InlineItemCard from "@/app/components/shared/InlineItemCard";

<InlineItemCard>
    <Chip label="Small" color="primary" />
    <Chip label="Normal" color="primary" />
</InlineItemCard>`}
      </CodeDialog>
    </>
  );
};

export default SizesCode;
