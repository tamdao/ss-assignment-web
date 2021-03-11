import { gql } from '@apollo/client';

export const GET_ALL_PARTICIPANTS = gql`
  query GetAllParticipants {
    participants {
      id
      email
      phoneNumber
      firstName
      lastName
      group
    }
  }
`;
