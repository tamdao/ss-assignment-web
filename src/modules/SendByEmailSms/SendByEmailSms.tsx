import React, { useCallback, useEffect, useState } from 'react';
import { DocumentNode, useApolloClient } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

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

import {
  getUpsertParticipantsMutation,
  getDeleteParticipantsMutation,
} from './sendByEmailSms.gql';

export default function () {
  const dispatch = useDispatch();
  const client = useApolloClient();

  const [submitting, setSubmitting] = useState(false);

  const deletedParticipants = useSelector(selectDeletedParticipants);
  const newParticipants = useSelector(selectNewParticipants);

  const onSaveParticipants = useCallback(
    async (askConfirmSave = true) => {
      if (submitting) {
        return;
      }

      setSubmitting(true);
      const saveQuery: { mutation: DocumentNode; variables: any }[] = [];

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

      if (saveQuery.length) {
        if (askConfirmSave) {
          confirmAlert({
            title: 'Confirm to submit',
            message: 'Participants had saved, do you want to change it?',
            buttons: [
              {
                label: 'Yes, change it',
                onClick: async () => {
                  await Promise.all(saveQuery.map((q) => client.mutate(q)));
                  dispatch(saveParticipants());
                  setSubmitting(false);
                },
              },
              {
                label: 'Cancel',
                onClick: () => {
                  setSubmitting(false);
                },
              },
            ],
          });
          return;
        }
        await Promise.all(saveQuery.map((q) => client.mutate(q)));
        dispatch(saveParticipants());
      }

      setSubmitting(false);
    },
    [deletedParticipants, newParticipants]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      onSaveParticipants();
    }, 300);
    return () => clearInterval(interval);
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
