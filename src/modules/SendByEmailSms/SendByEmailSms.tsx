import React, { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import Panel from '../../components/Panel/Panel';

import styles from './SendByEmailSms.module.css';
import { SendByEmailSmsHeader } from './components/SendByEmailSmsHeader';
import { AddParticipantButton } from './components/AddParticipantButton';
import { SendByEmailSmsTable } from './components/SendByEmailSmsTable';
import {
  saveParticipants,
  selectDeletedParticipants,
  selectNewParticipants,
} from './sendByEmailSms.redux';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUpsertParticipantsMutation,
  getDeleteParticipantsMutation,
} from './sendByEmailSms.gql';
import { useApolloClient } from '@apollo/client';

export default function () {
  const dispatch = useDispatch();
  const client = useApolloClient();

  const [submitting, setSubmitting] = useState(false);

  const deletedParticipants = useSelector(selectDeletedParticipants);
  const newParticipants = useSelector(selectNewParticipants);

  const onSaveParticipants = useCallback(async () => {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    const saveQuery = [];

    if (newParticipants.length) {
      const { variables, mutation } = getUpsertParticipantsMutation(
        newParticipants
      );
      saveQuery.push({
        mutation,
        variables,
      });
    }
    if (deletedParticipants.length) {
      const { variables, mutation } = getDeleteParticipantsMutation(
        deletedParticipants
      );
      saveQuery.push({
        mutation,
        variables,
      });
    }

    await Promise.all(saveQuery.map((q) => client.mutate(q)));
    dispatch(saveParticipants());

    setSubmitting(true);
  }, [deletedParticipants, newParticipants]);

  return (
    <div className={styles.Container}>
      <Panel header={<SendByEmailSmsHeader />}>
        <div className={styles.Content}>
          <SendByEmailSmsTable />
        </div>
        <AddParticipantButton />
      </Panel>
      <div className={styles.Footer}>
        <Button onClick={onSaveParticipants} disabled={submitting}>
          Save & Continute
        </Button>
      </div>
    </div>
  );
}
