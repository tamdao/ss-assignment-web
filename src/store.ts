import { configureStore } from '@reduxjs/toolkit';

import sendByEmailSmsReducer, {
  ISendByEmailSmsState,
} from './modules/SendByEmailSms/sendByEmailSms.redux';

const store = configureStore({
  reducer: {
    sendByEmailSms: sendByEmailSmsReducer,
  },
});

export default store;

export type RootState = {
  sendByEmailSms: ISendByEmailSmsState;
};
export type AppDispatch = typeof store.dispatch;
