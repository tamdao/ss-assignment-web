import React from 'react';
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
import ArrowRightAltOutlinedIcon from '@material-ui/icons/ArrowRightAltOutlined';
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import Panel from '../../components/Panel/Panel';

import styles from './SendByEmailSms.module.css';

const SendByEmailSmsHeader = () => {
  return (
    <div className={styles.Header}>
      <MailOutlineOutlinedIcon fontSize="large" className={styles.HeaderIcon} />{' '}
      Send by email / sms
    </div>
  );
};

export default function () {
  const columns = React.useMemo(
    () => [
      {
        id: 'arrow-icon',
        Cell: () => (
          <div className={styles.IconWrapper}>
            <ArrowRightAltOutlinedIcon fontSize="small" />
          </div>
        ),
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Phone number',
        accessor: 'phoneNumber',
        type: 'phone',
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
        datalist: ['The Mandalorian', 'Grogu', 'Greef Karga', 'The Client'],
      },
      {
        id: 'delete-btn',
        Cell: () => (
          <div className={styles.IconWrapper}>
            <RemoveCircleOutlineOutlinedIcon fontSize="small" color="error" />
          </div>
        ),
      },
    ],
    []
  );
  return (
    <div className={styles.Container}>
      <Panel header={<SendByEmailSmsHeader />}>
        <div className={styles.Content}>
          <Table
            columns={columns}
            data={[{ id: 0 }, { id: 0 }]}
            onCellChange={(index, id, value) => {}}
          />
        </div>
        <Button type="secondary" size="small">
          Add Participant
        </Button>
      </Panel>
      <div className={styles.Footer}>
        <Button>Save & Continute</Button>
      </div>
    </div>
  );
}