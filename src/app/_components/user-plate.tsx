import {
  Avatar,
  type AvatarProps,
  HStack,
  Text,
  type TextProps,
  VStack,
  type StackProps,
} from '@chakra-ui/react';
import { type User } from '@prisma/client';
import { type User as AuthUser } from 'next-auth';

interface Props {
  user: User | AuthUser;
  avatarProps?: AvatarProps;
  textContainerProps?: StackProps;
  userNameProps?: TextProps;
  userEmailProps?: TextProps;
}

const UserPlate: React.FC<Props> = ({
  user,
  avatarProps,
  userNameProps,
  userEmailProps,
  textContainerProps,
}) => (
  <HStack>
    <Avatar
      size='sm'
      name={user.name ?? undefined}
      src={user.image ?? undefined}
      {...avatarProps}
    />

    <VStack align='flex-start' gap={0} display={'none'} {...textContainerProps}>
      <Text lineHeight={1} fontSize='md' {...userNameProps}>
        {user.name}
      </Text>
      <Text
        lineHeight={1}
        fontSize='xs'
        color='blackAlpha.700'
        {...userEmailProps}
      >
        {user.email}
      </Text>
    </VStack>
  </HStack>
);

export default UserPlate;
