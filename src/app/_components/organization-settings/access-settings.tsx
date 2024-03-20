'use client';

import {
  Button,
  Divider,
  FormControl,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import {
  type OrganizationSecret,
  type Organization,
  type Prisma,
} from '@prisma/client';
import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { LuClipboardCheck, LuClipboardCopy } from 'react-icons/lu';
import { api } from '~/trpc/react';
import UserPlate from '../user-plate';
import LoadingSpinner from '../loading-spinner';

interface AccessSettingsProps {
  organization: Organization;
  // admins: Prisma.UsersOnOrganizationsGetPayload<{
  //   include: { user: true };
  // }>[];
}

const AccessSettings: React.FC<AccessSettingsProps> = ({
  organization,
  // admins,
}) => {
  const secrets = api.organization.getSecrets.useQuery({
    slug: organization.slug,
  });

  const admins = api.organization.getAdmins.useQuery({
    slug: organization.slug,
  });

  const generateSecret = api.organization.generateSecret.useMutation({
    onSuccess: async () => {
      await secrets.refetch();
    },
  });

  const demoteAdmin = api.organization.updateUserRole.useMutation({
    onSuccess: async () => {
      await admins.refetch();
    },
  });

  if (secrets.isLoading || admins.isLoading) return <LoadingSpinner />;

  return (
    <>
      <Heading size='md'>Access</Heading>

      <Divider />

      <Text>Secrets</Text>
      <Text fontSize={14}>
        Secrets are used to join your organization without an invitation link or
        admin approval. Only share them with people you trust.
      </Text>

      {secrets.data?.map((secret) => (
        <SecretCard
          key={secret.id}
          orgSecret={secret}
          onDelete={async () => secrets.refetch()}
        />
      ))}
      <Tooltip
        variant='bloom'
        label={
          secrets.data && secrets.data.length > 3
            ? 'You can only have 4 secrets at a time'
            : ''
        }
      >
        <Button
          isLoading={generateSecret.isLoading}
          isDisabled={(secrets.data && secrets.data.length > 3) ?? undefined}
          onClick={() => generateSecret.mutate({ id: organization.id })}
        >
          Generate new secret
        </Button>
      </Tooltip>

      <Divider />

      <Text>Admins</Text>
      <Text fontSize={14}>
        Admins can manage organization settings, invite new members. They
        can&apos;t access the{' '}
        <Text as='span' color='red.500'>
          Danger Zone
        </Text>
        , assign or remove admins.
      </Text>

      {admins.data?.map((admin) => (
        <HStack key={admin.user.id}>
          <UserPlate user={admin.user} />
          <Button
            onClick={() =>
              demoteAdmin.mutate({
                organizationId: organization.id,
                userId: admin.user.id,
                role: 'USER',
              })
            }
            colorScheme='red'
            variant='ghost'
          >
            X
          </Button>
        </HStack>
      ))}
    </>
  );
};

const SecretCard: React.FC<{
  orgSecret: OrganizationSecret;
  onDelete?: () => void;
}> = ({ orgSecret, onDelete }) => {
  const [hidden, setHidden] = useState(true);
  const [copied, setCopied] = useState(false);

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
            pr={20}
          />
          <InputRightElement
            display='flex'
            gap={2}
            alignItems='center'
            justifyContent='flex-start'
            w='70px'
            pr={16}
          >
            <Icon
              color={'blackAlpha.500'}
              _hover={{ color: 'blackAlpha.700' }}
              onClick={async () => {
                await navigator.clipboard.writeText(orgSecret.secret);
                setCopied(true);
              }}
              as={copied ? LuClipboardCheck : LuClipboardCopy}
              boxSize='24px'
            />

            <Icon
              color={'blackAlpha.500'}
              _hover={{ color: 'blackAlpha.700' }}
              onClick={() => setHidden(!hidden)}
              as={hidden ? FaRegEye : FaRegEyeSlash}
              boxSize={hidden ? '22px' : '24px'}
              ml={hidden ? '1px' : undefined}
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        isLoading={deleteSecret.isLoading}
        onClick={() => deleteSecret.mutate({ id: orgSecret.id })}
        colorScheme='red'
        variant='ghost'
      >
        Delete
      </Button>
    </HStack>
  );
};

export default AccessSettings;
