'use client';

import { ImExit } from 'react-icons/im';
import {
  Tooltip,
  IconButton,
  type IconButtonProps,
  type TooltipProps,
} from '@chakra-ui/react';

import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import { MdDelete } from 'react-icons/md';

interface ButtonProps {
  organizationId: string;
  iconButtonProps?: IconButtonProps;
  tooltipProps?: TooltipProps;
}

const LeaveOrgButton: React.FC<ButtonProps> = ({
  organizationId,
  iconButtonProps,
  tooltipProps,
}) => {
  const router = useRouter();

  const removeUser = api.organization.setUserInactive.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <Tooltip
      borderRadius={5}
      label='Leave'
      bg='blackAlpha.700'
      {...tooltipProps}
    >
      <IconButton
        aria-label='Leave organization'
        onClick={(e) => {
          e.preventDefault();
          removeUser.mutate({ organizationId: organizationId });
        }}
        icon={<ImExit />}
        variant='ghost'
        color='gray.800'
        size={'lg'}
        ml={5}
        isLoading={removeUser.isLoading}
        isDisabled={removeUser.isLoading}
        {...iconButtonProps}
      />
    </Tooltip>
  );
};

const RemoveOrgButton: React.FC<ButtonProps> = ({
  organizationId,
  iconButtonProps,
  tooltipProps,
}) => {
  const router = useRouter();

  const deleteOrganization = api.organization.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  return (
    <Tooltip
      borderRadius={5}
      label='Delete '
      bg='blackAlpha.700'
      {...tooltipProps}
    >
      <IconButton
        aria-label='Delete organization'
        onClick={(e) => {
          e.preventDefault();
          deleteOrganization.mutate({ id: organizationId });
        }}
        icon={<MdDelete />}
        variant='ghost'
        color='gray.800'
        size={'lg'}
        ml={5}
        isLoading={deleteOrganization.isLoading}
        isDisabled={deleteOrganization.isLoading}
        {...iconButtonProps}
      />
    </Tooltip>
  );
};

export { LeaveOrgButton, RemoveOrgButton };
