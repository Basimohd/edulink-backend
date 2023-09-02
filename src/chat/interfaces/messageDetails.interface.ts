export enum groupType {
  COMMUNITY = 'community',
  GROUP = 'group'
}

export enum senderType {
  STUDENT = 'student',
  FACULTY = 'faculty'
}

export interface messageDetails {
    groupType: groupType
    content: string
    groupId: string,
    senderId : string | null,
    senderType : senderType
  }

export interface saveMessageDetails {
  message: string;
  studentSender?: string; 
  facultySender?: string;
}