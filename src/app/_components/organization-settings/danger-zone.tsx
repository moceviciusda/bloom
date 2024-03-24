'use client';

import {
  Avatar,
  Button,
  type ButtonProps,
  Card,
  CardBody,
  CardHeader,
  Divider,
  HStack,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
  Tooltip,
} from '@chakra-ui/react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from '@choc-ui/chakra-autocomplete';
import { type Organization } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { type FocusEvent, useState } from 'react';
import { GoOrganization } from 'react-icons/go';
import { api } from '~/trpc/react';
import LoadingSpinner from '../loading-spinner';
import UserPlate from '../user-plate';

interface DangerZoneProps {
  organization: Organization;
}

const DangerZone: React.FC<DangerZoneProps> = ({ organization }) => {
  return (
    <>
      <Heading size='md'>Danger Zone</Heading>

      <Card size='sm' variant='outline' borderColor='red.600' fontSize={14}>
        <CardHeader>
          {/* <Text color='red.600'>Danger Zone</Text> */}

          <Text>
            <Text as='span' color='red.600'>
              Danger Zone
            </Text>{' '}
            actions could have a negative impact on your organization and its
            data are only available to the owner.
          </Text>
          <Text>
            These actions are irreversible. Please be certain before proceeding.
          </Text>
        </CardHeader>

        <Divider />

        <CardBody p={0}>
          <HStack justifyContent='space-between' p={2}>
            <Text>Transfer organization ownership to another user</Text>
            <TransferOwnershipModal organization={organization} />
          </HStack>

          <Divider />

          <HStack justifyContent='space-between' p={2}>
            <Text>Permanently delete organization and all associated data</Text>
            <DeleteOrganizationModal organization={organization}>
              Delete organization
            </DeleteOrganizationModal>
          </HStack>
        </CardBody>
      </Card>
    </>
  );
};

