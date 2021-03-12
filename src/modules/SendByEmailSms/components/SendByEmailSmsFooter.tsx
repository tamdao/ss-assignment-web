import React from 'react';
import Button from '../../../components/Button/Button';
import styles from '../SendByEmailSms.module.css';

export const SendByEmailSmsFooter = ({
  submitting,
  onSaveParticipants,
}: {
  submitting: boolean;
  onSaveParticipants: () => void;
}) => {
  return (
    <div className={styles.Footer}>
      <Button onClick={onSaveParticipants} disabled={submitting}>
        Save & Continute
      </Button>
    </div>
  );
};
