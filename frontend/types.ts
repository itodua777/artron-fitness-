
import React from 'react';

export enum View {
  DASHBOARD = 'DASHBOARD',
  USER_LIST = 'USER_LIST',
  ADD_USER = 'ADD_USER',
  PASSES = 'PASSES',
  PASS_LIBRARY = 'PASS_LIBRARY',
  EMPLOYEES = 'EMPLOYEES',
  MARKET = 'MARKET',
  ACCESSORIES = 'ACCESSORIES',
  MESSAGES = 'MESSAGES',
  PROMOTIONS = 'PROMOTIONS',
  ACCOUNTING = 'ACCOUNTING',
  STATISTICS = 'STATISTICS',
  SETTINGS = 'SETTINGS',
  CORPORATE = 'CORPORATE'
}

export interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  color: string;
}

export interface Package {
  id: string;
  name: string;
  description?: string;
  targetAge?: string;
  targetStatus?: string;
  durationMode: 'unlimited' | 'limited';
  durationDays?: number;
  timeMode: 'full' | 'custom';
  startTime?: string;
  endTime?: string;
  maxParticipants: number;
  trainer?: string;
  price: string;
  benefits: string[];
  promotionTarget?: 'web' | 'mobile' | 'both' | 'none';
}

export interface User {
  id: number;
  name: string;
  personalId: string;
  phone: string;
  email: string;
  address: string;
  status: 'Active' | 'Inactive' | 'Pending';
  activePackageId?: string;
  activePackageName?: string;
  packageExpiryDate?: string;
  joinedDate: string;
  avatar?: string;
  isCorporate?: boolean;
  companyName?: string;
  tenantId?: string;
  tenantName?: string;
  guardianType?: 'parent' | 'guardian';
  guardianFirstName?: string;
  guardianLastName?: string;
  guardianPersonalId?: string;
  guardianPhone?: string;
  guardianEmail?: string;
}

export interface MarketItem {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  category: string;
}

export interface Employee {
  id: number;
  fullName: string;
  position: string;
  department: string;
  phone: string;
  email: string;
  salary: string;
  status: 'Active' | 'OnLeave' | 'Terminated';
  joinDate: string;
  avatar?: string;
}

export interface EmployeeWorkSummary {
  employeeId: number;
  fullName: string;
  position: string;
  totalHours: number;
  workingDays: number;
  lateCount: number;
  overtimeHours: number;
}

export interface VisitLog {
  id: number;
  userId: number;
  userName: string;
  time: string;
  type: 'ENTRY' | 'EXIT';
  status: 'ALLOWED' | 'DENIED';
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: 'Package' | 'Visit' | 'Market' | 'Salary' | 'Utility' | 'Other';
  type: 'Income' | 'Expense';
  amount: number;
  paymentMethod: 'Cash' | 'Card' | 'Transfer';
}

export interface CorporateClient {
  id: string;
  name: string;
  identCode: string;
  discountPercentage: number;
  contactPerson: string;
  phone: string;
  employeeFile?: string;
  activeEmployees: number;
}
