import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../store';

export interface IParticipant {
  id: string;
  email: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  group?: string;
}

export interface ISendByEmailSmsState {
  participants: IParticipant[];
  draftParticipants: IParticipant[];
  validParticipants: {
    [key: string]: boolean;
  };
}

export const slice: any = createSlice({
  name: 'sendByEmailSms',
  initialState: {
    participants: [],
    draftParticipants: [],
    validParticipants: {},
  },
  reducers: {
    initParticipants: (state: ISendByEmailSmsState, action) => {
      state.participants = action.payload;
      state.draftParticipants = action.payload;
      state.validParticipants = {};
    },
    addParticipant: (state: ISendByEmailSmsState) => {
      state.draftParticipants.push({
        id: uuidv4(),
        email: '',
        phoneNumber: '',
      });
    },
    removeParticipant: (state: ISendByEmailSmsState, action) => {
      state.draftParticipants = state.draftParticipants.filter(
        (dp) => dp.id !== action.payload
      );
      delete state.validParticipants[action.payload];
    },
    updateParticipantFieldValue: (state: ISendByEmailSmsState, action) => {
      const participant: any = state.draftParticipants.find(
        (dp) => dp.id === action.payload.id
      );
      if (participant) {
        participant[action.payload.fieldName] = action.payload.value;
        state.validParticipants[participant.id] = action.payload.rowValid;
      }
    },
    saveParticipants: (state: ISendByEmailSmsState) => {
      for (const key in state.validParticipants) {
        if (
          Object.prototype.hasOwnProperty.call(state.validParticipants, key)
        ) {
          const valid = state.validParticipants[key];
          if (valid) {
            delete state.validParticipants[key];
            const participant = state.draftParticipants.find(
              (dp) => dp.id === key
            );
            if (!participant) {
              continue;
            }
            const originalParticipant = state.participants.find(
              (p) => p.id === participant.id
            );
            if (originalParticipant) {
              originalParticipant.email = participant.email;
              originalParticipant.phoneNumber = participant.phoneNumber;
              originalParticipant.firstName = participant.firstName;
              originalParticipant.lastName = participant.lastName;
              originalParticipant.group = participant.group;
            } else {
              state.participants.push(participant);
            }
          }
        }
      }
      state.participants = state.participants.filter((p) =>
        state.draftParticipants.find((dp) => dp.id === p.id)
      );
    },
  },
});

export const selectdraftParticipants = (state: RootState) =>
  state.sendByEmailSms.draftParticipants;
export const selectParticipants = (state: RootState) =>
  state.sendByEmailSms.participants;
export const selectDeletedParticipants = (state: RootState) => {
  const { participants, draftParticipants } = state.sendByEmailSms;
  const deletedParticipants = participants.filter(
    (p) => !draftParticipants.find((df) => df.id === p.id)
  );

  return deletedParticipants;
};
export const selectNewParticipants = (state: RootState) => {
  const {
    validParticipants,
    draftParticipants,
    participants,
  } = state.sendByEmailSms;
  const newParticipants = [];

  for (let index = 0; index < draftParticipants.length; index++) {
    const participant = draftParticipants[index];
    if (validParticipants[participant.id]) {
      const originalParticipant = participants.find(
        (p) => p.id === participant.id
      );
      if (
        !originalParticipant ||
        JSON.stringify(originalParticipant) !== JSON.stringify(participant)
      ) {
        newParticipants.push(participant);
      }
    }
  }

  return newParticipants;
};

export const {
  initParticipants,
  addParticipant,
  removeParticipant,
  updateParticipantFieldValue,
  saveParticipants,
} = slice.actions;

export default slice.reducer;
