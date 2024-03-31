'use client';

import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Card,
  CardHeader,
  Heading,
  CardBody,
  Stack,
  CardFooter,
  type TabProps,
  VStack,
  FormControl,
  Input,
  FormErrorMessage,
  Wrap,
  FormLabel,
  HStack,
  Spacer,
} from '@chakra-ui/react';
import { type Prisma } from '@prisma/client';
import { type HTMLMotionProps, motion, Reorder } from 'framer-motion';
import { type Dispatch, type SetStateAction, useState } from 'react';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '~/app/_components/loading-spinner';
import { WeightIcon } from './matrix-utils';
import { MatrixCardControls } from '../../_matrix-card/controls';

interface MatrixViewProps {
  isEditable?: boolean;
  matrix: Prisma.MatrixGetPayload<{
    include: {
      users: {
        select: {
          permissions: true;
          user: true;
        };
      };
      categories: {
        include: {
          competences: {
            include: {
              skills: { include: { skill: true } };
            };
          };
        };
      };
    };
  }>;
}

export const MatrixView: React.FC<MatrixViewProps> = ({
  isEditable = false,
  matrix,
}) => {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);

  const [categoryIdList, setCategoryIdList] = useState(
    matrix.categoryOrder.length
      ? matrix.categoryOrder
      : matrix.categories.map((c) => c.id)
  );
  const [selectedCategory, setSelectedCategory] = useState({
    index: 0,
    id: categoryIdList[0],
  });

  const updateCategoryOrder = api.matrix.updateCategoryOrder.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <Card
      flexDir={{ base: 'column', '2xl': 'row' }}
      flex={1}
      color='blackAlpha.800'
      size={{ base: 'xs', md: 'md', xl: 'lg' }}
      variant={{ base: 'unstyled', md: 'elevated' }}
    >
      <Tabs flex={1} variant='unstyled' index={selectedCategory.index}>
        <CardHeader display='flex' flexDir='column' alignItems='flex-start'>
          <HStack
            mb={6}
            alignSelf='stretch'
            flexDir={{ base: 'column', md: 'row' }}
          >
            <Heading size='lg'>{matrix.name}</Heading>
            <Spacer />
            {updateCategoryOrder.isLoading && <LoadingSpinner size='md' />}
            <MatrixCardControls matrix={matrix} isOwner={true} />
          </HStack>
          <TabList
            as={Reorder.Group}
            axis='x'
            values={categoryIdList}
            onReorder={(newList: unknown[]) => {
              setSelectedCategory({
                index: newList.indexOf(selectedCategory.id),
                id: selectedCategory.id,
              });
              setCategoryIdList(newList as string[]);
            }}
            fontSize={{ base: 10, md: 12, lg: 14, '2xl': 16 }}
            p={{ base: 1, md: 1.5 }}
            w='100%'
            color='blackAlpha.500'
            bg='gray.100'
            borderRadius={10}
            boxShadow={
              'inset -2px -2px 4px rgba(255, 255, 255, 0.45), inset 2px 2px 4px rgba(94,104,121,0.2)'
            }
          >
            {categoryIdList.map((categoryId, index) => {
              const category = matrix.categories.find(
                (c) => c.id === categoryId
              );
              if (!category) {
                return null;
              }
              return (
                <MatrixCategoryTab
                  fontSize={{ base: 10, sm: 12, md: 14, xl: 16 }}
                  as={Reorder.Item}
                  value={category.id}
                  key={category.id}
                  isActive={selectedCategory.id === categoryId}
                  color={
                    selectedCategory.id === categoryId
                      ? 'blackAlpha.800'
                      : 'unset'
                  }
                  _hover={{ color: 'blackAlpha.800' }}
                  cursor={
                    !isEditable ? 'pointer' : dragging ? 'grabbing' : 'grab'
                  }
                  onClick={() =>
                    !dragging && setSelectedCategory({ index, id: categoryId })
                  }
                  onDragStart={() => setDragging(true)}
                  onDragEnd={() => {
                    setTimeout(() => setDragging(false), 100);
                    JSON.stringify(categoryIdList) !==
                      JSON.stringify(matrix.categoryOrder) &&
                      updateCategoryOrder.mutate({
                        matrixId: matrix.id,
                        categoryOrder: categoryIdList,
                      });
                  }}
                  alignItems='stretch'
                  flex={1}
                >
                  <VStack
                    zIndex={1}
                    px={{ base: 1, md: 2, lg: 4, '2xl': 4 }}
                    py={{ base: 1, md: 2 }}
                    gap={0}
                    flex={1}
                    justify={isEditable ? 'space-between' : 'center'}
                  >
                    <Text>{category.name}</Text>

                    <WeightIcon
                      weight={category.weight}
                      size={{
                        base: 12,
                        md: 14,
                        xl: 16,
                      }}
                    />
                  </VStack>
                </MatrixCategoryTab>
              );
            })}
            {isEditable && (
              <MatrixCategoryTab
                fontSize={{ base: 10, sm: 12, md: 14, xl: 16 }}
                flex={1}
                isActive={selectedCategory.index === categoryIdList.length}
                color={
                  selectedCategory.index === categoryIdList.length
                    ? 'blackAlpha.800'
                    : 'unset'
                }
                _hover={{ color: 'blackAlpha.800' }}
                onClick={() =>
                  setSelectedCategory({
                    index: categoryIdList.length,
                    id: 'new',
                  })
                }
              >
                <VStack
                  zIndex={1}
                  px={{ base: 1, md: 2, lg: 4, '2xl': 4 }}
                  py={{ base: 1, md: 2 }}
                  gap={0}
                  flex={1}
                >
                  {selectedCategory.index === categoryIdList.length ? (
                    <AddCategoryForm
                      matrixId={matrix.id}
                      categoryIdList={categoryIdList}
                      setCategoryIdList={setCategoryIdList}
                      setSelectedCategory={setSelectedCategory}
                    />
                  ) : (
                    <Text>Add Category</Text>
                  )}
                </VStack>
              </MatrixCategoryTab>
            )}
          </TabList>
        </CardHeader>

        <CardBody as={TabPanels}>
          {categoryIdList.map((categoryId) => {
            const category = matrix.categories.find((c) => c.id === categoryId);
            if (!category) {
              return null;
            }
            return (
              <TabPanel key={category.id} p={0}>
                {/* {isEditable && <MatrixCategoryControls />} */}
                {category.competences.map((competence) => (
                  <div key={competence.id}>
                    <Text>
                      {competence.name} ({competence.weight})
                    </Text>

                    {competence.skills.map((skill) => (
                      <div key={skill.id}>
                        <Text>
                          {skill.skill.name} ({skill.weight})
                        </Text>
                      </div>
                    ))}
                  </div>
                ))}
              </TabPanel>
            );
          })}
        </CardBody>
      </Tabs>

      <CardFooter bg='pink'>
        <Stack direction='row' justify='flex-end'>
          <Text>Im card footer</Text>
        </Stack>
      </CardFooter>
    </Card>
  );
};

