export const NotificationConfig: any[] = [
  {
    name: 'Submit Goal',
    alert: {
      title: 'Submitted goals',
      template: '{{user.firstName}} {{user.lastName}} submitted {{goalSummary.owner.name}} goals',
      url: '/webux/my-goals/goals/{{goalSummary.owner.type}}/{{goalSummary.owner.id}}/{{goalSummary.owner.name}}/{{user.id}}?cycle={{goalSummary.cycleId}}',
      params: ['user', 'goalSummary'],
    },
    email: {
      subject: 'Submitting Goals',
      template: 'submit-goals',
      params: ['user', 'goalSummary'],
    },
    push: {},
  },
  {
    name: 'Password Reset',
    email: {
      subject: 'Password Reset',
      template: 'password-reset',
      params: ['link'],
    },
    push: {},
  },
  {
    name: 'Approved Goal',
    alert: {
      title: 'Approved goals',
      template: '{{user.firstName}} {{user.lastName}} approved {{goalSummary.owner.name}} goals',
      url: '/webux/my-goals/goals/{{goalSummary.owner.type}}/{{goalSummary.owner.id}}/{{goalSummary.owner.name}}/{{user.id}}?cycle={{goalSummary.cycleId}}',
      params: ['user', 'goalSummary'],
    },
    email: {
      subject: 'Approved Goal',
      template: 'approved-goal',
      params: ['user', 'goalSummary'],
    },
    push: {},
  },
  {
    name: 'Goals Rejected',
    alert: {
      title: 'Declined goals',
      template: '{{user.firstName}} {{user.lastName}} declined {{goalSummary.owner.name}} goals',
      url: '/webux/my-goals/goals/{{goalSummary.owner.type}}/{{goalSummary.owner.id}}/{{goalSummary.owner.name}}/{{user.id}}?cycle={{goalSummary.cycleId}}',
      params: ['user', 'goalSummary'],
    },
    email: {
      subject: 'Goals Rejected',
      template: 'goals-rejected',
      params: ['user', 'goalSummary'],
    },
    push: {},
  },
  {
    name: 'Peer Review Received',
    alert: {
      title: 'You received a peer review',
      template: '{{user.firstName}} {{user.lastName}} approved review for you',
      url: '/webux/peer-reviews?cycle={{cycleId}}',
      params: ['user', 'cycleId'],
    },
    email: {
      subject: 'Peer Review Received',
      template: 'peer-preview-received',
      params: ['user', 'cycleId'],
    },
    push: {},
  },
  {
    name: 'Peer Review Approved',
    alert: {
      title: 'Supervisor approved your review for {{user.firstName}} {{user.lastName}}',
      template:
        '{{supervisor.firstName}} {{supervisor.lastName}} approved your review for {{user.firstName}} {{user.lastName}}',
      url: '/webux/peer-reviews?cycle={{cycleId}}',
      params: ['user', 'supervisor', 'cycleId'],
    },
    email: {
      subject: 'Peer Review Received',
      template: 'peer-preview-received',
      params: ['user', 'supervisor', 'cycleId'],
    },
    push: {},
  },
  {
    name: 'Peer Review Rejected',
    alert: {
      title: 'Supervisor rejected your review for {{user.firstName}} {{user.lastName}}',
      template:
        '{{supervisor.firstName}} {{supervisor.lastName}} rejected your review for {{user.firstName}} {{user.lastName}}',
      url: '/webux/peer-reviews?cycle={{cycleId}}',
      params: ['user', 'supervisor', 'cycleId'],
    },
    email: {
      subject: 'Peer Review Rejected',
      template: 'peer-preview-received',
      params: ['user', 'supervisor', 'cycleId'],
    },
    push: {},
  },
  {
    name: 'Peer Review Received For Approval',
    alert: {
      title: '{{reviewer.firstName}} {{reviewer.lastName}} submitted a peer review for approval',
      template:
        '{{reviewer.firstName}} {{reviewer.lastName}} submitted peer review for {{user.firstName}} {{user.lastName}} for approval',
      url: '/webux/peer-reviews-approve/{{user.id}}/{{user.firstName}} {{user.lastName}}?cycle={{cycleId}}',
      params: ['user', 'reviewer', 'cycleId'],
    },
    email: {
      subject: 'Peer Review Received For Approval',
      template: 'peer-review-received-for-approval',
      params: ['user', 'reviewer', 'cycleId'],
    },
    push: {},
  },
  {
    name: 'ICR Received',
    alert: {
      title: 'IC review received from {{user.firstName}} {{user.lastName}}',
      template: '{{user.firstName}} {{user.lastName}} submitted internal customer review for {{teamGoalSummery.name}}',
      url: '/webux/internal-customer-answers?cycle={{teamGoalSummery.cycleId}}',
      params: ['user', 'teamGoalSummery'],
    },
    email: {
      subject: 'ICR Received',
      template: 'icr-received',
      params: ['user', 'teamGoalSummery'],
    },
    push: {},
  },
  {
    name: 'ICR Received For Approval',
    alert: {
      title: '{{user.firstName}} {{user.lastName}} approved your IC review',
      template:
        '{{user.firstName}} {{user.lastName}} approved your Internal Customer review for {{teamGoalSummery.name}}',
      url: '/webux/internal-customers?cycle={{teamGoalSummery.cycleId}}',
      params: ['user', 'teamGoalSummery'],
    },
    email: {
      subject: 'ICR Received For Approval',
      template: 'icr-received-for-approval',
      params: ['user', 'teamGoalSummery'],
    },
    push: {},
  },
  {
    name: 'Performance Cycle Ended',
    alert: {
      title: 'Performance Cycle Ended',
      template: '{{cycleName}} is ended at {{cycleEndDate}}',
      params: ['cycleName', 'cycleEndDate'],
    },
    email: {
      subject: 'Performance Cycle Ended',
      template: 'performance-cycle-ended',
      params: ['user', 'cycleName', 'cycleEndDate'],
    },
    push: {},
  },
  {
    name: 'New Cycle Started',
    alert: {
      title: 'New Cycle Started',
      template: '{{cycleName}} started',
      params: ['user', 'cycleName'],
    },
    email: {
      subject: 'New Cycle Started',
      template: 'new-cycle-started',
      params: ['user', 'cycleName'],
    },
    push: {},
  },
  {
    name: 'New Member Added To The Team',
    alert: {
      title: 'New member added to the team',
      template: '{{team.memberName}} added to the Team',
      params: ['user', 'team'],
    },
    email: {
      subject: 'New member added to the team',
      template: '{{team.memberName}} added to the Team',
      params: ['user', 'team'],
    },
    push: {},
  },
  {
    name: 'ICR Received For Approval',
    alert: {
      title: '{{user.firstName}} {{user.lastName}} approved your IC review',
      template:
        '{{user.firstName}} {{user.lastName}} approved your Internal Customer review for {{teamGoalSummery.name}}',
      url: '/webux/internal-customers?cycle={{teamGoalSummery.cycleId}}',
      params: ['user', 'teamGoalSummery'],
    },
    email: {
      subject: 'ICR Received For Approval',
      template: 'icr-received-for-approval',
      params: ['user', 'teamGoalSummery'],
    },
    push: {},
  },
];