const TransferOwnershipModal: React.FC<DangerZoneProps> = ({
  organization,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [confirm, setConfirm] = useState('');

  const router = useRouter();

  const users = api.organization.getUsers.useQuery({
    slug: organization.slug,
  });

  const changeOwner = api.organization.changeOwner.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  const updateRole = api.organization.updateUserRole.useMutation();

  const selectedUser = users.data?.find((u) => u.userId === selectedUserId);

  const transferHandler = () => {
    updateRole.mutate({
      userId: selectedUserId,
      role: 'OWNER',
      organizationId: organization.id,
    });
    updateRole.mutate({
      userId: organization.ownerId,
      role: 'ADMIN',
      organizationId: organization.id,
    });
    changeOwner.mutate({ slug: organization.slug, newOwnerId: selectedUserId });
  };

  return (
    <>
      <Button colorScheme='red' size='sm' whiteSpace='wrap' onClick={onOpen}>
        Transfer ownership
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setConfirmOpen(false);
          setConfirm('');
          setSelectedUserId('');
        }}
        isCentered
        size='lg'
      >
        <ModalOverlay />
        <ModalContent fontSize={14}>
          <ModalHeader>
            <Text fontSize={16}>Transfer ownership - {organization.name}</Text>
            <ModalCloseButton top={3} />
          </ModalHeader>
          <Divider />

          <ModalFooter
            fontSize={14}
            flexDir='column'
            alignItems='stretch'
            gap={2}
          >
            {!confirmOpen || !selectedUser ? (
              <>
                <Text textAlign='justify'>
                  Transfer organization ownership to another user. The new owner
                  will have full control over{' '}
                  <Text as='span' color='red.700'>
                    {organization.name}
                  </Text>{' '}
                  and its data.
                </Text>
                <AutoComplete
                  openOnFocus
                  isLoading={users.isLoading}
                  onChange={(userId: string) => setSelectedUserId(userId)}
                >
                  <AutoCompleteInput
                    loadingIcon
                    onFocus={(e: FocusEvent<HTMLInputElement>) =>
                      e.target.select()
                    }
                    placeholder='Search for a user'
                  />
                  <AutoCompleteList loadingState={<LoadingSpinner />} py={2}>
                    {users.data?.map((user) => (
                      <AutoCompleteItem
                        key={user.userId}
                        value={user.userId}
                        label={user.user.name}
                      >
                        <UserPlate user={user.user} />
                      </AutoCompleteItem>
                    ))}
                  </AutoCompleteList>
                </AutoComplete>
                <Tooltip
                  variant='bloom'
                  label={selectedUser ? '' : 'Select a user'}
                >
                  <Button
                    colorScheme='red'
                    variant='ghost'
                    isDisabled={!selectedUser}
                    onClick={() => setConfirmOpen(true)}
                  >
                    Transfer ownership
                  </Button>
                </Tooltip>
              </>
            ) : (
              <>
                <Text>
                  You are about to transfer ownership of{' '}
                  <Text as='span' color='red.700'>
                    {organization.name}
                  </Text>{' '}
                  to:
                </Text>
                <HStack justify='space-around'>
                  <UserPlate user={selectedUser.user} />
                  <Button
                    // variant='ghost'
                    size='sm'
                    onClick={() => {
                      setConfirmOpen(false);
                      setSelectedUserId('');
                      setConfirm('');
                    }}
                  >
                    Change user
                  </Button>
                </HStack>
                <Text>
                  Enter{' '}
                  <Text as='span' color='red.700' userSelect='none'>
                    Transfer {organization.name}
                  </Text>{' '}
                  bellow to confirm
                </Text>
                <Input
                  type='text'
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />

                <Button
                  colorScheme='red'
                  isLoading={changeOwner.isLoading || updateRole.isLoading}
                  isDisabled={confirm !== `Transfer ${organization.name}`}
                  onClick={transferHandler}
                >
                  Confirm
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const DeleteOrganizationModal: React.FC<
  DangerZoneProps & ButtonProps
> = ({ organization, children, ...rest }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirm, setConfirm] = useState('');

  const router = useRouter();

  const deleteOrganization = api.organization.delete.useMutation({
    onSuccess: () => {
      router.push('/');
      router.refresh();
    },
  });

  const deleteHandler = () => {
    deleteOrganization.mutate({ id: organization.id });
  };

  return (
    <>
      <Button
        colorScheme='red'
        size='sm'
        whiteSpace='wrap'
        onClick={(e) => {
          e.preventDefault();
          onOpen();
        }}
        {...rest}
      >
        {children}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setConfirmOpen(false);
        }}
        isCentered
        size='lg'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize={16}>Delete organization - {organization.name}</Text>
            <ModalCloseButton top={3} />
          </ModalHeader>
          <Divider />
          <ModalBody display='flex' flexDir='column' gap={2}>
            <HStack>
              <Avatar
                src={organization.image ?? undefined}
                size='xl'
                boxSize={20}
                color='blackAlpha.700'
                bg={'transparent'}
                borderRadius={12}
                border={
                  !!organization.image
                    ? 'none'
                    : '1px solid var(--chakra-colors-chakra-border-color)'
                }
                icon={<GoOrganization />}
              />
              <Heading size='lg'>{organization.name}</Heading>
            </HStack>
            <HStack justify='space-between' flexWrap='wrap'>
              <Stat textAlign='center'>
                <StatLabel>Assignments</StatLabel>
                <StatNumber>0</StatNumber>
              </Stat>
              <Stat textAlign='center'>
                <StatLabel>Matrices</StatLabel>
                <StatNumber>0</StatNumber>
              </Stat>
              <Stat textAlign='center'>
                <StatLabel>Teams</StatLabel>
                <StatNumber>0</StatNumber>
              </Stat>
              <Stat textAlign='center'>
                <StatLabel>Users</StatLabel>
                <StatNumber>0</StatNumber>
              </Stat>
            </HStack>
          </ModalBody>
          <Divider />
          <ModalFooter
            fontSize={14}
            flexDir='column'
            alignItems='stretch'
            gap={2}
          >
            {!confirmOpen ? (
              <>
                <Text textAlign='justify' mt='6px'>
                  This action is irreversible.{' '}
                  <Text as='span' color='red.700'>
                    All data
                  </Text>{' '}
                  associated with this organization including matrices, skills,
                  assignment history and growth plans will be{' '}
                  <Text as='span' color='red.700'>
                    permanently
                  </Text>{' '}
                  deleted.
                </Text>
                <Button
                  variant='ghost'
                  colorScheme='red'
                  onClick={() => setConfirmOpen(true)}
                >
                  Delete organization
                </Button>
              </>
            ) : (
              <>
                <Text>
                  Enter{' '}
                  <Text as='span' color='red.700' userSelect='none'>
                    Delete {organization.name}
                  </Text>{' '}
                  bellow to confirm
                </Text>
                <Input
                  type='text'
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />

                <Button
                  colorScheme='red'
                  isLoading={deleteOrganization.isLoading}
                  isDisabled={confirm !== `Delete ${organization.name}`}
                  onClick={deleteHandler}
                >
                  Confirm
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DangerZone;
