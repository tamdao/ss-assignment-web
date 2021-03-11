import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../store';

interface IParticipant {
  id: string;
  email: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  group?: string;
}

export interface ISendByEmailSmsState {
  participants: IParticipant[];
  drafParticipants: IParticipant[];
  validParticipants: boolean[];
}

export const slice: any = createSlice({
  name: 'sendByEmailSms',
  initialState: {
    participants: [],
    drafParticipants: [],
    validParticipants: [],
  },
  reducers: {
    initParticipants: (state: ISendByEmailSmsState, action) => {
      state.drafParticipants = action.payload;
      state.participants = action.payload;
    },
    addParticipant: (state: ISendByEmailSmsState) => {
      state.drafParticipants.push({ id: uuidv4(), email: '', phoneNumber: '' });
    },
    removeParticipant: (state: ISendByEmailSmsState, action) => {
      state.drafParticipants = state.drafParticipants.filter(
        (dp) => dp.id !== action.payload
      );
    },
    updateParticipantFieldByIndex: (state: ISendByEmailSmsState, action) => {
      const participant: any = state.drafParticipants[action.payload.index];
      if (participant) {
        participant[action.payload.id] = action.payload.value;
      }
      state.validParticipants[action.payload.index] = action.payload.rowValid;
    },
  },
});

export const selectDrafParticipants = (state: RootState) =>
  state.sendByEmailSms.drafParticipants;
export const selectParticipants = (state: RootState) =>
  state.sendByEmailSms.participants;
export const selectDeletedParticipants = (state: RootState) => {
  const { participants, drafParticipants } = state.sendByEmailSms;
  const deletedParticipants = participants.filter(
    (p) => !drafParticipants.find((df) => df.id === p.id)
  );

  return deletedParticipants;
};
export const selectNewParticipants = (state: RootState) => {
  const { validParticipants, drafParticipants } = state.sendByEmailSms;
  const newParticipants = [];

  for (let index = 0; index < drafParticipants.length; index++) {
    const participant = drafParticipants[index];
    if (validParticipants[index]) {
      newParticipants.push(participant);
    }
  }

  return newParticipants;
};

export const {
  initParticipants,
  addParticipant,
  removeParticipant,
  updateParticipantFieldByIndex,
  saveParticipants,
} = slice.actions;

export default slice.reducer;
