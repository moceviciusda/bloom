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
} from '@chakra-ui/react';
import { type Prisma } from '@prisma/client';
import { FaWeightHanging } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { useState } from 'react';

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
  const [selectedCategory, setSelectedCategory] = useState(0);
  return (
    <Card flex={1}>
      <Tabs
        variant='unstyled'
        onChange={(i) => setSelectedCategory(i)}
        // size={{ base: 'sm', lg: 'md', xl: 'lg' }}
      >
        <CardHeader display='flex' flexDir='column' alignItems='flex-start'>
          <Heading size='lg' mb={6}>
            {matrix.name}
          </Heading>
          <TabList
            color='gray.500'
            bg='gray.100'
            borderRadius={10}
            p={1}
            boxShadow={
              'inset -2px -2px 4px rgba(255, 255, 255, 0.45), inset 2px 2px 4px rgba(94,104,121,0.2)'
            }
          >
            {matrix.categories.map((category, index) => (
              <Tab
                key={category.id}
                p={0}
                _selected={{ color: 'black' }}
                fontWeight='600'
                transition={'color 0.2s 0.2s ease-in-out'}
              >
                {selectedCategory === index && (
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
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <Text zIndex={1} p={4}>
                  {category.name}
                </Text>
                {/* <HStack>
                  <Text>{category.name}</Text>

                  <Flex
                    alignItems='flex-end'
                    alignSelf='flex-start'
                    // color='gray.700'
                  >
                    <FaWeightHanging size='24' />
                    <Text
                      fontSize={14}
                      lineHeight={1.3}
                      ml='-24px'
                      w='24px'
                      color='white'
                    >
                      {category.weight}
                    </Text>
                  </Flex>
                </HStack> */}
              </Tab>
            ))}
            {isEditable && (
              <Tab
                p={0}
                _selected={{ color: 'black' }}
                transition={'color 0.2s 0.2s ease-in-out'}
                fontWeight='600'
              >
                {selectedCategory === matrix.categories.length && (
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
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <Text zIndex={1} p={4}>
                  New Category
                </Text>
              </Tab>
            )}
          </TabList>
        </CardHeader>

        <CardBody as={TabPanels}>
          {/* <TabPanels> */}
          {matrix.categories.map((category) => (
            <TabPanel key={category.id}>
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
          ))}
          {isEditable && (
            <TabPanel>
              <p>Add Category!</p>
            </TabPanel>
          )}
          {/* </TabPanels> */}
        </CardBody>
      </Tabs>
    </Card>
  );
};
