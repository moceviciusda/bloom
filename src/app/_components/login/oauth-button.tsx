'use client';

import {
  Button,
  Text,
  type ButtonProps,
  type TextProps,
} from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
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
  textProps,
  ...rest
}) => {
  const [loading, setLoading] = useState(false);

  const callbackUrl = useSearchParams().get('next') ?? '/';

  const handleClick = async () => {
    setLoading(true);
    await signIn(providerId, { callbackUrl });
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
      {...rest}
      isLoading={loading}
      onClick={() => handleClick()}
    >
      <Text {...textProps}>{providerName}</Text>
    </Button>
  );
};

export default OauthButton;
