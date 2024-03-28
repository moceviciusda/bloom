'use client';

import {
  Button,
  ButtonGroup,
  type ButtonProps,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  Divider,
  ModalCloseButton,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Input,
  FormControl,
  FormErrorMessage,
  Tooltip,
} from '@chakra-ui/react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteList,
  AutoCompleteItem,
} from '@choc-ui/chakra-autocomplete';
import { Permissions, type Matrix } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState, type FocusEvent } from 'react';
import { HiChevronUpDown } from 'react-icons/hi2';
import { MdAssignmentAdd, MdClose, MdDelete, MdFileCopy } from 'react-icons/md';
import { RiShareForwardFill } from 'react-icons/ri';
import LoadingSpinner from '~/app/_components/loading-spinner';
import UserPlate from '~/app/_components/user-plate';
import { api } from '~/trpc/react';

export const MatrixCardControls: React.FC<{
  matrix: Matrix;
  isOwner: boolean;
}> = ({ matrix, isOwner }) => {
  const router = useRouter();

  const selfUnshare = api.matrix.selfUnshare.useMutation({
    onSuccess: () => router.refresh(),
  });

  return (
    <ButtonGroup isAttached colorScheme='purple' size='sm' w='352px'>
      <CloneMatrixButton matrix={matrix} leftIcon={<MdFileCopy />} flex={1}>
        Clone
      </CloneMatrixButton>

      <Button isDisabled leftIcon={<MdAssignmentAdd />} flex={1}>
        Assign
      </Button>
      {isOwner && (
        <ShareMatrixButton
          matrix={matrix}
          leftIcon={<RiShareForwardFill />}
          flex={1}
        >
          Share
        </ShareMatrixButton>
      )}
      {isOwner ? (
        <DeleteMatrixButton matrix={matrix} leftIcon={<MdDelete />} flex={1}>
          Delete
        </DeleteMatrixButton>
      ) : (
        <Button
          leftIcon={<MdClose />}
          flex={1}
          onClick={(e) => {
            e.preventDefault();
            selfUnshare.mutate({ matrixId: matrix.id });
          }}
          isLoading={selfUnshare.isLoading}
        >
          Remove
        </Button>
      )}
    </ButtonGroup>
  );
};

