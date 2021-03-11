import React, { useCallback } from 'react';
import Button from '../../../components/Button/Button';
import { useDispatch } from 'react-redux';
import { addParticipant } from '../sendByEmailSms.redux';

export const AddParticipantButton = () => {
  const dispatch = useDispatch();

  const onAddParticipant = useCallback(() => {
    dispatch(addParticipant());
  }, []);

  return (
    <Button type="secondary" size="small" onClick={onAddParticipant}>
      Add Participant
    </Button>
  );
};
