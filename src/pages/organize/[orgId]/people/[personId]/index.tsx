import { GetServerSideProps } from 'next';
import { Grid } from '@material-ui/core';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { PageWithLayout } from 'types';
import PersonDetailsCard from 'components/organize/people/PersonDetailsCard';
import PersonOrganizationsCard from 'components/organize/people/PersonOrganizationsCard';
import SinglePersonLayout from 'layout/organize/SinglePersonLayout';
import TagsManager from 'components/organize/TagsManager';
import ZetkinQuery from 'components/ZetkinQuery';
import { personResource, personTagsResource } from 'api/people';
import { scaffold, ScaffoldedGetServerSideProps } from 'utils/next';

export const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people', 'misc'],
};

export const getPersonScaffoldProps: ScaffoldedGetServerSideProps = async (
  ctx
) => {
  const { orgId, personId } = ctx.params!;

  const { prefetch } = personResource(orgId as string, personId as string);
  const { state: personQueryState } = await prefetch(ctx);

  if (personQueryState?.status === 'success') {
    return {
      props: {
        orgId,
        personId,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

export const getServerSideProps: GetServerSideProps = scaffold(
  getPersonScaffoldProps,
  scaffoldOptions
);

export type PersonPageProps = {
  orgId: string;
  personId: string;
};

const PersonProfilePage: PageWithLayout<PersonPageProps> = (props) => {
  const { orgId, personId } = useRouter().query;
  const personTagsQuery = personTagsResource(
    orgId as string,
    personId as string
  ).useQuery();
  const { data: person } = personResource(
    props.orgId,
    props.personId
  ).useQuery();

  if (!person) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {person?.first_name} {person?.last_name}
        </title>
      </Head>
      <Grid container direction="row" spacing={6}>
        <Grid item lg={4} xs={12}>
          <PersonDetailsCard person={person} />
        </Grid>
        <Grid item lg={4} xs={12}>
          <PersonOrganizationsCard {...props} />
        </Grid>
        <Grid item lg={4} xs={12}>
          <ZetkinQuery queries={{ personTagsQuery }}>
            <TagsManager appliedTags={personTagsQuery.data || []} />
          </ZetkinQuery>
        </Grid>
      </Grid>
    </>
  );
};

PersonProfilePage.getLayout = function getLayout(page) {
  return <SinglePersonLayout>{page}</SinglePersonLayout>;
};

export default PersonProfilePage;
