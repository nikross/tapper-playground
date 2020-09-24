import { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Collapse, Flex } from '@chakra-ui/core'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

const JsonViewer = ({ tabData }) => {
  const [show, setShow] = useState(false)
  const handleToggle = () => setShow(!show)

  if (!tabData) return null
  return (
    <Flex
      direction='column'
      align='center'
      mt={6}
      w='700px'
      maxW='full'
      overflow='scroll'
    >
      <Button variant='link' variantColor='blue' onClick={handleToggle}>
        {show ? 'Hide JSON' : 'Show JSON'}
      </Button>
      <Collapse
        isOpen={show}
        bg='white'
        borderRadius='lg'
        overflow='hidden'
        mt={4}
      >
        <SyntaxHighlighter language='json' style={docco}>
          {JSON.stringify(tabData, null, ' ') /* creates JSON string with line breaks */}
        </SyntaxHighlighter>
      </Collapse>
    </Flex>
  )
}

JsonViewer.propTypes = {
  tabData: PropTypes.object
}

export default JsonViewer
