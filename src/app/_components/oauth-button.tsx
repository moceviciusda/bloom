'use client';

import {
  Button,
  Text,
  type ButtonProps,
  type TextProps,
} from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
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
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await signIn(providerId);
    setLoading(false);
  };

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
      minW='108px'
      {...rest}
      isLoading={loading}
      onClick={() => handleClick()}
    >
      <Text fontSize={14} {...textProps}>
        {providerName}
      </Text>
    </Button>
  );
};

export default OauthButton;
