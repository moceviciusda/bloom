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
  HStack,
  Flex,
  Stack,
  CardFooter,
  type TabProps,
  Icon,
  VStack,
  FormControl,
  Input,
  FormErrorMessage,
} from '@chakra-ui/react';
import { type Prisma } from '@prisma/client';
import { FaWeightHanging } from 'react-icons/fa6';
import { type HTMLMotionProps, motion, Reorder } from 'framer-motion';
import { useState } from 'react';
import { RiEdit2Line } from 'react-icons/ri';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';

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

  const [categoryIdList, setCategoryIdList] = useState<string[]>(
    matrix.categories.map((category) => category.id)
  );
  const [selectedCategory, setSelectedCategory] = useState({
    index: 0,
    id: categoryIdList[0],
  });

  const [newCategoryName, setNewCategoryName] = useState('');
  const createCategory = api.matrix.createCategory.useMutation({
    onSuccess: () => {
      router.refresh();
      setNewCategoryName('');
    },
  });
  const nameInputError =
    createCategory.error?.data?.zodError?.fieldErrors?.name?.[0];

  return (
    <Card
      flexDir={{ base: 'column', '2xl': 'row' }}
      flex={1}
      color='blackAlpha.800'
    >
      <Tabs
        flex={1}
        // display='flex'
        variant='unstyled'
        index={selectedCategory.index}
      >
        <CardHeader display='flex' flexDir='column' alignItems='flex-start'>
          <Heading size='lg' mb={6}>
            {matrix.name}
          </Heading>

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
            color='blackAlpha.500'
            bg='gray.100'
            borderRadius={10}
            p={1.5}
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
                  as={Reorder.Item}
                  value={category.id}
                  key={category.id}
                  isActive={selectedCategory.id === categoryId}
                  color={
                    selectedCategory.id === categoryId
                      ? 'blackAlpha.800'
                      : 'unset'
                  }
                  _focus={{ outline: 'none' }}
                  cursor={isEditable ? 'grab' : 'pointer'}
                  onMouseDown={() =>
                    setSelectedCategory({ index, id: categoryId })
                  }
                >
                  <VStack zIndex={1} px={4} py={2} gap={0}>
                    <HStack>
                      <Text>{category.name}</Text>

                      {isEditable && (
                        <Icon
                          as={RiEdit2Line}
                          _hover={{ color: 'blackAlpha.700' }}
                          cursor='pointer'
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('edit category: ', category.name);
                          }}
                        />
                      )}
                    </HStack>
                    <Text fontSize={12} fontWeight='500'>
                      Weight: {category.weight}{' '}
                    </Text>
                  </VStack>
                </MatrixCategoryTab>
              );
            })}
            {isEditable && (
              <MatrixCategoryTab
                isActive={selectedCategory.index === matrix.categories.length}
                onClick={() =>
                  setSelectedCategory({
                    index: matrix.categories.length,
                    id: 'new',
                  })
                }
              >
                <VStack zIndex={1} px={4} py={2} gap={0} w='180px'>
                  {selectedCategory.index === matrix.categories.length ? (
                    <FormControl isInvalid={createCategory.isError}>
                      <Input
                        onClick={(e) => e.stopPropagation()}
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyUp={(e) => {
                          e.preventDefault();
                          if (e.key === 'Enter') {
                            createCategory.mutate({
                              matrixId: matrix.id,
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
                        size='sm'
                        variant='unstyled'
                        fontWeight='600'
                      />
                      <FormErrorMessage fontSize={10} mt={0}>
                        {nameInputError}
                      </FormErrorMessage>
                    </FormControl>
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
                {category.name}
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
      //   _selected={{ color: 'blackAlpha.800' }}
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

const WeightIcon = ({
  weight,
  size = 24,
}: {
  weight: number;
  size?: number;
}) => {
  return (
    <Flex align='center'>
      <Icon as={FaWeightHanging} boxSize={`${size}px`} />
      <Text
        alignSelf='flex-end'
        fontSize={`${size / 2}px`}
        // lineHeight={size / 10}
        ml={`-${size}px`}
        w={`${size}px`}
        color='white'
      >
        {weight}
      </Text>
    </Flex>
  );
};
