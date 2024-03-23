'use client';

import {
  Avatar,
  AvatarBadge,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { type Organization } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, useRef, useState } from 'react';
import { GoOrganization } from 'react-icons/go';
import { MdDeleteOutline } from 'react-icons/md';
import { api } from '~/trpc/react';
import slugify from '~/utils/slugify';
import { useUploadThing } from '~/utils/uploadthing';
import LoadingSpinner from '../loading-spinner';

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

  const slugFieldError =
    updateSlug.failureReason?.data?.zodError?.fieldErrors.newSlug;

  const nameFieldError =
    updateName.failureReason?.data?.zodError?.fieldErrors.name;

  return (
    <>
      <Heading size='md'>General</Heading>

      <Card size='sm' variant='outline'>
        <CardBody>
          <Flex
            align='stretch'
            gap={10}
            flexDir={{ base: 'column', md: 'row' }}
          >
            <VStack align='flex-start' gap={0}>
              <Text>Logo</Text>
              <OrgLogo organization={organization} />
            </VStack>

            <VStack flex={1}>
              <FormControl isInvalid={updateName.isError}>
                <Text>Organization Name</Text>
                <Flex
                  as='form'
                  action={() => {
                    setName(name.trim());
                    updateName.mutate({
                      name: name.trim(),
                      slug: organization.slug,
                    });
                  }}
                  gap={2}
                  flexDir={{ base: 'column', md: 'row' }}
                >
                  <Input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Tooltip
                    variant='bloom'
                    label={
                      name.trim() === organization.name ? 'No changes' : ''
                    }
                  >
                    <Button
                      type='submit'
                      isDisabled={
                        name.trim() === organization.name || !name.trim()
                      }
                      isLoading={updateName.isLoading}
                    >
                      Rename
                    </Button>
                  </Tooltip>
                </Flex>

                <FormErrorMessage fontSize='xs'>
                  {nameFieldError?.[0] ?? updateName.error?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={updateSlug.isError}>
                <Text>Url Slug</Text>
                <Flex
                  as='form'
                  action={() => {
                    setSlug(slug.trim());
                    updateSlug.mutate({
                      newSlug: slug.trim(),
                      slug: organization.slug,
                    });
                  }}
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

                  <Tooltip
                    variant='bloom'
                    label={
                      slug.trim() === organization.slug ? 'No changes' : ''
                    }
                  >
                    <Button
                      type='submit'
                      isDisabled={
                        slug.trim() === organization.slug || !slug.trim()
                      }
                      isLoading={updateSlug.isLoading}
                    >
                      Change
                    </Button>
                  </Tooltip>
                </Flex>

                <FormErrorMessage fontSize='xs'>
                  {slugFieldError?.[0] ?? updateSlug.error?.message}
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};

const OrgLogo: React.FC<{ organization: Organization }> = ({
  organization,
}) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const updateImage = api.organization.updateImage.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onSettled: () => {
      setUploading(false);
    },
  });

  const deleteImage = api.organization.deleteImage.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onSettled: () => {
      setUploading(false);
    },
  });

  const { startUpload, permittedFileInfo } = useUploadThing(
    'orgImageUploader',
    {
      onClientUploadComplete: (file) => {
        const imageUrl = file[0]?.url;
        imageUrl &&
          updateImage.mutate({ slug: organization.slug, image: imageUrl });
        router.refresh();
      },
      onUploadBegin: () => setUploading(true),
    }
  );

  const uploadHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    await startUpload([file]);
  };

  return (
    <FormControl isInvalid={file ? file?.size > 2097152 : false}>
      <Avatar
        size='xl'
        boxSize='112px'
        borderRadius={12}
        border={
          !!organization.image
            ? 'none'
            : '1px solid var(--chakra-colors-chakra-border-color)'
        }
        color='blackAlpha.700'
        src={!uploading ? organization.image ?? undefined : undefined}
        bg={'transparent'}
        icon={!uploading ? <GoOrganization /> : <LoadingSpinner />}
        cursor={uploading ? 'wait' : 'pointer'}
        _hover={{ opacity: 0.9, transition: 'opacity 0.3s' }}
        onClick={() => hiddenInputRef.current?.click()}
      >
        {organization.image && !uploading && (
          <AvatarBadge
            as={MdDeleteOutline}
            color='blackAlpha.800'
            bg='blackAlpha.700'
            border='2px solid var(--chakra-colors-blackAlpha-400)'
            cursor='pointer'
            onClick={(e) => {
              e.stopPropagation();
              setUploading(true);
              deleteImage.mutate({ slug: organization.slug });
            }}
            _hover={{
              bg: 'blackAlpha.900',
              color: 'red.700',
              transition: 'all 0.3s',
            }}
          />
        )}
      </Avatar>
      <FormErrorMessage fontSize='xs'>
        Max file size: {permittedFileInfo?.config.image?.maxFileSize}
      </FormErrorMessage>

      <input
        type='file'
        ref={hiddenInputRef}
        style={{ display: 'none' }}
        disabled={uploading}
        value=''
        accept='image/*'
        onChange={(e) => uploadHandler(e)}
      />
    </FormControl>
  );
};

export default GeneralSettings;
