import { gql } from '@apollo/client';
import { IParticipant } from './sendByEmailSms.redux';

export const GET_ALL_PARTICIPANTS = gql`
  query GetAllParticipants {
    participants {
      id
      email
      countryCode
      phoneNumber
      firstName
      lastName
      group
    }
  }
`;

export const UPSERT_PARTICIPANTS = gql`
  mutation UpsertParticipant(
    $id: String!
    $email: String!
    $countryCode: String!
    $phoneNumber: String!
    $firstName: String
    $lastName: String
    $group: String
  ) {
    upsertParticipant(
      id: $id
      email: $email
      countryCode: $countryCode
      phoneNumber: $phoneNumber
      firstName: $firstName
      lastName: $lastName
      group: $group
    ) {
      id
      email
      phoneNumber
      firstName
      lastName
      group
    }
  }
`;

export const getUpsertParticipantsMutation = (participants: IParticipant[]) => {
  const variables: any = {};
  const mutations = participants.map((participant, index) => {
    variables[`item${index}`] = {
      id: participant.id,
      email: participant.email,
      countryCode: participant.countryCode,
      phoneNumber: participant.phoneNumber,
      firstName: participant.firstName,
      lastName: participant.lastName,
      group: participant.group,
    };
    return `item${index}: upsertParticipant(input: $item${index}) {
      id
      email
      countryCode
      phoneNumber
      firstName
      lastName
      group
    }`;
  });
  const mutation = gql(`mutation UpsertParticipants(${participants.map(
    (participant, index) => `$item${index}: ParticipantInput!`
  )}) {
    ${mutations.join('\n')}
  }`);
  return {
    variables,
    mutation,
  };
};

export const getDeleteParticipantsMutation = (participants: IParticipant[]) => {
  const variables: any = {};
  const mutations = participants.map((participant, index) => {
    variables[`item${index}`] = participant.id;
    return `item${index}: deleteParticipant(id: $item${index})`;
  });
  const mutation = gql(`mutation DeleteParticipants(${participants.map(
    (participant, index) => `$item${index}: String!`
  )}) {
    ${mutations.join('\n')}
  }`);
  return {
    variables,
    mutation,
  };
};
