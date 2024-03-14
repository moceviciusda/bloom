'use client';

import { Button, type ButtonProps } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

const SignOutButton: React.FC<ButtonProps> = ({ ...props }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  return (
    <Button {...props} isLoading={loading} onClick={() => handleClick()}>
      Sign out
    </Button>
  );
};

export default SignOutButton;
