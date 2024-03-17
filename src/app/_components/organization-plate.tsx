import {
  Avatar,
  Text,
  type AvatarProps,
  type TextProps,
} from '@chakra-ui/react';
import { type Organization } from '@prisma/client';
import { GoOrganization } from 'react-icons/go';

interface OrganizationPlateProps {
  organization: Organization;
  avatarProps?: AvatarProps;
  textProps?: TextProps;
}

const OrganizationPlate: React.FC<OrganizationPlateProps> = ({
  organization,
  avatarProps,
  textProps,
}) => {
  return (
    <>
      <Avatar
        size='xs'
        src={organization.image ?? undefined}
        border={organization.image ? undefined : '2px solid #414141'}
        bg='transparent'
        icon={<GoOrganization size={18} color='black' />}
        {...avatarProps}
      />
      <Text as='span' {...textProps}>
        {organization.name}
      </Text>
    </>
  );
};

export default OrganizationPlate;
