import React, { useCallback, useEffect, useState } from 'react';
import { DocumentNode, useApolloClient } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

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
import { SendByEmailSmsFooter } from './components/SendByEmailSmsFooter';

export default function SendByEmailSms() {
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
    [deletedParticipants, newParticipants, client, dispatch, submitting]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      onSaveParticipants(false);
    }, 300);
    return () => clearInterval(interval);
  }, [deletedParticipants, newParticipants, onSaveParticipants]);

  return (
    <div className={styles.Container}>
      <Panel header={<SendByEmailSmsHeader />}>
        <div className={styles.Content}>
          <SendByEmailSmsTable />
        </div>
        <AddParticipantButton />
      </Panel>
      <SendByEmailSmsFooter
        onSaveParticipants={onSaveParticipants}
        submitting={submitting}
      />
    </div>
  );
}
