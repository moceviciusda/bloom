'use client';

import { Button, type ButtonProps } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';

interface OauthButtonProps extends ButtonProps {
  provider: string;
}

const OauthButton: React.FC<OauthButtonProps> = ({ provider, ...rest }) => {
  return (
    <Button {...rest} onClick={() => signIn(provider)}>
      {`Continue with ${provider}`}
    </Button>
  );
};

export default OauthButton;