export const MatrixCategoryTab: React.FC<
  {
    children?: React.ReactNode;
    isActive?: boolean;
    activeIndicatorProps?: HTMLMotionProps<'span'>;
  } & TabProps
> = ({ children, isActive = false, activeIndicatorProps, ...rest }) => {
  return (
    <Tab
      p={0}
      textAlign='center'
      _focus={{ boxShadow: 'none' }}
      fontWeight='600'
      transition={'color 0.2s ease-in-out'}
      {...rest}
    >
      {isActive && (
        <motion.span
          layoutId='category-underline'
          style={{
            position: 'relative',
            height: '100%',
            width: '100%',
            marginRight: '-100%',
            background: 'white',
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, 0.1),0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            borderRadius: '6px',
          }}
          transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
          {...activeIndicatorProps}
        />
      )}
      {children}
    </Tab>
  );
};

const AddCategoryForm = ({
  matrixId,
  categoryIdList,
  setCategoryIdList,
  setSelectedCategory,
}: {
  matrixId: string;
  categoryIdList: string[];
  setCategoryIdList: Dispatch<SetStateAction<string[]>>;
  setSelectedCategory: Dispatch<
    SetStateAction<{ index: number; id: string | undefined }>
  >;
}) => {
  const router = useRouter();
  const [newCategoryName, setNewCategoryName] = useState('');
  const createCategory = api.matrix.createCategory.useMutation({
    onSuccess: ({ id }) => {
      router.refresh();
      setNewCategoryName('');
      setCategoryIdList([...categoryIdList, id]);
      setSelectedCategory({
        index: categoryIdList.length,
        id,
      });
    },
  });
  const nameInputError =
    createCategory.error?.data?.zodError?.fieldErrors?.name?.[0];
  return createCategory.isLoading ? (
    <LoadingSpinner size={{ base: 'md', md: 'lg' }} />
  ) : (
    <FormControl isInvalid={createCategory.isError}>
      {!createCategory.isError && (
        <FormLabel
          mb={0}
          fontSize={{
            base: 10,
            lg: 12,
          }}
          lineHeight={1}
        >
          New Category
        </FormLabel>
      )}
      <FormErrorMessage
        fontSize={{
          base: 10,
          lg: 12,
        }}
        lineHeight={1}
        fontWeight='400'
        mt={0}
      >
        {nameInputError}
      </FormErrorMessage>
      <Input
        onClick={(e) => e.stopPropagation()}
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        onKeyUp={(e) => {
          e.preventDefault();
          if (e.key === 'Enter') {
            createCategory.mutate({
              matrixId: matrixId,
              name: newCategoryName.trim(),
            });
          }
        }}
        autoFocus
        placeholder='Name'
        _placeholder={{
          color: 'blackAlpha.500',
          fontWeight: 400,
        }}
        size={{ base: 'xs', md: 'sm', lg: 'md' }}
        w='100%'
        variant='unstyled'
        fontWeight='600'
      />
    </FormControl>
  );
};

const MatrixCategoryControls = () => {
  return (
    <Wrap spacing={4}>
      <Card>
        <CardHeader>
          <Heading size='md'>Edit Name</Heading>
        </CardHeader>
        <CardBody>
          <FormControl>
            <Input />
          </FormControl>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <Heading size='md'>Edit Weight</Heading>
        </CardHeader>
        <CardBody>
          <FormControl>
            <Input />
          </FormControl>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <Heading size='md'>Delete Category</Heading>
        </CardHeader>
        <CardBody>
          <FormControl>
            <Input />
          </FormControl>
        </CardBody>
      </Card>
    </Wrap>
  );
};
