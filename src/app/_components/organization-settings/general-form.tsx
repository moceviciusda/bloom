'use client';

import {
  Avatar,
  AvatarBadge,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { type Organization } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa6';
import { GoOrganization } from 'react-icons/go';
import { MdDeleteOutline } from 'react-icons/md';
import { api } from '~/trpc/react';
import slugify from '~/utils/slugify';

interface GeneralSettingsProps {
  organization: Organization;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ organization }) => {
  const [name, setName] = useState(organization.name);
  const [slug, setSlug] = useState(organization.slug);

  const router = useRouter();

  const updateName = api.organization.updateName.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const updateSlug = api.organization.updateSlug.useMutation({
    onSuccess: () => {
      router.push(`/${slugify(slug)}/settings`);
    },
  });

  return (
    <>
      {/* <VStack py={2} align='stretch'> */}

      <Heading size='md'>General</Heading>

      <Divider />

      <Text fontSize={14}>Manage how your organization appears to others.</Text>
      <Flex align='stretch' gap={10} flexDir={{ base: 'column', md: 'row' }}>
        <VStack align='flex-start' gap={0}>
          <Text>Logo</Text>
          <Avatar
            size='xl'
            boxSize='112px'
            borderRadius={12}
            src={organization.image ?? undefined}
            bg={'purple.500'}
            icon={<GoOrganization />}
            cursor='pointer'
            _hover={{ opacity: 0.9, transition: 'opacity 0.3s' }}
            onClick={() => console.log('Change logo')}
          >
            <AvatarBadge
              as={MdDeleteOutline}
              color='blackAlpha.600'
              bg='blackAlpha.600'
              border='2px solid var(--chakra-colors-blackAlpha-400)'
              cursor='pointer'
              onClick={(e) => {
                e.stopPropagation();
                console.log('Remove logo');
              }}
              _hover={{
                bg: 'blackAlpha.700',
                color: 'red.700',
                border: '2px solid var(--chakra-colors-red-700)',
                transition: 'all 0.3s',
              }}
            />
          </Avatar>
        </VStack>

        <VStack flex={1}>
          <FormControl>
            <Text>Organization Name</Text>
            <Flex
              as='form'
              action={() =>
                updateName.mutate({ name, slug: organization.slug })
              }
              gap={2}
              flexDir={{ base: 'column', md: 'row' }}
            >
              <Input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Button
                type='submit'
                isDisabled={name === organization.name || !name.trim()}
              >
                Rename
              </Button>
            </Flex>
            {updateName.error && (
              <FormErrorMessage>{updateName.error.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!updateSlug.error}>
            <Text>Url Slug</Text>
            <Flex
              as='form'
              action={() =>
                updateSlug.mutate({ newSlug: slug, slug: organization.slug })
              }
              gap={2}
              flexDir={{ base: 'column', md: 'row' }}
            >
              <InputGroup>
                <InputLeftAddon pr={1}>https://bloom.com/</InputLeftAddon>

                <Input
                  pl={1}
                  type='text'
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </InputGroup>

              {/* <Input
                type='text'
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              /> */}
              <Button
                type='submit'
                isDisabled={slug === organization.slug || !slug.trim()}
              >
                Change
              </Button>
            </Flex>
            {updateSlug.error && (
              <FormErrorMessage>{updateSlug.error.message}</FormErrorMessage>
            )}
          </FormControl>
        </VStack>
      </Flex>

      {/* </VStack> */}
    </>
  );
};

export default GeneralSettings;
