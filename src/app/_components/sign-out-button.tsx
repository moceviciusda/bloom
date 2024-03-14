'use client';

import { Button, type ButtonProps } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';

const SignOutButton: React.FC<ButtonProps> = ({ ...props }) => {
  return (
    <Button {...props} onClick={() => signOut()}>
      Sign out
    </Button>
  );
};

export default SignOutButton;
