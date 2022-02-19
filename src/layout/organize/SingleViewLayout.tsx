import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { Box, makeStyles, Theme } from '@material-ui/core';
import { FunctionComponent, useContext, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { ConfirmDialogContext } from 'hooks/ConfirmDialogProvider';
import { defaultFetch } from 'fetching';
import EditTextinPlace from 'components/EditTextInPlace';
import getView from 'fetching/views/getView';
import NProgress from 'nprogress';
import patchView from 'fetching/views/patchView';
import SnackbarContext from 'hooks/SnackbarContext';
import TabbedLayout from './TabbedLayout';
import ViewJumpMenu from 'components/views/ViewJumpMenu';
import ViewSmartSearchDialog from 'components/views/ViewSmartSearchDialog';
import { viewsResource } from 'api/views';
import { ZetkinEllipsisMenuProps } from 'components/ZetkinEllipsisMenu';
import ZetkinQuery from 'components/ZetkinQuery';
import ZetkinDialog from 'components/ZetkinDialog';

const useStyles = makeStyles<Theme, { deactivated: boolean }>(() => ({
  deactivateWrapper: {
    filter: (props) =>
      props.deactivated ? 'grayscale(1) opacity(0.5)' : 'none',
    pointerEvents: (props) => (props.deactivated ? 'none' : 'all'),
    transition: 'filter 0.3s ease',
  },
}));

const SingleViewLayout: FunctionComponent = ({ children }) => {
  const router = useRouter();
  const { orgId, viewId } = router.query;

  const [deactivated, setDeactivated] = useState(false);
  const classes = useStyles({ deactivated });
  const intl = useIntl();
  const queryClient = useQueryClient();
  const [queryDialogOpen, setQueryDialogOpen] = useState(false);
  const viewQuery = useQuery(
    ['view', viewId],
    getView(orgId as string, viewId as string)
  );
  const patchViewMutation = useMutation(
    patchView(orgId as string, viewId as string)
  );
  const { showSnackbar } = useContext(SnackbarContext);
  const { showConfirmDialog } = useContext(ConfirmDialogContext);
  const deleteMutation = viewsResource(orgId as string).useDelete();

  const updateTitle = async (newTitle: string) => {
    patchViewMutation.mutateAsync(
      { title: newTitle },
      {
        onError: () => {
          showSnackbar(
            'error',
            intl.formatMessage({
              id: `misc.views.editViewTitleAlert.error`,
            })
          );
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries(['view', viewId]);
          showSnackbar(
            'success',
            intl.formatMessage({
              id: `misc.views.editViewTitleAlert.success`,
            })
          );
        },
      }
    );
  };

  const view = viewQuery.data;

  // TODO: Create mutation using new factory pattern
  const deleteQueryMutation = useMutation(
    async () => {
      await defaultFetch(
        `/orgs/${orgId}/people/views/${view?.id}/content_query`,
        {
          method: 'DELETE',
        }
      );
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(['view', view?.id.toString(), 'rows']);
        queryClient.invalidateQueries(['view', view?.id.toString()]);
      },
    }
  );

  const title = (
    <>
      <ZetkinQuery queries={{ viewQuery }}>
        {({ queries: { viewQuery } }) => {
          const view = viewQuery.data;
          return (
            <Box>
              <EditTextinPlace
                key={view.id}
                disabled={patchViewMutation.isLoading}
                onChange={(newTitle) => updateTitle(newTitle)}
                value={view?.title}
              />
              <ViewJumpMenu />
            </Box>
          );
        }}
      </ZetkinQuery>
    </>
  );

  const ellipsisMenu: ZetkinEllipsisMenuProps['items'] = [
    {
        label: intl.formatMessage({ id: 'pages.people.views.layout.ellipsisMenu.export' }),
        onSelect: () => setExportDialogOpen(true),
    }
  ];

  if (view?.content_query) {
    ellipsisMenu.push({
      label: intl.formatMessage({
        id: 'pages.people.views.layout.ellipsisMenu.editQuery',
      }),
      onSelect: () => setQueryDialogOpen(true),
    });
    ellipsisMenu.push({
      label: intl.formatMessage({
        id: 'pages.people.views.layout.ellipsisMenu.makeStatic',
      }),
      onSelect: () => deleteQueryMutation.mutate(),
    });
  } else {
    ellipsisMenu.push({
      label: intl.formatMessage({
        id: 'pages.people.views.layout.ellipsisMenu.makeDynamic',
      }),
      onSelect: () => setQueryDialogOpen(true),
    });
  }

  const deleteView = () => {
    if (view) {
      setDeactivated(true);
      NProgress.start();
      deleteMutation.mutate(view.id, {
        onError: () => {
          setDeactivated(false);
          showSnackbar(
            'error',
            intl.formatMessage({
              id: 'pages.people.views.layout.deleteDialog.error',
            })
          );
        },
        onSuccess: () => {
          router.push(`/organize/${orgId}/people/views`);
        },
      });
    }
  };

  ellipsisMenu.push({
    id: 'delete-view',
    label: intl.formatMessage({
      id: 'pages.people.views.layout.ellipsisMenu.delete',
    }),
    onSelect: () => {
      showConfirmDialog({
        onSubmit: deleteView,
        title: intl.formatMessage({
          id: 'pages.people.views.layout.deleteDialog.title',
        }),
        warningText: intl.formatMessage({
          id: 'pages.people.views.layout.deleteDialog.warningText',
        }),
      });
    },
  });

  return (
    <Box className={classes.deactivateWrapper}>
      <TabbedLayout
        baseHref={`/organize/${orgId}/people/views/${viewId}`}
        defaultTab="/"
        ellipsisMenuItems={ellipsisMenu}
        fixedHeight={true}
        tabs={[{ href: `/`, messageId: 'layout.organize.view.tabs.view' }]}
        title={title}
      >
        {children}
      </TabbedLayout>
      {queryDialogOpen && view && (
        <ViewSmartSearchDialog
          onDialogClose={() => setQueryDialogOpen(false)}
          orgId={orgId as string}
          view={view}
        />
      )}
      {exportDialogOpen && view && (
        <ZetkinDialog
            onClose={ () => setExportDialogOpen(false) }
            open={ exportDialogOpen }
            title= { intl.formatMessage({ id: 'pages.people.views.layout.exportMenu.title' })}>
            <div>
                <p>Bla bla bla</p>
            </div>
        </ZetkinDialog>
      )}
    </Box>
  );
};

export default SingleViewLayout;
