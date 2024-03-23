'use client';

import {
  Avatar,
  Button,
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
} from '@chakra-ui/react';
import { type Organization } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GoOrganization } from 'react-icons/go';
import { api } from '~/trpc/react';

interface DangerZoneProps {
  organization: Organization;
}

const DangerZone: React.FC<DangerZoneProps> = ({ organization }) => {
  return (
    <>
      <Heading size='md'>Danger Zone</Heading>

      <Card size='sm' variant='outline' borderColor='red.600'>
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
            <Text fontSize={14}>
              Transfer organization ownership to another user
            </Text>
            <Button colorScheme='red' size='sm' whiteSpace='wrap'>
              Transfer ownership
            </Button>
          </HStack>

          <Divider />

          <HStack justifyContent='space-between' p={2}>
            <Text fontSize={14}>
              Permanently delete organization and all associated data
            </Text>
            <DeleteOrganizationModal organization={organization} />
          </HStack>
        </CardBody>
      </Card>
    </>
  );
};

const DeleteOrganizationModal: React.FC<DangerZoneProps> = ({
  organization,
}) => {
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
      <Button colorScheme='red' size='sm' whiteSpace='wrap' onClick={onOpen}>
        Delete organization
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size='lg'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize={16}>Delete organization - {organization.name}</Text>
            <ModalCloseButton />
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
          <ModalFooter flexDir='column' alignItems='stretch' gap={2}>
            {!confirmOpen ? (
              <>
                <Text textAlign='justify' fontSize={14}>
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
                <Text fontSize={14}>
                  Endter{' '}
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
