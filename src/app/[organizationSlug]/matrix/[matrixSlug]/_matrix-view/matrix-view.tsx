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
} from '@chakra-ui/react';
import { type Prisma } from '@prisma/client';
import { FaWeightHanging } from 'react-icons/fa6';

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
  return (
    <Card flex={1}>
      <Tabs variant='unstyled' size={{ base: 'sm', lg: 'md', xl: 'lg' }}>
        <CardHeader display='flex' flexDir='column' alignItems='flex-start'>
          <Heading size='lg' mb={6}>
            {matrix.name}
          </Heading>
          <TabList color='gray.500' bg='gray.100' borderRadius={10} p={1}>
            {matrix.categories.map((category) => (
              <Tab
                fontWeight='600'
                borderRadius={6}
                key={category.id}
                _selected={{
                  bg: 'white',
                  color: 'black',
                  boxShadow: 'var(--chakra-shadows-base)',
                }}
              >
                <HStack>
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
                </HStack>
              </Tab>
            ))}
            {isEditable && (
              <Tab
                fontWeight='600'
                borderRadius={6}
                _selected={{
                  bg: 'white',
                  color: 'black',
                  boxShadow: 'var(--chakra-shadows-base)',
                }}
              >
                Add category
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
