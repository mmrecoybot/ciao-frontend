const permissions = [
  {
    category: "User and Role Management",
    permissions: [
      {
        name: "Manage Users",
        description:
          "Permission to create, update, delete, and deactivate users.",
      },
      {
        name: "View Users",
        description: "Permission to view the list of users and their details.",
      },
      {
        name: "Manage Roles",
        description: "Permission to create, update, and delete roles.",
      },
      {
        name: "Assign Permissions",
        description:
          "Permission to assign or revoke roles and permissions to users.",
      },
      {
        name: "View Roles",
        description:
          "Permission to view roles and their associated permissions.",
      },
    ],
  },
  {
    category: "Dashboard and Reports",
    permissions: [
      {
        name: "View Dashboard",
        description: "Permission to access and view the dashboard.",
      },
      {
        name: "Generate Reports",
        description: "Permission to create and generate custom reports.",
      },
      {
        name: "Export Reports",
        description:
          "Permission to export reports in various formats like PDF, Excel, etc.",
      },
      {
        name: "View Analytics",
        description: "Permission to view analytics and performance metrics.",
      },
    ],
  },
  {
    category: "Workflow and Task Management",
    permissions: [
      {
        name: "Manage Workflows",
        description: "Permission to create and update workflows.",
      },
      {
        name: "Approve Workflows",
        description: "Permission to approve pending workflows.",
      },
      {
        name: "View Workflows",
        description: "Permission to view workflows and their statuses.",
      },
      {
        name: "Manage Tasks",
        description: "Permission to create, assign, and update tasks.",
      },
      {
        name: "Complete Tasks",
        description: "Permission to mark tasks as completed.",
      },
      {
        name: "View Tasks",
        description: "Permission to view task lists and details.",
      },
    ],
  },
  {
    category: "Inventory and Procurement",
    permissions: [
      {
        name: "Manage Inventory",
        description: "Permission to add, update, or delete inventory items.",
      },
      {
        name: "View Inventory",
        description: "Permission to view inventory details and stock levels.",
      },
      {
        name: "Manage Procurement",
        description: "Permission to create and manage purchase orders.",
      },
      {
        name: "Approve Procurement",
        description: "Permission to approve purchase requests or orders.",
      },
    ],
  },
  {
    category: "Financial Management",
    permissions: [
      {
        name: "View Transactions",
        description: "Permission to view financial transactions and details.",
      },
      {
        name: "Process Payments",
        description: "Permission to initiate and process payments.",
      },
      {
        name: "Generate Invoices",
        description: "Permission to create and send invoices.",
      },
      {
        name: "Approve Budgets",
        description: "Permission to approve or modify budgets.",
      },
      {
        name: "View Financial Reports",
        description: "Permission to view financial statements and reports.",
      },
    ],
  },
  {
    category: "Asset Management",
    permissions: [
      {
        name: "Manage Assets",
        description: "Permission to add, update, or delete assets.",
      },
      {
        name: "View Assets",
        description: "Permission to view asset details and usage.",
      },
      {
        name: "Allocate Assets",
        description: "Permission to assign assets to employees or departments.",
      },
      {
        name: "Track Assets",
        description: "Permission to monitor asset usage and status.",
      },
    ],
  },
  {
    category: "Security and Compliance",
    permissions: [
      {
        name: "Manage Audit Logs",
        description: "Permission to view and delete audit trails.",
      },
      {
        name: "View Audit Logs",
        description: "Permission to view system and user activity logs.",
      },
      {
        name: "Manage Security Settings",
        description:
          "Permission to update security configurations like access controls and passwords.",
      },
      {
        name: "Access Restricted Areas",
        description: "Permission to access sensitive or restricted modules.",
      },
    ],
  },
  {
    category: "Communication and Notifications",
    permissions: [
      {
        name: "Manage Notifications",
        description: "Permission to create, update, or delete notifications.",
      },
      {
        name: "Send Notifications",
        description:
          "Permission to send system-generated or manual notifications.",
      },
      {
        name: "View Notifications",
        description: "Permission to view received notifications.",
      },
    ],
  },
  {
    category: "Application Settings",
    permissions: [
      {
        name: "Manage Settings",
        description: "Permission to update system-wide configurations.",
      },
      {
        name: "View Settings",
        description: "Permission to view application settings.",
      },
      {
        name: "Manage Integrations",
        description:
          "Permission to add, update, or delete integrations with third-party systems.",
      },
      {
        name: "Manage API Access",
        description: "Permission to generate, revoke, and manage API keys.",
      },
    ],
  },
  {
    category: "Support and Help",
    permissions: [
      {
        name: "Manage Support Tickets",
        description: "Permission to create, update, and close support tickets.",
      },
      {
        name: "View Support Tickets",
        description: "Permission to view all or assigned tickets.",
      },
      {
        name: "Access Knowledge Base",
        description:
          "Permission to access internal documentation or help resources.",
      },
    ],
  },
  {
    category: "Development and Maintenance",
    permissions: [
      {
        name: "Access Developer Tools",
        description: "Permission to access developer tools and environments.",
      },
      {
        name: "Deploy Updates",
        description: "Permission to deploy new features or updates.",
      },
      {
        name: "Monitor Application",
        description: "Permission to monitor system performance and logs.",
      },
    ],
  },
];
module.exports = permissions;
