import { FormattedMessage as Msg } from 'react-intl';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Link,
  Typography,
} from '@material-ui/core';

import { ZetkinJourney } from 'types/zetkin';

interface JourneyCardProps {
  journey: ZetkinJourney;
}

const JourneyCard = ({ journey }: JourneyCardProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const { id, singular_name, stats } = journey;

  return (
    <Card data-testid="journey-card">
      <CardContent>
        <Typography gutterBottom noWrap variant="h5">
          {singular_name}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Typography>{`${stats.open} open`}</Typography>
          <Typography color="secondary">{`${stats.closed} closed`}</Typography>
        </Box>
      </CardContent>
      <CardActions>
        <NextLink href={`/organize/${orgId}/journey/${id}`} passHref>
          <Link variant="button">
            <Msg id="pages.organizeAllJourneys.cardCTA" />
          </Link>
        </NextLink>
      </CardActions>
    </Card>
  );
};

export default JourneyCard;
