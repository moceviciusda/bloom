import {
  Avatar,
  Text,
  type AvatarProps,
  type TextProps,
  HStack,
  type StackProps,
} from '@chakra-ui/react';
import { type Organization } from '@prisma/client';
import { GoOrganization } from 'react-icons/go';

interface OrganizationPlateProps extends StackProps {
  organization: Organization;
  avatarProps?: AvatarProps;
  textProps?: TextProps;
}

const OrganizationPlate: React.FC<OrganizationPlateProps> = ({
  organization,
  avatarProps,
  textProps,
  ...rest
}) => {
  return (
    <HStack {...rest}>
      <Avatar
        size='xs'
        src={organization.image ?? undefined}
        border={organization.image ? undefined : '2px solid #414141'}
        bg='transparent'
        icon={<GoOrganization size={18} color='black' />}
        {...avatarProps}
      />
      <Text as='span' whiteSpace='wrap' {...textProps}>
        {organization.name}
      </Text>
    </HStack>
  );
};

export default OrganizationPlate;
