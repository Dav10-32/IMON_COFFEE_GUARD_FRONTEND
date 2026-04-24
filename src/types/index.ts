export type TrapStatus = 'active' | 'inactive' | 'alert';
export type AlertLevel = 'low' | 'medium' | 'high';
export type ConnectivityStatus = 'online' | 'offline' | 'weak';

export interface Trap {
  id: string;
  name: string;
  location: string;
  status: TrapStatus;
  batteryLevel: number;
  lastDetection: string;
  connectivity: ConnectivityStatus;
  weeklyActivity: number[];
  lastAlerts: Alert[];
}

export interface Alert {
  id: string;
  trapId: string;
  trapName: string;
  date: string;
  time: string;
  level: AlertLevel;
  message: string;
  read: boolean;
}

export interface Farmer {
  name: string;
  farmName: string;
  municipality: string;
  department: string;
  hectares: number;
  cooperative: string | null;
  activeTraps: number;
  totalTraps: number;
}
