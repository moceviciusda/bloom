import {
  Avatar,
  type AvatarProps,
  HStack,
  Text,
  type TextProps,
  VStack,
  type StackProps,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
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

    <VStack align='flex-start' gap={0} {...textContainerProps}>
      <Text lineHeight={1} {...userNameProps}>
        {user.name}
      </Text>
      <Text
        lineHeight={1}
        fontSize='xs'
        color='blackAlpha.700'
        fontWeight='500'
        {...userEmailProps}
      >
        {user.email}
      </Text>
    </VStack>
  </HStack>
);

export const UserPlateSkeleton: React.FC = () => (
  <HStack>
    <SkeletonCircle size='8' />
    <SkeletonText noOfLines={2} w='170px' />
  </HStack>
);

export default UserPlate;
