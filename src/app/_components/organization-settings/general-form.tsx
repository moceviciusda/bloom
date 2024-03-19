'use client';

import {
  Avatar,
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { type Organization } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GoOrganization } from 'react-icons/go';
import { api } from '~/trpc/react';

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
      router.push(`/${slug}/settings`);
    },
  });

  return (
    <>
      {/* <VStack py={2} align='stretch'> */}

      <Heading size='md'>General</Heading>

      <Divider />

      <HStack align='stretch' gap={10}>
        <VStack align='flex-start'>
          <FormLabel>Logo</FormLabel>
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

        <VStack flex={1}>
          {updateName.error && (
            <Text color='red'>{updateName.error.message}</Text>
          )}
          <FormControl>
            <FormLabel>Organization Name</FormLabel>
            <HStack
              as='form'
              action={() =>
                updateName.mutate({ name, slug: organization.slug })
              }
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
            </HStack>
          </FormControl>

          <FormControl>
            <FormLabel>Organization Slug</FormLabel>
            <HStack
              as='form'
              action={() =>
                updateSlug.mutate({ newSlug: slug, slug: organization.slug })
              }
            >
              <Input
                type='text'
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <Button
                type='submit'
                isDisabled={slug === organization.slug || !slug.trim()}
              >
                Change
              </Button>
            </HStack>
          </FormControl>
        </VStack>
      </HStack>

      {/* </VStack> */}
    </>
  );
};

export default GeneralSettings;
