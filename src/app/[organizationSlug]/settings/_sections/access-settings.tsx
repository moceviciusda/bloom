'use client';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  FormControl,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Skeleton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from '@choc-ui/chakra-autocomplete';
import { type OrganizationSecret, type Organization } from '@prisma/client';
import { type FocusEvent, useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { LuClipboardCheck, LuClipboardCopy } from 'react-icons/lu';
import { api } from '~/trpc/react';
import UserPlate, { UserPlateSkeleton } from '../../../_components/user-plate';
import LoadingSpinner from '../../../_components/loading-spinner';
import { useSession } from 'next-auth/react';

interface AccessSettingsProps {
  organization: Organization;
}

const AccessSettings: React.FC<AccessSettingsProps> = ({ organization }) => {
  const secrets = api.organization.getSecrets.useQuery({
    slug: organization.slug,
  });

  const generateSecret = api.organization.generateSecret.useMutation({
    onSuccess: async () => {
      await secrets.refetch();
    },
  });

  return (
    <>
      <Heading size='md'>Access</Heading>

      <Card size='sm' variant='outline'>
        <CardHeader>
          <Text>Secrets</Text>
          <Text fontSize={14}>
            Secrets are used to join your organization without an invitation
            link or admin approval. Only share them with people you trust.
          </Text>
        </CardHeader>

        <CardBody display='flex' flexDir='column' py={0} gap={2}>
          {secrets.isLoading ? (
            <SecretCardSkeleton />
          ) : (
            secrets.data?.map((secret) => (
              <SecretCard
                key={secret.id}
                orgSecret={secret}
                onDelete={async () => secrets.refetch()}
              />
            ))
          )}
        </CardBody>
        <CardFooter>
          <Tooltip
            variant='bloom'
            label={
              secrets.data && secrets.data.length > 1
                ? 'You can only have 2 secrets at a time'
                : ''
            }
          >
            <Button
              flex={1}
              isLoading={generateSecret.isLoading}
              isDisabled={
                (secrets.data && secrets.data.length > 1) ?? secrets.isLoading
              }
              onClick={() => generateSecret.mutate({ id: organization.id })}
            >
              Generate new secret
            </Button>
          </Tooltip>
        </CardFooter>
      </Card>

      <AdminsCard organization={organization} />
    </>
  );
};

const SecretCardSkeleton: React.FC = () => {
  return (
    <HStack align='stretch'>
      <Skeleton flex={1} h={10} borderRadius={6} fadeDuration={2} />
      <Skeleton w={20} borderRadius={6} fadeDuration={2} />
    </HStack>
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
            variant='filled'
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
              as={copied ? LuClipboardCheck : LuClipboardCopy}
              color={'blackAlpha.500'}
              _hover={{ color: 'blackAlpha.700' }}
              onClick={async () => {
                await navigator.clipboard.writeText(orgSecret.secret);
                setCopied(true);
              }}
              onMouseLeave={() => setCopied(false)}
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

const AdminsCard: React.FC<AccessSettingsProps> = ({ organization }) => {
  const [selectedUser, setSelectedUser] = useState('');

  const session = useSession();

  const admins = api.organization.getAdmins.useQuery({
    slug: organization.slug,
  });

  const users = api.organization.getUsers.useQuery({
    slug: organization.slug,
  });

  const updateRole = api.organization.updateUserRole.useMutation({
    onSuccess: async () => {
      setSelectedUser('');
      await admins.refetch();
    },
  });

  return (
    <Card size='sm' variant='outline'>
      <CardHeader>
        <Text>Admins</Text>
        <Text fontSize={14}>
          Admins can manage organization settings and invite new members. They
          can&apos;t access the{' '}
          <Text as='span' color='red.500'>
            Danger Zone
          </Text>
          , assign or remove admins.
        </Text>
      </CardHeader>
      <Divider />
      <CardBody p={0}>
        {admins.isLoading ? (
          <>
            <HStack justify='space-between' p={2}>
              <UserPlateSkeleton />
              <Skeleton w='92px' h={10} borderRadius={6} />
            </HStack>
            <HStack justify='space-between' p={2}>
              <UserPlateSkeleton />
              <Skeleton w='92px' h={10} borderRadius={6} />
            </HStack>
            <HStack justify='space-between' p={2}>
              <UserPlateSkeleton />
              <Skeleton w='92px' h={10} borderRadius={6} />
            </HStack>
          </>
        ) : (
          admins.data?.map((admin) => (
            <HStack
              key={admin.user.id}
              justify='space-between'
              p={2}
              _hover={{
                bg: 'gray.50',
                transition: 'background-color 0.3s ease',
              }}
            >
              <UserPlate user={admin.user} />
              <Button
                isDisabled={session.data?.user.id !== organization.ownerId}
                onClick={() =>
                  updateRole.mutate({
                    organizationId: organization.id,
                    userId: admin.user.id,
                    role: 'USER',
                  })
                }
                colorScheme='red'
                variant='ghost'
                _hover={{ color: 'white', bg: 'red.600' }}
              >
                Demote
              </Button>
            </HStack>
          ))
        )}
      </CardBody>
      <Divider />

      <CardFooter gap={2}>
        <AutoComplete
          openOnFocus
          isLoading={users.isLoading}
          onChange={(userId: string) => setSelectedUser(userId)}
        >
          <AutoCompleteInput
            loadingIcon
            isDisabled={session.data?.user.id !== organization.ownerId}
            onFocus={(e: FocusEvent<HTMLInputElement>) => e.target.select()}
          />
          <AutoCompleteList loadingState={<LoadingSpinner />} py={2}>
            {users.data?.map(
              (user) =>
                user.role !== 'OWNER' &&
                !admins.data?.some(
                  (admin) => admin.user.id === user.userId
                ) && (
                  <AutoCompleteItem
                    key={user.userId}
                    value={user.userId}
                    label={user.user.name}
                  >
                    <UserPlate user={user.user} />
                  </AutoCompleteItem>
                )
            )}
          </AutoCompleteList>
        </AutoComplete>

        <Tooltip variant='bloom' label={selectedUser ? '' : 'Select a user'}>
          <Button
            isDisabled={!selectedUser}
            onClick={() => {
              updateRole.mutate({
                organizationId: organization.id,
                userId: selectedUser,
                role: 'ADMIN',
              });
              setSelectedUser('');
            }}
          >
            Add admin
          </Button>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};

export default AccessSettings;
