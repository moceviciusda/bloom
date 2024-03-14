'use client';

import {
  Button,
  Text,
  type ButtonProps,
  type TextProps,
} from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { FaDiscord, FaGithub, FaGoogle } from 'react-icons/fa';

interface OauthButtonProps extends ButtonProps {
  providerId: string;
  providerName: string;
  textProps?: TextProps;
}

const OauthButton: React.FC<OauthButtonProps> = ({
  providerId,
  providerName,
  textProps = null,
  ...rest
}) => {
  return (
    <Button
      leftIcon={
        providerId === 'github' ? (
          <FaGithub />
        ) : providerId === 'google' ? (
          <FaGoogle />
        ) : providerId === 'discord' ? (
          <FaDiscord />
        ) : undefined
      }
      {...rest}
      onClick={() => signIn(providerId)}
    >
      <Text fontSize={14} {...textProps}>
        {providerName}
      </Text>
    </Button>
  );
};

export default OauthButton;
