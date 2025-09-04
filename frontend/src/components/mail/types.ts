export interface Mail {
  id: string;
  subject: string;
  sender: string;
  senderEmail: string;
  preview: string;
  body: string;
  date: Date;
  read: boolean;
  starred: boolean;
  important: boolean;
  labels: string[];
  attachments?: {
    name: string;
    size: string;
    type: string;
  }[];
}

export interface MailFolder {
  id: string;
  name: string;
  count: number;
  icon: string;
}
