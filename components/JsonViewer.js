import { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Collapse, Flex } from '@chakra-ui/react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

const JsonViewer = ({ tabData }) => {
  const [show, setShow] = useState(false)
  const handleToggle = () => setShow(!show)

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
        onClick={handleToggle}
        mb={6}
      >
        {show ? 'Hide Tab' : 'Inspect Tab'}
      </Button>
      <Collapse
        in={show}
      >
        <Box
          bg='white'
          borderRadius='md'
          overflow='hidden'
        >
          <SyntaxHighlighter language='json' style={docco}>
            {JSON.stringify(tabData, null, ' ') /* creates JSON string with line breaks */}
          </SyntaxHighlighter>
        </Box>
      </Collapse>
    </Flex>
  )
}

JsonViewer.propTypes = {
  tabData: PropTypes.object
}

export default JsonViewer
