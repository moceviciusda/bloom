import {
  Avatar,
  type AvatarProps,
  HStack,
  Text,
  type TextProps,
  VStack,
} from '@chakra-ui/react';
import { type User } from '@prisma/client';

interface Props {
  user: User;
  avatarProps?: AvatarProps;
  userNameProps?: TextProps;
  userEmailProps?: TextProps;
}

const USerPlate: React.FC<Props> = ({
  user,
  avatarProps,
  userNameProps,
  userEmailProps,
}) => (
  <HStack>
    <Avatar
      size='sm'
      name={user.name ?? undefined}
      src={user.image ?? undefined}
      {...avatarProps}
    />

    <VStack align='flex-start' gap={0}>
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

export default USerPlate;
