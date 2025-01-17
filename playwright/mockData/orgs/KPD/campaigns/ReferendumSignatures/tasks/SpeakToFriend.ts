import { TASK_TYPE } from '../../../../../../../src/types/tasks';
import { ZetkinTask } from '../../../../../../../src/types/zetkin';

import KPD from '../../..';
import ReferendumSignatureCollection from '..';

/**
 * ZetkinTask
 *
 * - Offline Task
 * - No publish date, no expires and no deadline
 */
const SpeakToFriendAboutReferendum: ZetkinTask = {
  campaign: {
    id: ReferendumSignatureCollection.id,
    title: ReferendumSignatureCollection.title,
  },
  config: {},
  id: 1,
  instructions: `
    Talk to a friend about the referendum. 
    Tell them about how if we vote YES, then we will have public control of housing,
    reducing homelessness.
    `,
  organization: KPD,
  reassign_interval: null,
  reassign_limit: null,
  target: {
    filter_spec: [],
    id: 1,
  },
  time_estimate: null,
  title: 'Speak to friend about the referendum',
  type: TASK_TYPE.OFFLINE,
};

export default SpeakToFriendAboutReferendum;
