import type { AnalyticsSummary } from "./AnalyticsPage.types";

const FULL_TOP_PERFORMERS = [
  { id: 1, name: "Sarah Johnson", role: "Senior Server", reliabilityRate: 98, avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
  { id: 2, name: "Mike Chen", role: "Head Chef", reliabilityRate: 95, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
  { id: 3, name: "Emma Rodriguez", role: "Bartender", reliabilityRate: 92, avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150" },
  { id: 4, name: "Olivia Martinez", role: "Server", reliabilityRate: 90, avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
  { id: 5, name: "James Wilson", role: "Kitchen Assistant", reliabilityRate: 88, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
];

const MOCK_DATABASE: Record<string, AnalyticsSummary> = {
  "1 week": {
    systemSpeed: { averageFillTimeHours: 2.4, selfServiceRate: 78, whatsappResponseRate: 85 },
    pointsVelocity: [
      { label: "Week 1", spent: 460, earned: 320 },
      { label: "Week 2", spent: 520, earned: 380 },
      { label: "Week 3", spent: 590, earned: 450 },
      { label: "Week 4", spent: 630, earned: 490 },
    ],
    motivationCorrelation: [
      { points: 10, hours: 4.2 },
      { points: 15, hours: 2.8 },
      { points: 20, hours: 1.5 },
      { points: 25, hours: 0.8 },
      { points: 30, hours: 0.4 },
    ],
    topPerformers: FULL_TOP_PERFORMERS,
    teamOverview: { totalEmployees: 6, avgShiftFill: 92, shiftSwaps: 24, autoFilled: 18, sickLeaves: 3, totalHours: 195, overtimeHours: 2.0 },
    shiftPopularity: {
      chartData: [{ name: "Morning", value: 45, color: "#ffb703" }, { name: "Afternoon", value: 35, color: "#3b82f6" }, { name: "Evening", value: 20, color: "#8b5cf6" }],
      mostPopularDay: "Friday", avgFillRate: 94
    },
    staffHealth: { underworked: [], overworked: [] },
  },
  "2 weeks": {
    systemSpeed: { averageFillTimeHours: 2.8, selfServiceRate: 74, whatsappResponseRate: 82 },
    pointsVelocity: [{ label: "Week 1", spent: 410, earned: 290 }, { label: "Week 2", spent: 480, earned: 340 }],
    motivationCorrelation: [{ points: 10, hours: 4.5 }, { points: 15, hours: 3.1 }],
    topPerformers: FULL_TOP_PERFORMERS,
    teamOverview: { totalEmployees: 8, avgShiftFill: 89, shiftSwaps: 42, autoFilled: 31, sickLeaves: 5, totalHours: 340, overtimeHours: 4.5 },
    shiftPopularity: {
      chartData: [{ name: "Morning", value: 40, color: "#ffb703" }, { name: "Afternoon", value: 40, color: "#3b82f6" }, { name: "Evening", value: 20, color: "#8b5cf6" }],
      mostPopularDay: "Thursday", avgFillRate: 91
    },
    staffHealth: {
      underworked: [{ id: 4, name: "Olivia Martinez", role: "Server", hoursDeviation: 6.5, avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" }],
      overworked: [
        { id: 1, name: "Sarah Johnson", role: "Senior Server", hoursDeviation: 8.0, avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
        { id: 2, name: "Mike Chen", role: "Head Chef", hoursDeviation: 4.5, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" }
      ]
    },
  },
  "1 month": {
    systemSpeed: { averageFillTimeHours: 3.1, selfServiceRate: 80, whatsappResponseRate: 79 },
    pointsVelocity: [{ label: "W1-W2", spent: 380, earned: 310 }, { label: "W3-W4", spent: 490, earned: 420 }],
    motivationCorrelation: [{ points: 10, hours: 5.0 }, { points: 15, hours: 3.6 }],
    topPerformers: FULL_TOP_PERFORMERS,
    teamOverview: { totalEmployees: 12, avgShiftFill: 94, shiftSwaps: 88, autoFilled: 65, sickLeaves: 8, totalHours: 780, overtimeHours: 12.3 },
    shiftPopularity: {
      chartData: [{ name: "Morning", value: 48, color: "#ffb703" }, { name: "Afternoon", value: 32, color: "#3b82f6" }, { name: "Evening", value: 20, color: "#8b5cf6" }],
      mostPopularDay: "Friday", avgFillRate: 95
    },
    staffHealth: {
      underworked: [{ id: 5, name: "James Wilson", role: "Kitchen Assistant", hoursDeviation: 12.0, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" }],
      overworked: [{ id: 2, name: "Mike Chen", role: "Head Chef", hoursDeviation: 14.5, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" }]
    },
  },
  "3 month": {
    systemSpeed: { averageFillTimeHours: 3.5, selfServiceRate: 81, whatsappResponseRate: 83 },
    pointsVelocity: [{ label: "March", spent: 300, earned: 250 }, { label: "April", spent: 450, earned: 400 }],
    motivationCorrelation: [{ points: 10, hours: 5.4 }, { points: 15, hours: 4.0 }],
    topPerformers: FULL_TOP_PERFORMERS,
    teamOverview: { totalEmployees: 15, avgShiftFill: 91, shiftSwaps: 210, autoFilled: 145, sickLeaves: 14, totalHours: 2100, overtimeHours: 28.1 },
    shiftPopularity: {
      chartData: [{ name: "Morning", value: 42, color: "#ffb703" }, { name: "Afternoon", value: 33, color: "#3b82f6" }, { name: "Evening", value: 25, color: "#8b5cf6" }],
      mostPopularDay: "Saturday", avgFillRate: 88
    },
    staffHealth: { underworked: [], overworked: [] },
  },
  "6 month": {
    systemSpeed: { averageFillTimeHours: 4.0, selfServiceRate: 85, whatsappResponseRate: 88 },
    pointsVelocity: [{ label: "Jan", spent: 210, earned: 190 }, { label: "Feb", spent: 340, earned: 280 }],
    motivationCorrelation: [{ points: 10, hours: 6.1 }, { points: 15, hours: 4.6 }],
    topPerformers: FULL_TOP_PERFORMERS,
    teamOverview: { totalEmployees: 18, avgShiftFill: 93, shiftSwaps: 430, autoFilled: 310, sickLeaves: 22, totalHours: 4350, overtimeHours: 45.0 },
    shiftPopularity: {
      chartData: [{ name: "Morning", value: 46, color: "#ffb703" }, { name: "Afternoon", value: 34, color: "#3b82f6" }, { name: "Evening", value: 20, color: "#8b5cf6" }],
      mostPopularDay: "Friday", avgFillRate: 92
    },
    staffHealth: {
      underworked: [{ id: 3, name: "Emma Rodriguez", role: "Bartender", hoursDeviation: 18.5, avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150" }],
      overworked: [],
    },
  },
  "1 year": {
    systemSpeed: { averageFillTimeHours: 4.2, selfServiceRate: 87, whatsappResponseRate: 91 },
    pointsVelocity: [{ label: "Q1", spent: 200, earned: 180 }, { label: "Q2", spent: 400, earned: 350 }],
    motivationCorrelation: [{ points: 10, hours: 6.8 }, { points: 15, hours: 5.2 }],
    topPerformers: FULL_TOP_PERFORMERS,
    teamOverview: { totalEmployees: 24, avgShiftFill: 95, shiftSwaps: 920, autoFilled: 680, sickLeaves: 41, totalHours: 8900, overtimeHours: 92.4 },
    shiftPopularity: {
      chartData: [{ name: "Morning", value: 44, color: "#ffb703" }, { name: "Afternoon", value: 36, color: "#3b82f6" }, { name: "Evening", value: 20, color: "#8b5cf6" }],
      mostPopularDay: "Friday", avgFillRate: 94
    },
    staffHealth: { underworked: [], overworked: [] },
  },
};

export const fetchAnalyticsSummary = async (timeframe: string): Promise<AnalyticsSummary> => {
  await new Promise((resolve) => setTimeout(resolve, 800)); 
  return MOCK_DATABASE[timeframe] || MOCK_DATABASE["1 week"];
};