const CloneMatrixButton: React.FC<{ matrix: Matrix } & ButtonProps> = ({
  matrix,
  children,
  ...rest
}) => {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [name, setName] = useState(matrix.name + ' (copy)');

  const cloneMatrix = api.matrix.clone.useMutation({
    onSuccess: () => {
      setName(matrix.name + ' (copy)');
      onClose();
      router.refresh();
    },
  });

  const inputError = cloneMatrix.error?.data?.zodError?.fieldErrors?.name?.[0];

  return (
    <>
      <Button
        {...rest}
        onClick={(e) => {
          e.preventDefault();
          onOpen();
        }}
      >
        {children}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setName(matrix.name + ' (copy)');
          onClose();
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent fontSize={14}>
          <ModalHeader>
            <Heading size='sm'>
              Clone Matrix - <Text as='span'>{matrix.name}</Text>
            </Heading>
            <ModalCloseButton top={3} />
          </ModalHeader>

          <Divider />

          <ModalBody>
            <Text>
              Create a new matrix with the same categories, competences, skills
              and their weights as{' '}
              <Text as='span' fontWeight='600'>
                {matrix.name}
              </Text>
              .
            </Text>
            <Text mt={1}>
              Any other associated data such as assignments, and historical
              stats will not be cloned.
            </Text>
          </ModalBody>

          <Divider />

          <ModalFooter flexDir='column' alignItems='flex-start'>
            <Text>Enter a name for the new matrix:</Text>
            <FormControl isInvalid={!!inputError}>
              <Input
                mt={2}
                value={name}
                autoFocus
                onFocus={(e) => e.target.select()}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  cloneMatrix.mutate({ matrixId: matrix.id, name })
                }
              />
              <FormErrorMessage fontSize={12}>{inputError}</FormErrorMessage>
            </FormControl>
            <Tooltip
              variant='bloom'
              label={!name.trim() ? 'Name is required' : ''}
            >
              <Button
                mt={2}
                alignSelf='stretch'
                colorScheme='purple'
                onClick={() =>
                  cloneMatrix.mutate({ matrixId: matrix.id, name })
                }
                isLoading={cloneMatrix.isLoading}
                isDisabled={!name.trim()}
              >
                Submit
              </Button>
            </Tooltip>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const ShareMatrixButton: React.FC<{ matrix: Matrix } & ButtonProps> = ({
  matrix,
  children,
  ...rest
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const orgUsers = api.organization.getActiveUsers.useQuery({
    slug: matrix.organizationSlug,
  });

  const shareMatrix = api.matrix.share.useMutation({
    onSuccess: async () => {
      await matrixUsers.refetch();
    },
  });

  const unshareMatrix = api.matrix.unshare.useMutation({
    onSuccess: async () => {
      await matrixUsers.refetch();
    },
  });

  const matrixUsers = api.matrix.getUsers.useQuery({
    matrixId: matrix.id,
  });

  const sharedWith =
    matrixUsers.data?.filter(
      (user) => user.permissions !== Permissions.OWNER
    ) ?? [];

  return (
    <>
      <Button
        {...rest}
        onClick={(e) => {
          e.preventDefault();
          onOpen();
        }}
      >
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent fontSize={14}>
          <ModalHeader>
            <Heading size='sm'>
              Share Matrix - <Text as='span'>{matrix.name}</Text>
            </Heading>
            <ModalCloseButton top={3} />
          </ModalHeader>

          <Divider />

          <ModalBody>
            <Text>Select a user to share the matrix with.</Text>
            <AutoComplete
              openOnFocus
              isLoading={
                orgUsers.isLoading ||
                matrixUsers.isLoading ||
                shareMatrix.isLoading ||
                unshareMatrix.isLoading
              }
              onChange={(userId: string) =>
                shareMatrix.mutate({
                  matrixId: matrix.id,
                  users: [{ userId, permissions: 'VIEWER' }],
                })
              }
            >
              <AutoCompleteInput
                loadingIcon={<LoadingSpinner size='md' thickness='3px' />}
                // isDisabled={session.data?.user.id !== organization.ownerId}
                onFocus={(e: FocusEvent<HTMLInputElement>) => e.target.select()}
              />
              <AutoCompleteList
                loadingState={<LoadingSpinner size='20px' />}
                py={2}
              >
                {orgUsers.data?.map(
                  (user) =>
                    !matrixUsers.data?.some(
                      (mu) => mu.userId === user.userId
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
          </ModalBody>

          <Divider />

          <ModalFooter flexDir='column' alignItems='stretch'>
            <Text>Shared with:</Text>
            {sharedWith.map((user) => (
              <HStack
                p={2}
                key={user.userId}
                justify='space-between'
                borderRadius={6}
                _hover={{ bg: 'gray.100' }}
              >
                <UserPlate user={user.user} />
                <Popover variant='responsive'>
                  {({ onClose }) => (
                    <>
                      <PopoverTrigger>
                        <Button
                          isLoading={
                            shareMatrix.isLoading || unshareMatrix.isLoading
                          }
                          w={24}
                          size='sm'
                          colorScheme='gray'
                          justifyContent={
                            shareMatrix.isLoading || unshareMatrix.isLoading
                              ? 'center'
                              : 'space-between'
                          }
                        >
                          <Text textTransform='capitalize'>
                            {user.permissions.toLowerCase()}
                          </Text>
                          <HiChevronUpDown />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent>
                        <PopoverBody p={0} border='none'>
                          <ButtonGroup
                            isAttached
                            orientation='vertical'
                            size='sm'
                          >
                            <Button
                              onClick={() => {
                                onClose();
                                shareMatrix.mutate({
                                  matrixId: matrix.id,
                                  users: [
                                    {
                                      userId: user.userId,
                                      permissions:
                                        user.permissions === 'VIEWER'
                                          ? 'EDITOR'
                                          : 'VIEWER',
                                    },
                                  ],
                                });
                              }}
                              variant='ghost'
                            >
                              {user.permissions === 'VIEWER'
                                ? 'Editor'
                                : 'Viewer'}
                            </Button>
                            <Button
                              onClick={() => {
                                onClose();
                                unshareMatrix.mutate({
                                  userId: user.userId,
                                  matrixId: matrix.id,
                                });
                              }}
                              colorScheme='red'
                              variant='ghost'
                              _hover={{ bg: 'red.600', color: 'white' }}
                            >
                              Remove
                            </Button>
                          </ButtonGroup>
                        </PopoverBody>
                      </PopoverContent>
                    </>
                  )}
                </Popover>
              </HStack>
            ))}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const DeleteMatrixButton: React.FC<{ matrix: Matrix } & ButtonProps> = ({
  matrix,
  children,
  ...rest
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();

  const deleteMatrix = api.matrix.delete.useMutation({
    onSuccess: () => {
      onClose();
      router.refresh();
    },
  });

  return (
    <>
      <Button
        {...rest}
        onClick={(e) => {
          e.preventDefault();
          onOpen();
        }}
      >
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent fontSize={14}>
          <ModalHeader>
            <Heading size='sm'>
              Delete Matrix - <Text as='span'>{matrix.name}</Text>
            </Heading>{' '}
            <ModalCloseButton top={3} />
          </ModalHeader>

          <Divider />

          <ModalFooter flexDir='column' alignItems='stretch'>
            <Text>
              Are you sure you want to delete {''}
              <Text as='span' color='red.600'>
                {matrix.name}
              </Text>
              ?
            </Text>
            <Text>
              All data associated with this matrix will be lost. This action is
              irreversible.
            </Text>

            <Button
              mt={2}
              colorScheme='red'
              variant='ghost'
              onClick={(e) => {
                e.preventDefault();
                deleteMatrix.mutate({ matrixId: matrix.id });
              }}
              isLoading={deleteMatrix.isLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
