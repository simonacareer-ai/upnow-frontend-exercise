export type TaskStatus = "Overdue" | "Critical" | "DueSoon" | "Blocked" | "Queued";
export type TaskPriority = "Normal" | "High" | "Urgent";

export interface Task {
  id: string;
  orderRef: string;
  name: string;
  station: string;
  status: TaskStatus;
  priority: TaskPriority;
  estMinutes: number;
  overdueMinutes?: number;
  dueLabel: string;
  assignedTo?: string;
  strandedFrom?: string; // member id who was assigned before going absent
  dependency?: string; // human readable blocker description
  blocking?: string; // what this task blocks, shown in red
  quantityLabel?: string; // "150 Pax", "40kg", "28 Bags"
}

export type MemberStatus = "Ready" | "Free" | "Busy" | "Overloaded" | "Absent";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: MemberStatus;
  load: number; // 0-140, percent of shift capacity
  note?: string; // small contextual note under the load bar
  strandedTaskIds?: string[];
}

export const initialTeam: TeamMember[] = [
  {
    id: "elena",
    name: "Elena R.",
    role: "Cook · Line 1 Standby",
    status: "Ready",
    load: 25,
    note: "Free for Station 2 sanitize",
  },
  {
    id: "kevin",
    name: "Kevin P.",
    role: "Stock Clerk · Inventory Dock",
    status: "Free",
    load: 35,
    note: "Inventory intake finished",
  },
  {
    id: "sarah",
    name: "Sarah L.",
    role: "Lead Cook · Assembly Bay A",
    status: "Busy",
    load: 75,
  },
  {
    id: "liam",
    name: "Liam M.",
    role: "Packer / QA · Dispatch",
    status: "Busy",
    load: 80,
  },
  {
    id: "chloe",
    name: "Chloe B.",
    role: "Line Packer · Staging",
    status: "Busy",
    load: 70,
  },
  {
    id: "ananya",
    name: "Ananya S.",
    role: "Kitchen Coordinator",
    status: "Overloaded",
    load: 110,
  },
  {
    id: "marcus",
    name: "Marcus K.",
    role: "Cook · Station 2",
    status: "Absent",
    load: 0,
    strandedTaskIds: ["t1"],
  },
  {
    id: "dave",
    name: "Dave T.",
    role: "Dock · Cold Storage",
    status: "Absent",
    load: 0,
    strandedTaskIds: ["t3"],
  },
];

export const initialTasks: Task[] = [
  {
    id: "t1",
    orderRef: "9421",
    name: "Deep-clean Prep Station 2 & Sanitize Line",
    station: "Station 2 · #8812",
    status: "Critical",
    priority: "Urgent",
    estMinutes: 20,
    overdueMinutes: 22,
    dueLabel: "Est. 20m",
    strandedFrom: "marcus",
    blocking: "Blocks 150 Bento Corporate Lunch (#9421)",
  },
  {
    id: "t2",
    orderRef: "9421",
    name: "Assemble 150x Bento Sets (Corporate Lunch)",
    station: "Bay A · #8815",
    status: "DueSoon",
    priority: "High",
    estMinutes: 35,
    dueLabel: "Due 12:00 PM",
    assignedTo: "sarah",
    dependency: "Needs Stn 2",
    quantityLabel: "150 Pax",
  },
  {
    id: "t3",
    orderRef: "9418",
    name: "Restock Cold Storage Dairy & Packaging",
    station: "Dock · #8809",
    status: "Overdue",
    priority: "High",
    estMinutes: 15,
    overdueMinutes: 14,
    dueLabel: "Overdue +14m",
    strandedFrom: "dave",
  },
  {
    id: "t4",
    orderRef: "9427",
    name: "Sear Marinated Chicken Thighs (Batch 3)",
    station: "Grill 1 · #8820",
    status: "DueSoon",
    priority: "High",
    estMinutes: 18,
    dueLabel: "Due 11:45 AM",
    assignedTo: "liam",
    dependency: "Sensor Reset",
    quantityLabel: "40kg",
  },
  {
    id: "t5",
    orderRef: "9430",
    name: "Seal & Tag Dispatch Bags (Batch 4)",
    station: "Pkg Bay 2 · #8824",
    status: "Queued",
    priority: "Normal",
    estMinutes: 12,
    dueLabel: "Due 12:15 PM",
    quantityLabel: "28 Bags",
  },
  {
    id: "t6",
    orderRef: "9421",
    name: "Batch Cook Chicken & Salmon",
    station: "Combi 3 · #8813",
    status: "Blocked",
    priority: "High",
    estMinutes: 35,
    dueLabel: "Due 11:35 AM",
    assignedTo: "sarah",
    dependency: "Waiting on Station 2",
    quantityLabel: "40kg",
  },
  {
    id: "t7",
    orderRef: "9433",
    name: "Portion Vegan Bowls (Combi 3)",
    station: "Combi 3 · #8817",
    status: "Blocked",
    priority: "Normal",
    estMinutes: 14,
    dueLabel: "Due 12:05 PM",
    dependency: "Waiting on Combi 3",
    quantityLabel: "25 Pax",
  },
  {
    id: "t8",
    orderRef: "9436",
    name: "Log Temp Check — Walk-in 2",
    station: "Station 4 · #8830",
    status: "Overdue",
    priority: "Normal",
    estMinutes: 5,
    overdueMinutes: 18,
    dueLabel: "Overdue +18m",
  },
];

export const criticalPath = {
  orderRef: "9421",
  label: "Corporate Lunch",
  target: "12:30 PM",
  targetLabel: "Target Departure: 12:30 PM",
  riskMinutes: -12,
  steps: [
    {
      index: "01",
      time: "11:15 AM",
      state: "BLOCKER" as const,
      title: "Clean Station 2",
      detail: "Surface sanitize required",
      minutes: "20 min",
      cta: "Assign Elena →",
    },
    {
      index: "02",
      time: "11:35 AM",
      state: "WAITING" as const,
      title: "Batch Cook",
      detail: "40kg Chicken & Salmon",
      minutes: "35 min",
      tag: "Needs Node 1",
    },
    {
      index: "03",
      time: "12:00 PM",
      state: "QUEUED" as const,
      title: "Bento Assembly",
      detail: "Bay A · Sarah L. & Chloe",
      minutes: "25 min",
      tag: "Bay A",
    },
    {
      index: "04",
      time: "12:25 PM",
      state: "READY" as const,
      title: "Handoff",
      detail: "Temp >68°C · Van Bay 3",
      minutes: "12:30 PM",
      tag: "Van #V-09",
    },
  ],
};
