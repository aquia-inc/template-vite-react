/**
 * Copyright component used in the footer.
 * @module components/Copyright
 */
import Link from '@mui/material/Link'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { SxProps } from '@mui/material/styles'
import { COPYRIGHT_LABEL, ORG_NAME, ORG_URL } from '@/constants'

type CopyrightProps = {
  sx?: SxProps
  typograpyProps?: TypographyProps
}

const Copyright: React.FC<CopyrightProps> = ({
  sx,
  typograpyProps,
}): JSX.Element => (
  <Container sx={{ m: 1, p: 2, ...sx }}>
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...typograpyProps}
    >
      {`${COPYRIGHT_LABEL}`}{' '}
      <Link color="inherit" href={ORG_URL}>
        {ORG_NAME}
      </Link>
    </Typography>
  </Container>
)

export default Copyright
