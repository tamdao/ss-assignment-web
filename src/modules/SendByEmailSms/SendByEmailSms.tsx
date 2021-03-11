import React, { useCallback } from 'react';
import Button from '../../components/Button/Button';
import Panel from '../../components/Panel/Panel';

import styles from './SendByEmailSms.module.css';
import { SendByEmailSmsHeader } from './components/SendByEmailSmsHeader';
import { AddParticipantButton } from './components/AddParticipantButton';
import { SendByEmailSmsTable } from './components/SendByEmailSmsTable';
import {
  selectDeletedParticipants,
  selectNewParticipants,
} from './sendByEmailSms.redux';

export default function () {
  const onSaveParticipants = useCallback(() => {
    console.log('selectDeletedParticipants', selectDeletedParticipants);
    console.log('selectNewParticipants', selectNewParticipants);
  }, []);

  return (
    <div className={styles.Container}>
      <Panel header={<SendByEmailSmsHeader />}>
        <div className={styles.Content}>
          <SendByEmailSmsTable />
        </div>
        <AddParticipantButton />
      </Panel>
      <div className={styles.Footer}>
        <Button onClick={onSaveParticipants}>Save & Continute</Button>
      </div>
    </div>
  );
}
