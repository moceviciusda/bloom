'use client';

import {
  Button,
  ButtonGroup,
  type ButtonProps,
  Heading,
  Input,
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
  VStack,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteList,
  AutoCompleteItem,
} from '@choc-ui/chakra-autocomplete';
import { Permissions, type Matrix } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FocusEvent } from 'react';
import { MdAssignmentAdd, MdDelete, MdFileCopy, MdShare } from 'react-icons/md';
import LoadingSpinner from '~/app/_components/loading-spinner';
import UserPlate from '~/app/_components/user-plate';
import { api } from '~/trpc/react';

export const MatrixCardControls: React.FC<{ matrix: Matrix }> = ({
  matrix,
}) => {
  const router = useRouter();

  const cloneMatrix = api.matrix.clone.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const deleteMatrix = api.matrix.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <ButtonGroup isAttached colorScheme='purple' size='sm'>
      <Button
        isLoading={cloneMatrix.isLoading}
        leftIcon={<MdFileCopy />}
        onClick={(e) => {
          e.preventDefault();
          cloneMatrix.mutate({
            name: matrix.name + ' (copy)',
            matrixId: matrix.id,
          });
        }}
      >
        Clone
      </Button>
      <Button leftIcon={<MdAssignmentAdd />}>Assign</Button>
      <ShareMatrixButton matrix={matrix} leftIcon={<MdShare />}>
        Share
      </ShareMatrixButton>
      <Button
        isLoading={deleteMatrix.isLoading}
        onClick={(e) => {
          e.preventDefault();
          deleteMatrix.mutate({ matrixId: matrix.id });
        }}
        leftIcon={<MdDelete />}
      >
        Delete
      </Button>
    </ButtonGroup>
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
              Share - <Text as='span'>{matrix.name}</Text>
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

          <ModalFooter flexDir='column' alignItems='stretch' gap={2}>
            <Text>Shared with:</Text>
            {sharedWith.map((user) => (
              <HStack key={user.userId} justify='space-between'>
                <UserPlate user={user.user} />
                <Popover variant='responsive'>
                  <PopoverTrigger>
                    <Button size='xs' variant='ghost'>
                      <Text>{user.permissions}</Text>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverBody p={0} border='none'>
                      <ButtonGroup isAttached orientation='vertical' size='sm'>
                        <Button
                          onClick={() => {
                            if (user.permissions === 'VIEWER') return;
                            shareMatrix.mutate({
                              matrixId: matrix.id,
                              users: [
                                { userId: user.userId, permissions: 'VIEWER' },
                              ],
                            });
                          }}
                        >
                          Viewer
                        </Button>
                        <Button
                          onClick={() => {
                            if (user.permissions === 'EDITOR') return;
                            shareMatrix.mutate({
                              matrixId: matrix.id,
                              users: [
                                { userId: user.userId, permissions: 'EDITOR' },
                              ],
                            });
                          }}
                        >
                          Editor
                        </Button>
                        <Button
                          onClick={() =>
                            unshareMatrix.mutate({
                              userId: user.userId,
                              matrixId: matrix.id,
                            })
                          }
                        >
                          Remove
                        </Button>
                      </ButtonGroup>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </HStack>
            ))}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
