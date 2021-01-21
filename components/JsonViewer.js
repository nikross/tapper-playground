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
      pt={6}
      minH={12}
      w='700px'
      maxW='full'
      overflow='scroll'
    >
      <Button
        variant='link'
        colorScheme='blue'
        mb={6}
        onClick={onOpen}
        ref={btnRef}
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
