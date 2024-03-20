'use client';

import {
  Avatar,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import { GoOrganization } from 'react-icons/go';
import { api } from '~/trpc/react';
import slugify from '~/utils/slugify';
import isBrowser from '~/utils/window';

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

      <Flex align='stretch' gap={10} flexDir={{ base: 'column', md: 'row' }}>
        <VStack flex={1}>
          {updateName.error && (
            <Text color='red'>{updateName.error.message}</Text>
          )}
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

        <VStack align='flex-start'>
          <Text>Logo</Text>
          <HStack>
            <Avatar
              size='xl'
              src={organization.image ?? undefined}
              bg={'purple.500'}
              icon={<GoOrganization />}
            />
            <ButtonGroup orientation='vertical'>
              <Button>Change</Button>
              <Button isDisabled={!organization.image}>Remove</Button>
            </ButtonGroup>
          </HStack>
        </VStack>
      </Flex>

      {/* </VStack> */}
    </>
  );
};

export default GeneralSettings;
