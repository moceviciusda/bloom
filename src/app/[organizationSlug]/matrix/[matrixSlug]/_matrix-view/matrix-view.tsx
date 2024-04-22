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
  Icon,
  Flex,
  ButtonGroup,
  Button,
  Center,
} from '@chakra-ui/react';
import { type Prisma } from '@prisma/client';
import { type HTMLMotionProps, motion } from 'framer-motion';
import React, { type Dispatch, type SetStateAction, useState } from 'react';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '~/app/_components/loading-spinner';
import { WeightIcon } from './matrix-utils';
import { MatrixCardControls } from '../../_matrix-card/controls';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import { MdClose, MdDragIndicator, MdInfoOutline } from 'react-icons/md';
import { LexoRank } from 'lexorank';

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
  const [categories, setCategories] = useState(matrix.categories);
  const [selectedCategory, setSelectedCategory] = useState({
    index: 0,
    id: categories[0]?.id,
  });

  const updateCategoryRank = api.matrix.updateCategoryRank.useMutation();

  const dragEndHandler = (results: DropResult) => {
    const { draggableId, source, destination, type } = results;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'category') {
      const newCategories = structuredClone(categories);
      const movedCategory = newCategories.splice(source.index, 1)[0];
      if (!movedCategory) return;

      newCategories.splice(destination.index, 0, movedCategory);
      setCategories(newCategories);
      setSelectedCategory({
        index: newCategories.findIndex((c) => c.id === selectedCategory.id),
        id: selectedCategory.id,
      });

      const nextCategory = newCategories[destination.index + 1];
      const prevCategory = newCategories[destination.index - 1];
      let newRank;
      if (nextCategory && prevCategory) {
        newRank = LexoRank.parse(prevCategory.lexoRank).between(
          LexoRank.parse(nextCategory.lexoRank)
        );
      } else if (nextCategory) {
        newRank = LexoRank.parse(nextCategory.lexoRank).genPrev();
      } else if (prevCategory) {
        newRank = LexoRank.parse(prevCategory.lexoRank).genNext();
      } else {
        return;
      }

      movedCategory.lexoRank = newRank.toString();

      updateCategoryRank.mutate({
        categoryId: draggableId,
        lexoRank: newRank.toString(),
      });
    }
  };

  return (
    <DragDropContext onDragEnd={dragEndHandler}>
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
              <MatrixCardControls matrix={matrix} isOwner={true} />
            </HStack>
            <Droppable
              droppableId='category'
              direction='horizontal'
              isDropDisabled={!isEditable}
              type='category'
            >
              {(provided) => (
                <TabList
                  fontSize={{ base: 10, md: 12, lg: 14, '2xl': 16 }}
                  p={{ base: 1, md: 1.5 }}
                  w='100%'
                  color='blackAlpha.500'
                  bg='purple.50'
                  borderRadius={16}
                  boxShadow={
                    'inset -2px -2px 4px rgba(255, 255, 255, 0.45), inset 2px 2px 4px rgba(94,104,121,0.2)'
                  }
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {categories.map((category, index) => (
                    <Draggable
                      key={category.id}
                      draggableId={category.id}
                      index={index}
                      isDragDisabled={!isEditable}
                      disableInteractiveElementBlocking
                    >
                      {(provided) => (
                        <MatrixCategoryTab
                          fontSize={{ base: 10, sm: 12, md: 14, xl: 16 }}
                          alignItems='stretch'
                          flex={1}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          isActive={selectedCategory.id === category.id}
                          color={
                            selectedCategory.id === category.id
                              ? 'blackAlpha.800'
                              : 'unset'
                          }
                          _hover={{ color: 'blackAlpha.800' }}
                          onClick={() =>
                            setSelectedCategory({
                              index,
                              id: category.id,
                            })
                          }
                        >
                          <VStack
                            ref={provided.innerRef}
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {isEditable && (
                    <MatrixCategoryTab
                      fontSize={{ base: 10, sm: 12, md: 14, xl: 16 }}
                      flex={1}
                      isActive={selectedCategory.id === 'new'}
                      color={
                        selectedCategory.id === 'new'
                          ? 'blackAlpha.800'
                          : 'unset'
                      }
                      _hover={{ color: 'blackAlpha.800' }}
                      onClick={() =>
                        setSelectedCategory({
                          index: categories.length,
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
                        {selectedCategory.id === 'new' ? (
                          <AddCategoryForm
                            matrixId={matrix.id}
                            setCategories={setCategories}
                            setSelectedCategory={setSelectedCategory}
                          />
                        ) : (
                          <Text>+ Add Category</Text>
                        )}
                      </VStack>
                    </MatrixCategoryTab>
                  )}
                </TabList>
              )}
            </Droppable>
          </CardHeader>

          <CardBody as={TabPanels}>
            {categories.map((category) => (
              <TabPanel key={category.id} p={0}>
                <MatrixCategoryPanel
                  category={category}
                  isEditable={isEditable}
                />
              </TabPanel>
            ))}
          </CardBody>
        </Tabs>

        <CardFooter bg='pink'>
          <Stack direction='row' justify='flex-end'>
            <Text>Im card footer</Text>
          </Stack>
        </CardFooter>
      </Card>
    </DragDropContext>
  );
};

const MatrixCategoryPanel: React.FC<{
  isEditable?: boolean;
  category: Prisma.MatrixCategoryGetPayload<{
    include: {
      competences: {
        include: {
          skills: { include: { skill: true } };
        };
      };
    };
  }>;
}> = ({ category, isEditable = false }) => {
  const [competences, setCompetences] = useState(category.competences);

  const createCompetence = api.matrix.createCompetence.useMutation({
    onSuccess: (competence) => {
      setCompetences((prev) => [competence, ...prev]);
    },
  });

  const updateCompetenceRank = api.matrix.updateCompetenceRank.useMutation();
  const updateSkillPosition = api.matrix.updateSkillPosition.useMutation();

  const dragEndHandler = (results: DropResult) => {
    const { source, destination, type, draggableId } = results;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const newCompetences = [...competences];

    if (type === 'competence') {
      const movedCompetence = newCompetences.splice(source.index, 1)[0];
      if (!movedCompetence) return;

      newCompetences.splice(destination.index, 0, movedCompetence);

      const nextCompetence = newCompetences[destination.index + 1];
      const prevCompetence = newCompetences[destination.index - 1];

      let newRank;
      if (nextCompetence && prevCompetence) {
        newRank = LexoRank.parse(prevCompetence.lexoRank).between(
          LexoRank.parse(nextCompetence.lexoRank)
        );
      } else if (nextCompetence) {
        newRank = LexoRank.parse(nextCompetence.lexoRank).genPrev();
      } else if (prevCompetence) {
        newRank = LexoRank.parse(prevCompetence.lexoRank).genNext();
      } else {
        return;
      }

      movedCompetence.lexoRank = newRank.toString();

      updateCompetenceRank.mutate({
        competenceId: draggableId,
        lexoRank: newRank.toString(),
      });
    }

    if (type === 'skill') {
      const sourceCompetence = newCompetences.find(
        (c) => c.id === source.droppableId
      );
      const destinationCompetence = newCompetences.find(
        (c) => c.id === destination.droppableId
      );
      if (!sourceCompetence || !destinationCompetence) return;

      const movedSkill = sourceCompetence.skills.splice(source.index, 1)[0];
      if (!movedSkill) return;

      destinationCompetence.skills.splice(destination.index, 0, movedSkill);

      const nextSkill = destinationCompetence.skills[destination.index + 1];
      const prevSkill = destinationCompetence.skills[destination.index - 1];

      let newRank;
      if (nextSkill && prevSkill) {
        newRank = LexoRank.parse(prevSkill.lexoRank).between(
          LexoRank.parse(nextSkill.lexoRank)
        );
      } else if (nextSkill) {
        newRank = LexoRank.parse(nextSkill.lexoRank).genPrev();
      } else if (prevSkill) {
        newRank = LexoRank.parse(prevSkill.lexoRank).genNext();
      } else {
        newRank = LexoRank.middle();
      }

      movedSkill.lexoRank = newRank.toString();

      updateSkillPosition.mutate({
        skillId: draggableId,
        lexoRank: newRank.toString(),
        competenceId: destination.droppableId,
      });
    }

    setCompetences(newCompetences);
  };

  return (
    <DragDropContext onDragEnd={dragEndHandler}>
      <Droppable
        droppableId={category.id}
        type='competence'
        direction='horizontal'
        isDropDisabled={!isEditable}
      >
        {(provided) => (
          <Wrap
            spacing={2}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <Card
              flex={1}
              borderRadius={16}
              overflow='hidden'
              minW='fit-content'
              variant='hover'
              align='stretch'
              justify='center'
              gap={1}
            >
              {createCompetence.isLoading ? (
                <Center>
                  <LoadingSpinner size={{ base: 'md', md: 'lg' }} />
                </Center>
              ) : (
                <Button
                  onClick={() =>
                    createCompetence.mutate({
                      categoryId: category.id,
                      name: 'Competence',
                    })
                  }
                  colorScheme='purple'
                  flex={1}
                  variant='ghost'
                >
                  + Add Competence
                </Button>
              )}
            </Card>
            {competences.map((competence, index) => (
              <MatrixCompetence
                key={competence.id}
                competence={competence}
                index={index}
                isEditable={isEditable}
                setCompetences={setCompetences}
              />
            ))}

            {provided.placeholder}
          </Wrap>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const MatrixCompetence: React.FC<{
  isEditable?: boolean;
  index: number;
  competence: Prisma.MatrixCompetenceGetPayload<{
    include: {
      skills: { include: { skill: true } };
    };
  }>;
  setCompetences: Dispatch<
    SetStateAction<
      Prisma.MatrixCompetenceGetPayload<{
        include: {
          skills: { include: { skill: true } };
        };
      }>[]
    >
  >;
}> = ({ competence, index, setCompetences, isEditable = false }) => {
  const [skills, setSkills] = useState(competence.skills);

  const deleteCompetence = api.matrix.deleteCompetence.useMutation({
    onSuccess: () => {
      setCompetences((prev) => prev.filter((c) => c.id !== competence.id));
    },
  });

  const addSkillToCompetence = api.matrix.addSkill.useMutation({
    onSuccess: (competence) => {
      if (!competence) return;
      setCompetences((prev) =>
        prev.map((c) => (c.id === competence.id ? competence : c))
      );
      setSkills(competence.skills);
    },
  });

  const createSkill = api.skill.create.useMutation({
    onSuccess: (skill) => {
      addSkillToCompetence.mutate({
        competenceId: competence.id,
        skillId: skill.id,
      });
    },
  });

  const removeSkillFromCompetence = api.matrix.removeSkill.useMutation({
    onSuccess: ({ id }) => {
      setSkills((prev) => prev.filter((skill) => skill.id !== id));
    },
  });

  return (
    <Draggable
      key={competence.id}
      draggableId={competence.id}
      index={index}
      isDragDisabled={!isEditable}
    >
      {(provided) => (
        <Card
          flex={1}
          minW='auto'
          borderRadius={16}
          {...provided.draggableProps}
          ref={provided.innerRef}
          align='stretch'
          gap={1}
          p={1}
        >
          <CardHeader
            p={4}
            as={HStack}
            {...provided.dragHandleProps}
            justify='space-between'
          >
            <Text>
              {competence.name} {' ' + competence.lexoRank}
            </Text>
            <ButtonGroup
              size='sm'
              color='gray'
              variant='ghost'
              isAttached
              isDisabled={!isEditable}
            >
              <Button>
                <WeightIcon
                  weight={competence.weight}
                  size={{
                    base: 14,
                    md: 16,
                    xl: 18,
                  }}
                />
              </Button>
              <Button
                onClick={() =>
                  deleteCompetence.mutate({ competenceId: competence.id })
                }
                colorScheme='red'
              >
                <Icon as={MdClose} boxSize={{ base: 4, md: 5 }} />
              </Button>
            </ButtonGroup>
          </CardHeader>
          <Droppable droppableId={competence.id} type='skill'>
            {(provided) => (
              <CardBody
                {...provided.droppableProps}
                ref={provided.innerRef}
                bg='purple.50'
                boxShadow={
                  'inset -2px -2px 4px rgba(255, 255, 255, 0.45), inset 2px 2px 4px rgba(94,104,121,0.2)'
                }
                borderRadius={14}
                p={2}
                as={ButtonGroup}
                isAttached
                orientation='vertical'
                gap={1}
              >
                {skills.map((skill, index) => (
                  <Draggable
                    key={skill.id}
                    draggableId={skill.id}
                    index={index}
                    isDragDisabled={!isEditable}
                  >
                    {(provided) => (
                      <Card
                        borderRadius={12}
                        size='sm'
                        variant='outline'
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <CardBody as={HStack} justifyContent='space-between'>
                          <Text>
                            {skill.skill.name}
                            {' ' + skill.lexoRank}
                          </Text>
                        </CardBody>

                        <CardFooter pt={0} justify='flex-end'>
                          <ButtonGroup
                            size='xs'
                            color='gray'
                            variant='ghost'
                            isAttached
                            isDisabled={!isEditable}
                          >
                            <Button>
                              <WeightIcon
                                weight={skill.weight}
                                size={{
                                  base: 12,
                                  md: 14,
                                  xl: 16,
                                }}
                              />
                            </Button>
                            <Button color='blackAlpha.600'>
                              <Icon
                                as={MdInfoOutline}
                                boxSize={{ base: 4, md: 5 }}
                              />
                            </Button>

                            <Button
                              onClick={() =>
                                removeSkillFromCompetence.mutate({
                                  skillOnCompetenceId: skill.id,
                                })
                              }
                              colorScheme='red'
                            >
                              <Icon as={MdClose} boxSize={{ base: 4, md: 5 }} />
                            </Button>
                          </ButtonGroup>
                        </CardFooter>
                        <Flex
                          position='absolute'
                          bottom={0}
                          transform={'rotate(90deg)'}
                          alignSelf='center'
                          {...provided.dragHandleProps}
                          color={'blackAlpha.600'}
                        >
                          <Icon
                            as={MdDragIndicator}
                            boxSize={{ base: 4, md: 5 }}
                          />
                        </Flex>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <Card borderRadius={12} size='sm' overflow='hidden'>
                  <Button
                    onClick={() => {
                      createSkill.mutate({
                        name: 'Skill',
                      });
                    }}
                    isLoading={createSkill.isLoading}
                    colorScheme='purple'
                    borderRadius={0}
                    flex={1}
                    p={1}
                  >
                    + Add Skill
                  </Button>
                </Card>
              </CardBody>
            )}
          </Droppable>
        </Card>
      )}
    </Draggable>
  );
};

export const MatrixCategoryTab: React.FC<
  {
    children?: React.ReactNode;
    isActive?: boolean;
    activeIndicatorProps?: HTMLMotionProps<'span'>;
    ref?: React.Ref<HTMLElement>;
  } & TabProps
> = ({ children, isActive = false, activeIndicatorProps, ref, ...rest }) => {
  return (
    <Tab
      p={0}
      textAlign='center'
      _focus={{ boxShadow: 'none' }}
      fontWeight='600'
      transition={'color 0.2s ease-in-out'}
      ref={ref}
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
            borderRadius: '12px',
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
  setCategories,
  setSelectedCategory,
}: {
  matrixId: string;
  setCategories: Dispatch<
    SetStateAction<
      Prisma.MatrixCategoryGetPayload<{
        include: {
          competences: {
            include: {
              skills: { include: { skill: true } };
            };
          };
        };
      }>[]
    >
  >;
  setSelectedCategory: Dispatch<
    SetStateAction<{
      index: number;
      id: string | undefined;
    }>
  >;
}) => {
  const router = useRouter();
  const [newCategoryName, setNewCategoryName] = useState('');
  const createCategory = api.matrix.createCategory.useMutation({
    onSuccess: (category) => {
      router.refresh();
      setNewCategoryName('');
      setCategories((prev) => {
        setSelectedCategory({
          index: prev.length,
          id: category.id,
        });
        return [...prev, category];
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
        onBlur={() => {
          newCategoryName.trim() &&
            createCategory.mutate({
              matrixId: matrixId,
              name: newCategoryName.trim(),
            });
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
