import React, { memo, useCallback, useEffect, useMemo } from 'react';
import phonenumber from 'google-libphonenumber';
import validator from 'validator';
import ArrowRightAltOutlinedIcon from '@material-ui/icons/ArrowRightAltOutlined';
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import ReportProblemOutlined from '@material-ui/icons/ReportProblemOutlined';
import { useQuery } from '@apollo/client';
import Table from '../../../components/Table/Table';
import styles from '../SendByEmailSms.module.css';
import { GET_ALL_PARTICIPANTS } from '../sendByEmailSms.gql';
import { useDispatch, useSelector } from 'react-redux';
import {
  initParticipants,
  selectdraftParticipants,
  removeParticipant,
  updateParticipantFieldValue,
  IParticipant,
} from '../sendByEmailSms.redux';
import { Row } from 'react-table';
import { getRowErrorStatus } from '../../../components/Table/EditableCell';

const phoneUtil = phonenumber.PhoneNumberUtil.getInstance();

export const SendByEmailSmsTable = memo(() => {
  const dispatch = useDispatch();
  const participants = useSelector(selectdraftParticipants);

  const columns = useMemo(
    () => [
      {
        id: 'arrow-icon',
        Cell: ({
          row,
          validations,
        }: {
          row: Row<IParticipant>;
          validations: {
            [key: string]: (value: string, originalRow?: any) => string;
          };
        }) => {
          const isError = getRowErrorStatus(validations, row.original);
          if (isError) {
            return (
              <div>
                <ReportProblemOutlined fontSize="small" color="error" />
                <ArrowRightAltOutlinedIcon fontSize="small" color="error" />
              </div>
            );
          }

          return (
            <div>
              <ReportProblemOutlined
                fontSize="small"
                className={styles.HiddenIcon}
              />
              <ArrowRightAltOutlinedIcon fontSize="small" />
            </div>
          );
        },
      },
      {
        Header: 'Email',
        accessor: 'email',
        validation: (value: string, originalRow?: any) => {
          if (!validator.isEmail(value as string)) {
            return 'Invalid email';
          }
          if (participants.filter((p) => p.email === value).length > 1) {
            return 'Email already exists';
          }
          return '';
        },
      },
      {
        id: 'countryCode',
        Header: 'Country code',
        accessor: 'countryCode',
      },
      {
        Header: 'Phone number',
        accessor: 'phoneNumber',
        type: 'phone',
        countryCodeAccessor: 'countryCode',
        validation: (value: string, originalRow?: any) => {
          if (!validator.isNumeric(value)) {
            return 'Invalid phone number';
          }
          const phoneNumber = phoneUtil.parse(value, originalRow.countryCode);

          const isValidPhoneNumber = phoneUtil.isValidNumberForRegion(
            phoneNumber,
            originalRow.countryCode
          );
          if (!isValidPhoneNumber) {
            return 'Invalid phone number';
          }

          return '';
        },
      },
      {
        Header: 'First name',
        accessor: 'firstName',
      },
      {
        Header: 'Last name',
        accessor: 'lastName',
      },
      {
        Header: 'Group',
        accessor: 'group',
        type: 'list',
        datalist: ['The Mandalorian', 'Grogu', 'Greef Karga', 'The Client'],
      },
      {
        id: 'delete-btn',
        Cell: ({ row }: { row: Row<IParticipant> }) => (
          <div
            className={styles.IconWrapper}
            onClick={() => dispatch(removeParticipant(row.original.id))}
          >
            <RemoveCircleOutlineOutlinedIcon fontSize="small" color="error" />
          </div>
        ),
      },
    ],
    [participants, dispatch]
  );

  const initialState = useMemo(
    () => ({
      hiddenColumns: ['countryCode'],
    }),
    []
  );

  const { data, error } = useQuery(GET_ALL_PARTICIPANTS);

  useEffect(() => {
    if (!error && data) {
      dispatch(initParticipants(data.participants));
    }
  }, [data, error, dispatch]);

  const onCellChange = useCallback(
    (id, fieldName, value, rowValid) => {
      dispatch(updateParticipantFieldValue({ id, fieldName, value, rowValid }));
    },
    [dispatch]
  );

  return (
    <Table
      columns={columns}
      data={participants}
      initialState={initialState}
      onCellChange={onCellChange}
    />
  );
});
