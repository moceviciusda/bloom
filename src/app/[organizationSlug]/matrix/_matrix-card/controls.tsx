'use client';

import { Button, ButtonGroup } from '@chakra-ui/react';
import { type Matrix } from '@prisma/client';
import { MdAssignmentAdd, MdDelete, MdFileCopy, MdShare } from 'react-icons/md';

export const MatrixCardControls: React.FC<{ matrix: Matrix }> = ({
  matrix,
}) => {
  return (
    <ButtonGroup isAttached colorScheme='purple' size='sm'>
      <Button leftIcon={<MdFileCopy />}>Clone</Button>
      <Button leftIcon={<MdAssignmentAdd />}>Assign</Button>
      <Button leftIcon={<MdShare />}>Share</Button>
      <Button leftIcon={<MdDelete />}>Delete</Button>
    </ButtonGroup>
  );
};
