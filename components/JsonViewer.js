import { useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  useDisclosure
} from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

const JsonViewer = ({ tabData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  if (!tabData) return <Box h={12} />
  return (
    <Flex
      direction='column'
      align='center'
      py={6}
      minH={12}
      w='700px'
      maxW='full'
    >
      <Button
        variant='ghost'
        color='gray.500'
        size='lg'
        leftIcon={<Search2Icon />}
        _hover={{
          bg: 'gray.200',
          color: 'gray.700'
        }}
        ref={btnRef}
        onClick={onOpen}
      >
        Inspect Tab
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        size='xl'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton size='lg' />
            <DrawerHeader>Current Tab</DrawerHeader>
            <DrawerBody>
              <Box
                bg='white'
                borderRadius='md'
                overflow='hidden'
              >
                <SyntaxHighlighter language='json' style={docco}>
                  {JSON.stringify(tabData, null, ' ') /* creates JSON string with line breaks */}
                </SyntaxHighlighter>
              </Box>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Flex>
  )
}

JsonViewer.propTypes = {
  tabData: PropTypes.object
}

export default JsonViewer
