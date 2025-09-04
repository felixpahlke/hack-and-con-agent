import { Mail, MailFolder } from "./types";

export const mockMails: Mail[] = [
  {
    id: "1",
    subject: "Welcome to our platform!",
    sender: "Sarah Johnson",
    senderEmail: "sarah.johnson@company.com",
    preview:
      "Thank you for joining us. Here's everything you need to get started with your new account...",
    body: `Dear User,

Thank you for joining our platform! We're excited to have you on board.

Here's everything you need to get started:
1. Complete your profile setup
2. Explore our dashboard features  
3. Connect with your team members
4. Start your first project

If you have any questions, don't hesitate to reach out to our support team.

Best regards,
Sarah Johnson
Customer Success Team`,
    date: new Date("2024-01-15T09:30:00"),
    read: false,
    starred: true,
    important: true,
    labels: ["Welcome", "Getting Started"],
    attachments: [
      {
        name: "getting-started-guide.pdf",
        size: "2.3 MB",
        type: "PDF",
      },
    ],
  },
  {
    id: "2",
    subject: "Project Update - Q1 2024",
    sender: "Michael Chen",
    senderEmail: "m.chen@company.com",
    preview:
      "Here's the latest update on our Q1 projects. We've made significant progress on the client deliverables...",
    body: `Team,

Here's the latest update on our Q1 projects:

Project Alpha: 85% complete
- Client feedback incorporated
- Testing phase initiated
- Launch scheduled for next week

Project Beta: 60% complete  
- Design reviews completed
- Development in progress
- Stakeholder meeting scheduled

Let me know if you have any questions.

Best,
Michael`,
    date: new Date("2024-01-14T14:22:00"),
    read: true,
    starred: false,
    important: false,
    labels: ["Projects", "Updates"],
  },
  {
    id: "3",
    subject: "Security Alert: Login from new device",
    sender: "Security Team",
    senderEmail: "security@company.com",
    preview:
      "We detected a login to your account from a new device. If this was you, no action is needed...",
    body: `Security Alert

We detected a login to your account from a new device:

Device: MacBook Pro
Location: San Francisco, CA
Time: January 14, 2024 at 2:15 PM PST
IP Address: 192.168.1.100

If this was you, no action is needed. If you don't recognize this activity, please contact our security team immediately.

Security Team
company.com`,
    date: new Date("2024-01-14T14:15:00"),
    read: false,
    starred: false,
    important: true,
    labels: ["Security", "Alert"],
  },
  {
    id: "4",
    subject: "Meeting Reminder: Team Standup Tomorrow",
    sender: "Calendar Bot",
    senderEmail: "calendar@company.com",
    preview:
      "Reminder: You have a team standup meeting scheduled for tomorrow at 10:00 AM...",
    body: `Meeting Reminder

You have a team standup meeting scheduled for:

Date: January 16, 2024
Time: 10:00 AM - 10:30 AM PST
Location: Conference Room A / Zoom
Meeting ID: 123-456-789

Agenda:
- Sprint progress review
- Blockers discussion
- Next sprint planning

Calendar Bot`,
    date: new Date("2024-01-14T12:00:00"),
    read: true,
    starred: false,
    important: false,
    labels: ["Meetings", "Reminders"],
  },
  {
    id: "5",
    subject: "Invoice #INV-2024-001 - Payment Due",
    sender: "Billing Department",
    senderEmail: "billing@company.com",
    preview:
      "Your invoice INV-2024-001 for $1,250.00 is due on January 20th. Please process payment at your earliest...",
    body: `Invoice Payment Reminder

Invoice Details:
- Invoice Number: INV-2024-001
- Amount: $1,250.00
- Due Date: January 20, 2024
- Services: Q1 2024 Subscription

Payment Methods:
- Online portal: portal.company.com
- Bank transfer details attached
- Credit card on file

Please process payment by the due date to avoid service interruption.

Billing Department`,
    date: new Date("2024-01-13T16:45:00"),
    read: true,
    starred: false,
    important: true,
    labels: ["Billing", "Invoice"],
  },
  {
    id: "6",
    subject: "Weekly Newsletter - Tech Updates",
    sender: "Tech News",
    senderEmail: "newsletter@technews.com",
    preview:
      "This week in tech: AI breakthroughs, new frameworks, and industry insights you shouldn't miss...",
    body: `Weekly Tech Newsletter

This Week's Highlights:
🤖 AI Breakthroughs
- New LLM model released with 40% better performance
- AI coding assistants reach new milestone

🚀 Framework Updates  
- React 19 beta features announced
- Vue 3.4 performance improvements

📊 Industry Insights
- Developer survey results
- Remote work trends 2024

Read more at technews.com

Unsubscribe | Manage Preferences`,
    date: new Date("2024-01-13T08:00:00"),
    read: false,
    starred: false,
    important: false,
    labels: ["Newsletter", "Tech"],
  },
  {
    id: "7",
    subject: "Congratulations! Your proposal has been accepted",
    sender: "Jane Smith",
    senderEmail: "jane.smith@client.com",
    preview:
      "We're pleased to inform you that your project proposal has been accepted. We'd like to schedule a kickoff meeting...",
    body: `Dear Team,

We're pleased to inform you that your project proposal has been accepted!

Next Steps:
1. Contract signing - this week
2. Kickoff meeting - January 18th
3. Project timeline review
4. Resource allocation

We're excited to work with you on this project and look forward to a successful collaboration.

Best regards,
Jane Smith
Project Manager`,
    date: new Date("2024-01-12T11:30:00"),
    read: true,
    starred: true,
    important: true,
    labels: ["Client", "Good News"],
  },
  {
    id: "8",
    subject: "System Maintenance Scheduled - January 20th",
    sender: "IT Operations",
    senderEmail: "it-ops@company.com",
    preview:
      "Scheduled system maintenance will occur on January 20th from 2:00 AM to 6:00 AM PST. Services will be temporarily unavailable...",
    body: `System Maintenance Notice

Scheduled maintenance window:
Date: January 20, 2024
Time: 2:00 AM - 6:00 AM PST
Duration: 4 hours (estimated)

Affected Services:
- Main application
- Email services  
- File storage
- API endpoints

During maintenance:
- All services will be temporarily unavailable
- Automatic backups will be performed
- Security updates will be applied

We apologize for any inconvenience.

IT Operations Team`,
    date: new Date("2024-01-12T09:15:00"),
    read: true,
    starred: false,
    important: false,
    labels: ["IT", "Maintenance"],
  },
];

export const mockFolders: MailFolder[] = [
  {
    id: "inbox",
    name: "Inbox",
    count: 5,
    icon: "inbox",
  },
  {
    id: "sent",
    name: "Sent",
    count: 12,
    icon: "send",
  },
  {
    id: "drafts",
    name: "Drafts",
    count: 3,
    icon: "file-text",
  },
  {
    id: "starred",
    name: "Starred",
    count: 2,
    icon: "star",
  },
  {
    id: "important",
    name: "Important",
    count: 4,
    icon: "alert-circle",
  },
  {
    id: "spam",
    name: "Spam",
    count: 0,
    icon: "shield",
  },
  {
    id: "trash",
    name: "Trash",
    count: 1,
    icon: "trash",
  },
];
