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
  useDisclosure
} from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import json from 'react-syntax-highlighter/dist/cjs/languages/hljs/json'
import docco from 'react-syntax-highlighter/dist/cjs/styles/hljs/docco'

SyntaxHighlighter.registerLanguage('json', json)

const JsonViewer = ({ tabData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  return (
    <>
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
            <DrawerBody pb={6}>
              <Box
                bg='white'
                borderRadius='md'
                overflow='hidden'
              >
                <SyntaxHighlighter
                  language='json'
                  style={docco}
                  customStyle={{ minHeight: 'calc(100vh - 6rem)' }}
                >
                  {JSON.stringify(tabData, null, ' ') /* creates JSON string with line breaks */}
                </SyntaxHighlighter>
              </Box>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}
JsonViewer.defaultProps = {
  tabData: {}
}

JsonViewer.propTypes = {
  tabData: PropTypes.object
}

export default JsonViewer
