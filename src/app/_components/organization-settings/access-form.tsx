'use client';

import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { type OrganizationSecret, type Organization } from '@prisma/client';
import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { api } from '~/trpc/react';

interface AccessSettingsProps {
  organization: Organization;
}

const AccessSettings: React.FC<AccessSettingsProps> = ({ organization }) => {
  const {
    data: secrets,
    isLoading,
    refetch,
  } = api.organization.getSecrets.useQuery({
    slug: organization.slug,
  });

  const generateSecret = api.organization.generateSecret.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <>
      <Heading size='md'>Access</Heading>

      <Divider />

      <FormLabel>Secrets</FormLabel>
      {secrets?.map((secret) => (
        <SecretCard
          key={secret.id}
          orgSecret={secret}
          onDelete={async () => refetch()}
        />
      ))}
      <Button
        isDisabled={(secrets && secrets.length > 3) ?? undefined}
        onClick={() => generateSecret.mutate({ id: organization.id })}
      >
        Generate new secret
      </Button>
    </>
  );
};

const SecretCard: React.FC<{
  orgSecret: OrganizationSecret;
  onDelete?: () => void;
}> = ({ orgSecret, onDelete }) => {
  const [hidden, setHidden] = useState(true);

  const deleteSecret = api.organization.deleteSecret.useMutation({
    onSuccess: onDelete,
  });

  return (
    <HStack>
      <FormControl>
        <InputGroup>
          <Input
            value={orgSecret.secret}
            isReadOnly
            type={hidden ? 'password' : 'text'}
            placeholder='Secret'
          />
          <InputRightElement onClick={() => setHidden(!hidden)}>
            {hidden ? <FaRegEye /> : <FaRegEyeSlash />}
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        onClick={() => deleteSecret.mutate({ id: orgSecret.id })}
        colorScheme='red'
      >
        Remove
      </Button>
    </HStack>
  );
};

export default AccessSettings;
