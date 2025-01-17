import { useRouter } from 'next/router';
import { Avatar, Box, Typography } from '@material-ui/core';

const ZetkinPerson: React.FunctionComponent<{
  id: number;
  name: string;
  subtitle?: string | React.ReactNode;
}> = ({ id, name, subtitle }) => {
  const router = useRouter();
  const { orgId } = router.query;

  return (
    <Box display="flex">
      <Avatar src={orgId ? `/api/orgs/${orgId}/people/${id}/avatar` : ''} />
      <Box
        alignItems="start"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        ml={1}
      >
        <Typography variant="body1">{name}</Typography>
        {typeof subtitle === 'string' ? (
          <Typography variant="body2">{subtitle}</Typography>
        ) : (
          subtitle
        )}
      </Box>
    </Box>
  );
};

export default ZetkinPerson;
