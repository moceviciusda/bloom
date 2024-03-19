'use client';

import {
  Avatar,
  Button,
  ButtonGroup,
  Divider,
  Flex,
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

interface AccessSettingsProps {
  organization: Organization;
}

const AccessSettings: React.FC<AccessSettingsProps> = ({ organization }) => {
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
      <Heading size='md'>Access</Heading>

      <Divider />
    </>
  );
};

export default AccessSettings;
