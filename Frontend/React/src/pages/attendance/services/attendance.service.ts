// // // // // /**
// // // // //  * ======================================================
// // // // //  * Attendance Module - Service Layer
// // // // //  * ======================================================
// // // // //  */

// // // // // import axios, { AxiosResponse } from "axios";

// // // // // import axiosInstance from "../../../services/axios/axiosInstance";

// // // // // import {
// // // // //   AttendanceRecord,
// // // // //   AttendanceSummary,
// // // // //   AttendanceOverviewItem,
// // // // //   AttendanceFilter,
// // // // //   AttendanceApiResponse,
// // // // //   AttendanceExportResponse,
// // // // //   DailyPunchState,
// // // // //   PunchActionRequest,
// // // // //   PunchActionResponse,
// // // // //   AttendanceAction,
// // // // //   AttendanceTimelineActivity,
// // // // // } from "../types/attendance.types";

// // // // // import { API_ENDPOINTS } from "../constants/attendance.constants";
// // // // // import { attendanceMockData } from "../components/mocks/attendance.mock";

// // // // // // =============================================================================
// // // // // // Configuration
// // // // // // =============================================================================

// // // // // /**
// // // // //  * false = use real HRMS API
// // // // //  * true  = use frontend mock data
// // // // //  */
// // // // // const USE_MOCK = false;

// // // // // // =============================================================================
// // // // // // Punch Action Endpoints
// // // // // // =============================================================================

// // // // // const ATTENDANCE_ACTION_ENDPOINTS: Record<
// // // // //   AttendanceAction,
// // // // //   string
// // // // // > = {
// // // // //   PUNCH_IN: "api/v1/attendance/punch-in",
// // // // //   BREAK_IN: "api/v1/attendance/break-in",
// // // // //   BREAK_OUT: "api/v1/attendance/break-out",
// // // // //   PUNCH_OUT: "api/v1/attendance/punch-out",
// // // // // };

// // // // // // =============================================================================
// // // // // // Service Interface
// // // // // // =============================================================================

// // // // // export interface IAttendanceService {
// // // // //   getAttendance(
// // // // //     filters?: AttendanceFilter,
// // // // //   ): Promise<AttendanceApiResponse>;

// // // // //   getAttendanceSummary(
// // // // //     filters?: AttendanceFilter,
// // // // //   ): Promise<AttendanceSummary>;

// // // // //   getAttendanceOverview(
// // // // //     year: number,
// // // // //     month: number,
// // // // //   ): Promise<AttendanceOverviewItem[]>;

// // // // //   exportAttendance(
// // // // //     filters?: AttendanceFilter,
// // // // //   ): Promise<AttendanceExportResponse>;

// // // // //   filterAttendance(
// // // // //     filters: AttendanceFilter,
// // // // //   ): Promise<AttendanceApiResponse>;

// // // // //   getTodayAttendance(): Promise<DailyPunchState>;

// // // // //   getTodayTimeline(): Promise<AttendanceTimelineActivity[]>;

// // // // //   executePunchAction(
// // // // //     request: PunchActionRequest,
// // // // //   ): Promise<PunchActionResponse>;
// // // // // }

// // // // // // =============================================================================
// // // // // // Mock Service
// // // // // // =============================================================================

// // // // // class MockAttendanceService implements IAttendanceService {
// // // // //   private delay(
// // // // //     milliseconds: number = 500,
// // // // //   ): Promise<void> {
// // // // //     return new Promise((resolve) =>
// // // // //       setTimeout(resolve, milliseconds),
// // // // //     );
// // // // //   }

// // // // //   private dailyState: DailyPunchState = {
// // // // //     id: null,
// // // // //     employeeId: "CURRENT_USER",
// // // // //     attendanceDate: new Date()
// // // // //       .toISOString()
// // // // //       .split("T")[0],

// // // // //     punchIn: null,
// // // // //     punchOut: null,

// // // // //     breakIn: null,
// // // // //     breakOut: null,

// // // // //     punchState: "NOT_PUNCHED_IN",

// // // // //     isPunchedIn: false,
// // // // //     isOnBreak: false,
// // // // //     isPunchedOut: false,

// // // // //     workingMinutes: 0,
// // // // //     breakMinutes: 0,

// // // // //     punchInLocation: null,
// // // // //     punchOutLocation: null,

// // // // //     lastAction: null,
// // // // //     lastActionAt: null,
// // // // //   };

// // // // //   // ===========================================================================
// // // // //   // Attendance History
// // // // //   // ===========================================================================

// // // // //   async getAttendance(
// // // // //     filters?: AttendanceFilter,
// // // // //   ): Promise<AttendanceApiResponse> {
// // // // //     await this.delay(600);

// // // // //     let records: AttendanceRecord[] = [
// // // // //       ...attendanceMockData.records,
// // // // //     ];

// // // // //     if (filters) {
// // // // //       if (filters.selectedDate) {
// // // // //         records = records.filter(
// // // // //           (record) =>
// // // // //             record.date === filters.selectedDate,
// // // // //         );
// // // // //       }

// // // // //       if (filters.startDate) {
// // // // //         records = records.filter(
// // // // //           (record) =>
// // // // //             record.date >= filters.startDate!,
// // // // //         );
// // // // //       }

// // // // //       if (filters.endDate) {
// // // // //         records = records.filter(
// // // // //           (record) =>
// // // // //             record.date <= filters.endDate!,
// // // // //         );
// // // // //       }

// // // // //       if (filters.status) {
// // // // //         records = records.filter(
// // // // //           (record) =>
// // // // //             record.status === filters.status,
// // // // //         );
// // // // //       }

// // // // //       if (filters.searchTerm) {
// // // // //         const search =
// // // // //           filters.searchTerm
// // // // //             .trim()
// // // // //             .toLowerCase();

// // // // //         records = records.filter(
// // // // //           (record) =>
// // // // //             record.employeeName
// // // // //               ?.toLowerCase()
// // // // //               .includes(search) ||
// // // // //             record.id
// // // // //               .toLowerCase()
// // // // //               .includes(search),
// // // // //         );
// // // // //       }
// // // // //     }

// // // // //     return {
// // // // //       records,

// // // // //       summary: this.calculateSummary(
// // // // //         records,
// // // // //         filters,
// // // // //       ),

// // // // //       overview: attendanceMockData.overview,

// // // // //       totalCount: records.length,

// // // // //       page: 1,

// // // // //       pageSize: 10,
// // // // //     };
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Summary
// // // // //   // ===========================================================================

// // // // //   async getAttendanceSummary(
// // // // //     filters?: AttendanceFilter,
// // // // //   ): Promise<AttendanceSummary> {
// // // // //     await this.delay(400);

// // // // //     const response =
// // // // //       await this.getAttendance(filters);

// // // // //     return response.summary;
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Overview
// // // // //   // ===========================================================================

// // // // //   async getAttendanceOverview(
// // // // //     year: number,
// // // // //     month: number,
// // // // //   ): Promise<AttendanceOverviewItem[]> {
// // // // //     await this.delay(300);

// // // // //     const datePrefix =
// // // // //       `${year}-${String(month).padStart(2, "0")}`;

// // // // //     return attendanceMockData.overview.filter(
// // // // //       (item) =>
// // // // //         item.date.startsWith(datePrefix),
// // // // //     );
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Export
// // // // //   // ===========================================================================

// // // // //   async exportAttendance(
// // // // //     _filters?: AttendanceFilter,
// // // // //   ): Promise<AttendanceExportResponse> {
// // // // //     await this.delay(800);

// // // // //     return {
// // // // //       downloadUrl:
// // // // //         "/mock/attendance-export.xlsx",

// // // // //       fileName: `attendance-${
// // // // //         new Date()
// // // // //           .toISOString()
// // // // //           .split("T")[0]
// // // // //       }.xlsx`,
// // // // //     };
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Filter
// // // // //   // ===========================================================================

// // // // //   async filterAttendance(
// // // // //     filters: AttendanceFilter,
// // // // //   ): Promise<AttendanceApiResponse> {
// // // // //     return this.getAttendance(filters);
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Today's Attendance
// // // // //   // ===========================================================================

// // // // //   async getTodayAttendance(): Promise<DailyPunchState> {
// // // // //     await this.delay(250);

// // // // //     return {
// // // // //       ...this.dailyState,
// // // // //     };
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Today's Activity Timeline
// // // // //   // ===========================================================================

// // // // //   async getTodayTimeline(): Promise<
// // // // //     AttendanceTimelineActivity[]
// // // // //   > {
// // // // //     await this.delay(250);

// // // // //     const activities: AttendanceTimelineActivity[] =
// // // // //       [];

// // // // //     if (this.dailyState.punchIn) {
// // // // //       activities.push({
// // // // //         id: "mock-punch-in",
// // // // //         activity: "PI",
// // // // //         log: this.dailyState.punchIn,
// // // // //         address:
// // // // //           this.dailyState.punchInLocation
// // // // //             ?.address ?? null,
// // // // //       });
// // // // //     }

// // // // //     if (this.dailyState.breakIn) {
// // // // //       activities.push({
// // // // //         id: "mock-break-in",
// // // // //         activity: "BI",
// // // // //         log: this.dailyState.breakIn,
// // // // //         address: null,
// // // // //       });
// // // // //     }

// // // // //     if (this.dailyState.breakOut) {
// // // // //       activities.push({
// // // // //         id: "mock-break-out",
// // // // //         activity: "BO",
// // // // //         log: this.dailyState.breakOut,
// // // // //         address: null,
// // // // //       });
// // // // //     }

// // // // //     if (this.dailyState.punchOut) {
// // // // //       activities.push({
// // // // //         id: "mock-punch-out",
// // // // //         activity: "PO",
// // // // //         log: this.dailyState.punchOut,
// // // // //         address:
// // // // //           this.dailyState.punchOutLocation
// // // // //             ?.address ?? null,
// // // // //       });
// // // // //     }

// // // // //     activities.sort(
// // // // //       (a, b) =>
// // // // //         new Date(a.log).getTime() -
// // // // //         new Date(b.log).getTime(),
// // // // //     );

// // // // //     return activities;
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Punch Action
// // // // //   // ===========================================================================

// // // // //  // ===========================================================================
// // // // // // Punch Action
// // // // // // ===========================================================================

// // // // // async executePunchAction(
// // // // //   request: PunchActionRequest,
// // // // // ): Promise<PunchActionResponse> {
// // // // //   await this.delay(300);

// // // // //   const now = new Date();
// // // // //   const timestamp = now.toISOString();

// // // // //   switch (request.action) {
// // // // //     case "PUNCH_IN":
// // // // //       if (this.dailyState.isPunchedIn) {
// // // // //         return {
// // // // //           success: false,
// // // // //           message: "Already punched in.",
// // // // //           action: request.action,
// // // // //           actionStatus: "ALREADY_COMPLETED",
// // // // //           attendance: { ...this.dailyState },
// // // // //           timestamp,
// // // // //         };
// // // // //       }

// // // // //       this.dailyState = {
// // // // //         ...this.dailyState,
// // // // //         punchIn: timestamp,
// // // // //         punchOut: null,
// // // // //         breakIn: null,
// // // // //         breakOut: null,
// // // // //         punchState: "WORKING",
// // // // //         isPunchedIn: true,
// // // // //         isOnBreak: false,
// // // // //         isPunchedOut: false,
// // // // //         punchInLocation: request.latitude != null && request.longitude != null
// // // // //           ? {
// // // // //               latitude: request.latitude,
// // // // //               longitude: request.longitude,
// // // // //               accuracy: request.accuracy ?? 0,
// // // // //               address: request.address ?? null,
// // // // //             }
// // // // //           : null,
// // // // //         lastAction: "PUNCH_IN",
// // // // //         lastActionAt: timestamp,
// // // // //       };

// // // // //       return {
// // // // //         success: true,
// // // // //         message: "Punch In successful.",
// // // // //         action: request.action,
// // // // //         actionStatus: "SUCCESS",
// // // // //         attendance: { ...this.dailyState },
// // // // //         timestamp,
// // // // //       };

// // // // //     case "BREAK_IN":
// // // // //       if (!this.dailyState.isPunchedIn) {
// // // // //         return {
// // // // //           success: false,
// // // // //           message: "Please Punch In first.",
// // // // //           action: request.action,
// // // // //           actionStatus: "INVALID_STATE",
// // // // //           attendance: { ...this.dailyState },
// // // // //           timestamp,
// // // // //         };
// // // // //       }

// // // // //       if (this.dailyState.isOnBreak) {
// // // // //         return {
// // // // //           success: false,
// // // // //           message: "Already on break.",
// // // // //           action: request.action,
// // // // //           actionStatus: "ALREADY_COMPLETED",
// // // // //           attendance: { ...this.dailyState },
// // // // //           timestamp,
// // // // //         };
// // // // //       }

// // // // //       this.dailyState = {
// // // // //         ...this.dailyState,
// // // // //         breakIn: timestamp,
// // // // //         breakOut: null,
// // // // //         punchState: "ON_BREAK",
// // // // //         isOnBreak: true,
// // // // //         lastAction: "BREAK_IN",
// // // // //         lastActionAt: timestamp,
// // // // //       };

// // // // //       return {
// // // // //         success: true,
// // // // //         message: "Break In successful.",
// // // // //         action: request.action,
// // // // //         actionStatus: "SUCCESS",
// // // // //         attendance: { ...this.dailyState },
// // // // //         timestamp,
// // // // //       };

// // // // //     case "BREAK_OUT":
// // // // //       if (!this.dailyState.isPunchedIn) {
// // // // //         return {
// // // // //           success: false,
// // // // //           message: "Please Punch In first.",
// // // // //           action: request.action,
// // // // //           actionStatus: "INVALID_STATE",
// // // // //           attendance: { ...this.dailyState },
// // // // //           timestamp,
// // // // //         };
// // // // //       }

// // // // //       if (!this.dailyState.isOnBreak) {
// // // // //         return {
// // // // //           success: false,
// // // // //           message: "You are not currently on break.",
// // // // //           action: request.action,
// // // // //           actionStatus: "INVALID_STATE",
// // // // //           attendance: { ...this.dailyState },
// // // // //           timestamp,
// // // // //         };
// // // // //       }

// // // // //       this.dailyState = {
// // // // //         ...this.dailyState,
// // // // //         breakOut: timestamp,
// // // // //         punchState: "WORKING",
// // // // //         isOnBreak: false,
// // // // //         lastAction: "BREAK_OUT",
// // // // //         lastActionAt: timestamp,
// // // // //       };

// // // // //       return {
// // // // //         success: true,
// // // // //         message: "Break Out successful.",
// // // // //         action: request.action,
// // // // //         actionStatus: "SUCCESS",
// // // // //         attendance: { ...this.dailyState },
// // // // //         timestamp,
// // // // //       };

// // // // //     case "PUNCH_OUT":
// // // // //       if (!this.dailyState.isPunchedIn) {
// // // // //         return {
// // // // //           success: false,
// // // // //           message: "Please Punch In first.",
// // // // //           action: request.action,
// // // // //           actionStatus: "INVALID_STATE",
// // // // //           attendance: { ...this.dailyState },
// // // // //           timestamp,
// // // // //         };
// // // // //       }

// // // // //       if (this.dailyState.isOnBreak) {
// // // // //         return {
// // // // //           success: false,
// // // // //           message: "Please Break Out before Punch Out.",
// // // // //           action: request.action,
// // // // //           actionStatus: "INVALID_STATE",
// // // // //           attendance: { ...this.dailyState },
// // // // //           timestamp,
// // // // //         };
// // // // //       }

// // // // //       this.dailyState = {
// // // // //         ...this.dailyState,
// // // // //         punchOut: timestamp,
// // // // //         punchState: "PUNCHED_OUT",
// // // // //         isPunchedIn: false,
// // // // //         isOnBreak: false,
// // // // //         isPunchedOut: true,
// // // // //         punchOutLocation:
// // // // //           request.latitude != null && request.longitude != null
// // // // //             ? {
// // // // //                 latitude: request.latitude,
// // // // //                 longitude: request.longitude,
// // // // //                 accuracy: request.accuracy ?? 0,
// // // // //                 address: request.address ?? null,
// // // // //               }
// // // // //             : null,
// // // // //         lastAction: "PUNCH_OUT",
// // // // //         lastActionAt: timestamp,
// // // // //       };

// // // // //       return {
// // // // //         success: true,
// // // // //         message: "Punch Out successful.",
// // // // //         action: request.action,
// // // // //         actionStatus: "SUCCESS",
// // // // //         attendance: { ...this.dailyState },
// // // // //         timestamp,
// // // // //       };

// // // // //     default:
// // // // //       return {
// // // // //         success: false,
// // // // //         message: `Unsupported attendance action: ${request.action}`,
// // // // //         action: request.action,
// // // // //         actionStatus: "FAILED",
// // // // //         attendance: { ...this.dailyState },
// // // // //         timestamp,
// // // // //       };
// // // // //   }
// // // // // }
// // // // //   // ===========================================================================
// // // // //   // Summary Calculation
// // // // //   // ===========================================================================

// // // // //   private calculateSummary(
// // // // //     records: AttendanceRecord[],
// // // // //     filters?: AttendanceFilter,
// // // // //   ): AttendanceSummary {
// // // // //     const total = records.length;

// // // // //     const present = records.filter(
// // // // //       (record) =>
// // // // //         record.status === "Present",
// // // // //     ).length;

// // // // //     const absent = records.filter(
// // // // //       (record) =>
// // // // //         record.status === "Absent",
// // // // //     ).length;

// // // // //     const late = records.filter(
// // // // //       (record) =>
// // // // //         record.status === "Late",
// // // // //     ).length;

// // // // //     const weeklyOff = records.filter(
// // // // //       (record) =>
// // // // //         record.status === "WeeklyOff",
// // // // //     ).length;

// // // // //     const holiday = records.filter(
// // // // //       (record) =>
// // // // //         record.status === "Holiday",
// // // // //     ).length;

// // // // //     const workingDays = Math.max(
// // // // //       total - weeklyOff - holiday,
// // // // //       0,
// // // // //     );

// // // // //     const presentPercentage =
// // // // //       workingDays > 0
// // // // //         ? Math.round(
// // // // //             (present / workingDays) * 100,
// // // // //           )
// // // // //         : 0;

// // // // //     const absentPercentage =
// // // // //       workingDays > 0
// // // // //         ? Math.round(
// // // // //             (absent / workingDays) * 100,
// // // // //           )
// // // // //         : 0;

// // // // //     const latePercentage =
// // // // //       workingDays > 0
// // // // //         ? Math.round(
// // // // //             (late / workingDays) * 100,
// // // // //           )
// // // // //         : 0;

// // // // //     const workRecords = records.filter(
// // // // //       (record) =>
// // // // //         record.status === "Present" ||
// // // // //         record.status === "Late",
// // // // //     );

// // // // //     const totalHours =
// // // // //       workRecords.reduce(
// // // // //         (sum, record) =>
// // // // //           sum + record.workingHours,
// // // // //         0,
// // // // //       );

// // // // //     const averageHours =
// // // // //       workRecords.length > 0
// // // // //         ? totalHours / workRecords.length
// // // // //         : 0;

// // // // //     const hours =
// // // // //       Math.floor(averageHours);

// // // // //     const minutes =
// // // // //       Math.round(
// // // // //         (averageHours - hours) * 60,
// // // // //       );

// // // // //     const averageWorkingHours =
// // // // //       `${String(hours).padStart(2, "0")}:${String(
// // // // //         minutes,
// // // // //       ).padStart(2, "0")}`;

// // // // //     let totalDays = total;

// // // // //     if (
// // // // //       filters?.startDate &&
// // // // //       filters?.endDate
// // // // //     ) {
// // // // //       const start = new Date(
// // // // //         filters.startDate,
// // // // //       );

// // // // //       const end = new Date(
// // // // //         filters.endDate,
// // // // //       );

// // // // //       const diffTime =
// // // // //         Math.abs(
// // // // //           end.getTime() -
// // // // //             start.getTime(),
// // // // //         );

// // // // //       totalDays =
// // // // //         Math.ceil(
// // // // //           diffTime /
// // // // //             (1000 * 60 * 60 * 24),
// // // // //         ) + 1;
// // // // //     }

// // // // //     return {
// // // // //       totalDays,

// // // // //       presentDays: present,
// // // // //       presentPercentage,

// // // // //       absentDays: absent,
// // // // //       absentPercentage,

// // // // //       lateDays: late,
// // // // //       latePercentage,

// // // // //       averageWorkingHours,
// // // // //     };
// // // // //   }
// // // // // }

// // // // // // =============================================================================
// // // // // // Real API Service
// // // // // // =============================================================================

// // // // // class ApiAttendanceService
// // // // //   implements IAttendanceService {

// // // // //   // ===========================================================================
// // // // //   // Query Parameters
// // // // //   // ===========================================================================

// // // // //   private buildQueryParams(
// // // // //     filters?: AttendanceFilter,
// // // // //   ): URLSearchParams {
// // // // //     const params =
// // // // //       new URLSearchParams();

// // // // //     if (!filters) {
// // // // //       return params;
// // // // //     }

// // // // //     if (filters.startDate) {
// // // // //       params.append(
// // // // //         "start_date",
// // // // //         filters.startDate,
// // // // //       );
// // // // //     }

// // // // //     if (filters.endDate) {
// // // // //       params.append(
// // // // //         "end_date",
// // // // //         filters.endDate,
// // // // //       );
// // // // //     }

// // // // //     if (filters.selectedDate) {
// // // // //       params.append(
// // // // //         "date",
// // // // //         filters.selectedDate,
// // // // //       );
// // // // //     }

// // // // //     if (filters.status) {
// // // // //       params.append(
// // // // //         "status",
// // // // //         filters.status,
// // // // //       );
// // // // //     }

// // // // //     if (filters.searchTerm) {
// // // // //       params.append(
// // // // //         "search",
// // // // //         filters.searchTerm,
// // // // //       );
// // // // //     }

// // // // //     return params;
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Get Today's Local Date
// // // // //   // ===========================================================================

// // // // //   /**
// // // // //    * IMPORTANT:
// // // // //    *
// // // // //    * Do not use toISOString() for today's date here.
// // // // //    *
// // // // //    * toISOString() uses UTC and can return the previous/next
// // // // //    * date around midnight for an Indian user.
// // // // //    *
// // // // //    * The HRMS attendance date is based on local/IST date.
// // // // //    */
// // // // //   private getTodayDate(): string {
// // // // //     const now = new Date();

// // // // //     const year =
// // // // //       now.getFullYear();

// // // // //     const month =
// // // // //       String(
// // // // //         now.getMonth() + 1,
// // // // //       ).padStart(2, "0");

// // // // //     const day =
// // // // //       String(
// // // // //         now.getDate(),
// // // // //       ).padStart(2, "0");

// // // // //     return `${year}-${month}-${day}`;
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Response Handler
// // // // //   // ===========================================================================

// // // // //   private handleResponse<T>(
// // // // //     response: AxiosResponse,
// // // // //   ): T {
// // // // //     const responseData =
// // // // //       response.data;

// // // // //     if (
// // // // //       responseData &&
// // // // //       typeof responseData === "object" &&
// // // // //       "data" in responseData &&
// // // // //       responseData.data !== undefined
// // // // //     ) {
// // // // //       return responseData.data as T;
// // // // //     }

// // // // //     return responseData as T;
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Empty Daily State
// // // // //   // ===========================================================================

// // // // //   private createEmptyDailyState(
// // // // //     date: string,
// // // // //   ): DailyPunchState {
// // // // //     return {
// // // // //       id: null,

// // // // //       employeeId: "",

// // // // //       attendanceDate: date,

// // // // //       punchIn: null,
// // // // //       punchOut: null,

// // // // //       breakIn: null,
// // // // //       breakOut: null,

// // // // //       punchState:
// // // // //         "NOT_PUNCHED_IN",

// // // // //       isPunchedIn: false,
// // // // //       isOnBreak: false,
// // // // //       isPunchedOut: false,

// // // // //       workingMinutes: 0,
// // // // //       breakMinutes: 0,

// // // // //       punchInLocation: null,
// // // // //       punchOutLocation: null,

// // // // //       lastAction: null,
// // // // //       lastActionAt: null,
// // // // //     };
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Backend Attendance -> Frontend Daily Punch State
// // // // //   // ===========================================================================

// // // // //   private mapBackendAttendanceToDailyPunchState(
// // // // //     attendance: any,
// // // // //   ): DailyPunchState {
// // // // //     const attendanceDate =
// // // // //       attendance?.attendance_date ??
// // // // //       attendance?.attendanceDate ??
// // // // //       attendance?.date ??
// // // // //       this.getTodayDate();

// // // // //     const punchIn =
// // // // //       attendance?.punch_in ??
// // // // //       attendance?.punchIn ??
// // // // //       null;

// // // // //     const punchOut =
// // // // //       attendance?.punch_out ??
// // // // //       attendance?.punchOut ??
// // // // //       null;

// // // // //     const breakIn =
// // // // //       attendance?.break_in ??
// // // // //       attendance?.breakIn ??
// // // // //       attendance?.last_break_in ??
// // // // //       null;

// // // // //     const breakOut =
// // // // //       attendance?.break_out ??
// // // // //       attendance?.breakOut ??
// // // // //       attendance?.last_break_out ??
// // // // //       null;

// // // // //     const punchInLocation =
// // // // //       attendance?.punch_in_location ??
// // // // //       attendance?.punchInLocation ??
// // // // //       null;

// // // // //     const punchOutLocation =
// // // // //       attendance?.punch_out_location ??
// // // // //       attendance?.punchOutLocation ??
// // // // //       null;

// // // // //     const isPunchedIn =
// // // // //       Boolean(punchIn);

// // // // //     const isPunchedOut =
// // // // //       Boolean(punchOut);

// // // // //     const isOnBreak =
// // // // //       Boolean(breakIn) &&
// // // // //       !Boolean(breakOut);

// // // // //     let punchState:
// // // // //       DailyPunchState["punchState"];

// // // // //     if (isPunchedOut) {
// // // // //       punchState =
// // // // //         "PUNCHED_OUT";
// // // // //     } else if (isOnBreak) {
// // // // //       punchState =
// // // // //         "ON_BREAK";
// // // // //     } else if (isPunchedIn) {
// // // // //       punchState =
// // // // //         "WORKING";
// // // // //     } else {
// // // // //       punchState =
// // // // //         "NOT_PUNCHED_IN";
// // // // //     }

// // // // //     let lastAction:
// // // // //       DailyPunchState["lastAction"];

// // // // //     if (isPunchedOut) {
// // // // //       lastAction =
// // // // //         "PUNCH_OUT";
// // // // //     } else if (breakOut) {
// // // // //       lastAction =
// // // // //         "BREAK_OUT";
// // // // //     } else if (breakIn) {
// // // // //       lastAction =
// // // // //         "BREAK_IN";
// // // // //     } else if (punchIn) {
// // // // //       lastAction =
// // // // //         "PUNCH_IN";
// // // // //     } else {
// // // // //       lastAction = null;
// // // // //     }

// // // // //     return {
// // // // //       id:
// // // // //         attendance?.id != null
// // // // //           ? String(attendance.id)
// // // // //           : null,

// // // // //       employeeId:
// // // // //         attendance?.employee_id ??
// // // // //         attendance?.employeeId ??
// // // // //         attendance?.emp_id ??
// // // // //         "",

// // // // //       attendanceDate,

// // // // //       punchIn,
// // // // //       punchOut,

// // // // //       breakIn,
// // // // //       breakOut,

// // // // //       punchState,

// // // // //       isPunchedIn,
// // // // //       isOnBreak,
// // // // //       isPunchedOut,

// // // // //       workingMinutes: Number(
// // // // //         attendance?.working_minutes ??
// // // // //           attendance?.workingMinutes ??
// // // // //           attendance?.working_hrs ??
// // // // //           0,
// // // // //       ),

// // // // //       breakMinutes: Number(
// // // // //         attendance?.break_minutes ??
// // // // //           attendance?.breakMinutes ??
// // // // //           attendance?.total_break ??
// // // // //           0,
// // // // //       ),

// // // // //       punchInLocation,
// // // // //       punchOutLocation,

// // // // //       lastAction,

// // // // //       lastActionAt:
// // // // //         attendance?.last_action_at ??
// // // // //         attendance?.lastActionAt ??
// // // // //         null,
// // // // //     };
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Normalize Attendance History Response
// // // // //   // ===========================================================================

// // // // //   private normalizeAttendanceResponse(
// // // // //     response: any,
// // // // //   ): AttendanceApiResponse {
// // // // //     const data =
// // // // //       response?.data !== undefined
// // // // //         ? response.data
// // // // //         : response;

// // // // //     if (Array.isArray(data)) {
// // // // //       return {
// // // // //         records:
// // // // //           data as AttendanceRecord[],

// // // // //         summary:
// // // // //           {} as AttendanceSummary,

// // // // //         overview: [],

// // // // //         totalCount:
// // // // //           data.length,

// // // // //         page: 1,

// // // // //         pageSize:
// // // // //           data.length,
// // // // //       };
// // // // //     }

// // // // //     return {
// // // // //       records:
// // // // //         Array.isArray(data?.records)
// // // // //           ? data.records
// // // // //           : [],

// // // // //       summary:
// // // // //         data?.summary ??
// // // // //         ({} as AttendanceSummary),

// // // // //       overview:
// // // // //         Array.isArray(data?.overview)
// // // // //           ? data.overview
// // // // //           : [],

// // // // //       totalCount: Number(
// // // // //         data?.totalCount ??
// // // // //           data?.total_count ??
// // // // //           data?.records?.length ??
// // // // //           0,
// // // // //       ),

// // // // //       page: Number(
// // // // //         data?.page ?? 1,
// // // // //       ),

// // // // //       pageSize: Number(
// // // // //         data?.pageSize ??
// // // // //           data?.page_size ??
// // // // //           10,
// // // // //       ),
// // // // //     };
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Error Handler
// // // // //   // ===========================================================================

// // // // //   private handleError(
// // // // //     error: unknown,
// // // // //   ): never {
// // // // //     if (axios.isAxiosError(error)) {
// // // // //       const responseData =
// // // // //         error.response?.data;

// // // // //       let message =
// // // // //         error.message ||
// // // // //         "Attendance API request failed.";

// // // // //       if (
// // // // //         responseData &&
// // // // //         typeof responseData === "object"
// // // // //       ) {
// // // // //         if (
// // // // //           "message" in responseData &&
// // // // //           typeof responseData.message ===
// // // // //             "string"
// // // // //         ) {
// // // // //           message =
// // // // //             responseData.message;
// // // // //         } else if (
// // // // //           "detail" in responseData &&
// // // // //           typeof responseData.detail ===
// // // // //             "string"
// // // // //         ) {
// // // // //           message =
// // // // //             responseData.detail;
// // // // //         }
// // // // //       }

// // // // //       throw new Error(
// // // // //         `Attendance API Error: ${message}`,
// // // // //       );
// // // // //     }

// // // // //     if (error instanceof Error) {
// // // // //       throw error;
// // // // //     }

// // // // //     throw new Error(
// // // // //       "An unexpected attendance error occurred.",
// // // // //     );
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Attendance History
// // // // //   // ===========================================================================

// // // // //   async getAttendance(
// // // // //     filters?: AttendanceFilter,
// // // // //   ): Promise<AttendanceApiResponse> {
// // // // //     try {
// // // // //       const params =
// // // // //         this.buildQueryParams(filters);

// // // // //       const query =
// // // // //         params.toString();

// // // // //       const url =
// // // // //         query.length > 0
// // // // //           ? `${API_ENDPOINTS.attendance}?${query}`
// // // // //           : API_ENDPOINTS.attendance;

// // // // //       const response =
// // // // //         await axiosInstance.get(url);

// // // // //       return this.normalizeAttendanceResponse(
// // // // //         response.data,
// // // // //       );
// // // // //     } catch (error) {
// // // // //       return this.handleError(error);
// // // // //     }
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Summary
// // // // //   // ===========================================================================

// // // // //   async getAttendanceSummary(
// // // // //     filters?: AttendanceFilter,
// // // // //   ): Promise<AttendanceSummary> {
// // // // //     try {
// // // // //       const params =
// // // // //         this.buildQueryParams(filters);

// // // // //       const query =
// // // // //         params.toString();

// // // // //       const url =
// // // // //         query.length > 0
// // // // //           ? `${API_ENDPOINTS.summary}?${query}`
// // // // //           : API_ENDPOINTS.summary;

// // // // //       const response =
// // // // //         await axiosInstance.get<AttendanceSummary>(
// // // // //           url,
// // // // //         );

// // // // //       return this.handleResponse<AttendanceSummary>(
// // // // //         response,
// // // // //       );
// // // // //     } catch (error) {
// // // // //       return this.handleError(error);
// // // // //     }
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Monthly Overview
// // // // //   // ===========================================================================

// // // // //   async getAttendanceOverview(
// // // // //     year: number,
// // // // //     month: number,
// // // // //   ): Promise<AttendanceOverviewItem[]> {
// // // // //     try {
// // // // //       const params =
// // // // //         new URLSearchParams();

// // // // //       params.append(
// // // // //         "year",
// // // // //         year.toString(),
// // // // //       );

// // // // //       params.append(
// // // // //         "month",
// // // // //         month.toString(),
// // // // //       );

// // // // //       const response =
// // // // //         await axiosInstance.get<
// // // // //           AttendanceOverviewItem[]
// // // // //         >(
// // // // //           `${API_ENDPOINTS.overview}?${params.toString()}`,
// // // // //         );

// // // // //       return this.handleResponse<
// // // // //         AttendanceOverviewItem[]
// // // // //       >(response);
// // // // //     } catch (error) {
// // // // //       return this.handleError(error);
// // // // //     }
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Export
// // // // //   // ===========================================================================

// // // // //   async exportAttendance(
// // // // //     filters?: AttendanceFilter,
// // // // //   ): Promise<AttendanceExportResponse> {
// // // // //     try {
// // // // //       const params =
// // // // //         this.buildQueryParams(filters);

// // // // //       const query =
// // // // //         params.toString();

// // // // //       const url =
// // // // //         query.length > 0
// // // // //           ? `${API_ENDPOINTS.export}?${query}`
// // // // //           : API_ENDPOINTS.export;

// // // // //       const response =
// // // // //         await axiosInstance.get<Blob>(
// // // // //           url,
// // // // //           {
// // // // //             responseType: "blob",
// // // // //           },
// // // // //         );

// // // // //       const blob =
// // // // //         response.data;

// // // // //       const downloadUrl =
// // // // //         URL.createObjectURL(blob);

// // // // //       const fileName =
// // // // //         `attendance-${this.getTodayDate()}.xlsx`;

// // // // //       return {
// // // // //         downloadUrl,
// // // // //         fileName,
// // // // //       };
// // // // //     } catch (error) {
// // // // //       return this.handleError(error);
// // // // //     }
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Filter
// // // // //   // ===========================================================================

// // // // //   async filterAttendance(
// // // // //     filters: AttendanceFilter,
// // // // //   ): Promise<AttendanceApiResponse> {
// // // // //     return this.getAttendance(filters);
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Today's Attendance
// // // // //   // ===========================================================================

// // // // //   async getTodayAttendance(): Promise<DailyPunchState> {
// // // // //     try {
// // // // //       /**
// // // // //        * Today's date is generated using the browser's
// // // // //        * local date, not UTC.
// // // // //        */
// // // // //       const today =
// // // // //         this.getTodayDate();

// // // // //       /**
// // // // //        * Get today's attendance from backend.
// // // // //        *
// // // // //        * Backend identifies the logged-in employee
// // // // //        * using JWT.
// // // // //        */
// // // // //       const response =
// // // // //         await this.getAttendance({
// // // // //           selectedDate: today,
// // // // //         });

// // // // //       const records =
// // // // //         Array.isArray(
// // // // //           response?.records,
// // // // //         )
// // // // //           ? response.records
// // // // //           : [];

// // // // //       /**
// // // // //        * Find today's record.
// // // // //        */
// // // // //       const todayRecord =
// // // // //         records.find(
// // // // //           (record: any) => {
// // // // //             const recordDate =
// // // // //               record?.date ??
// // // // //               record?.attendance_date ??
// // // // //               record?.attendanceDate;

// // // // //             if (!recordDate) {
// // // // //               return false;
// // // // //             }

// // // // //             return (
// // // // //               String(recordDate)
// // // // //                 .substring(0, 10) ===
// // // // //               today
// // // // //             );
// // // // //           },
// // // // //         );

// // // // //       /**
// // // // //        * No record means the employee
// // // // //        * has not punched in today.
// // // // //        */
// // // // //       if (!todayRecord) {
// // // // //         return this.createEmptyDailyState(
// // // // //           today,
// // // // //         );
// // // // //       }

// // // // //       /**
// // // // //        * Convert backend state into frontend state.
// // // // //        */
// // // // //       return this.mapBackendAttendanceToDailyPunchState(
// // // // //         todayRecord,
// // // // //       );
// // // // //     } catch (error) {
// // // // //       return this.handleError(error);
// // // // //     }
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Today's Activity Timeline
// // // // //   // ===========================================================================

// // // // //   async getTodayTimeline(): Promise<
// // // // //     AttendanceTimelineActivity[]
// // // // //   > {
// // // // //     try {
// // // // //       const today =
// // // // //         this.getTodayDate();

// // // // //       /**
// // // // //        * Use the existing attendance API.
// // // // //        *
// // // // //        * No new backend timeline API is required.
// // // // //        */
// // // // //       const response =
// // // // //         await axiosInstance.get(
// // // // //           `${API_ENDPOINTS.attendance}?date=${today}`,
// // // // //         );

// // // // //       const responseData =
// // // // //         response.data;

// // // // //       /**
// // // // //        * Backend may return:
// // // // //        *
// // // // //        * 1. A single attendance object
// // // // //        * 2. An array
// // // // //        * 3. { records: [...] }
// // // // //        * 4. { data: [...] }
// // // // //        * 5. { data: { records: [...] } }
// // // // //        */
// // // // //       let records: any[] = [];

// // // // //       if (Array.isArray(responseData)) {
// // // // //         records = responseData;
// // // // //       } else if (
// // // // //         responseData &&
// // // // //         Array.isArray(
// // // // //           responseData.records,
// // // // //         )
// // // // //       ) {
// // // // //         records =
// // // // //           responseData.records;
// // // // //       } else if (
// // // // //         responseData &&
// // // // //         responseData.data &&
// // // // //         Array.isArray(
// // // // //           responseData.data,
// // // // //         )
// // // // //       ) {
// // // // //         records =
// // // // //           responseData.data;
// // // // //       } else if (
// // // // //         responseData &&
// // // // //         responseData.data &&
// // // // //         Array.isArray(
// // // // //           responseData.data.records,
// // // // //         )
// // // // //       ) {
// // // // //         records =
// // // // //           responseData.data.records;
// // // // //       } else if (
// // // // //         responseData &&
// // // // //         typeof responseData ===
// // // // //           "object" &&
// // // // //         responseData.id != null
// // // // //       ) {
// // // // //         records = [
// // // // //           responseData,
// // // // //         ];
// // // // //       } else if (
// // // // //         responseData &&
// // // // //         responseData.data &&
// // // // //         typeof responseData.data ===
// // // // //           "object" &&
// // // // //         responseData.data.id != null
// // // // //       ) {
// // // // //         records = [
// // // // //           responseData.data,
// // // // //         ];
// // // // //       }

// // // // //       /**
// // // // //        * Find today's attendance record.
// // // // //        */
// // // // //       const todayRecord =
// // // // //         records.find(
// // // // //           (record: any) => {
// // // // //             const recordDate =
// // // // //               record?.date ??
// // // // //               record?.attendance_date ??
// // // // //               record?.attendanceDate;

// // // // //             return (
// // // // //               recordDate &&
// // // // //               String(recordDate)
// // // // //                 .substring(0, 10) ===
// // // // //                 today
// // // // //             );
// // // // //           },
// // // // //         );

// // // // //       if (!todayRecord) {
// // // // //         return [];
// // // // //       }

// // // // //       const activities: AttendanceTimelineActivity[] =
// // // // //         [];

// // // // //       // -----------------------------------------------------------------------
// // // // //       // Punch In
// // // // //       // -----------------------------------------------------------------------

// // // // //       if (todayRecord.punch_in) {
// // // // //         activities.push({
// // // // //           id: `${todayRecord.id}-PI`,
// // // // //           activity: "PI",
// // // // //           log: todayRecord.punch_in,
// // // // //           address:
// // // // //             todayRecord.punch_in_address ??
// // // // //             null,
// // // // //         });
// // // // //       }

// // // // //       // -----------------------------------------------------------------------
// // // // //       // Break In
// // // // //       // -----------------------------------------------------------------------

// // // // //       if (todayRecord.last_break_in) {
// // // // //         activities.push({
// // // // //           id: `${todayRecord.id}-BI`,
// // // // //           activity: "BI",
// // // // //           log: todayRecord.last_break_in,
// // // // //           address: null,
// // // // //         });
// // // // //       }

// // // // //       // -----------------------------------------------------------------------
// // // // //       // Break Out
// // // // //       // -----------------------------------------------------------------------

// // // // //       if (todayRecord.last_break_out) {
// // // // //         activities.push({
// // // // //           id: `${todayRecord.id}-BO`,
// // // // //           activity: "BO",
// // // // //           log: todayRecord.last_break_out,
// // // // //           address: null,
// // // // //         });
// // // // //       }

// // // // //       // -----------------------------------------------------------------------
// // // // //       // Punch Out
// // // // //       // -----------------------------------------------------------------------

// // // // //       if (todayRecord.punch_out) {
// // // // //         activities.push({
// // // // //           id: `${todayRecord.id}-PO`,
// // // // //           activity: "PO",
// // // // //           log: todayRecord.punch_out,
// // // // //           address:
// // // // //             todayRecord.punch_out_address ??
// // // // //             null,
// // // // //         });
// // // // //       }

// // // // //       // -----------------------------------------------------------------------
// // // // //       // Always display activities chronologically.
// // // // //       // -----------------------------------------------------------------------

// // // // //       activities.sort(
// // // // //         (a, b) =>
// // // // //           new Date(a.log).getTime() -
// // // // //           new Date(b.log).getTime(),
// // // // //       );

// // // // //       return activities;
// // // // //     } catch (error) {
// // // // //       return this.handleError(error);
// // // // //     }
// // // // //   }

// // // // //   // ===========================================================================
// // // // //   // Punch Action
// // // // //   // ===========================================================================

// // // // //   async executePunchAction(
// // // // //     request: PunchActionRequest,
// // // // //   ): Promise<PunchActionResponse> {
// // // // //     try {
// // // // //       const endpoint =
// // // // //         ATTENDANCE_ACTION_ENDPOINTS[
// // // // //           request.action
// // // // //         ];

// // // // //       if (!endpoint) {
// // // // //         throw new Error(
// // // // //           `Unsupported attendance action: ${request.action}`,
// // // // //         );
// // // // //       }

// // // // //       // -----------------------------------------------------------------------
// // // // //       // Prepare backend payload
// // // // //       // -----------------------------------------------------------------------

// // // // //       const payload = {
// // // // //         latitude:
// // // // //           request.latitude,

// // // // //         longitude:
// // // // //           request.longitude,

// // // // //         accuracy:
// // // // //           request.accuracy ?? null,

// // // // //         address:
// // // // //           request.address ?? null,

// // // // //         action_time:
// // // // //           request.actionTime ?? null,
// // // // //       };

// // // // //       // -----------------------------------------------------------------------
// // // // //       // Execute attendance action
// // // // //       // -----------------------------------------------------------------------

// // // // //       const response =
// // // // //         await axiosInstance.post(
// // // // //           endpoint,
// // // // //           payload,
// // // // //         );

// // // // //       const responseData =
// // // // //         this.handleResponse<any>(
// // // // //           response,
// // // // //         );

// // // // //       // -----------------------------------------------------------------------
// // // // //       // Backend rejected action
// // // // //       // -----------------------------------------------------------------------

// // // // //       if (!responseData?.success) {
// // // // //         const attendance =
// // // // //           this.mapBackendAttendanceToDailyPunchState(
// // // // //             responseData?.attendance,
// // // // //           );

// // // // //         return {
// // // // //           ...responseData,

// // // // //           action:
// // // // //             request.action,

// // // // //           attendance,
// // // // //         } as PunchActionResponse;
// // // // //       }

// // // // //       // // -----------------------------------------------------------------------
// // // // //       // // IMPORTANT:
// // // // //       // //
// // // // //       // // After every successful action,
// // // // //       // // get the state again from DB.
// // // // //       // // -----------------------------------------------------------------------

// // // // //       // let latestAttendance:
// // // // //       //   | DailyPunchState
// // // // //       //   | null = null;

// // // // //       // try {
// // // // //       //   latestAttendance =
// // // // //       //     await this.getTodayAttendance();
// // // // //       // } catch (refreshError) {
// // // // //       //   console.warn(
// // // // //       //     "Attendance action succeeded, but latest attendance state could not be refreshed:",
// // // // //       //     refreshError,
// // // // //       //   );
// // // // //       // }

// // // // //       // // -----------------------------------------------------------------------
// // // // //       // // Use database state.
// // // // //       // // If refresh fails, use action response.
// // // // //       // // -----------------------------------------------------------------------

// // // // //       // const attendance =
// // // // //       //   latestAttendance ??
// // // // //       //   this.mapBackendAttendanceToDailyPunchState(
// // // // //       //     responseData?.attendance,
// // // // //       //   );

// // // // //       // -----------------------------------------------------------------------
// // // // // // Use the attendance state returned by the successful action itself.
// // // // // //
// // // // // // Do not immediately call getTodayAttendance() here because the
// // // // // // existing GET /attendance/ endpoint can return attendance records
// // // // // // belonging to other employees.
// // // // // // -----------------------------------------------------------------------
// // // // // const attendance =
// // // // //   this.mapBackendAttendanceToDailyPunchState(
// // // // //     responseData?.attendance,
// // // // //   );

// // // // //       return {
// // // // //         ...responseData,

// // // // //         action:
// // // // //           request.action,

// // // // //         attendance,
// // // // //       } as PunchActionResponse;
// // // // //     } catch (error) {
// // // // //       return this.handleError(error);
// // // // //     }
// // // // //   }
// // // // // }

// // // // // // =============================================================================
// // // // // // Service Factory
// // // // // // =============================================================================

// // // // // export const attendanceService: IAttendanceService =
// // // // //   USE_MOCK
// // // // //     ? new MockAttendanceService()
// // // // //     : new ApiAttendanceService();

// // // // // // =============================================================================
// // // // // // Mock Mode Helper
// // // // // // =============================================================================

// // // // // export const isUsingMock =
// // // // //   USE_MOCK;

// // // // // // =============================================================================
// // // // // // Testing Exports
// // // // // // =============================================================================

// // // // // export {
// // // // //   MockAttendanceService,
// // // // //   ApiAttendanceService,
// // // // // };














// // // // /**
// // // //  * ======================================================
// // // //  * Attendance Module - Service Layer
// // // //  * ======================================================
// // // //  *
// // // //  * Uses the real HRMS API when USE_MOCK is false.
// // // //  * Attendance history is scoped to the logged-in employee.
// // // //  *
// // // //  * @module services/attendance.service
// // // //  */

// // // // import axios, { AxiosResponse } from "axios";
// // // // import axiosInstance from "../../../services/axios/axiosInstance";

// // // // import type {
// // // //   AttendanceRecord,
// // // //   AttendanceSummary,
// // // //   AttendanceOverviewItem,
// // // //   AttendanceFilter,
// // // //   AttendanceApiResponse,
// // // //   AttendanceExportResponse,
// // // //   DailyPunchState,
// // // //   PunchActionRequest,
// // // //   PunchActionResponse,
// // // //   AttendanceAction,
// // // //   AttendanceTimelineActivity,
// // // //   AttendanceStatus,
// // // // } from "../types/attendance.types";

// // // // import { API_ENDPOINTS } from "../constants/attendance.constants";
// // // // import { attendanceMockData } from "../components/mocks/attendance.mock";

// // // // // =============================================================================
// // // // // Configuration
// // // // // =============================================================================

// // // // const USE_MOCK = false;

// // // // // =============================================================================
// // // // // Backend response types
// // // // // =============================================================================

// // // // interface BackendDailyRecord {
// // // //   id?: number | string;
// // // //   date?: string;
// // // //   attendance_date?: string;
// // // //   attendanceDate?: string;
// // // //   status?: string | null;
// // // //   attendance_status?: string | null;
// // // //   punch_in?: string | null;
// // // //   punch_out?: string | null;
// // // //   punchIn?: string | null;
// // // //   punchOut?: string | null;
// // // //   break_in?: string | null;
// // // //   break_out?: string | null;
// // // //   last_break_in?: string | null;
// // // //   last_break_out?: string | null;
// // // //   working_hours?: number | null;
// // // //   working_hrs?: number | null;
// // // //   working_minutes?: number | null;
// // // //   break_minutes?: number | null;
// // // //   total_break?: number | null;
// // // //   late_minutes?: number | null;
// // // //   shift?: string | null;
// // // //   holiday_name?: string | null;
// // // //   employee_id?: number | string;
// // // //   employee_name?: string;
// // // //   punch_in_location?: any;
// // // //   punch_out_location?: any;
// // // //   punch_in_address?: string | null;
// // // //   punch_out_address?: string | null;
// // // //   last_action_at?: string | null;
// // // // }

// // // // interface BackendEmployee {
// // // //   employee_id?: number | string;
// // // //   employee_code?: string;
// // // //   employee_name?: string;
// // // //   daily_records?: BackendDailyRecord[];
// // // //   present?: number;
// // // //   week_off?: number;
// // // //   public_holiday?: number;
// // // //   pl?: number;
// // // //   cl?: number;
// // // //   co?: number;
// // // //   lop?: number;
// // // //   late?: number;
// // // //   total_days?: number;
// // // //   total_working_hours?: number;
// // // //   total_break_minutes?: number;
// // // // }

// // // // interface BackendHistoryResponse {
// // // //   success?: boolean;
// // // //   message?: string;
// // // //   employees?: BackendEmployee[];
// // // //   statistics?: {
// // // //     total_employees?: number;
// // // //     present?: number;
// // // //     week_off?: number;
// // // //     public_holiday?: number;
// // // //     pl?: number;
// // // //     cl?: number;
// // // //     co?: number;
// // // //     lop?: number;
// // // //     late?: number;
// // // //     total_working_hours?: number;
// // // //     total_break_minutes?: number;
// // // //   };
// // // //   pagination?: {
// // // //     page?: number;
// // // //     page_size?: number;
// // // //     total_items?: number;
// // // //     total_pages?: number;
// // // //     has_previous?: boolean;
// // // //     has_next?: boolean;
// // // //   };
// // // // }

// // // // interface BackendPunchResponse {
// // // //   success?: boolean;
// // // //   message?: string;
// // // //   attendance?: BackendDailyRecord;
// // // //   [key: string]: any;
// // // // }

// // // // interface BackendLateMark {
// // // //   attendance_id: number;
// // // //   emp_id: number;
// // // //   date: string;
// // // //   punch_in?: string | null;
// // // //   shift_start?: string | null;
// // // //   late_minutes: number;
// // // //   is_late: boolean;
// // // // }

// // // // interface BackendLateMarkResponse {
// // // //   success: boolean;
// // // //   from_date: string;
// // // //   to_date: string;
// // // //   grace_minutes: number;
// // // //   total_late_records: number;
// // // //   data: BackendLateMark[];
// // // // }

// // // // // =============================================================================
// // // // // Punch action endpoints
// // // // // =============================================================================

// // // // const ATTENDANCE_ACTION_ENDPOINTS: Record<AttendanceAction, string> = {
// // // //   PUNCH_IN: "/api/v1/attendance/punch-in",
// // // //   BREAK_IN: "/api/v1/attendance/break-in",
// // // //   BREAK_OUT: "/api/v1/attendance/break-out",
// // // //   PUNCH_OUT: "/api/v1/attendance/punch-out",
// // // // };

// // // // // =============================================================================
// // // // // Service interface
// // // // // =============================================================================

// // // // export interface IAttendanceService {
// // // //   getAttendance(filters?: AttendanceFilter): Promise<AttendanceApiResponse>;
// // // //   getAttendanceSummary(filters?: AttendanceFilter): Promise<AttendanceSummary>;
// // // //   getAttendanceOverview(year: number, month: number): Promise<AttendanceOverviewItem[]>;
// // // //   exportAttendance(filters?: AttendanceFilter): Promise<AttendanceExportResponse>;
// // // //   filterAttendance(filters: AttendanceFilter): Promise<AttendanceApiResponse>;
// // // //   getTodayAttendance(): Promise<DailyPunchState>;
// // // //   getTodayTimeline(): Promise<AttendanceTimelineActivity[]>;
// // // //   executePunchAction(request: PunchActionRequest): Promise<PunchActionResponse>;
// // // // }

// // // // // =============================================================================
// // // // // Shared helpers
// // // // // =============================================================================

// // // // function localDate(date: Date): string {
// // // //   const year = date.getFullYear();
// // // //   const month = String(date.getMonth() + 1).padStart(2, "0");
// // // //   const day = String(date.getDate()).padStart(2, "0");
// // // //   return `${year}-${month}-${day}`;
// // // // }

// // // // function toTime(value?: string | null): string {
// // // //   if (!value) return "";
// // // //   const match = value.match(/(?:T|\s)?(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?/);
// // // //   return match ? `${match[1]}:${match[2]}` : value;
// // // // }

// // // // function mapStatus(value?: string | null): AttendanceStatus {
// // // //   const status = (value ?? "").trim().toUpperCase();

// // // //   if (["PRESENT", "P"].includes(status)) return "Present";
// // // //   if (status === "LATE") return "Late";
// // // //   if (["WO", "WEEKLYOFF", "WEEKLY_OFF"].includes(status)) return "WeeklyOff";
// // // //   if (["PH", "HOLIDAY", "PUBLIC_HOLIDAY"].includes(status)) return "Holiday";

// // // //   // The current frontend type has no dedicated Leave/LOP status.
// // // //   return "Absent";
// // // // }

// // // // function unwrapResponse<T>(response: AxiosResponse<T | { data: T }>): T {
// // // //   const body: any = response.data;
// // // //   if (body && typeof body === "object" && "data" in body) {
// // // //     return body.data as T;
// // // //   }
// // // //   return body as T;
// // // // }

// // // // function emptySummary(): AttendanceSummary {
// // // //   return {
// // // //     totalDays: 0,
// // // //     presentDays: 0,
// // // //     presentPercentage: 0,
// // // //     absentDays: 0,
// // // //     absentPercentage: 0,
// // // //     lateDays: 0,
// // // //     latePercentage: 0,
// // // //     averageWorkingHours: "--",
// // // //   };
// // // // }

// // // // function mapDailyRecord(
// // // //   raw: BackendDailyRecord,
// // // //   employee?: BackendEmployee,
// // // // ): AttendanceRecord {
// // // //   const date = String(raw.date ?? raw.attendance_date ?? raw.attendanceDate ?? "").slice(0, 10);

// // // //   return {
// // // //     id: String(raw.id ?? `${employee?.employee_id ?? raw.employee_id ?? "employee"}-${date}`),
// // // //     date,
// // // //     shift: raw.shift || "--",
// // // //     punchIn: toTime(raw.punch_in ?? raw.punchIn),
// // // //     punchOut: toTime(raw.punch_out ?? raw.punchOut),
// // // //     breakIn: raw.break_in ?? raw.last_break_in ?? null,
// // // //     breakOut: raw.break_out ?? raw.last_break_out ?? null,
// // // //     workingHours: Number(raw.working_hours ?? raw.working_hrs ?? 0),
// // // //     breakTime: Number(raw.break_minutes ?? raw.total_break ?? 0),
// // // //     status: mapStatus(raw.status ?? raw.attendance_status),
// // // //     employeeName: employee?.employee_name ?? raw.employee_name,
// // // //     employeeId: employee?.employee_id ?? raw.employee_id,
// // // //   };
// // // // }

// // // // // =============================================================================
// // // // // Logged-in employee resolution
// // // // // =============================================================================

// // // // /**
// // // //  * Use an employee ID already saved by your login/profile flow.
// // // //  *
// // // //  * IMPORTANT:
// // // //  * Do not fall back to an unfiltered all-employee history request.
// // // //  * If your project uses a different auth-storage key, add that exact
// // // //  * key here after checking your existing authStorage implementation.
// // // //  */
// // // // function getLoggedInEmployeeId(): number {
// // // //   const possibleKeys = [
// // // //     "employee_id",
// // // //     "employeeId",
// // // //     "emp_id",
// // // //     "empId",
// // // //     "current_employee_id",
// // // //     "currentEmployeeId",
// // // //     "user",
// // // //     "currentUser",
// // // //     "user_data",
// // // //     "userData",
// // // //     "auth_user",
// // // //   ];

// // // //   for (const key of possibleKeys) {
// // // //     const raw = localStorage.getItem(key);
// // // //     if (!raw) continue;

// // // //     const direct = Number(raw);
// // // //     if (Number.isInteger(direct) && direct > 0) {
// // // //       return direct;
// // // //     }

// // // //     try {
// // // //       const parsed = JSON.parse(raw);
// // // //       const candidate =
// // // //         parsed?.employee_id ??
// // // //         parsed?.employeeId ??
// // // //         parsed?.emp_id ??
// // // //         parsed?.empId ??
// // // //         parsed?.employee?.id ??
// // // //         parsed?.employee?.employee_id ??
// // // //         parsed?.user?.employee_id ??
// // // //         parsed?.user?.emp_id;

// // // //       const id = Number(candidate);
// // // //       if (Number.isInteger(id) && id > 0) {
// // // //         return id;
// // // //       }
// // // //     } catch {
// // // //       // This storage entry is not JSON; try the next known key.
// // // //     }
// // // //   }

// // // //   throw new Error(
// // // //     "Could not resolve the logged-in employee ID from auth storage. " +
// // // //     "Check your existing authStorage/profile utility and add its exact employee-ID field.",
// // // //   );
// // // // }

// // // // // =============================================================================
// // // // // Mock service
// // // // // =============================================================================

// // // // class MockAttendanceService implements IAttendanceService {
// // // //   private delay(milliseconds = 300): Promise<void> {
// // // //     return new Promise((resolve) => setTimeout(resolve, milliseconds));
// // // //   }

// // // //   private dailyState: DailyPunchState = {
// // // //     id: null,
// // // //     employeeId: "CURRENT_USER",
// // // //     attendanceDate: localDate(new Date()),
// // // //     punchIn: null,
// // // //     punchOut: null,
// // // //     breakIn: null,
// // // //     breakOut: null,
// // // //     punchState: "NOT_PUNCHED_IN",
// // // //     isPunchedIn: false,
// // // //     isOnBreak: false,
// // // //     isPunchedOut: false,
// // // //     workingMinutes: 0,
// // // //     breakMinutes: 0,
// // // //     punchInLocation: null,
// // // //     punchOutLocation: null,
// // // //     lastAction: null,
// // // //     lastActionAt: null,
// // // //   };

// // // //   async getAttendance(filters?: AttendanceFilter): Promise<AttendanceApiResponse> {
// // // //     await this.delay();

// // // //     let records = [...attendanceMockData.records];

// // // //     if (filters?.selectedDate) {
// // // //       records = records.filter((r) => r.date === filters.selectedDate);
// // // //     }
// // // //     if (filters?.startDate) {
// // // //       records = records.filter((r) => r.date >= filters.startDate!);
// // // //     }
// // // //     if (filters?.endDate) {
// // // //       records = records.filter((r) => r.date <= filters.endDate!);
// // // //     }
// // // //     if (filters?.status) {
// // // //       records = records.filter((r) => r.status === filters.status);
// // // //     }
// // // //     if (filters?.searchTerm?.trim()) {
// // // //       const search = filters.searchTerm.trim().toLowerCase();
// // // //       records = records.filter(
// // // //         (r) =>
// // // //           r.employeeName?.toLowerCase().includes(search) ||
// // // //           r.id.toLowerCase().includes(search),
// // // //       );
// // // //     }

// // // //     const present = records.filter((r) => r.status === "Present").length;
// // // //     const absent = records.filter((r) => r.status === "Absent").length;
// // // //     const late = records.filter((r) => r.status === "Late").length;
// // // //     const working = records.filter((r) => ["Present", "Late"].includes(r.status));
// // // //     const totalHours = working.reduce((sum, r) => sum + r.workingHours, 0);

// // // //     return {
// // // //       records,
// // // //       summary: {
// // // //         totalDays: records.length,
// // // //         presentDays: present,
// // // //         presentPercentage: records.length ? (present / records.length) * 100 : 0,
// // // //         absentDays: absent,
// // // //         absentPercentage: records.length ? (absent / records.length) * 100 : 0,
// // // //         lateDays: late,
// // // //         latePercentage: records.length ? (late / records.length) * 100 : 0,
// // // //         averageWorkingHours: working.length ? (totalHours / working.length).toFixed(2) : "--",
// // // //       },
// // // //       overview: attendanceMockData.overview,
// // // //       totalCount: records.length,
// // // //       page: 1,
// // // //       pageSize: records.length,
// // // //     };
// // // //   }

// // // //   async getAttendanceSummary(filters?: AttendanceFilter): Promise<AttendanceSummary> {
// // // //     return (await this.getAttendance(filters)).summary;
// // // //   }

// // // //   async getAttendanceOverview(year: number, month: number): Promise<AttendanceOverviewItem[]> {
// // // //     const prefix = `${year}-${String(month).padStart(2, "0")}`;
// // // //     return attendanceMockData.overview.filter((item) => item.date.startsWith(prefix));
// // // //   }

// // // //   async exportAttendance(): Promise<AttendanceExportResponse> {
// // // //     return {
// // // //       downloadUrl: "/mock/attendance-export.xlsx",
// // // //       fileName: `attendance-${localDate(new Date())}.xlsx`,
// // // //     };
// // // //   }

// // // //   async filterAttendance(filters: AttendanceFilter): Promise<AttendanceApiResponse> {
// // // //     return this.getAttendance(filters);
// // // //   }

// // // //   async getTodayAttendance(): Promise<DailyPunchState> {
// // // //     return { ...this.dailyState, attendanceDate: localDate(new Date()) };
// // // //   }

// // // //   async getTodayTimeline(): Promise<AttendanceTimelineActivity[]> {
// // // //     const activities: AttendanceTimelineActivity[] = [];
// // // //     const state = this.dailyState;

// // // //     if (state.punchIn) activities.push({ id: "mock-PI", activity: "PI", log: state.punchIn });
// // // //     if (state.breakIn) activities.push({ id: "mock-BI", activity: "BI", log: state.breakIn });
// // // //     if (state.breakOut) activities.push({ id: "mock-BO", activity: "BO", log: state.breakOut });
// // // //     if (state.punchOut) activities.push({ id: "mock-PO", activity: "PO", log: state.punchOut });

// // // //     return activities.sort((a, b) => new Date(a.log).getTime() - new Date(b.log).getTime());
// // // //   }

// // // //   async executePunchAction(request: PunchActionRequest): Promise<PunchActionResponse> {
// // // //     const timestamp = new Date().toISOString();
// // // //     const state = this.dailyState;

// // // //     if (request.action === "PUNCH_IN") {
// // // //       if (state.isPunchedIn) {
// // // //         return {
// // // //           success: false, message: "Already punched in.", action: request.action,
// // // //           actionStatus: "ALREADY_COMPLETED", attendance: { ...state }, timestamp,
// // // //         };
// // // //       }
// // // //       this.dailyState = {
// // // //         ...state,
// // // //         punchIn: timestamp,
// // // //         punchOut: null,
// // // //         breakIn: null,
// // // //         breakOut: null,
// // // //         punchState: "WORKING",
// // // //         isPunchedIn: true,
// // // //         isOnBreak: false,
// // // //         isPunchedOut: false,
// // // //         lastAction: "PUNCH_IN",
// // // //         lastActionAt: timestamp,
// // // //       };
// // // //     } else if (request.action === "BREAK_IN") {
// // // //       if (!state.isPunchedIn || state.isOnBreak) {
// // // //         return {
// // // //           success: false,
// // // //           message: !state.isPunchedIn ? "Please Punch In first." : "Already on break.",
// // // //           action: request.action,
// // // //           actionStatus: !state.isPunchedIn ? "INVALID_STATE" : "ALREADY_COMPLETED",
// // // //           attendance: { ...state }, timestamp,
// // // //         };
// // // //       }
// // // //       this.dailyState = {
// // // //         ...state, breakIn: timestamp, breakOut: null,
// // // //         punchState: "ON_BREAK", isOnBreak: true,
// // // //         lastAction: "BREAK_IN", lastActionAt: timestamp,
// // // //       };
// // // //     } else if (request.action === "BREAK_OUT") {
// // // //       if (!state.isPunchedIn || !state.isOnBreak) {
// // // //         return {
// // // //           success: false,
// // // //           message: !state.isPunchedIn ? "Please Punch In first." : "You are not currently on break.",
// // // //           action: request.action, actionStatus: "INVALID_STATE",
// // // //           attendance: { ...state }, timestamp,
// // // //         };
// // // //       }
// // // //       this.dailyState = {
// // // //         ...state, breakOut: timestamp, punchState: "WORKING",
// // // //         isOnBreak: false, lastAction: "BREAK_OUT", lastActionAt: timestamp,
// // // //       };
// // // //     } else {
// // // //       if (!state.isPunchedIn || state.isOnBreak) {
// // // //         return {
// // // //           success: false,
// // // //           message: !state.isPunchedIn ? "Please Punch In first." : "Please Break Out before Punch Out.",
// // // //           action: request.action, actionStatus: "INVALID_STATE",
// // // //           attendance: { ...state }, timestamp,
// // // //         };
// // // //       }
// // // //       this.dailyState = {
// // // //         ...state, punchOut: timestamp, punchState: "PUNCHED_OUT",
// // // //         isPunchedIn: false, isOnBreak: false, isPunchedOut: true,
// // // //         lastAction: "PUNCH_OUT", lastActionAt: timestamp,
// // // //       };
// // // //     }

// // // //     return {
// // // //       success: true,
// // // //       // message: `${request.action.replaceAll("_", " ")} successful.`,
// // // //       message: `${request.action.replace(/_/g, " ")} successful.`,
// // // //       action: request.action,
// // // //       actionStatus: "SUCCESS",
// // // //       attendance: { ...this.dailyState },
// // // //       timestamp,
// // // //     };
// // // //   }
// // // // }

// // // // // =============================================================================
// // // // // Real API service
// // // // // =============================================================================

// // // // class ApiAttendanceService implements IAttendanceService {
// // // //   private getTodayDate(): string {
// // // //     return localDate(new Date());
// // // //   }

// // // //   private buildQueryParams(filters?: AttendanceFilter): URLSearchParams {
// // // //     const params = new URLSearchParams();

// // // //     // Use the actual backend history endpoint's parameter names.
// // // //     if (filters?.startDate) params.set("from_date", filters.startDate);
// // // //     if (filters?.endDate) params.set("to_date", filters.endDate);

// // // //     if (filters?.selectedDate) {
// // // //       params.set("from_date", filters.selectedDate);
// // // //       params.set("to_date", filters.selectedDate);
// // // //     }

// // // //     if (filters?.searchTerm?.trim()) {
// // // //       params.set("search", filters.searchTerm.trim());
// // // //     }

// // // //     // Scope employee history to the logged-in employee.
// // // //     params.set("emp_id", String(getLoggedInEmployeeId()));
// // // //     params.set("page", "1");
// // // //     params.set("page_size", "200");

// // // //     return params;
// // // //   }

// // // //   private handleResponse<T>(response: AxiosResponse): T {
// // // //     return unwrapResponse<T>(response);
// // // //   }

// // // //   private handleError(error: unknown): never {
// // // //     if (axios.isAxiosError(error)) {
// // // //       const data = error.response?.data as any;
// // // //       const message =
// // // //         data?.message ??
// // // //         data?.detail ??
// // // //         error.message ??
// // // //         "Attendance API request failed.";

// // // //       throw new Error(`Attendance API Error: ${message}`);
// // // //     }

// // // //     if (error instanceof Error) throw error;
// // // //     throw new Error("An unexpected attendance error occurred.");
// // // //   }

// // // //   private createEmptyDailyState(date: string): DailyPunchState {
// // // //     return {
// // // //       id: null,
// // // //       employeeId: getLoggedInEmployeeId(),
// // // //       attendanceDate: date,
// // // //       punchIn: null,
// // // //       punchOut: null,
// // // //       breakIn: null,
// // // //       breakOut: null,
// // // //       punchState: "NOT_PUNCHED_IN",
// // // //       isPunchedIn: false,
// // // //       isOnBreak: false,
// // // //       isPunchedOut: false,
// // // //       workingMinutes: 0,
// // // //       breakMinutes: 0,
// // // //       punchInLocation: null,
// // // //       punchOutLocation: null,
// // // //       lastAction: null,
// // // //       lastActionAt: null,
// // // //     };
// // // //   }

// // // //   private mapBackendAttendanceToDailyPunchState(
// // // //     attendance: BackendDailyRecord | null | undefined,
// // // //   ): DailyPunchState {
// // // //     const date = String(
// // // //       attendance?.attendance_date ??
// // // //       attendance?.attendanceDate ??
// // // //       attendance?.date ??
// // // //       this.getTodayDate(),
// // // //     ).slice(0, 10);

// // // //     const punchIn = attendance?.punch_in ?? attendance?.punchIn ?? null;
// // // //     const punchOut = attendance?.punch_out ?? attendance?.punchOut ?? null;
// // // //     const breakIn = attendance?.break_in ?? attendance?.last_break_in ?? null;
// // // //     const breakOut = attendance?.break_out ?? attendance?.last_break_out ?? null;

// // // //     const isPunchedIn = Boolean(punchIn) && !Boolean(punchOut);
// // // //     const isPunchedOut = Boolean(punchOut);
// // // //     const isOnBreak = Boolean(breakIn) && !Boolean(breakOut) && isPunchedIn;

// // // //     let punchState: DailyPunchState["punchState"] = "NOT_PUNCHED_IN";
// // // //     if (isPunchedOut) punchState = "PUNCHED_OUT";
// // // //     else if (isOnBreak) punchState = "ON_BREAK";
// // // //     else if (isPunchedIn) punchState = "WORKING";

// // // //     let lastAction: DailyPunchState["lastAction"] = null;
// // // //     if (punchOut) lastAction = "PUNCH_OUT";
// // // //     else if (breakOut) lastAction = "BREAK_OUT";
// // // //     else if (breakIn) lastAction = "BREAK_IN";
// // // //     else if (punchIn) lastAction = "PUNCH_IN";

// // // //     return {
// // // //       id: attendance?.id != null ? String(attendance.id) : null,
// // // //       employeeId:
// // // //         attendance?.employee_id ??
// // // //         getLoggedInEmployeeId(),
// // // //       attendanceDate: date,
// // // //       punchIn,
// // // //       punchOut,
// // // //       breakIn,
// // // //       breakOut,
// // // //       punchState,
// // // //       isPunchedIn,
// // // //       isOnBreak,
// // // //       isPunchedOut,
// // // //       workingMinutes: Number(
// // // //         attendance?.working_minutes ??
// // // //         attendance?.working_hrs ??
// // // //         0,
// // // //       ) * (attendance?.working_hrs != null ? 60 : 1),
// // // //       breakMinutes: Number(
// // // //         attendance?.break_minutes ??
// // // //         attendance?.total_break ??
// // // //         0,
// // // //       ),
// // // //       punchInLocation: attendance?.punch_in_location ?? null,
// // // //       punchOutLocation: attendance?.punch_out_location ?? null,
// // // //       lastAction,
// // // //       lastActionAt: attendance?.last_action_at ?? null,
// // // //     };
// // // //   }

// // // //   private normalizeHistoryResponse(
// // // //     body: BackendHistoryResponse,
// // // //   ): AttendanceApiResponse {
// // // //     if (!body?.success) {
// // // //       throw new Error(body?.message ?? "Attendance history could not be loaded.");
// // // //     }

// // // //     const employee = body.employees?.[0];
// // // //     const records = (employee?.daily_records ?? []).map((item) =>
// // // //       mapDailyRecord(item, employee),
// // // //     );

// // // //     const stats = body.statistics ?? {};
// // // //     const totalDays = records.length;
// // // //     const present = Number(stats.present ?? employee?.present ?? 0);
// // // //     const absent = Number(stats.lop ?? employee?.lop ?? 0);
// // // //     const late = Number(stats.late ?? employee?.late ?? 0);
// // // //     const workingHours = Number(
// // // //       stats.total_working_hours ?? employee?.total_working_hours ?? 0,
// // // //     );

// // // //     const summary: AttendanceSummary = {
// // // //       totalDays: Number(employee?.total_days ?? totalDays),
// // // //       presentDays: present,
// // // //       presentPercentage: totalDays ? (present / totalDays) * 100 : 0,
// // // //       absentDays: absent,
// // // //       absentPercentage: totalDays ? (absent / totalDays) * 100 : 0,
// // // //       lateDays: late,
// // // //       latePercentage: totalDays ? (late / totalDays) * 100 : 0,
// // // //       averageWorkingHours: present ? (workingHours / present).toFixed(2) : "--",
// // // //     };

// // // //     const overview: AttendanceOverviewItem[] = records.map((record) => {
// // // //       const [year, month, day] = record.date.split("-").map(Number);
// // // //       return {
// // // //         date: record.date,
// // // //         dayOfWeek: new Date(year, month - 1, day).toLocaleDateString(
// // // //           "en-US",
// // // //           { weekday: "long" },
// // // //         ),
// // // //         dayOfMonth: day,
// // // //         status: record.status,
// // // //       };
// // // //     });

// // // //     return {
// // // //       records,
// // // //       summary,
// // // //       overview,
// // // //       totalCount: Number(body.pagination?.total_items ?? records.length),
// // // //       page: Number(body.pagination?.page ?? 1),
// // // //       pageSize: Number(body.pagination?.page_size ?? 200),
// // // //     };
// // // //   }

// // // //   async getAttendance(filters?: AttendanceFilter): Promise<AttendanceApiResponse> {
// // // //     try {
// // // //       const params = this.buildQueryParams(filters);
// // // //       const response = await axiosInstance.get<BackendHistoryResponse>(
// // // //         `/api/v1/attendance/history?${params.toString()}`,
// // // //       );
// // // //       return this.normalizeHistoryResponse(response.data);
// // // //     } catch (error) {
// // // //       return this.handleError(error);
// // // //     }
// // // //   }

// // // //   async getAttendanceSummary(filters?: AttendanceFilter): Promise<AttendanceSummary> {
// // // //     try {
// // // //       const params = this.buildQueryParams(filters);
// // // //       params.delete("page");
// // // //       params.delete("page_size");

// // // //       const response = await axiosInstance.get<AttendanceSummary>(
// // // //         `/api/v1/attendance/summary?${params.toString()}`,
// // // //       );
// // // //       return this.handleResponse<AttendanceSummary>(response);
// // // //     } catch (error) {
// // // //       return this.handleError(error);
// // // //     }
// // // //   }

// // // //   async getAttendanceOverview(
// // // //     year: number,
// // // //     month: number,
// // // //   ): Promise<AttendanceOverviewItem[]> {
// // // //     try {
// // // //       const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;
// // // //       const lastDay = new Date(year, month, 0).getDate();
// // // //       const lastDate =
// // // //         `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

// // // //       const params = new URLSearchParams({
// // // //         from_date: firstDay,
// // // //         to_date: lastDate,
// // // //         emp_id: String(getLoggedInEmployeeId()),
// // // //       });

// // // //       const response = await axiosInstance.get<BackendHistoryResponse>(
// // // //         `/api/v1/attendance/history?${params.toString()}`,
// // // //       );

// // // //       return this.normalizeHistoryResponse(response.data).overview;
// // // //     } catch (error) {
// // // //       return this.handleError(error);
// // // //     }
// // // //   }

// // // //   async exportAttendance(
// // // //     filters?: AttendanceFilter,
// // // //   ): Promise<AttendanceExportResponse> {
// // // //     try {
// // // //       const params = this.buildQueryParams(filters);
// // // //       params.delete("page");
// // // //       params.delete("page_size");

// // // //       const response = await axiosInstance.get<Blob>(
// // // //         `/api/v1/attendance/export?${params.toString()}`,
// // // //         { responseType: "blob" },
// // // //       );

// // // //       const url = URL.createObjectURL(response.data);
// // // //       return {
// // // //         downloadUrl: url,
// // // //         fileName: `attendance-${this.getTodayDate()}.xlsx`,
// // // //       };
// // // //     } catch (error) {
// // // //       return this.handleError(error);
// // // //     }
// // // //   }

// // // //   async filterAttendance(filters: AttendanceFilter): Promise<AttendanceApiResponse> {
// // // //     return this.getAttendance(filters);
// // // //   }

// // // //   async getTodayAttendance(): Promise<DailyPunchState> {
// // // //     try {
// // // //       const today = this.getTodayDate();
// // // //       const response = await this.getAttendance({ selectedDate: today });
// // // //       const record = response.records.find((item) => item.date === today);

// // // //       if (!record) return this.createEmptyDailyState(today);

// // // //       return this.mapBackendAttendanceToDailyPunchState({
// // // //         id: record.id,
// // // //         date: record.date,
// // // //         status: record.status,
// // // //         punch_in: record.punchIn || null,
// // // //         punch_out: record.punchOut || null,
// // // //         break_in: record.breakIn ?? null,
// // // //         break_out: record.breakOut ?? null,
// // // //         working_hours: record.workingHours,
// // // //         break_minutes: record.breakTime,
// // // //         employee_id: record.employeeId,
// // // //       });
// // // //     } catch (error) {
// // // //       return this.handleError(error);
// // // //     }
// // // //   }

// // // //   async getTodayTimeline(): Promise<AttendanceTimelineActivity[]> {
// // // //     try {
// // // //       const today = this.getTodayDate();
// // // //       const params = new URLSearchParams({
// // // //         from_date: today,
// // // //         to_date: today,
// // // //         emp_id: String(getLoggedInEmployeeId()),
// // // //       });

// // // //       const response = await axiosInstance.get<BackendHistoryResponse>(
// // // //         `/api/v1/attendance/history?${params.toString()}`,
// // // //       );

// // // //       const employee = response.data?.employees?.[0];
// // // //       const record = employee?.daily_records?.find(
// // // //         (item) => String(item.date ?? "").slice(0, 10) === today,
// // // //       );

// // // //       if (!record) return [];

// // // //       const activities: AttendanceTimelineActivity[] = [];
// // // //       const id = String(record.id ?? today);

// // // //       const punchIn = record.punch_in ?? record.punchIn;
// // // //       const breakIn = record.break_in ?? record.last_break_in;
// // // //       const breakOut = record.break_out ?? record.last_break_out;
// // // //       const punchOut = record.punch_out ?? record.punchOut;

// // // //       if (punchIn) activities.push({ id: `${id}-PI`, activity: "PI", log: punchIn });
// // // //       if (breakIn) activities.push({ id: `${id}-BI`, activity: "BI", log: breakIn });
// // // //       if (breakOut) activities.push({ id: `${id}-BO`, activity: "BO", log: breakOut });
// // // //       if (punchOut) activities.push({ id: `${id}-PO`, activity: "PO", log: punchOut });

// // // //       return activities.sort(
// // // //         (a, b) => new Date(a.log).getTime() - new Date(b.log).getTime(),
// // // //       );
// // // //     } catch (error) {
// // // //       return this.handleError(error);
// // // //     }
// // // //   }

// // // //   async executePunchAction(
// // // //     request: PunchActionRequest,
// // // //   ): Promise<PunchActionResponse> {
// // // //     try {
// // // //       const endpoint = ATTENDANCE_ACTION_ENDPOINTS[request.action];

// // // //       const payload = {
// // // //         action_time: request.actionTime ?? null,
// // // //       };

// // // //       // This module does not collect or send employee location.
// // // //       const response = await axiosInstance.post<BackendPunchResponse>(
// // // //         endpoint,
// // // //         payload,
// // // //       );

// // // //       const body = this.handleResponse<BackendPunchResponse>(response);
// // // //       const attendance = this.mapBackendAttendanceToDailyPunchState(
// // // //         body?.attendance,
// // // //       );

// // // //       return {
// // // //         ...(body as any),
// // // //         success: Boolean(body?.success),
// // // //         message: body?.message ?? "Attendance action completed.",
// // // //         action: request.action,
// // // //         actionStatus: body?.success ? "SUCCESS" : "FAILED",
// // // //         attendance,
// // // //         timestamp: new Date().toISOString(),
// // // //       };
// // // //     } catch (error) {
// // // //       return this.handleError(error);
// // // //     }
// // // //   }
// // // // }

// // // // // =============================================================================
// // // // // Service factory
// // // // // =============================================================================

// // // // export const attendanceService: IAttendanceService =
// // // //   USE_MOCK ? new MockAttendanceService() : new ApiAttendanceService();

// // // // export const isUsingMock = USE_MOCK;

// // // // export { MockAttendanceService, ApiAttendanceService };




// // // // src/pages/attendance/attendance-history/services/attendanceHistory.service.ts

// // // import axiosInstance from "@/services/axios/axiosInstance";

// // // import type {
// // //   EmployeeAttendance,
// // //   AttendanceStatistics,
// // //   AttendanceFilters,
// // //   PaginationInfo,
// // //   AttendanceInsights,
// // //   AttendanceRecord,
// // //   MonthlySummary,
// // //   AttendanceStatus,
// // // } from "../attendance-history/types/attendanceHistory.types";

// // // // ============================================================
// // // // BACKEND TYPES
// // // // ============================================================

// // // interface BackendDailyAttendance {
// // //   id?: number;
// // //   date: string;
// // //   status?: string | null;
// // //   attendance_status?: string | null;
// // //   punch_in?: string | null;
// // //   punch_out?: string | null;
// // //   check_in?: string | null;
// // //   check_out?: string | null;
// // //   late_minutes?: number | null;
// // //   lateMinutes?: number | null;
// // //   working_hours?: number | null;
// // //   working_hrs?: number | null;
// // //   break_minutes?: number | null;
// // //   total_break?: number | null;
// // //   shift?: string | null;
// // //   holiday_name?: string | null;
// // // }

// // // interface BackendMonthlyEmployee {
// // //   id?: number | string;
// // //   employee_id?: number | string;
// // //   emp_id?: number | string;
// // //   emp_code?: string | number;
// // //   name?: string | null;
// // //   employee_name?: string | null;
// // //   employee_code?: string | number;
// // //   first_name?: string | null;
// // //   last_name?: string | null;
// // //   designation?: string | { name?: string } | null;
// // //   department?: string | { name?: string } | null;
// // //   avatar?: string | null;
// // //   photo?: string | null;
// // //   profile_image?: string | null;
// // //   month?: string;
// // //   daily_records?: BackendDailyAttendance[];
// // //   dailyRecords?: BackendDailyAttendance[];
// // //   daily_attendance?: BackendDailyAttendance[];
// // //   attendance?: BackendDailyAttendance[];
// // //   present?: number;
// // //   week_off?: number;
// // //   week_off_days?: number;
// // //   public_holiday?: number;
// // //   pl?: number;
// // //   cl?: number;
// // //   co?: number;
// // //   lop?: number;
// // //   half_day_leave?: number;
// // //   late?: number;
// // //   late_count_15?: number;
// // //   n1?: number;
// // //   n2?: number;
// // //   n3?: number;
// // //   n4?: number;
// // //   n5?: number;
// // //   n6?: number;
// // //   n7?: number;
// // //   n8?: number;
// // //   n9?: number;
// // //   n10?: number;
// // //   n11?: number;
// // //   n12?: number;
// // //   paid_days?: number;
// // //   lop_absent_days?: number;
// // //   total_working_hours?: number;
// // //   total_break_minutes?: number;
// // // }

// // // interface BackendHistoryResponse {
// // //   success?: boolean;
// // //   filters?: Record<string, unknown>;
// // //   employees?: BackendMonthlyEmployee[];
// // //   statistics?: Record<string, unknown>;
// // //   pagination?: {
// // //     page?: number;
// // //     page_size?: number;
// // //     total_records?: number;
// // //     total_pages?: number;
// // //     current_page?: number;
// // //     total_items?: number;
// // //   };
// // // }

// // // interface LateMarkRequest {
// // //   from_date: string;
// // //   to_date: string;
// // //   grace_minutes: number;
// // //   emp_id?: number;
// // // }

// // // interface BackendLateMark {
// // //   attendance_id: number;
// // //   emp_id: number;
// // //   date: string;
// // //   punch_in?: string | null;
// // //   shift_start?: string | null;
// // //   late_minutes: number;
// // //   is_late: boolean;
// // // }

// // // interface BackendLateMarkResponse {
// // //   success: boolean;
// // //   from_date: string;
// // //   to_date: string;
// // //   grace_minutes: number;
// // //   total_late_records: number;
// // //   data: BackendLateMark[];
// // // }

// // // interface BackendEmployee {
// // //   id?: number | string;
// // //   emp_code?: string | number;
// // //   first_name?: string | null;
// // //   last_name?: string | null;
// // //   name?: string | null;
// // //   designation?: string | { name?: string };
// // //   department?: string | { name?: string };
// // //   photo?: string | null;
// // //   avatar?: string | null;
// // //   profile_image?: string | null;
// // // }

// // // // ============================================================
// // // // CONSTANTS
// // // // ============================================================

// // // const ATTENDANCE_ENDPOINT = "/api/v1/attendance";
// // // const EMPLOYEE_ENDPOINT = "/api/v1/employees";
// // // const MONTHLY_HISTORY_ENDPOINT = `${ATTENDANCE_ENDPOINT}/history`;
// // // const MONTH_NAMES = [
// // //   "Jan", "Feb", "Mar", "Apr", "May", "Jun",
// // //   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
// // // ];

// // // const EMPTY_MONTHLY_SUMMARY: MonthlySummary = {
// // //   present: 0,
// // //   weekOff: 0,
// // //   paidLeave: 0,
// // //   casualLeave: 0,
// // //   compensatoryLeave: 0,
// // //   halfDayPL: 0,
// // //   halfDayCL: 0,
// // //   halfDayCO: 0,
// // //   publicHoliday: 0,
// // //   lop: 0,
// // //   halfDayLOP: 0,
// // //   lwp: 0,
// // //   paidDays: 0,
// // //   lopAbsent: 0,
// // // };

// // // const VALID_STATUSES = new Set<AttendanceStatus>([
// // //   "P", "AB", "WO", "LOP", "PL", "CO", "CL",
// // //   "HD-PL", "HD-CL", "HD-CO", "PH", "HD-LOP", "LWP",
// // // ]);

// // // // ============================================================
// // // // HELPERS
// // // // ============================================================

// // // const getErrorMessage = (error: unknown): string => {
// // //   if (typeof error === "object" && error !== null && "response" in error) {
// // //     const response = (
// // //       error as { response?: { data?: { detail?: string; message?: string } } }
// // //     ).response;
// // //     return (
// // //       response?.data?.detail ||
// // //       response?.data?.message ||
// // //       "Unable to fetch attendance history."
// // //     );
// // //   }
// // //   if (error instanceof Error) return error.message;
// // //   return "An unexpected error occurred.";
// // // };

// // // const getDisplayValue = (
// // //   value?: string | { name?: string } | null,
// // // ): string => {
// // //   if (typeof value === "string" && value.trim()) return value.trim();
// // //   if (typeof value === "object" && value?.name?.trim()) return value.name.trim();
// // //   return "N/A";
// // // };

// // // const getEmployeeName = (employee: BackendMonthlyEmployee): string => {
// // //   const directName = employee.name || employee.employee_name;
// // //   if (directName?.trim()) return directName.trim();
// // //   const fullName = `${employee.first_name ?? ""} ${employee.last_name ?? ""}`.trim();
// // //   return fullName || `Employee ${String(employee.id ?? employee.employee_id ?? employee.emp_id ?? "Unknown")}`;
// // // };

// // // const getAvatarUrl = (employee: BackendMonthlyEmployee, name: string): string => {
// // //   const photo = employee.photo || employee.avatar || employee.profile_image;
// // //   return photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
// // // };

// // // const formatTime = (value?: string | null): string | undefined => {
// // //   if (!value) return undefined;
// // //   // Backend may return a time-only value or an ISO datetime.
// // //   const parsed = new Date(value);
// // //   if (!Number.isNaN(parsed.getTime()) && /[T ]/.test(value)) {
// // //     return parsed.toLocaleTimeString("en-IN", {
// // //       hour: "2-digit",
// // //       minute: "2-digit",
// // //       hour12: true,
// // //     });
// // //   }
// // //   const match = value.match(/^(\d{1,2}):(\d{2})(?::\d{2}(?:\.\d+)?)?$/);
// // //   if (match) {
// // //     const hours = Number(match[1]);
// // //     const suffix = hours >= 12 ? "PM" : "AM";
// // //     const hour12 = hours % 12 || 12;
// // //     return `${String(hour12).padStart(2, "0")}:${match[2]} ${suffix}`;
// // //   }
// // //   return undefined;
// // // };

// // // const normalizeStatus = (
// // //   rawStatus?: string | null,
// // //   punchIn?: string | null,
// // // ): AttendanceStatus => {
// // //   const status = (rawStatus ?? "").trim().toUpperCase().replace(/[\\s_-]+/g, " ");

// // //   const aliases: Record<string, AttendanceStatus> = {
// // //     PRESENT: "P",
// // //     P: "P",
// // //     ABSENT: "AB",
// // //     A: "AB",
// // //     AB: "AB",
// // //     "WEEK OFF": "WO",
// // //     WO: "WO",
// // //     "PUBLIC HOLIDAY": "PH",
// // //     PH: "PH",
// // //     "PAID LEAVE": "PL",
// // //     PL: "PL",
// // //     "CASUAL LEAVE": "CL",
// // //     CL: "CL",
// // //     "COMP OFF": "CO",
// // //     "COMPENSATORY OFF": "CO",
// // //     CO: "CO",
// // //     "HALF DAY PAID LEAVE": "HD-PL",
// // //     "HD PL": "HD-PL",
// // //     "HD PL ": "HD-PL",
// // //     "HALF DAY CASUAL LEAVE": "HD-CL",
// // //     "HD CL": "HD-CL",
// // //     "HALF DAY COMP OFF": "HD-CO",
// // //     "HD CO": "HD-CO",
// // //     "HALF DAY LOP": "HD-LOP",
// // //     "HD LOP": "HD-LOP",
// // //     "LOSS OF PAY": "LOP",
// // //     LOP: "LOP",
// // //     LWP: "LWP",
// // //   };

// // //   let normalized: AttendanceStatus | undefined =
// // //     aliases[status] ??
// // //     (VALID_STATUSES.has(status as AttendanceStatus)
// // //       ? (status as AttendanceStatus)
// // //       : undefined);

// // //   // The report API emits "Present" for a punched day, while absent days
// // //   // are emitted as "LOP". Keep explicit calendar classifications (PH, WO,
// // //   // and approved leave codes), but do not let an absent/LOP label hide a
// // //   // real punch-in in the frontend grid.
// // //   if (punchIn && (!normalized || normalized === "AB" || normalized === "LOP")) {
// // //     return "P";
// // //   }

// // //   return normalized ?? (punchIn ? "P" : "AB");
// // // };

// // // const getDailyRecords = (employee: BackendMonthlyEmployee): BackendDailyAttendance[] =>
// // //   employee.daily_records ??
// // //   employee.dailyRecords ??
// // //   employee.daily_attendance ??
// // //   employee.attendance ??
// // //   [];

// // // const getDailyStatus = (record: BackendDailyAttendance): AttendanceStatus =>
// // //   normalizeStatus(
// // //     record.status ?? record.attendance_status,
// // //     record.punch_in ?? record.check_in,
// // //   );

// // // const makeDateLabel = (dateValue: string, month: number, year: number): string => {
// // //   const day = Number(dateValue.substring(8, 10));
// // //   return `${String(day).padStart(2, "0")} ${MONTH_NAMES[month - 1]} ${year}`;
// // // };

// // // // ============================================================
// // // // MONTHLY SUMMARY
// // // // ============================================================

// // // const calculateMonthlySummary = (dailyRecords: AttendanceRecord[]): MonthlySummary => {
// // //   const summary: MonthlySummary = { ...EMPTY_MONTHLY_SUMMARY };

// // //   dailyRecords.forEach((record) => {
// // //     switch (record.status) {
// // //       case "P": summary.present++; break;
// // //       case "WO": summary.weekOff++; break;
// // //       case "PL": summary.paidLeave++; break;
// // //       case "CL": summary.casualLeave++; break;
// // //       case "CO": summary.compensatoryLeave++; break;
// // //       case "HD-PL": summary.halfDayPL++; break;
// // //       case "HD-CL": summary.halfDayCL++; break;
// // //       case "HD-CO": summary.halfDayCO++; break;
// // //       case "PH": summary.publicHoliday++; break;
// // //       case "LOP": summary.lop++; break;
// // //       case "HD-LOP": summary.halfDayLOP++; break;
// // //       case "LWP": summary.lwp++; break;
// // //       case "AB": summary.lopAbsent++; break;
// // //       default: break;
// // //     }
// // //   });

// // //   summary.paidDays =
// // //     summary.present +
// // //     summary.weekOff +
// // //     summary.paidLeave +
// // //     summary.casualLeave +
// // //     summary.compensatoryLeave +
// // //     summary.halfDayPL +
// // //     summary.halfDayCL +
// // //     summary.halfDayCO +
// // //     summary.publicHoliday;

// // //   return summary;
// // // };

// // // const calculateStatistics = (employees: EmployeeAttendance[]): AttendanceStatistics => {
// // //   let present = 0;
// // //   let absent = 0;
// // //   let weekOff = 0;
// // //   let latePunchIn = 0;
// // //   let lop = 0;
// // //   let totalLateMinutes = 0;
// // //   let totalRecords = 0;

// // //   employees.forEach((employee) => {
// // //     employee.dailyRecords.forEach((record) => {
// // //       totalRecords++;
// // //       switch (record.status) {
// // //         case "P":
// // //           present++;
// // //           if (record.lateMinutes !== undefined && record.lateMinutes > 0) {
// // //             latePunchIn++;
// // //             totalLateMinutes += record.lateMinutes;
// // //           }
// // //           break;
// // //         case "AB": absent++; break;
// // //         case "WO": weekOff++; break;
// // //         case "LOP": lop++; break;
// // //         default: break;
// // //       }
// // //     });
// // //   });

// // //   const totalWorkingDays = Math.max(totalRecords - weekOff, 0);
// // //   return {
// // //     totalEmployees: employees.length,
// // //     present,
// // //     absent,
// // //     weekOff,
// // //     latePunchIn,
// // //     lop,
// // //     averageAttendance: totalWorkingDays > 0 ? (present / totalWorkingDays) * 100 : 0,
// // //     averageLateMinutes: latePunchIn > 0 ? totalLateMinutes / latePunchIn : 0,
// // //     totalWorkingDays,
// // //     absenteeismRate: totalWorkingDays > 0 ? (absent / totalWorkingDays) * 100 : 0,
// // //   };
// // // };

// // // // ============================================================
// // // // SERVICE
// // // // ============================================================

// // // export class AttendanceHistoryService {
// // //   private static instance: AttendanceHistoryService;

// // //   private constructor() {}

// // //   public static getInstance(): AttendanceHistoryService {
// // //     if (!AttendanceHistoryService.instance) {
// // //       AttendanceHistoryService.instance = new AttendanceHistoryService();
// // //     }
// // //     return AttendanceHistoryService.instance;
// // //   }

// // //   /**
// // //    * Uses the backend's attendance-history endpoint, because that response
// // //    * contains the resolved daily statuses (PH, WO, leave codes, LOP, etc.).
// // //    * This avoids inferring weekly offs from Saturday/Sunday or rebuilding
// // //    * statuses from punch records alone.
// // //    */
// // //   async getAttendanceHistory(
// // //     filters: AttendanceFilters,
// // //     page = 1,
// // //     pageSize = 5,
// // //   ): Promise<{
// // //     employees: EmployeeAttendance[];
// // //     statistics: AttendanceStatistics;
// // //     pagination: PaginationInfo;
// // //   }> {
// // //     try {
// // //       const [yearFromMonth, monthFromMonth] = filters.month.split("-").map(Number);
// // //       const year = filters.year || yearFromMonth;
// // //       const month = monthFromMonth;

// // //       if (!year || !month || month < 1 || month > 12) {
// // //         throw new Error("Invalid attendance month.");
// // //       }

// // //       const response = await axiosInstance.get<BackendHistoryResponse>(
// // //         MONTHLY_HISTORY_ENDPOINT,
// // //         {
// // //           params: {
// // //             month,
// // //             year,
// // //             page,
// // //             page_size: pageSize,
// // //           },
// // //         },
// // //       );

// // //       const payload = response.data;
// // //       const backendEmployees = Array.isArray(payload.employees) ? payload.employees : [];

// // //       let employees: EmployeeAttendance[] = backendEmployees.map((backendEmployee) => {
// // //         const rawId =
// // //           backendEmployee.id ??
// // //           backendEmployee.employee_id ??
// // //           backendEmployee.emp_id ??
// // //           backendEmployee.emp_code ??
// // //           "unknown";
// // //         const id = String(rawId);
// // //         const name = getEmployeeName(backendEmployee);
// // //         const recordsByDay = new Map<number, AttendanceRecord>();

// // //         getDailyRecords(backendEmployee).forEach((record) => {
// // //           if (!record.date) return;
// // //           const dateString = record.date.substring(0, 10);
// // //           const recordYear = Number(dateString.substring(0, 4));
// // //           const recordMonth = Number(dateString.substring(5, 7));
// // //           const day = Number(dateString.substring(8, 10));

// // //           if (recordYear !== year || recordMonth !== month || !day) return;

// // //           const status = getDailyStatus(record);
// // //           recordsByDay.set(day, {
// // //             date: makeDateLabel(dateString, month, year),
// // //             status,
// // //             checkIn: formatTime(record.punch_in ?? record.check_in),
// // //             checkOut: formatTime(record.punch_out ?? record.check_out),
// // //             lateMinutes:
// // //               record.late_minutes ?? record.lateMinutes ?? undefined,
// // //           });
// // //         });

// // //         const daysInMonth = new Date(year, month, 0).getDate();
// // //         const dailyRecords: AttendanceRecord[] = Array.from(
// // //           { length: daysInMonth },
// // //           (_, index) => {
// // //             const day = index + 1;
// // //             return (
// // //               recordsByDay.get(day) ?? {
// // //                 date: `${String(day).padStart(2, "0")} ${MONTH_NAMES[month - 1]} ${year}`,
// // //                 // Missing backend day: neutral absent fallback, never infer a weekend.
// // //                 status: "AB" as AttendanceStatus,
// // //               }
// // //             );
// // //           },
// // //         );

// // //         const monthlySummary = calculateMonthlySummary(dailyRecords);
// // //         const lateCount = dailyRecords.filter(
// // //           (record) => record.status === "P" && (record.lateMinutes ?? 0) > 0,
// // //         ).length;

// // //         return {
// // //           id,
// // //           name,
// // //           designation: getDisplayValue(backendEmployee.designation),
// // //           department: getDisplayValue(backendEmployee.department),
// // //           avatar: getAvatarUrl(backendEmployee, name),
// // //           dailyRecords,
// // //           lateCount,
// // //           monthlySummary,
// // //         };
// // //       });

// // //       if (filters.searchTerm?.trim()) {
// // //         const searchTerm = filters.searchTerm.toLowerCase().trim();
// // //         employees = employees.filter((employee) =>
// // //           employee.name.toLowerCase().includes(searchTerm) ||
// // //           employee.id.toLowerCase().includes(searchTerm) ||
// // //           employee.designation.toLowerCase().includes(searchTerm) ||
// // //           employee.department.toLowerCase().includes(searchTerm)
// // //         );
// // //       }

// // //       if (filters.department) {
// // //         employees = employees.filter(
// // //           (employee) => employee.department === filters.department,
// // //         );
// // //       }

// // //       employees.sort((a, b) => a.name.localeCompare(b.name));

// // //       const paginationData = payload.pagination ?? {};
// // //       const totalItems =
// // //         paginationData.total_records ??
// // //         paginationData.total_items ??
// // //         backendEmployees.length;
// // //       const totalPages =
// // //         paginationData.total_pages ??
// // //         Math.max(1, Math.ceil(totalItems / pageSize));
// // //       const currentPage =
// // //         paginationData.current_page ?? paginationData.page ?? page;

// // //       return {
// // //         employees,
// // //         statistics: calculateStatistics(employees),
// // //         pagination: {
// // //           currentPage,
// // //           pageSize: paginationData.page_size ?? pageSize,
// // //           totalItems,
// // //           totalPages,
// // //         },
// // //       };
// // //     } catch (error) {
// // //       const errorMessage = getErrorMessage(error);
// // //       console.error("Attendance history API error:", errorMessage);
// // //       throw new Error(errorMessage);
// // //     }
// // //   }

// // //   async getMonthlySummary(filters: AttendanceFilters): Promise<EmployeeAttendance[]> {
// // //     const response = await this.getAttendanceHistory(filters, 1, 10000);
// // //     return response.employees;
// // //   }

// // //   async calculateLateMarks(filters: AttendanceFilters): Promise<BackendLateMarkResponse> {
// // //     const [year, month] = filters.month.split("-").map(Number);
// // //     if (!year || !month || month < 1 || month > 12) {
// // //       throw new Error("Invalid attendance month.");
// // //     }

// // //     const fromDate = `${year}-${String(month).padStart(2, "0")}-01`;
// // //     const lastDay = new Date(year, month, 0).getDate();
// // //     const toDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

// // //     const request: LateMarkRequest = {
// // //       from_date: fromDate,
// // //       to_date: toDate,
// // //       grace_minutes: 15,
// // //     };

// // //     const response = await axiosInstance.post<BackendLateMarkResponse>(
// // //       `${ATTENDANCE_ENDPOINT}/late-marks/calculate`,
// // //       request,
// // //     );
// // //     return response.data;
// // //   }

// // //   async exportAttendanceHistory(filters: AttendanceFilters): Promise<Blob> {
// // //     const response = await this.getAttendanceHistory(filters, 1, 10000);
// // //     const headers = [
// // //       "Employee", "ID", "Present", "WO", "PL", "CO", "CL",
// // //       "HD-PL", "HD-CL", "HD-CO", "PH", "LOP", "HD-LOP",
// // //       "LWP", "Paid Days", "LOP/Absent",
// // //     ];

// // //     const escapeCsvValue = (value: unknown): string => {
// // //       const stringValue = String(value ?? "");
// // //       if (
// // //         stringValue.includes(",") ||
// // //         stringValue.includes('"') ||
// // //         stringValue.includes("\n")
// // //       ) {
// // //         return `"${stringValue.replace(/"/g, '""')}"`;
// // //       }
// // //       return stringValue;
// // //     };

// // //     const rows = response.employees.map((employee) => {
// // //       const summary = employee.monthlySummary;
// // //       return [
// // //         employee.name,
// // //         employee.id,
// // //         summary.present,
// // //         summary.weekOff,
// // //         summary.paidLeave,
// // //         summary.compensatoryLeave,
// // //         summary.casualLeave,
// // //         summary.halfDayPL,
// // //         summary.halfDayCL,
// // //         summary.halfDayCO,
// // //         summary.publicHoliday,
// // //         summary.lop,
// // //         summary.halfDayLOP,
// // //         summary.lwp,
// // //         summary.paidDays,
// // //         summary.lopAbsent,
// // //       ].map(escapeCsvValue).join(",");
// // //     });

// // //     return new Blob([[headers.join(","), ...rows].join("\n")], {
// // //       type: "text/csv;charset=utf-8;",
// // //     });
// // //   }

// // //   async getInsights(): Promise<AttendanceInsights> {
// // //     return {
// // //       title: "Attendance Insights",
// // //       description:
// // //         "Late-mark insights are unavailable because the backend does not currently provide late-mark information.",
// // //       count: 0,
// // //       actionLabel: "No Details Available",
// // //     };
// // //   }

// // //   async getFilters(): Promise<AttendanceFilters> {
// // //     const now = new Date();
// // //     return {
// // //       month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
// // //       year: now.getFullYear(),
// // //     };
// // //   }
// // // }

// // // export const attendanceHistoryService = AttendanceHistoryService.getInstance();


// // /**
// //  * ======================================================
// //  * Attendance Module - Service Layer
// //  * ======================================================
// //  * Enterprise-grade service for managing:
// //  *
// //  * - Attendance history
// //  * - Attendance summary
// //  * - Attendance overview
// //  * - Attendance export
// //  * - Current daily punch state
// //  * - Punch In
// //  * - Break In
// //  * - Break Out
// //  * - Punch Out
// //  *
// //  * IMPORTANT:
// //  * Set USE_MOCK = true during frontend development.
// //  * Set USE_MOCK = false when the real API is ready.
// //  *
// //  * @module services/attendance.service
// //  */

// // import axios, {
// //   AxiosInstance,
// //   AxiosResponse,
// // } from 'axios';

// // import {
// //   AttendanceRecord,
// //   AttendanceSummary,
// //   AttendanceOverviewItem,
// //   AttendanceFilter,
// //   AttendanceApiResponse,
// //   AttendanceExportResponse,
// //   DailyPunchState,
// //   PunchActionRequest,
// //   PunchActionResponse,
// // } from '../types/attendance.types';

// // import {
// //   API_ENDPOINTS,
// // } from '../constants/attendance.constants';

// // import {
// //   attendanceMockData,
// // } from '../components/mocks/attendance.mock';

// // // -----------------------------------------------------------------------------
// // // Configuration
// // // -----------------------------------------------------------------------------

// // /**
// //  * Switch between mock data and real API.
// //  *
// //  * true  = frontend mock mode
// //  * false = real backend API
// //  */
// // const USE_MOCK = false;

// // /**
// //  * Base API URL for attendance endpoints.
// //  */
// // const API_BASE_URL =
// //   import.meta.env.VITE_API_BASE_URL ||
// //   'http://localhost:8000/api/v1';

// // // -----------------------------------------------------------------------------
// // // Axios Instance
// // // -----------------------------------------------------------------------------

// // const httpClient: AxiosInstance = axios.create({
// //   baseURL: API_BASE_URL,
// //   timeout: 30000,
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // });

// // // -----------------------------------------------------------------------------
// // // Service Interface
// // // -----------------------------------------------------------------------------

// // export interface IAttendanceService {
// //   /**
// //    * Get attendance history.
// //    */
// //   getAttendance(
// //     filters?: AttendanceFilter
// //   ): Promise<AttendanceApiResponse>;

// //   /**
// //    * Get attendance summary.
// //    */
// //   getAttendanceSummary(
// //     filters?: AttendanceFilter
// //   ): Promise<AttendanceSummary>;

// //   /**
// //    * Get monthly attendance overview.
// //    */
// //   getAttendanceOverview(
// //     year: number,
// //     month: number
// //   ): Promise<AttendanceOverviewItem[]>;

// //   /**
// //    * Export attendance report.
// //    */
// //   exportAttendance(
// //     filters?: AttendanceFilter
// //   ): Promise<AttendanceExportResponse>;

// //   /**
// //    * Filter attendance records.
// //    */
// //   filterAttendance(
// //     filters: AttendanceFilter
// //   ): Promise<AttendanceApiResponse>;

// //   /**
// //    * Get today's attendance/punch state
// //    * for the currently logged-in employee.
// //    */
// //   getTodayAttendance(): Promise<DailyPunchState>;

// //   /**
// //    * Execute one attendance action:
// //    *
// //    * PUNCH_IN
// //    * BREAK_IN
// //    * BREAK_OUT
// //    * PUNCH_OUT
// //    */
// //   executePunchAction(
// //     request: PunchActionRequest
// //   ): Promise<PunchActionResponse>;
// // }

// // // -----------------------------------------------------------------------------
// // // Mock Service Implementation
// // // -----------------------------------------------------------------------------

// // class MockAttendanceService implements IAttendanceService {
// //   /**
// //    * Simulates API latency.
// //    */
// //   private delay(
// //     ms: number = 500
// //   ): Promise<void> {
// //     return new Promise(resolve =>
// //       setTimeout(resolve, ms)
// //     );
// //   }

// //   /**
// //    * Current day's punch state.
// //    *
// //    * This allows the Dashboard PunchCard to behave
// //    * like a real attendance system even before the
// //    * backend API is connected.
// //    */
// //   private dailyState: DailyPunchState = {
// //     id: null,

// //     employeeId: 'CURRENT_USER',

// //     attendanceDate: new Date()
// //       .toISOString()
// //       .split('T')[0],

// //     punchIn: null,

// //     punchOut: null,

// //     breakIn: null,

// //     breakOut: null,

// //     punchState: 'NOT_PUNCHED_IN',

// //     isPunchedIn: false,

// //     isOnBreak: false,

// //     isPunchedOut: false,

// //     workingMinutes: 0,

// //     breakMinutes: 0,

// //     punchInLocation: null,

// //     punchOutLocation: null,

// //     lastAction: null,

// //     lastActionAt: null,
// //   };

// //   // ---------------------------------------------------------------------------
// //   // Attendance History
// //   // ---------------------------------------------------------------------------

// //   async getAttendance(
// //     filters?: AttendanceFilter
// //   ): Promise<AttendanceApiResponse> {
// //     await this.delay(600);

// //     let records = [
// //       ...attendanceMockData.records,
// //     ];

// //     if (filters) {
// //       if (filters.selectedDate) {
// //         records = records.filter(
// //           record =>
// //             record.date === filters.selectedDate
// //         );
// //       }

// //       if (filters.startDate) {
// //         records = records.filter(
// //           record =>
// //             record.date >= filters.startDate!
// //         );
// //       }

// //       if (filters.endDate) {
// //         records = records.filter(
// //           record =>
// //             record.date <= filters.endDate!
// //         );
// //       }

// //       if (filters.status) {
// //         records = records.filter(
// //           record =>
// //             record.status === filters.status
// //         );
// //       }

// //       if (filters.searchTerm) {
// //         const search =
// //           filters.searchTerm.toLowerCase();

// //         records = records.filter(record =>
// //           record.employeeName
// //             ?.toLowerCase()
// //             .includes(search) ||
// //           record.id
// //             .toLowerCase()
// //             .includes(search)
// //         );
// //       }
// //     }

// //     const summary =
// //       this.calculateSummary(
// //         records,
// //         filters
// //       );

// //     return {
// //       records,

// //       summary,

// //       overview:
// //         attendanceMockData.overview,

// //       totalCount:
// //         records.length,

// //       page: 1,

// //       pageSize: 10,
// //     };
// //   }

// //   // ---------------------------------------------------------------------------
// //   // Attendance Summary
// //   // ---------------------------------------------------------------------------

// //   async getAttendanceSummary(
// //     filters?: AttendanceFilter
// //   ): Promise<AttendanceSummary> {
// //     await this.delay(400);

// //     const data =
// //       await this.getAttendance(filters);

// //     return data.summary;
// //   }

// //   // ---------------------------------------------------------------------------
// //   // Attendance Overview
// //   // ---------------------------------------------------------------------------

// //   async getAttendanceOverview(
// //     year: number,
// //     month: number
// //   ): Promise<AttendanceOverviewItem[]> {
// //     await this.delay(300);

// //     const datePrefix =
// //       `${year}-${String(month).padStart(2, '0')}`;

// //     return attendanceMockData.overview.filter(
// //       item =>
// //         item.date.startsWith(datePrefix)
// //     );
// //   }

// //   // ---------------------------------------------------------------------------
// //   // Attendance Export
// //   // ---------------------------------------------------------------------------

// //   async exportAttendance(
// //     _filters?: AttendanceFilter
// //   ): Promise<AttendanceExportResponse> {
// //     await this.delay(800);

// //     return {
// //       downloadUrl:
// //         '/mock/attendance-export.xlsx',

// //       fileName:
// //         `attendance-${
// //           new Date()
// //             .toISOString()
// //             .split('T')[0]
// //         }.xlsx`,
// //     };
// //   }

// //   // ---------------------------------------------------------------------------
// //   // Attendance Filter
// //   // ---------------------------------------------------------------------------

// //   async filterAttendance(
// //     filters: AttendanceFilter
// //   ): Promise<AttendanceApiResponse> {
// //     return this.getAttendance(filters);
// //   }

// //   // ---------------------------------------------------------------------------
// //   // TODAY ATTENDANCE
// //   // ---------------------------------------------------------------------------

// //   /**
// //    * Returns the current attendance state
// //    * of the logged-in employee.
// //    */
// //   async getTodayAttendance(): Promise<DailyPunchState> {
// //     await this.delay(250);

// //     return {
// //       ...this.dailyState,
// //     };
// //   }

// //   // ---------------------------------------------------------------------------
// //   // PUNCH ACTION
// //   // ---------------------------------------------------------------------------

// //   /**
// //    * Executes:
// //    *
// //    * PUNCH_IN
// //    * BREAK_IN
// //    * BREAK_OUT
// //    * PUNCH_OUT
// //    *
// //    * Includes frontend state validation so the UI
// //    * behaves exactly like a real attendance workflow.
// //    */
// //   async executePunchAction(
// //     request: PunchActionRequest
// //   ): Promise<PunchActionResponse> {
// //     await this.delay(400);

// //     const now = new Date();

// //     const timestamp =
// //       now.toISOString();

// //     const displayTime =
// //       now.toLocaleTimeString(
// //         'en-US',
// //         {
// //           hour: '2-digit',
// //           minute: '2-digit',
// //           hour12: true,
// //         }
// //       );

// //     const location =
// //       request.latitude !== undefined &&
// //       request.longitude !== undefined
// //         ? {
// //             latitude:
// //               request.latitude,

// //             longitude:
// //               request.longitude,

// //             accuracy:
// //               request.accuracy ?? 0,

// //             address:
// //               request.address ?? null,
// //           }
// //         : null;

// //     // -------------------------------------------------------------------------
// //     // PUNCH IN
// //     // -------------------------------------------------------------------------

// //     if (
// //       request.action === 'PUNCH_IN'
// //     ) {
// //       if (
// //         this.dailyState.isPunchedIn
// //       ) {
// //         return {
// //           success: false,

// //           message:
// //             'You have already punched in.',

// //           action:
// //             request.action,

// //           actionStatus:
// //             'ALREADY_COMPLETED',

// //           attendance:
// //             { ...this.dailyState },

// //           timestamp,
// //         };
// //       }

// //       this.dailyState = {
// //         ...this.dailyState,

// //         id:
// //           this.dailyState.id ??
// //           `ATT-${Date.now()}`,

// //         punchIn:
// //           displayTime,

// //         punchState:
// //           'WORKING',

// //         isPunchedIn:
// //           true,

// //         isOnBreak:
// //           false,

// //         isPunchedOut:
// //           false,

// //         lastAction:
// //           'PUNCH_IN',

// //         lastActionAt:
// //           timestamp,

// //         punchInLocation:
// //           location,
// //       };

// //       return {
// //         success: true,

// //         message:
// //           'Punch In completed successfully.',

// //         action:
// //           request.action,

// //         actionStatus:
// //           'SUCCESS',

// //         attendance:
// //           { ...this.dailyState },

// //         timestamp,

// //         location,
// //       };
// //     }

// //     // -------------------------------------------------------------------------
// //     // BREAK IN
// //     // -------------------------------------------------------------------------

// //     if (
// //       request.action === 'BREAK_IN'
// //     ) {
// //       if (
// //         !this.dailyState.isPunchedIn
// //       ) {
// //         return {
// //           success: false,

// //           message:
// //             'Please punch in before starting a break.',

// //           action:
// //             request.action,

// //           actionStatus:
// //             'INVALID_STATE',

// //           attendance:
// //             { ...this.dailyState },

// //           timestamp,
// //         };
// //       }

// //       if (
// //         this.dailyState.isPunchedOut
// //       ) {
// //         return {
// //           success: false,

// //           message:
// //             'You have already punched out.',

// //           action:
// //             request.action,

// //           actionStatus:
// //             'INVALID_STATE',

// //           attendance:
// //             { ...this.dailyState },

// //           timestamp,
// //         };
// //       }

// //       if (
// //         this.dailyState.isOnBreak
// //       ) {
// //         return {
// //           success: false,

// //           message:
// //             'Break is already active.',

// //           action:
// //             request.action,

// //           actionStatus:
// //             'ALREADY_COMPLETED',

// //           attendance:
// //             { ...this.dailyState },

// //           timestamp,
// //         };
// //       }

// //       this.dailyState = {
// //         ...this.dailyState,

// //         breakIn:
// //           displayTime,

// //         breakOut:
// //           null,

// //         punchState:
// //           'ON_BREAK',

// //         isOnBreak:
// //           true,

// //         lastAction:
// //           'BREAK_IN',

// //         lastActionAt:
// //           timestamp,
// //       };

// //       return {
// //         success: true,

// //         message:
// //           'Break In completed successfully.',

// //         action:
// //           request.action,

// //         actionStatus:
// //           'SUCCESS',

// //         attendance:
// //           { ...this.dailyState },

// //         timestamp,

// //         location,
// //       };
// //     }

// //     // -------------------------------------------------------------------------
// //     // BREAK OUT
// //     // -------------------------------------------------------------------------

// //     if (
// //       request.action === 'BREAK_OUT'
// //     ) {
// //       if (
// //         !this.dailyState.isOnBreak
// //       ) {
// //         return {
// //           success: false,

// //           message:
// //             'There is no active break.',

// //           action:
// //             request.action,

// //           actionStatus:
// //             'INVALID_STATE',

// //           attendance:
// //             { ...this.dailyState },

// //           timestamp,
// //         };
// //       }

// //       this.dailyState = {
// //         ...this.dailyState,

// //         breakOut:
// //           displayTime,

// //         punchState:
// //           'WORKING',

// //         isOnBreak:
// //           false,

// //         lastAction:
// //           'BREAK_OUT',

// //         lastActionAt:
// //           timestamp,
// //       };

// //       return {
// //         success: true,

// //         message:
// //           'Break Out completed successfully.',

// //         action:
// //           request.action,

// //         actionStatus:
// //           'SUCCESS',

// //         attendance:
// //           { ...this.dailyState },

// //         timestamp,

// //         location,
// //       };
// //     }

// //     // -------------------------------------------------------------------------
// //     // PUNCH OUT
// //     // -------------------------------------------------------------------------

// //     if (
// //       request.action === 'PUNCH_OUT'
// //     ) {
// //       if (
// //         !this.dailyState.isPunchedIn
// //       ) {
// //         return {
// //           success: false,

// //           message:
// //             'Please punch in before punching out.',

// //           action:
// //             request.action,

// //           actionStatus:
// //             'INVALID_STATE',

// //           attendance:
// //             { ...this.dailyState },

// //           timestamp,
// //         };
// //       }

// //       if (
// //         this.dailyState.isOnBreak
// //       ) {
// //         return {
// //           success: false,

// //           message:
// //             'Please end your break before punching out.',

// //           action:
// //             request.action,

// //           actionStatus:
// //             'INVALID_STATE',

// //           attendance:
// //             { ...this.dailyState },

// //           timestamp,
// //         };
// //       }

// //       if (
// //         this.dailyState.isPunchedOut
// //       ) {
// //         return {
// //           success: false,

// //           message:
// //             'You have already punched out.',

// //           action:
// //             request.action,

// //           actionStatus:
// //             'ALREADY_COMPLETED',

// //           attendance:
// //             { ...this.dailyState },

// //           timestamp,
// //         };
// //       }

// //       this.dailyState = {
// //         ...this.dailyState,

// //         punchOut:
// //           displayTime,

// //         punchState:
// //           'PUNCHED_OUT',

// //         isPunchedIn:
// //           true,

// //         isOnBreak:
// //           false,

// //         isPunchedOut:
// //           true,

// //         lastAction:
// //           'PUNCH_OUT',

// //         lastActionAt:
// //           timestamp,

// //         punchOutLocation:
// //           location,
// //       };

// //       return {
// //         success: true,

// //         message:
// //           'Punch Out completed successfully.',

// //         action:
// //           request.action,

// //         actionStatus:
// //           'SUCCESS',

// //         attendance:
// //           { ...this.dailyState },

// //         timestamp,

// //         location,
// //       };
// //     }

// //     // -------------------------------------------------------------------------
// //     // INVALID ACTION
// //     // -------------------------------------------------------------------------

// //     return {
// //       success: false,

// //       message:
// //         'Invalid attendance action.',

// //       action:
// //         request.action,

// //       actionStatus:
// //         'FAILED',

// //       attendance:
// //         { ...this.dailyState },

// //       timestamp,
// //     };
// //   }

// //   // ---------------------------------------------------------------------------
// //   // Summary Calculation
// //   // ---------------------------------------------------------------------------

// //   private calculateSummary(
// //     records: AttendanceRecord[],
// //     filters?: AttendanceFilter
// //   ): AttendanceSummary {
// //     const total =
// //       records.length;

// //     const present =
// //       records.filter(
// //         record =>
// //           record.status === 'Present'
// //       ).length;

// //     const absent =
// //       records.filter(
// //         record =>
// //           record.status === 'Absent'
// //       ).length;

// //     const late =
// //       records.filter(
// //         record =>
// //           record.status === 'Late'
// //       ).length;

// //     const weeklyOff =
// //       records.filter(
// //         record =>
// //           record.status === 'WeeklyOff'
// //       ).length;

// //     const holiday =
// //       records.filter(
// //         record =>
// //           record.status === 'Holiday'
// //       ).length;

// //     const workingDays =
// //       total -
// //       weeklyOff -
// //       holiday;

// //     const presentPercentage =
// //       workingDays > 0
// //         ? Math.round(
// //             (present / workingDays) *
// //               100
// //           )
// //         : 0;

// //     const absentPercentage =
// //       workingDays > 0
// //         ? Math.round(
// //             (absent / workingDays) *
// //               100
// //           )
// //         : 0;

// //     const latePercentage =
// //       workingDays > 0
// //         ? Math.round(
// //             (late / workingDays) *
// //               100
// //           )
// //         : 0;

// //     const workRecords =
// //       records.filter(
// //         record =>
// //           record.status === 'Present' ||
// //           record.status === 'Late'
// //       );

// //     const totalHours =
// //       workRecords.reduce(
// //         (sum, record) =>
// //           sum + record.workingHours,
// //         0
// //       );

// //     const avgHours =
// //       workRecords.length > 0
// //         ? totalHours /
// //           workRecords.length
// //         : 0;

// //     const hours =
// //       Math.floor(avgHours);

// //     const minutes =
// //       Math.round(
// //         (avgHours - hours) * 60
// //       );

// //     const avgWorkingHours =
// //       `${String(hours).padStart(2, '0')}:${String(
// //         minutes
// //       ).padStart(2, '0')}`;

// //     let totalDays =
// //       total;

// //     if (
// //       filters?.startDate &&
// //       filters?.endDate
// //     ) {
// //       const start =
// //         new Date(filters.startDate);

// //       const end =
// //         new Date(filters.endDate);

// //       const diffTime =
// //         Math.abs(
// //           end.getTime() -
// //             start.getTime()
// //         );

// //       totalDays =
// //         Math.ceil(
// //           diffTime /
// //             (1000 *
// //               60 *
// //               60 *
// //               24)
// //         ) + 1;
// //     }

// //     return {
// //       totalDays,

// //       presentDays:
// //         present,

// //       presentPercentage,

// //       absentDays:
// //         absent,

// //       absentPercentage,

// //       lateDays:
// //         late,

// //       latePercentage,

// //       averageWorkingHours:
// //         avgWorkingHours,
// //     };
// //   }
// // }

// // // -----------------------------------------------------------------------------
// // // Real API Service Implementation
// // // -----------------------------------------------------------------------------

// // class ApiAttendanceService
// //   implements IAttendanceService {

// //   private buildQueryParams(
// //     filters?: AttendanceFilter
// //   ): URLSearchParams {
// //     const params =
// //       new URLSearchParams();

// //     if (filters) {
// //       if (filters.startDate) {
// //         params.append(
// //           'start_date',
// //           filters.startDate
// //         );
// //       }

// //       if (filters.endDate) {
// //         params.append(
// //           'end_date',
// //           filters.endDate
// //         );
// //       }

// //       if (filters.selectedDate) {
// //         params.append(
// //           'date',
// //           filters.selectedDate
// //         );
// //       }

// //       if (filters.status) {
// //         params.append(
// //           'status',
// //           filters.status
// //         );
// //       }

// //       if (filters.searchTerm) {
// //         params.append(
// //           'search',
// //           filters.searchTerm
// //         );
// //       }
// //     }

// //     return params;
// //   }

// //   private handleResponse<T>(
// //     response: AxiosResponse
// //   ): T {
// //     if (
// //       response.data &&
// //       response.data.data
// //     ) {
// //       return response.data.data as T;
// //     }

// //     return response.data as T;
// //   }

// //   private handleError(
// //     error: unknown
// //   ): never {
// //     if (
// //       axios.isAxiosError(error)
// //     ) {
// //       const message =
// //         error.response?.data?.message ||
// //         error.message ||
// //         'An error occurred';

// //       throw new Error(
// //         `Attendance API Error: ${message}`
// //       );
// //     }

// //     throw new Error(
// //       'An unexpected error occurred'
// //     );
// //   }

// //   // ---------------------------------------------------------------------------
// //   // Attendance History
// //   // ---------------------------------------------------------------------------

// //   async getAttendance(
// //     filters?: AttendanceFilter
// //   ): Promise<AttendanceApiResponse> {
// //     try {
// //       const params =
// //         this.buildQueryParams(filters);

// //       const query =
// //         params.toString();

// //       const url =
// //         query.length > 0
// //           ? `${API_ENDPOINTS.attendance}?${query}`
// //           : API_ENDPOINTS.attendance;

// //       const response =
// //         await httpClient.get<AttendanceApiResponse>(
// //           url
// //         );

// //       return this.handleResponse<AttendanceApiResponse>(
// //         response
// //       );
// //     } catch (error) {
// //       return this.handleError(error);
// //     }
// //   }

// //   // ---------------------------------------------------------------------------
// //   // Summary
// //   // ---------------------------------------------------------------------------

// //   async getAttendanceSummary(
// //     filters?: AttendanceFilter
// //   ): Promise<AttendanceSummary> {
// //     try {
// //       const params =
// //         this.buildQueryParams(filters);

// //       const query =
// //         params.toString();

// //       const url =
// //         query.length > 0
// //           ? `${API_ENDPOINTS.summary}?${query}`
// //           : API_ENDPOINTS.summary;

// //       const response =
// //         await httpClient.get<AttendanceSummary>(
// //           url
// //         );

// //       return this.handleResponse<AttendanceSummary>(
// //         response
// //       );
// //     } catch (error) {
// //       return this.handleError(error);
// //     }
// //   }

// //   // ---------------------------------------------------------------------------
// //   // Overview
// //   // ---------------------------------------------------------------------------

// //   async getAttendanceOverview(
// //     year: number,
// //     month: number
// //   ): Promise<AttendanceOverviewItem[]> {
// //     try {
// //       const params =
// //         new URLSearchParams();

// //       params.append(
// //         'year',
// //         year.toString()
// //       );

// //       params.append(
// //         'month',
// //         month.toString()
// //       );

// //       const query =
// //         params.toString();

// //       const url =
// //         `${API_ENDPOINTS.overview}?${query}`;

// //       const response =
// //         await httpClient.get<
// //           AttendanceOverviewItem[]
// //         >(url);

// //       return this.handleResponse<
// //         AttendanceOverviewItem[]
// //       >(response);
// //     } catch (error) {
// //       return this.handleError(error);
// //     }
// //   }

// //   // ---------------------------------------------------------------------------
// //   // Export
// //   // ---------------------------------------------------------------------------

// //   async exportAttendance(
// //     filters?: AttendanceFilter
// //   ): Promise<AttendanceExportResponse> {
// //     try {
// //       const params =
// //         this.buildQueryParams(filters);

// //       const query =
// //         params.toString();

// //       const url =
// //         query.length > 0
// //           ? `${API_ENDPOINTS.export}?${query}`
// //           : API_ENDPOINTS.export;

// //       const response =
// //         await httpClient.get(
// //           url,
// //           {
// //             responseType: 'blob',
// //           }
// //         );

// //       const blob =
// //         response.data as Blob;

// //       const downloadUrl =
// //         URL.createObjectURL(blob);

// //       const fileName =
// //         `attendance-${
// //           new Date()
// //             .toISOString()
// //             .split('T')[0]
// //         }.xlsx`;

// //       return {
// //         downloadUrl,
// //         fileName,
// //       };
// //     } catch (error) {
// //       return this.handleError(error);
// //     }
// //   }

// //   // ---------------------------------------------------------------------------
// //   // Filter
// //   // ---------------------------------------------------------------------------

// //   async filterAttendance(
// //     filters: AttendanceFilter
// //   ): Promise<AttendanceApiResponse> {
// //     try {
// //       const params =
// //         this.buildQueryParams(filters);

// //       const query =
// //         params.toString();

// //       const url =
// //         query.length > 0
// //           ? `${API_ENDPOINTS.filter}?${query}`
// //           : API_ENDPOINTS.filter;

// //       const response =
// //         await httpClient.get<AttendanceApiResponse>(
// //           url
// //         );

// //       return this.handleResponse<AttendanceApiResponse>(
// //         response
// //       );
// //     } catch (error) {
// //       return this.handleError(error);
// //     }
// //   }

// //   // ---------------------------------------------------------------------------
// //   // TODAY ATTENDANCE
// //   // ---------------------------------------------------------------------------

// //   async getTodayAttendance(): Promise<DailyPunchState> {
// //     try {
// //       const response =
// //         await httpClient.get<DailyPunchState>(
// //           API_ENDPOINTS.today
// //         );

// //       return this.handleResponse<DailyPunchState>(
// //         response
// //       );
// //     } catch (error) {
// //       return this.handleError(error);
// //     }
// //   }

// //   // ---------------------------------------------------------------------------
// //   // PUNCH ACTION
// //   // ---------------------------------------------------------------------------

// //   // async executePunchAction(
// //   //   request: PunchActionRequest
// //   // ): Promise<PunchActionResponse> {
// //   //   try {
// //   //     const response =
// //   //       await httpClient.post<PunchActionResponse>(
// //   //         API_ENDPOINTS.punchAction,
// //   //         request
// //   //       );

// //   //     return this.handleResponse<PunchActionResponse>(
// //   //       response
// //   //     );
// //   //   } catch (error) {
// //   //     return this.handleError(error);
// //   //   }
// //   // }

// //   async executePunchAction(
// //   request: PunchActionRequest
// // ): Promise<PunchActionResponse> {
// //   try {
// //     const actionEndpoints = {
// //       PUNCH_IN: API_ENDPOINTS.punchIn,
// //       BREAK_IN: API_ENDPOINTS.breakIn,
// //       BREAK_OUT: API_ENDPOINTS.breakOut,
// //       PUNCH_OUT: API_ENDPOINTS.punchOut,
// //     };

// //     const endpoint = actionEndpoints[request.action];

// //     const response = await httpClient.post<PunchActionResponse>(
// //       endpoint,
// //       request
// //     );

// //     return this.handleResponse<PunchActionResponse>(response);
// //   } catch (error) {
// //     return this.handleError(error);
// //   }
// // }
// // }

// // // -----------------------------------------------------------------------------
// // // Service Factory
// // // -----------------------------------------------------------------------------

// // export const attendanceService: IAttendanceService =
// //   USE_MOCK
// //     ? new MockAttendanceService()
// //     : new ApiAttendanceService();

// // // -----------------------------------------------------------------------------
// // // Mock Mode Helper
// // // -----------------------------------------------------------------------------

// // export const isUsingMock =
// //   USE_MOCK;

// // // -----------------------------------------------------------------------------
// // // Testing Exports
// // // -----------------------------------------------------------------------------

// // export {
// //   MockAttendanceService,
// //   ApiAttendanceService,
// // };



// // /**
// //  * ======================================================
// //  * Attendance Module - Service Layer
// //  * ======================================================
// //  */

// // import axios, { AxiosResponse } from "axios";

// // import axiosInstance from "../../../services/axios/axiosInstance";

// // import {
// //   AttendanceRecord,
// //   AttendanceSummary,
// //   AttendanceOverviewItem,
// //   AttendanceFilter,
// //   AttendanceApiResponse,
// //   AttendanceExportResponse,
// //   DailyPunchState,
// //   PunchActionRequest,
// //   PunchActionResponse,
// //   AttendanceAction,
// //   AttendanceTimelineActivity,
// // } from "../types/attendance.types";

// // import { API_ENDPOINTS } from "../constants/attendance.constants";
// // import { attendanceMockData } from "../components/mocks/attendance.mock";

// // // =============================================================================
// // // Configuration
// // // =============================================================================

// // /**
// //  * false = use real HRMS API
// //  * true  = use frontend mock data
// //  */
// // const USE_MOCK = false;

// // // =============================================================================
// // // Punch Action Endpoints
// // // =============================================================================

// // const ATTENDANCE_ACTION_ENDPOINTS: Record<
// //   AttendanceAction,
// //   string
// // > = {
// //   PUNCH_IN: "api/v1/attendance/punch-in",
// //   BREAK_IN: "api/v1/attendance/break-in",
// //   BREAK_OUT: "api/v1/attendance/break-out",
// //   PUNCH_OUT: "api/v1/attendance/punch-out",
// // };

// // // =============================================================================
// // // Service Interface
// // // =============================================================================

// // export interface IAttendanceService {
// //   getAttendance(
// //     filters?: AttendanceFilter,
// //   ): Promise<AttendanceApiResponse>;

// //   getAttendanceSummary(
// //     filters?: AttendanceFilter,
// //   ): Promise<AttendanceSummary>;

// //   getAttendanceOverview(
// //     year: number,
// //     month: number,
// //   ): Promise<AttendanceOverviewItem[]>;

// //   exportAttendance(
// //     filters?: AttendanceFilter,
// //   ): Promise<AttendanceExportResponse>;

// //   filterAttendance(
// //     filters: AttendanceFilter,
// //   ): Promise<AttendanceApiResponse>;

// //   getTodayAttendance(): Promise<DailyPunchState>;

// //   getTodayTimeline(): Promise<AttendanceTimelineActivity[]>;

// //   executePunchAction(
// //     request: PunchActionRequest,
// //   ): Promise<PunchActionResponse>;
// // }

// // // =============================================================================
// // // Mock Service
// // // =============================================================================

// // class MockAttendanceService implements IAttendanceService {
// //   private delay(
// //     milliseconds: number = 500,
// //   ): Promise<void> {
// //     return new Promise((resolve) =>
// //       setTimeout(resolve, milliseconds),
// //     );
// //   }

// //   private dailyState: DailyPunchState = {
// //     id: null,
// //     employeeId: "CURRENT_USER",
// //     attendanceDate: new Date()
// //       .toISOString()
// //       .split("T")[0],

// //     punchIn: null,
// //     punchOut: null,

// //     breakIn: null,
// //     breakOut: null,

// //     punchState: "NOT_PUNCHED_IN",

// //     isPunchedIn: false,
// //     isOnBreak: false,
// //     isPunchedOut: false,

// //     workingMinutes: 0,
// //     breakMinutes: 0,

// //     punchInLocation: null,
// //     punchOutLocation: null,

// //     lastAction: null,
// //     lastActionAt: null,
// //   };

// //   // ===========================================================================
// //   // Attendance History
// //   // ===========================================================================

// //   async getAttendance(
// //     filters?: AttendanceFilter,
// //   ): Promise<AttendanceApiResponse> {
// //     await this.delay(600);

// //     let records: AttendanceRecord[] = [
// //       ...attendanceMockData.records,
// //     ];

// //     if (filters) {
// //       if (filters.selectedDate) {
// //         records = records.filter(
// //           (record) =>
// //             record.date === filters.selectedDate,
// //         );
// //       }

// //       if (filters.startDate) {
// //         records = records.filter(
// //           (record) =>
// //             record.date >= filters.startDate!,
// //         );
// //       }

// //       if (filters.endDate) {
// //         records = records.filter(
// //           (record) =>
// //             record.date <= filters.endDate!,
// //         );
// //       }

// //       if (filters.status) {
// //         records = records.filter(
// //           (record) =>
// //             record.status === filters.status,
// //         );
// //       }

// //       if (filters.searchTerm) {
// //         const search =
// //           filters.searchTerm
// //             .trim()
// //             .toLowerCase();

// //         records = records.filter(
// //           (record) =>
// //             record.employeeName
// //               ?.toLowerCase()
// //               .includes(search) ||
// //             record.id
// //               .toLowerCase()
// //               .includes(search),
// //         );
// //       }
// //     }

// //     return {
// //       records,

// //       summary: this.calculateSummary(
// //         records,
// //         filters,
// //       ),

// //       overview: attendanceMockData.overview,

// //       totalCount: records.length,

// //       page: 1,

// //       pageSize: 10,
// //     };
// //   }

// //   // ===========================================================================
// //   // Summary
// //   // ===========================================================================

// //   async getAttendanceSummary(
// //     filters?: AttendanceFilter,
// //   ): Promise<AttendanceSummary> {
// //     await this.delay(400);

// //     const response =
// //       await this.getAttendance(filters);

// //     return response.summary;
// //   }

// //   // ===========================================================================
// //   // Overview
// //   // ===========================================================================

// //   async getAttendanceOverview(
// //     year: number,
// //     month: number,
// //   ): Promise<AttendanceOverviewItem[]> {
// //     await this.delay(300);

// //     const datePrefix =
// //       `${year}-${String(month).padStart(2, "0")}`;

// //     return attendanceMockData.overview.filter(
// //       (item) =>
// //         item.date.startsWith(datePrefix),
// //     );
// //   }

// //   // ===========================================================================
// //   // Export
// //   // ===========================================================================

// //   async exportAttendance(
// //     _filters?: AttendanceFilter,
// //   ): Promise<AttendanceExportResponse> {
// //     await this.delay(800);

// //     return {
// //       downloadUrl:
// //         "/mock/attendance-export.xlsx",

// //       fileName: `attendance-${
// //         new Date()
// //           .toISOString()
// //           .split("T")[0]
// //       }.xlsx`,
// //     };
// //   }

// //   // ===========================================================================
// //   // Filter
// //   // ===========================================================================

// //   async filterAttendance(
// //     filters: AttendanceFilter,
// //   ): Promise<AttendanceApiResponse> {
// //     return this.getAttendance(filters);
// //   }

// //   // ===========================================================================
// //   // Today's Attendance
// //   // ===========================================================================

// //   async getTodayAttendance(): Promise<DailyPunchState> {
// //     await this.delay(250);

// //     return {
// //       ...this.dailyState,
// //     };
// //   }

// //   // ===========================================================================
// //   // Today's Activity Timeline
// //   // ===========================================================================

// //   async getTodayTimeline(): Promise<
// //     AttendanceTimelineActivity[]
// //   > {
// //     await this.delay(250);

// //     const activities: AttendanceTimelineActivity[] =
// //       [];

// //     if (this.dailyState.punchIn) {
// //       activities.push({
// //         id: "mock-punch-in",
// //         activity: "PI",
// //         log: this.dailyState.punchIn,
// //         address:
// //           this.dailyState.punchInLocation
// //             ?.address ?? null,
// //       });
// //     }

// //     if (this.dailyState.breakIn) {
// //       activities.push({
// //         id: "mock-break-in",
// //         activity: "BI",
// //         log: this.dailyState.breakIn,
// //         address: null,
// //       });
// //     }

// //     if (this.dailyState.breakOut) {
// //       activities.push({
// //         id: "mock-break-out",
// //         activity: "BO",
// //         log: this.dailyState.breakOut,
// //         address: null,
// //       });
// //     }

// //     if (this.dailyState.punchOut) {
// //       activities.push({
// //         id: "mock-punch-out",
// //         activity: "PO",
// //         log: this.dailyState.punchOut,
// //         address:
// //           this.dailyState.punchOutLocation
// //             ?.address ?? null,
// //       });
// //     }

// //     activities.sort(
// //       (a, b) =>
// //         new Date(a.log).getTime() -
// //         new Date(b.log).getTime(),
// //     );

// //     return activities;
// //   }

// //   // ===========================================================================
// //   // Punch Action
// //   // ===========================================================================

// //  // ===========================================================================
// // // Punch Action
// // // ===========================================================================

// // async executePunchAction(
// //   request: PunchActionRequest,
// // ): Promise<PunchActionResponse> {
// //   await this.delay(300);

// //   const now = new Date();
// //   const timestamp = now.toISOString();

// //   switch (request.action) {
// //     case "PUNCH_IN":
// //       if (this.dailyState.isPunchedIn) {
// //         return {
// //           success: false,
// //           message: "Already punched in.",
// //           action: request.action,
// //           actionStatus: "ALREADY_COMPLETED",
// //           attendance: { ...this.dailyState },
// //           timestamp,
// //         };
// //       }

// //       this.dailyState = {
// //         ...this.dailyState,
// //         punchIn: timestamp,
// //         punchOut: null,
// //         breakIn: null,
// //         breakOut: null,
// //         punchState: "WORKING",
// //         isPunchedIn: true,
// //         isOnBreak: false,
// //         isPunchedOut: false,
// //         punchInLocation: request.latitude != null && request.longitude != null
// //           ? {
// //               latitude: request.latitude,
// //               longitude: request.longitude,
// //               accuracy: request.accuracy ?? 0,
// //               address: request.address ?? null,
// //             }
// //           : null,
// //         lastAction: "PUNCH_IN",
// //         lastActionAt: timestamp,
// //       };

// //       return {
// //         success: true,
// //         message: "Punch In successful.",
// //         action: request.action,
// //         actionStatus: "SUCCESS",
// //         attendance: { ...this.dailyState },
// //         timestamp,
// //       };

// //     case "BREAK_IN":
// //       if (!this.dailyState.isPunchedIn) {
// //         return {
// //           success: false,
// //           message: "Please Punch In first.",
// //           action: request.action,
// //           actionStatus: "INVALID_STATE",
// //           attendance: { ...this.dailyState },
// //           timestamp,
// //         };
// //       }

// //       if (this.dailyState.isOnBreak) {
// //         return {
// //           success: false,
// //           message: "Already on break.",
// //           action: request.action,
// //           actionStatus: "ALREADY_COMPLETED",
// //           attendance: { ...this.dailyState },
// //           timestamp,
// //         };
// //       }

// //       this.dailyState = {
// //         ...this.dailyState,
// //         breakIn: timestamp,
// //         breakOut: null,
// //         punchState: "ON_BREAK",
// //         isOnBreak: true,
// //         lastAction: "BREAK_IN",
// //         lastActionAt: timestamp,
// //       };

// //       return {
// //         success: true,
// //         message: "Break In successful.",
// //         action: request.action,
// //         actionStatus: "SUCCESS",
// //         attendance: { ...this.dailyState },
// //         timestamp,
// //       };

// //     case "BREAK_OUT":
// //       if (!this.dailyState.isPunchedIn) {
// //         return {
// //           success: false,
// //           message: "Please Punch In first.",
// //           action: request.action,
// //           actionStatus: "INVALID_STATE",
// //           attendance: { ...this.dailyState },
// //           timestamp,
// //         };
// //       }

// //       if (!this.dailyState.isOnBreak) {
// //         return {
// //           success: false,
// //           message: "You are not currently on break.",
// //           action: request.action,
// //           actionStatus: "INVALID_STATE",
// //           attendance: { ...this.dailyState },
// //           timestamp,
// //         };
// //       }

// //       this.dailyState = {
// //         ...this.dailyState,
// //         breakOut: timestamp,
// //         punchState: "WORKING",
// //         isOnBreak: false,
// //         lastAction: "BREAK_OUT",
// //         lastActionAt: timestamp,
// //       };

// //       return {
// //         success: true,
// //         message: "Break Out successful.",
// //         action: request.action,
// //         actionStatus: "SUCCESS",
// //         attendance: { ...this.dailyState },
// //         timestamp,
// //       };

// //     case "PUNCH_OUT":
// //       if (!this.dailyState.isPunchedIn) {
// //         return {
// //           success: false,
// //           message: "Please Punch In first.",
// //           action: request.action,
// //           actionStatus: "INVALID_STATE",
// //           attendance: { ...this.dailyState },
// //           timestamp,
// //         };
// //       }

// //       if (this.dailyState.isOnBreak) {
// //         return {
// //           success: false,
// //           message: "Please Break Out before Punch Out.",
// //           action: request.action,
// //           actionStatus: "INVALID_STATE",
// //           attendance: { ...this.dailyState },
// //           timestamp,
// //         };
// //       }

// //       this.dailyState = {
// //         ...this.dailyState,
// //         punchOut: timestamp,
// //         punchState: "PUNCHED_OUT",
// //         isPunchedIn: false,
// //         isOnBreak: false,
// //         isPunchedOut: true,
// //         punchOutLocation:
// //           request.latitude != null && request.longitude != null
// //             ? {
// //                 latitude: request.latitude,
// //                 longitude: request.longitude,
// //                 accuracy: request.accuracy ?? 0,
// //                 address: request.address ?? null,
// //               }
// //             : null,
// //         lastAction: "PUNCH_OUT",
// //         lastActionAt: timestamp,
// //       };

// //       return {
// //         success: true,
// //         message: "Punch Out successful.",
// //         action: request.action,
// //         actionStatus: "SUCCESS",
// //         attendance: { ...this.dailyState },
// //         timestamp,
// //       };

// //     default:
// //       return {
// //         success: false,
// //         message: `Unsupported attendance action: ${request.action}`,
// //         action: request.action,
// //         actionStatus: "FAILED",
// //         attendance: { ...this.dailyState },
// //         timestamp,
// //       };
// //   }
// // }
// //   // ===========================================================================
// //   // Summary Calculation
// //   // ===========================================================================

// //   private calculateSummary(
// //     records: AttendanceRecord[],
// //     filters?: AttendanceFilter,
// //   ): AttendanceSummary {
// //     const total = records.length;

// //     const present = records.filter(
// //       (record) =>
// //         record.status === "Present",
// //     ).length;

// //     const absent = records.filter(
// //       (record) =>
// //         record.status === "Absent",
// //     ).length;

// //     const late = records.filter(
// //       (record) =>
// //         record.status === "Late",
// //     ).length;

// //     const weeklyOff = records.filter(
// //       (record) =>
// //         record.status === "WeeklyOff",
// //     ).length;

// //     const holiday = records.filter(
// //       (record) =>
// //         record.status === "Holiday",
// //     ).length;

// //     const workingDays = Math.max(
// //       total - weeklyOff - holiday,
// //       0,
// //     );

// //     const presentPercentage =
// //       workingDays > 0
// //         ? Math.round(
// //             (present / workingDays) * 100,
// //           )
// //         : 0;

// //     const absentPercentage =
// //       workingDays > 0
// //         ? Math.round(
// //             (absent / workingDays) * 100,
// //           )
// //         : 0;

// //     const latePercentage =
// //       workingDays > 0
// //         ? Math.round(
// //             (late / workingDays) * 100,
// //           )
// //         : 0;

// //     const workRecords = records.filter(
// //       (record) =>
// //         record.status === "Present" ||
// //         record.status === "Late",
// //     );

// //     const totalHours =
// //       workRecords.reduce(
// //         (sum, record) =>
// //           sum + record.workingHours,
// //         0,
// //       );

// //     const averageHours =
// //       workRecords.length > 0
// //         ? totalHours / workRecords.length
// //         : 0;

// //     const hours =
// //       Math.floor(averageHours);

// //     const minutes =
// //       Math.round(
// //         (averageHours - hours) * 60,
// //       );

// //     const averageWorkingHours =
// //       `${String(hours).padStart(2, "0")}:${String(
// //         minutes,
// //       ).padStart(2, "0")}`;

// //     let totalDays = total;

// //     if (
// //       filters?.startDate &&
// //       filters?.endDate
// //     ) {
// //       const start = new Date(
// //         filters.startDate,
// //       );

// //       const end = new Date(
// //         filters.endDate,
// //       );

// //       const diffTime =
// //         Math.abs(
// //           end.getTime() -
// //             start.getTime(),
// //         );

// //       totalDays =
// //         Math.ceil(
// //           diffTime /
// //             (1000 * 60 * 60 * 24),
// //         ) + 1;
// //     }

// //     return {
// //       totalDays,

// //       presentDays: present,
// //       presentPercentage,

// //       absentDays: absent,
// //       absentPercentage,

// //       lateDays: late,
// //       latePercentage,

// //       averageWorkingHours,
// //     };
// //   }
// // }

// // // =============================================================================
// // // Real API Service
// // // =============================================================================

// // class ApiAttendanceService
// //   implements IAttendanceService {

// //   // ===========================================================================
// //   // Query Parameters
// //   // ===========================================================================

// //   private buildQueryParams(
// //     filters?: AttendanceFilter,
// //   ): URLSearchParams {
// //     const params =
// //       new URLSearchParams();

// //     if (!filters) {
// //       return params;
// //     }

// //     if (filters.startDate) {
// //       params.append(
// //         "start_date",
// //         filters.startDate,
// //       );
// //     }

// //     if (filters.endDate) {
// //       params.append(
// //         "end_date",
// //         filters.endDate,
// //       );
// //     }

// //     if (filters.selectedDate) {
// //       params.append(
// //         "date",
// //         filters.selectedDate,
// //       );
// //     }

// //     if (filters.status) {
// //       params.append(
// //         "status",
// //         filters.status,
// //       );
// //     }

// //     if (filters.searchTerm) {
// //       params.append(
// //         "search",
// //         filters.searchTerm,
// //       );
// //     }

// //     return params;
// //   }

// //   // ===========================================================================
// //   // Get Today's Local Date
// //   // ===========================================================================

// //   /**
// //    * IMPORTANT:
// //    *
// //    * Do not use toISOString() for today's date here.
// //    *
// //    * toISOString() uses UTC and can return the previous/next
// //    * date around midnight for an Indian user.
// //    *
// //    * The HRMS attendance date is based on local/IST date.
// //    */
// //   private getTodayDate(): string {
// //     const now = new Date();

// //     const year =
// //       now.getFullYear();

// //     const month =
// //       String(
// //         now.getMonth() + 1,
// //       ).padStart(2, "0");

// //     const day =
// //       String(
// //         now.getDate(),
// //       ).padStart(2, "0");

// //     return `${year}-${month}-${day}`;
// //   }

// //   // ===========================================================================
// //   // Response Handler
// //   // ===========================================================================

// //   private handleResponse<T>(
// //     response: AxiosResponse,
// //   ): T {
// //     const responseData =
// //       response.data;

// //     if (
// //       responseData &&
// //       typeof responseData === "object" &&
// //       "data" in responseData &&
// //       responseData.data !== undefined
// //     ) {
// //       return responseData.data as T;
// //     }

// //     return responseData as T;
// //   }

// //   // ===========================================================================
// //   // Empty Daily State
// //   // ===========================================================================

// //   private createEmptyDailyState(
// //     date: string,
// //   ): DailyPunchState {
// //     return {
// //       id: null,

// //       employeeId: "",

// //       attendanceDate: date,

// //       punchIn: null,
// //       punchOut: null,

// //       breakIn: null,
// //       breakOut: null,

// //       punchState:
// //         "NOT_PUNCHED_IN",

// //       isPunchedIn: false,
// //       isOnBreak: false,
// //       isPunchedOut: false,

// //       workingMinutes: 0,
// //       breakMinutes: 0,

// //       punchInLocation: null,
// //       punchOutLocation: null,

// //       lastAction: null,
// //       lastActionAt: null,
// //     };
// //   }

// //   // ===========================================================================
// //   // Backend Attendance -> Frontend Daily Punch State
// //   // ===========================================================================

// //   private mapBackendAttendanceToDailyPunchState(
// //     attendance: any,
// //   ): DailyPunchState {
// //     const attendanceDate =
// //       attendance?.attendance_date ??
// //       attendance?.attendanceDate ??
// //       attendance?.date ??
// //       this.getTodayDate();

// //     const punchIn =
// //       attendance?.punch_in ??
// //       attendance?.punchIn ??
// //       null;

// //     const punchOut =
// //       attendance?.punch_out ??
// //       attendance?.punchOut ??
// //       null;

// //     const breakIn =
// //       attendance?.break_in ??
// //       attendance?.breakIn ??
// //       attendance?.last_break_in ??
// //       null;

// //     const breakOut =
// //       attendance?.break_out ??
// //       attendance?.breakOut ??
// //       attendance?.last_break_out ??
// //       null;

// //     const punchInLocation =
// //       attendance?.punch_in_location ??
// //       attendance?.punchInLocation ??
// //       null;

// //     const punchOutLocation =
// //       attendance?.punch_out_location ??
// //       attendance?.punchOutLocation ??
// //       null;

// //     const isPunchedIn =
// //       Boolean(punchIn);

// //     const isPunchedOut =
// //       Boolean(punchOut);

// //     const isOnBreak =
// //       Boolean(breakIn) &&
// //       !Boolean(breakOut);

// //     let punchState:
// //       DailyPunchState["punchState"];

// //     if (isPunchedOut) {
// //       punchState =
// //         "PUNCHED_OUT";
// //     } else if (isOnBreak) {
// //       punchState =
// //         "ON_BREAK";
// //     } else if (isPunchedIn) {
// //       punchState =
// //         "WORKING";
// //     } else {
// //       punchState =
// //         "NOT_PUNCHED_IN";
// //     }

// //     let lastAction:
// //       DailyPunchState["lastAction"];

// //     if (isPunchedOut) {
// //       lastAction =
// //         "PUNCH_OUT";
// //     } else if (breakOut) {
// //       lastAction =
// //         "BREAK_OUT";
// //     } else if (breakIn) {
// //       lastAction =
// //         "BREAK_IN";
// //     } else if (punchIn) {
// //       lastAction =
// //         "PUNCH_IN";
// //     } else {
// //       lastAction = null;
// //     }

// //     return {
// //       id:
// //         attendance?.id != null
// //           ? String(attendance.id)
// //           : null,

// //       employeeId:
// //         attendance?.employee_id ??
// //         attendance?.employeeId ??
// //         attendance?.emp_id ??
// //         "",

// //       attendanceDate,

// //       punchIn,
// //       punchOut,

// //       breakIn,
// //       breakOut,

// //       punchState,

// //       isPunchedIn,
// //       isOnBreak,
// //       isPunchedOut,

// //       workingMinutes: Number(
// //         attendance?.working_minutes ??
// //           attendance?.workingMinutes ??
// //           attendance?.working_hrs ??
// //           0,
// //       ),

// //       breakMinutes: Number(
// //         attendance?.break_minutes ??
// //           attendance?.breakMinutes ??
// //           attendance?.total_break ??
// //           0,
// //       ),

// //       punchInLocation,
// //       punchOutLocation,

// //       lastAction,

// //       lastActionAt:
// //         attendance?.last_action_at ??
// //         attendance?.lastActionAt ??
// //         null,
// //     };
// //   }

// //   // ===========================================================================
// //   // Normalize Attendance History Response
// //   // ===========================================================================

// //   private normalizeAttendanceResponse(
// //     response: any,
// //   ): AttendanceApiResponse {
// //     const data =
// //       response?.data !== undefined
// //         ? response.data
// //         : response;

// //     if (Array.isArray(data)) {
// //       return {
// //         records:
// //           data as AttendanceRecord[],

// //         summary:
// //           {} as AttendanceSummary,

// //         overview: [],

// //         totalCount:
// //           data.length,

// //         page: 1,

// //         pageSize:
// //           data.length,
// //       };
// //     }

// //     return {
// //       records:
// //         Array.isArray(data?.records)
// //           ? data.records
// //           : [],

// //       summary:
// //         data?.summary ??
// //         ({} as AttendanceSummary),

// //       overview:
// //         Array.isArray(data?.overview)
// //           ? data.overview
// //           : [],

// //       totalCount: Number(
// //         data?.totalCount ??
// //           data?.total_count ??
// //           data?.records?.length ??
// //           0,
// //       ),

// //       page: Number(
// //         data?.page ?? 1,
// //       ),

// //       pageSize: Number(
// //         data?.pageSize ??
// //           data?.page_size ??
// //           10,
// //       ),
// //     };
// //   }

// //   // ===========================================================================
// //   // Error Handler
// //   // ===========================================================================

// //   private handleError(
// //     error: unknown,
// //   ): never {
// //     if (axios.isAxiosError(error)) {
// //       const responseData =
// //         error.response?.data;

// //       let message =
// //         error.message ||
// //         "Attendance API request failed.";

// //       if (
// //         responseData &&
// //         typeof responseData === "object"
// //       ) {
// //         if (
// //           "message" in responseData &&
// //           typeof responseData.message ===
// //             "string"
// //         ) {
// //           message =
// //             responseData.message;
// //         } else if (
// //           "detail" in responseData &&
// //           typeof responseData.detail ===
// //             "string"
// //         ) {
// //           message =
// //             responseData.detail;
// //         }
// //       }

// //       throw new Error(
// //         `Attendance API Error: ${message}`,
// //       );
// //     }

// //     if (error instanceof Error) {
// //       throw error;
// //     }

// //     throw new Error(
// //       "An unexpected attendance error occurred.",
// //     );
// //   }

// //   // ===========================================================================
// //   // Attendance History
// //   // ===========================================================================

// //   async getAttendance(
// //     filters?: AttendanceFilter,
// //   ): Promise<AttendanceApiResponse> {
// //     try {
// //       const params =
// //         this.buildQueryParams(filters);

// //       const query =
// //         params.toString();

// //       const url =
// //         query.length > 0
// //           ? `${API_ENDPOINTS.attendance}?${query}`
// //           : API_ENDPOINTS.attendance;

// //       const response =
// //         await axiosInstance.get(url);

// //       return this.normalizeAttendanceResponse(
// //         response.data,
// //       );
// //     } catch (error) {
// //       return this.handleError(error);
// //     }
// //   }

// //   // ===========================================================================
// //   // Summary
// //   // ===========================================================================

// //   async getAttendanceSummary(
// //     filters?: AttendanceFilter,
// //   ): Promise<AttendanceSummary> {
// //     try {
// //       const params =
// //         this.buildQueryParams(filters);

// //       const query =
// //         params.toString();

// //       const url =
// //         query.length > 0
// //           ? `${API_ENDPOINTS.summary}?${query}`
// //           : API_ENDPOINTS.summary;

// //       const response =
// //         await axiosInstance.get<AttendanceSummary>(
// //           url,
// //         );

// //       return this.handleResponse<AttendanceSummary>(
// //         response,
// //       );
// //     } catch (error) {
// //       return this.handleError(error);
// //     }
// //   }

// //   // ===========================================================================
// //   // Monthly Overview
// //   // ===========================================================================

// //   async getAttendanceOverview(
// //     year: number,
// //     month: number,
// //   ): Promise<AttendanceOverviewItem[]> {
// //     try {
// //       const params =
// //         new URLSearchParams();

// //       params.append(
// //         "year",
// //         year.toString(),
// //       );

// //       params.append(
// //         "month",
// //         month.toString(),
// //       );

// //       const response =
// //         await axiosInstance.get<
// //           AttendanceOverviewItem[]
// //         >(
// //           `${API_ENDPOINTS.overview}?${params.toString()}`,
// //         );

// //       return this.handleResponse<
// //         AttendanceOverviewItem[]
// //       >(response);
// //     } catch (error) {
// //       return this.handleError(error);
// //     }
// //   }

// //   // ===========================================================================
// //   // Export
// //   // ===========================================================================

// //   async exportAttendance(
// //     filters?: AttendanceFilter,
// //   ): Promise<AttendanceExportResponse> {
// //     try {
// //       const params =
// //         this.buildQueryParams(filters);

// //       const query =
// //         params.toString();

// //       const url =
// //         query.length > 0
// //           ? `${API_ENDPOINTS.export}?${query}`
// //           : API_ENDPOINTS.export;

// //       const response =
// //         await axiosInstance.get<Blob>(
// //           url,
// //           {
// //             responseType: "blob",
// //           },
// //         );

// //       const blob =
// //         response.data;

// //       const downloadUrl =
// //         URL.createObjectURL(blob);

// //       const fileName =
// //         `attendance-${this.getTodayDate()}.xlsx`;

// //       return {
// //         downloadUrl,
// //         fileName,
// //       };
// //     } catch (error) {
// //       return this.handleError(error);
// //     }
// //   }

// //   // ===========================================================================
// //   // Filter
// //   // ===========================================================================

// //   async filterAttendance(
// //     filters: AttendanceFilter,
// //   ): Promise<AttendanceApiResponse> {
// //     return this.getAttendance(filters);
// //   }

// //   // ===========================================================================
// //   // Today's Attendance
// //   // ===========================================================================

// //   async getTodayAttendance(): Promise<DailyPunchState> {
// //     try {
// //       /**
// //        * Today's date is generated using the browser's
// //        * local date, not UTC.
// //        */
// //       const today =
// //         this.getTodayDate();

// //       /**
// //        * Get today's attendance from backend.
// //        *
// //        * Backend identifies the logged-in employee
// //        * using JWT.
// //        */
// //       const response =
// //         await this.getAttendance({
// //           selectedDate: today,
// //         });

// //       const records =
// //         Array.isArray(
// //           response?.records,
// //         )
// //           ? response.records
// //           : [];

// //       /**
// //        * Find today's record.
// //        */
// //       const todayRecord =
// //         records.find(
// //           (record: any) => {
// //             const recordDate =
// //               record?.date ??
// //               record?.attendance_date ??
// //               record?.attendanceDate;

// //             if (!recordDate) {
// //               return false;
// //             }

// //             return (
// //               String(recordDate)
// //                 .substring(0, 10) ===
// //               today
// //             );
// //           },
// //         );

// //       /**
// //        * No record means the employee
// //        * has not punched in today.
// //        */
// //       if (!todayRecord) {
// //         return this.createEmptyDailyState(
// //           today,
// //         );
// //       }

// //       /**
// //        * Convert backend state into frontend state.
// //        */
// //       return this.mapBackendAttendanceToDailyPunchState(
// //         todayRecord,
// //       );
// //     } catch (error) {
// //       return this.handleError(error);
// //     }
// //   }

// //   // ===========================================================================
// //   // Today's Activity Timeline
// //   // ===========================================================================

// //   async getTodayTimeline(): Promise<
// //     AttendanceTimelineActivity[]
// //   > {
// //     try {
// //       const today =
// //         this.getTodayDate();

// //       /**
// //        * Use the existing attendance API.
// //        *
// //        * No new backend timeline API is required.
// //        */
// //       const response =
// //         await axiosInstance.get(
// //           `${API_ENDPOINTS.attendance}?date=${today}`,
// //         );

// //       const responseData =
// //         response.data;

// //       /**
// //        * Backend may return:
// //        *
// //        * 1. A single attendance object
// //        * 2. An array
// //        * 3. { records: [...] }
// //        * 4. { data: [...] }
// //        * 5. { data: { records: [...] } }
// //        */
// //       let records: any[] = [];

// //       if (Array.isArray(responseData)) {
// //         records = responseData;
// //       } else if (
// //         responseData &&
// //         Array.isArray(
// //           responseData.records,
// //         )
// //       ) {
// //         records =
// //           responseData.records;
// //       } else if (
// //         responseData &&
// //         responseData.data &&
// //         Array.isArray(
// //           responseData.data,
// //         )
// //       ) {
// //         records =
// //           responseData.data;
// //       } else if (
// //         responseData &&
// //         responseData.data &&
// //         Array.isArray(
// //           responseData.data.records,
// //         )
// //       ) {
// //         records =
// //           responseData.data.records;
// //       } else if (
// //         responseData &&
// //         typeof responseData ===
// //           "object" &&
// //         responseData.id != null
// //       ) {
// //         records = [
// //           responseData,
// //         ];
// //       } else if (
// //         responseData &&
// //         responseData.data &&
// //         typeof responseData.data ===
// //           "object" &&
// //         responseData.data.id != null
// //       ) {
// //         records = [
// //           responseData.data,
// //         ];
// //       }

// //       /**
// //        * Find today's attendance record.
// //        */
// //       const todayRecord =
// //         records.find(
// //           (record: any) => {
// //             const recordDate =
// //               record?.date ??
// //               record?.attendance_date ??
// //               record?.attendanceDate;

// //             return (
// //               recordDate &&
// //               String(recordDate)
// //                 .substring(0, 10) ===
// //                 today
// //             );
// //           },
// //         );

// //       if (!todayRecord) {
// //         return [];
// //       }

// //       const activities: AttendanceTimelineActivity[] =
// //         [];

// //       // -----------------------------------------------------------------------
// //       // Punch In
// //       // -----------------------------------------------------------------------

// //       if (todayRecord.punch_in) {
// //         activities.push({
// //           id: `${todayRecord.id}-PI`,
// //           activity: "PI",
// //           log: todayRecord.punch_in,
// //           address:
// //             todayRecord.punch_in_address ??
// //             null,
// //         });
// //       }

// //       // -----------------------------------------------------------------------
// //       // Break In
// //       // -----------------------------------------------------------------------

// //       if (todayRecord.last_break_in) {
// //         activities.push({
// //           id: `${todayRecord.id}-BI`,
// //           activity: "BI",
// //           log: todayRecord.last_break_in,
// //           address: null,
// //         });
// //       }

// //       // -----------------------------------------------------------------------
// //       // Break Out
// //       // -----------------------------------------------------------------------

// //       if (todayRecord.last_break_out) {
// //         activities.push({
// //           id: `${todayRecord.id}-BO`,
// //           activity: "BO",
// //           log: todayRecord.last_break_out,
// //           address: null,
// //         });
// //       }

// //       // -----------------------------------------------------------------------
// //       // Punch Out
// //       // -----------------------------------------------------------------------

// //       if (todayRecord.punch_out) {
// //         activities.push({
// //           id: `${todayRecord.id}-PO`,
// //           activity: "PO",
// //           log: todayRecord.punch_out,
// //           address:
// //             todayRecord.punch_out_address ??
// //             null,
// //         });
// //       }

// //       // -----------------------------------------------------------------------
// //       // Always display activities chronologically.
// //       // -----------------------------------------------------------------------

// //       activities.sort(
// //         (a, b) =>
// //           new Date(a.log).getTime() -
// //           new Date(b.log).getTime(),
// //       );

// //       return activities;
// //     } catch (error) {
// //       return this.handleError(error);
// //     }
// //   }

// //   // ===========================================================================
// //   // Punch Action
// //   // ===========================================================================

// //   async executePunchAction(
// //     request: PunchActionRequest,
// //   ): Promise<PunchActionResponse> {
// //     try {
// //       const endpoint =
// //         ATTENDANCE_ACTION_ENDPOINTS[
// //           request.action
// //         ];

// //       if (!endpoint) {
// //         throw new Error(
// //           `Unsupported attendance action: ${request.action}`,
// //         );
// //       }

// //       // -----------------------------------------------------------------------
// //       // Prepare backend payload
// //       // -----------------------------------------------------------------------

// //       const payload = {
// //         latitude:
// //           request.latitude,

// //         longitude:
// //           request.longitude,

// //         accuracy:
// //           request.accuracy ?? null,

// //         address:
// //           request.address ?? null,

// //         action_time:
// //           request.actionTime ?? null,
// //       };

// //       // -----------------------------------------------------------------------
// //       // Execute attendance action
// //       // -----------------------------------------------------------------------

// //       const response =
// //         await axiosInstance.post(
// //           endpoint,
// //           payload,
// //         );

// //       const responseData =
// //         this.handleResponse<any>(
// //           response,
// //         );

// //       // -----------------------------------------------------------------------
// //       // Backend rejected action
// //       // -----------------------------------------------------------------------

// //       if (!responseData?.success) {
// //         const attendance =
// //           this.mapBackendAttendanceToDailyPunchState(
// //             responseData?.attendance,
// //           );

// //         return {
// //           ...responseData,

// //           action:
// //             request.action,

// //           attendance,
// //         } as PunchActionResponse;
// //       }

// //       // // -----------------------------------------------------------------------
// //       // // IMPORTANT:
// //       // //
// //       // // After every successful action,
// //       // // get the state again from DB.
// //       // // -----------------------------------------------------------------------

// //       // let latestAttendance:
// //       //   | DailyPunchState
// //       //   | null = null;

// //       // try {
// //       //   latestAttendance =
// //       //     await this.getTodayAttendance();
// //       // } catch (refreshError) {
// //       //   console.warn(
// //       //     "Attendance action succeeded, but latest attendance state could not be refreshed:",
// //       //     refreshError,
// //       //   );
// //       // }

// //       // // -----------------------------------------------------------------------
// //       // // Use database state.
// //       // // If refresh fails, use action response.
// //       // // -----------------------------------------------------------------------

// //       // const attendance =
// //       //   latestAttendance ??
// //       //   this.mapBackendAttendanceToDailyPunchState(
// //       //     responseData?.attendance,
// //       //   );

// //       // -----------------------------------------------------------------------
// // // Use the attendance state returned by the successful action itself.
// // //
// // // Do not immediately call getTodayAttendance() here because the
// // // existing GET /attendance/ endpoint can return attendance records
// // // belonging to other employees.
// // // -----------------------------------------------------------------------
// // const attendance =
// //   this.mapBackendAttendanceToDailyPunchState(
// //     responseData?.attendance,
// //   );

// //       return {
// //         ...responseData,

// //         action:
// //           request.action,

// //         attendance,
// //       } as PunchActionResponse;
// //     } catch (error) {
// //       return this.handleError(error);
// //     }
// //   }
// // }

// // // =============================================================================
// // // Service Factory
// // // =============================================================================

// // export const attendanceService: IAttendanceService =
// //   USE_MOCK
// //     ? new MockAttendanceService()
// //     : new ApiAttendanceService();

// // // =============================================================================
// // // Mock Mode Helper
// // // =============================================================================

// // export const isUsingMock =
// //   USE_MOCK;

// // // =============================================================================
// // // Testing Exports
// // // =============================================================================

// // export {
// //   MockAttendanceService,
// //   ApiAttendanceService,
// // };














// /**
//  * ======================================================
//  * Attendance Module - Service Layer
//  * ======================================================
//  *
//  * Uses the real HRMS API when USE_MOCK is false.
//  * Attendance history is scoped to the logged-in employee.
//  *
//  * @module services/attendance.service
//  */

// import axios, { AxiosResponse } from "axios";
// import axiosInstance from "../../../services/axios/axiosInstance";

// import type {
//   AttendanceRecord,
//   AttendanceSummary,
//   AttendanceOverviewItem,
//   AttendanceFilter,
//   AttendanceApiResponse,
//   AttendanceExportResponse,
//   DailyPunchState,
//   PunchActionRequest,
//   PunchActionResponse,
//   AttendanceAction,
//   AttendanceTimelineActivity,
//   AttendanceStatus,
// } from "../types/attendance.types";

// import { API_ENDPOINTS } from "../constants/attendance.constants";
// import { attendanceMockData } from "../components/mocks/attendance.mock";

// // =============================================================================
// // Configuration
// // =============================================================================

// const USE_MOCK = false;

// // =============================================================================
// // Backend response types
// // =============================================================================

// interface BackendDailyRecord {
//   id?: number | string;
//   date?: string;
//   attendance_date?: string;
//   attendanceDate?: string;
//   status?: string | null;
//   attendance_status?: string | null;
//   punch_in?: string | null;
//   punch_out?: string | null;
//   punch_in_time?: string | null;
//   punch_out_time?: string | null;
//   punchIn?: string | null;
//   punchOut?: string | null;
//   break_in?: string | null;
//   break_out?: string | null;
//   last_break_in?: string | null;
//   last_break_out?: string | null;
//   working_hours?: number | null;
//   working_hrs?: number | null;
//   working_minutes?: number | null;
//   break_minutes?: number | null;
//   total_break?: number | null;
//   late_minutes?: number | null;
//   shift?: string | null;
//   shift_name?: string | null;
//   patternname?: string | null;
//   shift_start_time?: string | null;
//   shift_end_time?: string | null;
//   shift_start?: string | null;
//   shift_end?: string | null;
//   holiday_name?: string | null;
//   employee_id?: number | string;
//   employee_name?: string;
//   punch_in_location?: any;
//   punch_out_location?: any;
//   punch_in_address?: string | null;
//   punch_out_address?: string | null;
//   last_action_at?: string | null;
// }

// interface BackendEmployee {
//   employee_id?: number | string;
//   employee_code?: string;
//   employee_name?: string;
//   daily_records?: BackendDailyRecord[];
//   present?: number;
//   week_off?: number;
//   public_holiday?: number;
//   pl?: number;
//   cl?: number;
//   co?: number;
//   lop?: number;
//   late?: number;
//   total_days?: number;
//   total_working_hours?: number;
//   total_break_minutes?: number;
// }

// interface BackendHistoryResponse {
//   success?: boolean;
//   message?: string;
//   employees?: BackendEmployee[];
//   statistics?: {
//     total_employees?: number;
//     present?: number;
//     week_off?: number;
//     public_holiday?: number;
//     pl?: number;
//     cl?: number;
//     co?: number;
//     lop?: number;
//     late?: number;
//     total_working_hours?: number;
//     total_break_minutes?: number;
//   };
//   pagination?: {
//     page?: number;
//     page_size?: number;
//     total_items?: number;
//     total_pages?: number;
//     has_previous?: boolean;
//     has_next?: boolean;
//   };
// }

// interface BackendPunchResponse {
//   success?: boolean;
//   message?: string;
//   attendance?: BackendDailyRecord;
//   [key: string]: any;
// }

// interface BackendLateMark {
//   attendance_id: number;
//   emp_id: number;
//   date: string;
//   punch_in?: string | null;
//   shift_start?: string | null;
//   late_minutes: number;
//   is_late: boolean;
// }

// interface BackendLateMarkResponse {
//   success: boolean;
//   from_date: string;
//   to_date: string;
//   grace_minutes: number;
//   total_late_records: number;
//   data: BackendLateMark[];
// }

// // =============================================================================
// // Punch action endpoints
// // =============================================================================

// const ATTENDANCE_ACTION_ENDPOINTS: Record<AttendanceAction, string> = {
//   PUNCH_IN: "/api/v1/attendance/punch-in",
//   BREAK_IN: "/api/v1/attendance/break-in",
//   BREAK_OUT: "/api/v1/attendance/break-out",
//   PUNCH_OUT: "/api/v1/attendance/punch-out",
// };

// // =============================================================================
// // Service interface
// // =============================================================================

// export interface IAttendanceService {
//   getAttendance(filters?: AttendanceFilter): Promise<AttendanceApiResponse>;
//   getAttendanceSummary(filters?: AttendanceFilter): Promise<AttendanceSummary>;
//   getAttendanceOverview(year: number, month: number): Promise<AttendanceOverviewItem[]>;
//   exportAttendance(filters?: AttendanceFilter): Promise<AttendanceExportResponse>;
//   filterAttendance(filters: AttendanceFilter): Promise<AttendanceApiResponse>;
//   getTodayAttendance(): Promise<DailyPunchState>;
//   getTodayTimeline(): Promise<AttendanceTimelineActivity[]>;
//   executePunchAction(request: PunchActionRequest): Promise<PunchActionResponse>;
// }

// // =============================================================================
// // Shared helpers
// // =============================================================================

// function localDate(date: Date): string {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// }

// function toTime(value?: string | null): string {
//   if (!value) return "";
//   const match = value.match(/(?:T|\s)?(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?/);
//   return match ? `${match[1]}:${match[2]}` : value;
// }

// function mapStatus(value?: string | null): AttendanceStatus {
//   const status = (value ?? "").trim().toUpperCase();

//   if (["PRESENT", "P"].includes(status)) return "Present";
//   if (status === "LATE") return "Late";
//   if (["WO", "WEEKLYOFF", "WEEKLY_OFF"].includes(status)) return "WeeklyOff";
//   if (["PH", "HOLIDAY", "PUBLIC_HOLIDAY"].includes(status)) return "Holiday";

//   // The current frontend type has no dedicated Leave/LOP status.
//   return "Absent";
// }

// function unwrapResponse<T>(response: AxiosResponse<T | { data: T }>): T {
//   const body: any = response.data;
//   if (body && typeof body === "object" && "data" in body) {
//     return body.data as T;
//   }
//   return body as T;
// }

// function emptySummary(): AttendanceSummary {
//   return {
//     totalDays: 0,
//     presentDays: 0,
//     presentPercentage: 0,
//     absentDays: 0,
//     absentPercentage: 0,
//     lateDays: 0,
//     latePercentage: 0,
//     averageWorkingHours: "--",
//   };
// }

// function mapDailyRecord(
//   raw: BackendDailyRecord,
//   employee?: BackendEmployee,
// ): AttendanceRecord {
//   const date = String(raw.date ?? raw.attendance_date ?? raw.attendanceDate ?? "").slice(0, 10);
//   const shiftLabel = raw.shift ?? raw.shift_name;
//   const shiftStart = toTime(raw.shift_start_time ?? raw.shift_start);
//   const shiftEnd = toTime(raw.shift_end_time ?? raw.shift_end);
//   const shift = shiftLabel || (shiftStart && shiftEnd
//     ? `${shiftStart} - ${shiftEnd}${raw.patternname ? ` (${raw.patternname})` : ""}`
//     : "--");

//   return {
//     id: String(raw.id ?? `${employee?.employee_id ?? raw.employee_id ?? "employee"}-${date}`),
//     date,
//     shift,
//     punchIn: toTime(raw.punch_in ?? raw.punch_in_time ?? raw.punchIn),
//     punchOut: toTime(raw.punch_out ?? raw.punch_out_time ?? raw.punchOut),
//     breakIn: raw.break_in ?? raw.last_break_in ?? null,
//     breakOut: raw.break_out ?? raw.last_break_out ?? null,
//     workingHours: Number(raw.working_hours ?? raw.working_hrs ?? 0),
//     breakTime: Number(raw.break_minutes ?? raw.total_break ?? 0),
//     status: mapStatus(raw.status ?? raw.attendance_status),
//     employeeName: employee?.employee_name ?? raw.employee_name,
//     employeeId: employee?.employee_id ?? raw.employee_id,
//   };
// }

// // =============================================================================
// // Logged-in employee resolution
// // =============================================================================

// /**
//  * Use an employee ID already saved by your login/profile flow.
//  *
//  * IMPORTANT:
//  * Do not fall back to an unfiltered all-employee history request.
//  * If your project uses a different auth-storage key, add that exact
//  * key here after checking your existing authStorage implementation.
//  */
// let loggedInEmployeeIdPromise: Promise<number> | null = null;

// /**
//  * Resolve the logged-in employee's database ID using the same profile
//  * endpoint used by TopNavbar. `username` stores the employee code, not
//  * the numeric employee ID.
//  */
// async function getLoggedInEmployeeId(): Promise<number> {
//   if (loggedInEmployeeIdPromise) {
//     return loggedInEmployeeIdPromise;
//   }

//   loggedInEmployeeIdPromise = (async (): Promise<number> => {
//     const empCode = localStorage.getItem("username")?.trim();

//     if (!empCode) {
//       throw new Error(
//         "Could not resolve the logged-in employee: localStorage key 'username' is missing.",
//       );
//     }

//     const response = await axiosInstance.get(
//       `/api/v1/employees/profile/${encodeURIComponent(empCode)}`,
//     );

//     const body: any = response.data;
//     const profile =
//       body?.data && typeof body.data === "object"
//         ? body.data
//         : body;

//     const candidate =
//       profile?.id ??
//       profile?.employee_id ??
//       profile?.employeeId ??
//       profile?.emp_id ??
//       profile?.employee?.id ??
//       profile?.employee?.employee_id;

//     const employeeId = Number(candidate);

//     if (!Number.isInteger(employeeId) || employeeId <= 0) {
//       throw new Error(
//         "The employee profile API did not return a valid numeric employee ID. " +
//         "Expected one of: id, employee_id, employeeId, or emp_id.",
//       );
//     }

//     return employeeId;
//   })().catch((error) => {
//     // Allow retry after a failed profile request.
//     loggedInEmployeeIdPromise = null;
//     throw error;
//   });

//   return loggedInEmployeeIdPromise;
// }

// // =============================================================================
// // Mock service
// // =============================================================================

// class MockAttendanceService implements IAttendanceService {
//   private delay(milliseconds = 300): Promise<void> {
//     return new Promise((resolve) => setTimeout(resolve, milliseconds));
//   }

//   private dailyState: DailyPunchState = {
//     id: null,
//     employeeId: "CURRENT_USER",
//     attendanceDate: localDate(new Date()),
//     punchIn: null,
//     punchOut: null,
//     breakIn: null,
//     breakOut: null,
//     punchState: "NOT_PUNCHED_IN",
//     isPunchedIn: false,
//     isOnBreak: false,
//     isPunchedOut: false,
//     workingMinutes: 0,
//     breakMinutes: 0,
//     punchInLocation: null,
//     punchOutLocation: null,
//     lastAction: null,
//     lastActionAt: null,
//   };

//   async getAttendance(filters?: AttendanceFilter): Promise<AttendanceApiResponse> {
//     await this.delay();

//     let records = [...attendanceMockData.records];

//     if (filters?.selectedDate) {
//       records = records.filter((r) => r.date === filters.selectedDate);
//     }
//     if (filters?.startDate) {
//       records = records.filter((r) => r.date >= filters.startDate!);
//     }
//     if (filters?.endDate) {
//       records = records.filter((r) => r.date <= filters.endDate!);
//     }
//     if (filters?.status) {
//       records = records.filter((r) => r.status === filters.status);
//     }
//     if (filters?.searchTerm?.trim()) {
//       const search = filters.searchTerm.trim().toLowerCase();
//       records = records.filter(
//         (r) =>
//           r.employeeName?.toLowerCase().includes(search) ||
//           r.id.toLowerCase().includes(search),
//       );
//     }

//     const present = records.filter((r) => r.status === "Present").length;
//     const absent = records.filter((r) => r.status === "Absent").length;
//     const late = records.filter((r) => r.status === "Late").length;
//     const working = records.filter((r) => ["Present", "Late"].includes(r.status));
//     const totalHours = working.reduce((sum, r) => sum + r.workingHours, 0);

//     return {
//       records,
//       summary: {
//         totalDays: records.length,
//         presentDays: present,
//         presentPercentage: records.length ? (present / records.length) * 100 : 0,
//         absentDays: absent,
//         absentPercentage: records.length ? (absent / records.length) * 100 : 0,
//         lateDays: late,
//         latePercentage: records.length ? (late / records.length) * 100 : 0,
//         averageWorkingHours: working.length ? (totalHours / working.length).toFixed(2) : "--",
//       },
//       overview: attendanceMockData.overview,
//       totalCount: records.length,
//       page: 1,
//       pageSize: records.length,
//     };
//   }

//   async getAttendanceSummary(filters?: AttendanceFilter): Promise<AttendanceSummary> {
//     return (await this.getAttendance(filters)).summary;
//   }

//   async getAttendanceOverview(year: number, month: number): Promise<AttendanceOverviewItem[]> {
//     const prefix = `${year}-${String(month).padStart(2, "0")}`;
//     return attendanceMockData.overview.filter((item) => item.date.startsWith(prefix));
//   }

//   async exportAttendance(): Promise<AttendanceExportResponse> {
//     return {
//       downloadUrl: "/mock/attendance-export.xlsx",
//       fileName: `attendance-${localDate(new Date())}.xlsx`,
//     };
//   }

//   async filterAttendance(filters: AttendanceFilter): Promise<AttendanceApiResponse> {
//     return this.getAttendance(filters);
//   }

//   async getTodayAttendance(): Promise<DailyPunchState> {
//     return { ...this.dailyState, attendanceDate: localDate(new Date()) };
//   }

//   async getTodayTimeline(): Promise<AttendanceTimelineActivity[]> {
//     const activities: AttendanceTimelineActivity[] = [];
//     const state = this.dailyState;

//     if (state.punchIn) activities.push({ id: "mock-PI", activity: "PI", log: state.punchIn });
//     if (state.breakIn) activities.push({ id: "mock-BI", activity: "BI", log: state.breakIn });
//     if (state.breakOut) activities.push({ id: "mock-BO", activity: "BO", log: state.breakOut });
//     if (state.punchOut) activities.push({ id: "mock-PO", activity: "PO", log: state.punchOut });

//     return activities.sort((a, b) => new Date(a.log).getTime() - new Date(b.log).getTime());
//   }

//   async executePunchAction(request: PunchActionRequest): Promise<PunchActionResponse> {
//     const timestamp = new Date().toISOString();
//     const state = this.dailyState;

//     if (request.action === "PUNCH_IN") {
//       if (state.isPunchedIn) {
//         return {
//           success: false, message: "Already punched in.", action: request.action,
//           actionStatus: "ALREADY_COMPLETED", attendance: { ...state }, timestamp,
//         };
//       }
//       this.dailyState = {
//         ...state,
//         punchIn: timestamp,
//         punchOut: null,
//         breakIn: null,
//         breakOut: null,
//         punchState: "WORKING",
//         isPunchedIn: true,
//         isOnBreak: false,
//         isPunchedOut: false,
//         lastAction: "PUNCH_IN",
//         lastActionAt: timestamp,
//       };
//     } else if (request.action === "BREAK_IN") {
//       if (!state.isPunchedIn || state.isOnBreak) {
//         return {
//           success: false,
//           message: !state.isPunchedIn ? "Please Punch In first." : "Already on break.",
//           action: request.action,
//           actionStatus: !state.isPunchedIn ? "INVALID_STATE" : "ALREADY_COMPLETED",
//           attendance: { ...state }, timestamp,
//         };
//       }
//       this.dailyState = {
//         ...state, breakIn: timestamp, breakOut: null,
//         punchState: "ON_BREAK", isOnBreak: true,
//         lastAction: "BREAK_IN", lastActionAt: timestamp,
//       };
//     } else if (request.action === "BREAK_OUT") {
//       if (!state.isPunchedIn || !state.isOnBreak) {
//         return {
//           success: false,
//           message: !state.isPunchedIn ? "Please Punch In first." : "You are not currently on break.",
//           action: request.action, actionStatus: "INVALID_STATE",
//           attendance: { ...state }, timestamp,
//         };
//       }
//       this.dailyState = {
//         ...state, breakOut: timestamp, punchState: "WORKING",
//         isOnBreak: false, lastAction: "BREAK_OUT", lastActionAt: timestamp,
//       };
//     } else {
//       if (!state.isPunchedIn || state.isOnBreak) {
//         return {
//           success: false,
//           message: !state.isPunchedIn ? "Please Punch In first." : "Please Break Out before Punch Out.",
//           action: request.action, actionStatus: "INVALID_STATE",
//           attendance: { ...state }, timestamp,
//         };
//       }
//       this.dailyState = {
//         ...state, punchOut: timestamp, punchState: "PUNCHED_OUT",
//         isPunchedIn: false, isOnBreak: false, isPunchedOut: true,
//         lastAction: "PUNCH_OUT", lastActionAt: timestamp,
//       };
//     }

//     return {
//       success: true,
//       // message: `${request.action.replaceAll("_", " ")} successful.`,
//       message: `${request.action.replace(/_/g, " ")} successful.`,
//       action: request.action,
//       actionStatus: "SUCCESS",
//       attendance: { ...this.dailyState },
//       timestamp,
//     };
//   }
// }

// // =============================================================================
// // Real API service
// // =============================================================================

// class ApiAttendanceService implements IAttendanceService {
//   private getTodayDate(): string {
//     return localDate(new Date());
//   }

//   private async buildQueryParams(filters?: AttendanceFilter): Promise<URLSearchParams> {
//     const params = new URLSearchParams();

//     // The monthly history endpoint expects `month` and `year`. Sending only
//     // `from_date`/`to_date` switches the backend to its separate admin-history
//     // response shape, which does not contain employees[].daily_records.
//     // Resolve the month from the selected date/range; default to this month.
//     const dateForMonth = filters?.selectedDate ?? filters?.startDate ?? localDate(new Date());
//     const dateMatch = dateForMonth.match(/^(\d{4})-(\d{2})/);
//     const now = new Date();
//     const year = dateMatch ? Number(dateMatch[1]) : now.getFullYear();
//     const month = dateMatch ? Number(dateMatch[2]) : now.getMonth() + 1;

//     params.set("year", String(year));
//     params.set("month", String(month));

//     if (filters?.searchTerm?.trim()) {
//       params.set("search", filters.searchTerm.trim());
//     }

//     // Scope the report to the authenticated employee's resolved database ID.
//     params.set("emp_id", String(await getLoggedInEmployeeId()));
//     params.set("page", "1");
//     params.set("page_size", "200");

//     return params;
//   }

//   private handleResponse<T>(response: AxiosResponse): T {
//     return unwrapResponse<T>(response);
//   }

//   private handleError(error: unknown): never {
//     if (axios.isAxiosError(error)) {
//       const data = error.response?.data as any;
//       const message =
//         data?.message ??
//         data?.detail ??
//         error.message ??
//         "Attendance API request failed.";

//       throw new Error(`Attendance API Error: ${message}`);
//     }

//     if (error instanceof Error) throw error;
//     throw new Error("An unexpected attendance error occurred.");
//   }

//   private createEmptyDailyState(date: string): DailyPunchState {
//     return {
//       id: null,
//       employeeId: "",
//       attendanceDate: date,
//       punchIn: null,
//       punchOut: null,
//       breakIn: null,
//       breakOut: null,
//       punchState: "NOT_PUNCHED_IN",
//       isPunchedIn: false,
//       isOnBreak: false,
//       isPunchedOut: false,
//       workingMinutes: 0,
//       breakMinutes: 0,
//       punchInLocation: null,
//       punchOutLocation: null,
//       lastAction: null,
//       lastActionAt: null,
//     };
//   }

//   private mapBackendAttendanceToDailyPunchState(
//     attendance: BackendDailyRecord | null | undefined,
//   ): DailyPunchState {
//     const date = String(
//       attendance?.attendance_date ??
//       attendance?.attendanceDate ??
//       attendance?.date ??
//       this.getTodayDate(),
//     ).slice(0, 10);

//     const punchIn = attendance?.punch_in ?? attendance?.punchIn ?? null;
//     const punchOut = attendance?.punch_out ?? attendance?.punchOut ?? null;
//     const breakIn = attendance?.break_in ?? attendance?.last_break_in ?? null;
//     const breakOut = attendance?.break_out ?? attendance?.last_break_out ?? null;

//     const isPunchedIn = Boolean(punchIn) && !Boolean(punchOut);
//     const isPunchedOut = Boolean(punchOut);
//     const isOnBreak = Boolean(breakIn) && !Boolean(breakOut) && isPunchedIn;

//     let punchState: DailyPunchState["punchState"] = "NOT_PUNCHED_IN";
//     if (isPunchedOut) punchState = "PUNCHED_OUT";
//     else if (isOnBreak) punchState = "ON_BREAK";
//     else if (isPunchedIn) punchState = "WORKING";

//     let lastAction: DailyPunchState["lastAction"] = null;
//     if (punchOut) lastAction = "PUNCH_OUT";
//     else if (breakOut) lastAction = "BREAK_OUT";
//     else if (breakIn) lastAction = "BREAK_IN";
//     else if (punchIn) lastAction = "PUNCH_IN";

//     return {
//       id: attendance?.id != null ? String(attendance.id) : null,
//       employeeId:
//         attendance?.employee_id ??
//         attendance?.emp_id ??
//         "",
//       attendanceDate: date,
//       punchIn,
//       punchOut,
//       breakIn,
//       breakOut,
//       punchState,
//       isPunchedIn,
//       isOnBreak,
//       isPunchedOut,
//       workingMinutes: Number(
//         attendance?.working_minutes ??
//         attendance?.working_hrs ??
//         0,
//       ) * (attendance?.working_hrs != null ? 60 : 1),
//       breakMinutes: Number(
//         attendance?.break_minutes ??
//         attendance?.total_break ??
//         0,
//       ),
//       punchInLocation: attendance?.punch_in_location ?? null,
//       punchOutLocation: attendance?.punch_out_location ?? null,
//       lastAction,
//       lastActionAt: attendance?.last_action_at ?? null,
//     };
//   }

//   private normalizeHistoryResponse(
//     body: BackendHistoryResponse,
//   ): AttendanceApiResponse {
//     if (!body?.success) {
//       throw new Error(body?.message ?? "Attendance history could not be loaded.");
//     }

//     const employee = body.employees?.[0];
//     const records = (employee?.daily_records ?? []).map((item) =>
//       mapDailyRecord(item, employee),
//     );

//     const stats = body.statistics ?? {};
//     const totalDays = records.length;
//     const present = Number(stats.present ?? employee?.present ?? 0);
//     const absent = Number(stats.lop ?? employee?.lop ?? 0);
//     const late = Number(stats.late ?? employee?.late ?? 0);
//     const workingHours = Number(
//       stats.total_working_hours ?? employee?.total_working_hours ?? 0,
//     );

//     const summary: AttendanceSummary = {
//       totalDays: Number(employee?.total_days ?? totalDays),
//       presentDays: present,
//       presentPercentage: totalDays ? (present / totalDays) * 100 : 0,
//       absentDays: absent,
//       absentPercentage: totalDays ? (absent / totalDays) * 100 : 0,
//       lateDays: late,
//       latePercentage: totalDays ? (late / totalDays) * 100 : 0,
//       averageWorkingHours: present ? (workingHours / present).toFixed(2) : "--",
//     };

//     const overview: AttendanceOverviewItem[] = records.map((record) => {
//       const [year, month, day] = record.date.split("-").map(Number);
//       return {
//         date: record.date,
//         dayOfWeek: new Date(year, month - 1, day).toLocaleDateString(
//           "en-US",
//           { weekday: "long" },
//         ),
//         dayOfMonth: day,
//         status: record.status,
//       };
//     });

//     return {
//       records,
//       summary,
//       overview,
//       totalCount: Number(body.pagination?.total_items ?? records.length),
//       page: Number(body.pagination?.page ?? 1),
//       pageSize: Number(body.pagination?.page_size ?? 200),
//     };
//   }

//   async getAttendance(filters?: AttendanceFilter): Promise<AttendanceApiResponse> {
//     try {
//       const params = await this.buildQueryParams(filters);
//       const response = await axiosInstance.get<BackendHistoryResponse>(
//         `/api/v1/attendance/history?${params.toString()}`,
//       );
//       return this.normalizeHistoryResponse(response.data);
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }

//   async getAttendanceSummary(filters?: AttendanceFilter): Promise<AttendanceSummary> {
//     try {
//       const params = await this.buildQueryParams(filters);
//       params.delete("page");
//       params.delete("page_size");

//       const response = await axiosInstance.get<AttendanceSummary>(
//         `/api/v1/attendance/summary?${params.toString()}`,
//       );
//       return this.handleResponse<AttendanceSummary>(response);
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }

//   async getAttendanceOverview(
//     year: number,
//     month: number,
//   ): Promise<AttendanceOverviewItem[]> {
//     try {
//       const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;
//       const lastDay = new Date(year, month, 0).getDate();
//       const lastDate =
//         `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

//       const params = new URLSearchParams({
//         from_date: firstDay,
//         to_date: lastDate,
//         emp_id: String(await getLoggedInEmployeeId()),
//       });

//       const response = await axiosInstance.get<BackendHistoryResponse>(
//         `/api/v1/attendance/history?${params.toString()}`,
//       );

//       return this.normalizeHistoryResponse(response.data).overview;
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }

//   async exportAttendance(
//     filters?: AttendanceFilter,
//   ): Promise<AttendanceExportResponse> {
//     try {
//       const params = await this.buildQueryParams(filters);
//       params.delete("page");
//       params.delete("page_size");

//       const response = await axiosInstance.get<Blob>(
//         `/api/v1/attendance/export?${params.toString()}`,
//         { responseType: "blob" },
//       );

//       const url = URL.createObjectURL(response.data);
//       return {
//         downloadUrl: url,
//         fileName: `attendance-${this.getTodayDate()}.xlsx`,
//       };
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }

//   async filterAttendance(filters: AttendanceFilter): Promise<AttendanceApiResponse> {
//     return this.getAttendance(filters);
//   }

//   async getTodayAttendance(): Promise<DailyPunchState> {
//     try {
//       const today = this.getTodayDate();
//       const response = await this.getAttendance({ selectedDate: today });
//       const record = response.records.find((item) => item.date === today);

//       if (!record) return this.createEmptyDailyState(today);

//       return this.mapBackendAttendanceToDailyPunchState({
//         id: record.id,
//         date: record.date,
//         status: record.status,
//         punch_in: record.punchIn || null,
//         punch_out: record.punchOut || null,
//         break_in: record.breakIn ?? null,
//         break_out: record.breakOut ?? null,
//         working_hours: record.workingHours,
//         break_minutes: record.breakTime,
//         employee_id: record.employeeId,
//       });
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }

//   async getTodayTimeline(): Promise<AttendanceTimelineActivity[]> {
//     try {
//       const today = this.getTodayDate();
//       const params = new URLSearchParams({
//         from_date: today,
//         to_date: today,
//         emp_id: String(await getLoggedInEmployeeId()),
//       });

//       const response = await axiosInstance.get<BackendHistoryResponse>(
//         `/api/v1/attendance/history?${params.toString()}`,
//       );

//       const employee = response.data?.employees?.[0];
//       const record = employee?.daily_records?.find(
//         (item) => String(item.date ?? "").slice(0, 10) === today,
//       );

//       if (!record) return [];

//       const activities: AttendanceTimelineActivity[] = [];
//       const id = String(record.id ?? today);

//       const punchIn = record.punch_in ?? record.punchIn;
//       const breakIn = record.break_in ?? record.last_break_in;
//       const breakOut = record.break_out ?? record.last_break_out;
//       const punchOut = record.punch_out ?? record.punchOut;

//       if (punchIn) activities.push({ id: `${id}-PI`, activity: "PI", log: punchIn });
//       if (breakIn) activities.push({ id: `${id}-BI`, activity: "BI", log: breakIn });
//       if (breakOut) activities.push({ id: `${id}-BO`, activity: "BO", log: breakOut });
//       if (punchOut) activities.push({ id: `${id}-PO`, activity: "PO", log: punchOut });

//       return activities.sort(
//         (a, b) => new Date(a.log).getTime() - new Date(b.log).getTime(),
//       );
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }

//   async executePunchAction(
//     request: PunchActionRequest,
//   ): Promise<PunchActionResponse> {
//     try {
//       const endpoint = ATTENDANCE_ACTION_ENDPOINTS[request.action];

//       const payload = {
//         action_time: request.actionTime ?? null,
//       };

//       // This module does not collect or send employee location.
//       const response = await axiosInstance.post<BackendPunchResponse>(
//         endpoint,
//         payload,
//       );

//       const body = this.handleResponse<BackendPunchResponse>(response);
//       const attendance = this.mapBackendAttendanceToDailyPunchState(
//         body?.attendance,
//       );

//       return {
//         ...(body as any),
//         success: Boolean(body?.success),
//         message: body?.message ?? "Attendance action completed.",
//         action: request.action,
//         actionStatus: body?.success ? "SUCCESS" : "FAILED",
//         attendance,
//         timestamp: new Date().toISOString(),
//       };
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }
// }

// // =============================================================================
// // Service factory
// // =============================================================================

// export const attendanceService: IAttendanceService =
//   USE_MOCK ? new MockAttendanceService() : new ApiAttendanceService();

// export const isUsingMock = USE_MOCK;

// export { MockAttendanceService, ApiAttendanceService };




// /**
//  * ======================================================
//  * Attendance Module - Service Layer
//  * ======================================================
//  */

// import axios, { AxiosResponse } from "axios";

// import axiosInstance from "../../../services/axios/axiosInstance";

// import {
//   AttendanceRecord,
//   AttendanceSummary,
//   AttendanceOverviewItem,
//   AttendanceFilter,
//   AttendanceApiResponse,
//   AttendanceExportResponse,
//   DailyPunchState,
//   PunchActionRequest,
//   PunchActionResponse,
//   AttendanceAction,
//   AttendanceTimelineActivity,
// } from "../types/attendance.types";

// // import { attendanceMockData } from "../components/mocks/attendance.mock";

// // =============================================================================
// // Configuration
// // =============================================================================

// /**
//  * false = use real HRMS API
//  * true  = use frontend mock data
//  */
// const USE_MOCK = false;

// // =============================================================================
// // Punch Action Endpoints
// // =============================================================================

// const ATTENDANCE_ACTION_ENDPOINTS: Record<
//   AttendanceAction,
//   string
// > = {
//   PUNCH_IN: "api/v1/attendance/punch-in",
//   BREAK_IN: "api/v1/attendance/break-in",
//   BREAK_OUT: "api/v1/attendance/break-out",
//   PUNCH_OUT: "api/v1/attendance/punch-out",
// };

// // =============================================================================
// // Service Interface
// // =============================================================================

// export interface IAttendanceService {
//   getAttendance(
//     filters?: AttendanceFilter,
//   ): Promise<AttendanceApiResponse>;

//   getAttendanceSummary(
//     filters?: AttendanceFilter,
//   ): Promise<AttendanceSummary>;

//   getAttendanceOverview(
//     year: number,
//     month: number,
//   ): Promise<AttendanceOverviewItem[]>;

//   exportAttendance(
//     filters?: AttendanceFilter,
//   ): Promise<AttendanceExportResponse>;

//   filterAttendance(
//     filters: AttendanceFilter,
//   ): Promise<AttendanceApiResponse>;

//   getTodayAttendance(): Promise<DailyPunchState>;

//   getTodayTimeline(): Promise<AttendanceTimelineActivity[]>;

//   executePunchAction(
//     request: PunchActionRequest,
//   ): Promise<PunchActionResponse>;
// }

// // =============================================================================
// // Mock Service
// // =============================================================================

// class MockAttendanceService implements IAttendanceService {
//   private delay(
//     milliseconds: number = 500,
//   ): Promise<void> {
//     return new Promise((resolve) =>
//       setTimeout(resolve, milliseconds),
//     );
//   }

//   private dailyState: DailyPunchState = {
//     id: null,
//     employeeId: "CURRENT_USER",
//     attendanceDate: new Date()
//       .toISOString()
//       .split("T")[0],

//     punchIn: null,
//     punchOut: null,

//     breakIn: null,
//     breakOut: null,

//     punchState: "NOT_PUNCHED_IN",

//     isPunchedIn: false,
//     isOnBreak: false,
//     isPunchedOut: false,

//     workingMinutes: 0,
//     breakMinutes: 0,

//     punchInLocation: null,
//     punchOutLocation: null,

//     lastAction: null,
//     lastActionAt: null,
//   };

//   // ===========================================================================
//   // Attendance History
//   // ===========================================================================

//   async getAttendance(
//     filters?: AttendanceFilter,
//   ): Promise<AttendanceApiResponse> {
//     await this.delay(600);

//     let records: AttendanceRecord[] = [
//       ...attendanceMockData.records,
//     ];

//     if (filters) {
//       if (filters.selectedDate) {
//         records = records.filter(
//           (record) =>
//             record.date === filters.selectedDate,
//         );
//       }

//       if (filters.startDate) {
//         records = records.filter(
//           (record) =>
//             record.date >= filters.startDate!,
//         );
//       }

//       if (filters.endDate) {
//         records = records.filter(
//           (record) =>
//             record.date <= filters.endDate!,
//         );
//       }

//       if (filters.status) {
//         records = records.filter(
//           (record) =>
//             record.status === filters.status,
//         );
//       }

//       if (filters.searchTerm) {
//         const search =
//           filters.searchTerm
//             .trim()
//             .toLowerCase();

//         records = records.filter(
//           (record) =>
//             record.employeeName
//               ?.toLowerCase()
//               .includes(search) ||
//             record.id
//               .toLowerCase()
//               .includes(search),
//         );
//       }
//     }

//     return {
//       records,

//       summary: this.calculateSummary(
//         records,
//         filters,
//       ),

//       overview: attendanceMockData.overview,

//       totalCount: records.length,

//       page: 1,

//       pageSize: 10,
//     };
//   }

//   // ===========================================================================
//   // Summary
//   // ===========================================================================

//   async getAttendanceSummary(
//     filters?: AttendanceFilter,
//   ): Promise<AttendanceSummary> {
//     await this.delay(400);

//     const response =
//       await this.getAttendance(filters);

//     return response.summary;
//   }

//   // ===========================================================================
//   // Overview
//   // ===========================================================================

//   async getAttendanceOverview(
//     year: number,
//     month: number,
//   ): Promise<AttendanceOverviewItem[]> {
//     await this.delay(300);

//     const datePrefix =
//       `${year}-${String(month).padStart(2, "0")}`;

//     return attendanceMockData.overview.filter(
//       (item) =>
//         item.date.startsWith(datePrefix),
//     );
//   }

//   // ===========================================================================
//   // Export
//   // ===========================================================================

//   async exportAttendance(
//     _filters?: AttendanceFilter,
//   ): Promise<AttendanceExportResponse> {
//     await this.delay(800);

//     return {
//       downloadUrl:
//         "/mock/attendance-export.xlsx",

//       fileName: `attendance-${
//         new Date()
//           .toISOString()
//           .split("T")[0]
//       }.xlsx`,
//     };
//   }

//   // ===========================================================================
//   // Filter
//   // ===========================================================================

//   async filterAttendance(
//     filters: AttendanceFilter,
//   ): Promise<AttendanceApiResponse> {
//     return this.getAttendance(filters);
//   }

//   // ===========================================================================
//   // Today's Attendance
//   // ===========================================================================

//   async getTodayAttendance(): Promise<DailyPunchState> {
//     await this.delay(250);

//     return {
//       ...this.dailyState,
//     };
//   }

//   // ===========================================================================
//   // Today's Activity Timeline
//   // ===========================================================================

//   async getTodayTimeline(): Promise<
//     AttendanceTimelineActivity[]
//   > {
//     await this.delay(250);

//     const activities: AttendanceTimelineActivity[] =
//       [];

//     if (this.dailyState.punchIn) {
//       activities.push({
//         id: "mock-punch-in",
//         activity: "PI",
//         log: this.dailyState.punchIn,
//         address:
//           this.dailyState.punchInLocation
//             ?.address ?? null,
//       });
//     }

//     if (this.dailyState.breakIn) {
//       activities.push({
//         id: "mock-break-in",
//         activity: "BI",
//         log: this.dailyState.breakIn,
//         address: null,
//       });
//     }

//     if (this.dailyState.breakOut) {
//       activities.push({
//         id: "mock-break-out",
//         activity: "BO",
//         log: this.dailyState.breakOut,
//         address: null,
//       });
//     }

//     if (this.dailyState.punchOut) {
//       activities.push({
//         id: "mock-punch-out",
//         activity: "PO",
//         log: this.dailyState.punchOut,
//         address:
//           this.dailyState.punchOutLocation
//             ?.address ?? null,
//       });
//     }

//     activities.sort(
//       (a, b) =>
//         new Date(a.log).getTime() -
//         new Date(b.log).getTime(),
//     );

//     return activities;
//   }

//   // ===========================================================================
//   // Punch Action
//   // ===========================================================================

//  // ===========================================================================
// // Punch Action
// // ===========================================================================

// async executePunchAction(
//   request: PunchActionRequest,
// ): Promise<PunchActionResponse> {
//   await this.delay(300);

//   const now = new Date();
//   const timestamp = now.toISOString();

//   switch (request.action) {
//     case "PUNCH_IN":
//       if (this.dailyState.isPunchedIn) {
//         return {
//           success: false,
//           message: "Already punched in.",
//           action: request.action,
//           actionStatus: "ALREADY_COMPLETED",
//           attendance: { ...this.dailyState },
//           timestamp,
//         };
//       }

//       this.dailyState = {
//         ...this.dailyState,
//         punchIn: timestamp,
//         punchOut: null,
//         breakIn: null,
//         breakOut: null,
//         punchState: "WORKING",
//         isPunchedIn: true,
//         isOnBreak: false,
//         isPunchedOut: false,
//         punchInLocation: request.latitude != null && request.longitude != null
//           ? {
//               latitude: request.latitude,
//               longitude: request.longitude,
//               accuracy: request.accuracy ?? 0,
//               address: request.address ?? null,
//             }
//           : null,
//         lastAction: "PUNCH_IN",
//         lastActionAt: timestamp,
//       };

//       return {
//         success: true,
//         message: "Punch In successful.",
//         action: request.action,
//         actionStatus: "SUCCESS",
//         attendance: { ...this.dailyState },
//         timestamp,
//       };

//     case "BREAK_IN":
//       if (!this.dailyState.isPunchedIn) {
//         return {
//           success: false,
//           message: "Please Punch In first.",
//           action: request.action,
//           actionStatus: "INVALID_STATE",
//           attendance: { ...this.dailyState },
//           timestamp,
//         };
//       }

//       if (this.dailyState.isOnBreak) {
//         return {
//           success: false,
//           message: "Already on break.",
//           action: request.action,
//           actionStatus: "ALREADY_COMPLETED",
//           attendance: { ...this.dailyState },
//           timestamp,
//         };
//       }

//       this.dailyState = {
//         ...this.dailyState,
//         breakIn: timestamp,
//         breakOut: null,
//         punchState: "ON_BREAK",
//         isOnBreak: true,
//         lastAction: "BREAK_IN",
//         lastActionAt: timestamp,
//       };

//       return {
//         success: true,
//         message: "Break In successful.",
//         action: request.action,
//         actionStatus: "SUCCESS",
//         attendance: { ...this.dailyState },
//         timestamp,
//       };

//     case "BREAK_OUT":
//       if (!this.dailyState.isPunchedIn) {
//         return {
//           success: false,
//           message: "Please Punch In first.",
//           action: request.action,
//           actionStatus: "INVALID_STATE",
//           attendance: { ...this.dailyState },
//           timestamp,
//         };
//       }

//       if (!this.dailyState.isOnBreak) {
//         return {
//           success: false,
//           message: "You are not currently on break.",
//           action: request.action,
//           actionStatus: "INVALID_STATE",
//           attendance: { ...this.dailyState },
//           timestamp,
//         };
//       }

//       this.dailyState = {
//         ...this.dailyState,
//         breakOut: timestamp,
//         punchState: "WORKING",
//         isOnBreak: false,
//         lastAction: "BREAK_OUT",
//         lastActionAt: timestamp,
//       };

//       return {
//         success: true,
//         message: "Break Out successful.",
//         action: request.action,
//         actionStatus: "SUCCESS",
//         attendance: { ...this.dailyState },
//         timestamp,
//       };

//     case "PUNCH_OUT":
//       if (!this.dailyState.isPunchedIn) {
//         return {
//           success: false,
//           message: "Please Punch In first.",
//           action: request.action,
//           actionStatus: "INVALID_STATE",
//           attendance: { ...this.dailyState },
//           timestamp,
//         };
//       }

//       if (this.dailyState.isOnBreak) {
//         return {
//           success: false,
//           message: "Please Break Out before Punch Out.",
//           action: request.action,
//           actionStatus: "INVALID_STATE",
//           attendance: { ...this.dailyState },
//           timestamp,
//         };
//       }

//       this.dailyState = {
//         ...this.dailyState,
//         punchOut: timestamp,
//         punchState: "PUNCHED_OUT",
//         isPunchedIn: false,
//         isOnBreak: false,
//         isPunchedOut: true,
//         punchOutLocation:
//           request.latitude != null && request.longitude != null
//             ? {
//                 latitude: request.latitude,
//                 longitude: request.longitude,
//                 accuracy: request.accuracy ?? 0,
//                 address: request.address ?? null,
//               }
//             : null,
//         lastAction: "PUNCH_OUT",
//         lastActionAt: timestamp,
//       };

//       return {
//         success: true,
//         message: "Punch Out successful.",
//         action: request.action,
//         actionStatus: "SUCCESS",
//         attendance: { ...this.dailyState },
//         timestamp,
//       };

//     default:
//       return {
//         success: false,
//         message: `Unsupported attendance action: ${request.action}`,
//         action: request.action,
//         actionStatus: "FAILED",
//         attendance: { ...this.dailyState },
//         timestamp,
//       };
//   }
// }
//   // ===========================================================================
//   // Summary Calculation
//   // ===========================================================================

//   private calculateSummary(
//     records: AttendanceRecord[],
//     filters?: AttendanceFilter,
//   ): AttendanceSummary {
//     const total = records.length;

//     const present = records.filter(
//       (record) =>
//         record.status === "Present",
//     ).length;

//     const absent = records.filter(
//       (record) =>
//         record.status === "Absent",
//     ).length;

//     const late = records.filter(
//       (record) =>
//         record.status === "Late",
//     ).length;

//     const weeklyOff = records.filter(
//       (record) =>
//         record.status === "WeeklyOff",
//     ).length;

//     const holiday = records.filter(
//       (record) =>
//         record.status === "Holiday",
//     ).length;

//     const workingDays = Math.max(
//       total - weeklyOff - holiday,
//       0,
//     );

//     const presentPercentage =
//       workingDays > 0
//         ? Math.round(
//             (present / workingDays) * 100,
//           )
//         : 0;

//     const absentPercentage =
//       workingDays > 0
//         ? Math.round(
//             (absent / workingDays) * 100,
//           )
//         : 0;

//     const latePercentage =
//       workingDays > 0
//         ? Math.round(
//             (late / workingDays) * 100,
//           )
//         : 0;

//     const workRecords = records.filter(
//       (record) =>
//         record.status === "Present" ||
//         record.status === "Late",
//     );

//     const totalHours =
//       workRecords.reduce(
//         (sum, record) =>
//           sum + record.workingHours,
//         0,
//       );

//     const averageHours =
//       workRecords.length > 0
//         ? totalHours / workRecords.length
//         : 0;

//     const hours =
//       Math.floor(averageHours);

//     const minutes =
//       Math.round(
//         (averageHours - hours) * 60,
//       );

//     const averageWorkingHours =
//       `${String(hours).padStart(2, "0")}:${String(
//         minutes,
//       ).padStart(2, "0")}`;

//     let totalDays = total;

//     if (
//       filters?.startDate &&
//       filters?.endDate
//     ) {
//       const start = new Date(
//         filters.startDate,
//       );

//       const end = new Date(
//         filters.endDate,
//       );

//       const diffTime =
//         Math.abs(
//           end.getTime() -
//             start.getTime(),
//         );

//       totalDays =
//         Math.ceil(
//           diffTime /
//             (1000 * 60 * 60 * 24),
//         ) + 1;
//     }

//     return {
//       totalDays,

//       presentDays: present,
//       presentPercentage,

//       absentDays: absent,
//       absentPercentage,

//       lateDays: late,
//       latePercentage,

//       averageWorkingHours,
//     };
//   }
// }

// // =============================================================================
// // Real API Service
// // =============================================================================

// class ApiAttendanceService
//   implements IAttendanceService {

//   // ===========================================================================
//   // Query Parameters
//   // ===========================================================================

//   private buildQueryParams(
//     filters?: AttendanceFilter,
//   ): URLSearchParams {
//     const params =
//       new URLSearchParams();

//     if (!filters) {
//       return params;
//     }

//     if (filters.startDate) {
//       params.append(
//         "start_date",
//         filters.startDate,
//       );
//     }

//     if (filters.endDate) {
//       params.append(
//         "end_date",
//         filters.endDate,
//       );
//     }

//     if (filters.selectedDate) {
//       params.append(
//         "date",
//         filters.selectedDate,
//       );
//     }

//     if (filters.status) {
//       params.append(
//         "status",
//         filters.status,
//       );
//     }

//     if (filters.searchTerm) {
//       params.append(
//         "search",
//         filters.searchTerm,
//       );
//     }

//     return params;
//   }

//   // ===========================================================================
//   // Get Today's Local Date
//   // ===========================================================================

//   /**
//    * IMPORTANT:
//    *
//    * Do not use toISOString() for today's date here.
//    *
//    * toISOString() uses UTC and can return the previous/next
//    * date around midnight for an Indian user.
//    *
//    * The HRMS attendance date is based on local/IST date.
//    */
//   private getTodayDate(): string {
//     const now = new Date();

//     const year =
//       now.getFullYear();

//     const month =
//       String(
//         now.getMonth() + 1,
//       ).padStart(2, "0");

//     const day =
//       String(
//         now.getDate(),
//       ).padStart(2, "0");

//     return `${year}-${month}-${day}`;
//   }

//   // ===========================================================================
//   // Response Handler
//   // ===========================================================================

//   private handleResponse<T>(
//     response: AxiosResponse,
//   ): T {
//     const responseData =
//       response.data;

//     if (
//       responseData &&
//       typeof responseData === "object" &&
//       "data" in responseData &&
//       responseData.data !== undefined
//     ) {
//       return responseData.data as T;
//     }

//     return responseData as T;
//   }

//   // ===========================================================================
//   // Empty Daily State
//   // ===========================================================================

//   private createEmptyDailyState(
//     date: string,
//   ): DailyPunchState {
//     return {
//       id: null,

//       employeeId: "",

//       attendanceDate: date,

//       punchIn: null,
//       punchOut: null,

//       breakIn: null,
//       breakOut: null,

//       punchState:
//         "NOT_PUNCHED_IN",

//       isPunchedIn: false,
//       isOnBreak: false,
//       isPunchedOut: false,

//       workingMinutes: 0,
//       breakMinutes: 0,

//       punchInLocation: null,
//       punchOutLocation: null,

//       lastAction: null,
//       lastActionAt: null,
//     };
//   }

//   // ===========================================================================
//   // Backend Attendance -> Frontend Daily Punch State
//   // ===========================================================================

//   private mapBackendAttendanceToDailyPunchState(
//     attendance: any,
//   ): DailyPunchState {
//     const attendanceDate =
//       attendance?.attendance_date ??
//       attendance?.attendanceDate ??
//       attendance?.date ??
//       this.getTodayDate();

//     const punchIn =
//       attendance?.punch_in ??
//       attendance?.punchIn ??
//       null;

//     const punchOut =
//       attendance?.punch_out ??
//       attendance?.punchOut ??
//       null;

//     const breakIn =
//       attendance?.break_in ??
//       attendance?.breakIn ??
//       attendance?.last_break_in ??
//       null;

//     const breakOut =
//       attendance?.break_out ??
//       attendance?.breakOut ??
//       attendance?.last_break_out ??
//       null;

//     const punchInLocation =
//       attendance?.punch_in_location ??
//       attendance?.punchInLocation ??
//       null;

//     const punchOutLocation =
//       attendance?.punch_out_location ??
//       attendance?.punchOutLocation ??
//       null;

//     const isPunchedIn =
//       Boolean(punchIn);

//     const isPunchedOut =
//       Boolean(punchOut);

//     const isOnBreak =
//       Boolean(breakIn) &&
//       !Boolean(breakOut);

//     let punchState:
//       DailyPunchState["punchState"];

//     if (isPunchedOut) {
//       punchState =
//         "PUNCHED_OUT";
//     } else if (isOnBreak) {
//       punchState =
//         "ON_BREAK";
//     } else if (isPunchedIn) {
//       punchState =
//         "WORKING";
//     } else {
//       punchState =
//         "NOT_PUNCHED_IN";
//     }

//     let lastAction:
//       DailyPunchState["lastAction"];

//     if (isPunchedOut) {
//       lastAction =
//         "PUNCH_OUT";
//     } else if (breakOut) {
//       lastAction =
//         "BREAK_OUT";
//     } else if (breakIn) {
//       lastAction =
//         "BREAK_IN";
//     } else if (punchIn) {
//       lastAction =
//         "PUNCH_IN";
//     } else {
//       lastAction = null;
//     }

//     return {
//       id:
//         attendance?.id != null
//           ? String(attendance.id)
//           : null,

//       employeeId:
//         attendance?.employee_id ??
//         attendance?.employeeId ??
//         attendance?.emp_id ??
//         "",

//       attendanceDate,

//       punchIn,
//       punchOut,

//       breakIn,
//       breakOut,

//       punchState,

//       isPunchedIn,
//       isOnBreak,
//       isPunchedOut,

//       workingMinutes: Number(
//         attendance?.working_minutes ??
//           attendance?.workingMinutes ??
//           attendance?.working_hrs ??
//           0,
//       ),

//       breakMinutes: Number(
//         attendance?.break_minutes ??
//           attendance?.breakMinutes ??
//           attendance?.total_break ??
//           0,
//       ),

//       punchInLocation,
//       punchOutLocation,

//       lastAction,

//       lastActionAt:
//         attendance?.last_action_at ??
//         attendance?.lastActionAt ??
//         null,
//     };
//   }

//   // ===========================================================================
//   // Normalize Attendance History Response
//   // ===========================================================================

//   private normalizeAttendanceResponse(
//     response: any,
//   ): AttendanceApiResponse {
//     const data =
//       response?.data !== undefined
//         ? response.data
//         : response;

//     if (Array.isArray(data)) {
//       return {
//         records:
//           data as AttendanceRecord[],

//         summary:
//           {} as AttendanceSummary,

//         overview: [],

//         totalCount:
//           data.length,

//         page: 1,

//         pageSize:
//           data.length,
//       };
//     }

//     return {
//       records:
//         Array.isArray(data?.records)
//           ? data.records
//           : [],

//       summary:
//         data?.summary ??
//         ({} as AttendanceSummary),

//       overview:
//         Array.isArray(data?.overview)
//           ? data.overview
//           : [],

//       totalCount: Number(
//         data?.totalCount ??
//           data?.total_count ??
//           data?.records?.length ??
//           0,
//       ),

//       page: Number(
//         data?.page ?? 1,
//       ),

//       pageSize: Number(
//         data?.pageSize ??
//           data?.page_size ??
//           10,
//       ),
//     };
//   }

//   // ===========================================================================
//   // Error Handler
//   // ===========================================================================

//   private handleError(
//     error: unknown,
//   ): never {
//     if (axios.isAxiosError(error)) {
//       const responseData =
//         error.response?.data;

//       let message =
//         error.message ||
//         "Attendance API request failed.";

//       if (
//         responseData &&
//         typeof responseData === "object"
//       ) {
//         if (
//           "message" in responseData &&
//           typeof responseData.message ===
//             "string"
//         ) {
//           message =
//             responseData.message;
//         } else if (
//           "detail" in responseData &&
//           typeof responseData.detail ===
//             "string"
//         ) {
//           message =
//             responseData.detail;
//         }
//       }

//       throw new Error(
//         `Attendance API Error: ${message}`,
//       );
//     }

//     if (error instanceof Error) {
//       throw error;
//     }

//     throw new Error(
//       "An unexpected attendance error occurred.",
//     );
//   }

//   // ===========================================================================
//   // Attendance History
//   // ===========================================================================

//   async getAttendance(
//     filters?: AttendanceFilter,
//   ): Promise<AttendanceApiResponse> {
//     try {
//       const params =
//         this.buildQueryParams(filters);

//       const query =
//         params.toString();

//       const url =
//         query.length > 0
//           ? `${API_ENDPOINTS.attendance}?${query}`
//           : API_ENDPOINTS.attendance;

//       const response =
//         await axiosInstance.get(url);

//       return this.normalizeAttendanceResponse(
//         response.data,
//       );
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }

//   // ===========================================================================
//   // Summary
//   // ===========================================================================

//   async getAttendanceSummary(
//     filters?: AttendanceFilter,
//   ): Promise<AttendanceSummary> {
//     try {
//       const params =
//         this.buildQueryParams(filters);

//       const query =
//         params.toString();

//       const url =
//         query.length > 0
//           ? `${API_ENDPOINTS.summary}?${query}`
//           : API_ENDPOINTS.summary;

//       const response =
//         await axiosInstance.get<AttendanceSummary>(
//           url,
//         );

//       return this.handleResponse<AttendanceSummary>(
//         response,
//       );
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }

//   // ===========================================================================
//   // Monthly Overview
//   // ===========================================================================

//   async getAttendanceOverview(
//     year: number,
//     month: number,
//   ): Promise<AttendanceOverviewItem[]> {
//     try {
//       const params =
//         new URLSearchParams();

//       params.append(
//         "year",
//         year.toString(),
//       );

//       params.append(
//         "month",
//         month.toString(),
//       );

//       const response =
//         await axiosInstance.get<
//           AttendanceOverviewItem[]
//         >(
//           `${API_ENDPOINTS.overview}?${params.toString()}`,
//         );

//       return this.handleResponse<
//         AttendanceOverviewItem[]
//       >(response);
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }

//   // ===========================================================================
//   // Export
//   // ===========================================================================

//   async exportAttendance(
//     filters?: AttendanceFilter,
//   ): Promise<AttendanceExportResponse> {
//     try {
//       const params =
//         this.buildQueryParams(filters);

//       const query =
//         params.toString();

//       const url =
//         query.length > 0
//           ? `${API_ENDPOINTS.export}?${query}`
//           : API_ENDPOINTS.export;

//       const response =
//         await axiosInstance.get<Blob>(
//           url,
//           {
//             responseType: "blob",
//           },
//         );

//       const blob =
//         response.data;

//       const downloadUrl =
//         URL.createObjectURL(blob);

//       const fileName =
//         `attendance-${this.getTodayDate()}.xlsx`;

//       return {
//         downloadUrl,
//         fileName,
//       };
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }

//   // ===========================================================================
//   // Filter
//   // ===========================================================================

//   async filterAttendance(
//     filters: AttendanceFilter,
//   ): Promise<AttendanceApiResponse> {
//     return this.getAttendance(filters);
//   }

//   // ===========================================================================
//   // Today's Attendance
//   // ===========================================================================

//   async getTodayAttendance(): Promise<DailyPunchState> {
//     try {
//       /**
//        * Today's date is generated using the browser's
//        * local date, not UTC.
//        */
//       const today =
//         this.getTodayDate();

//       /**
//        * Get today's attendance from backend.
//        *
//        * Backend identifies the logged-in employee
//        * using JWT.
//        */
//       const response =
//         await this.getAttendance({
//           selectedDate: today,
//         });

//       const records =
//         Array.isArray(
//           response?.records,
//         )
//           ? response.records
//           : [];

//       /**
//        * Find today's record.
//        */
//       const todayRecord =
//         records.find(
//           (record: any) => {
//             const recordDate =
//               record?.date ??
//               record?.attendance_date ??
//               record?.attendanceDate;

//             if (!recordDate) {
//               return false;
//             }

//             return (
//               String(recordDate)
//                 .substring(0, 10) ===
//               today
//             );
//           },
//         );

//       /**
//        * No record means the employee
//        * has not punched in today.
//        */
//       if (!todayRecord) {
//         return this.createEmptyDailyState(
//           today,
//         );
//       }

//       /**
//        * Convert backend state into frontend state.
//        */
//       return this.mapBackendAttendanceToDailyPunchState(
//         todayRecord,
//       );
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }

//   // ===========================================================================
//   // Today's Activity Timeline
//   // ===========================================================================

//   async getTodayTimeline(): Promise<
//     AttendanceTimelineActivity[]
//   > {
//     try {
//       const today =
//         this.getTodayDate();

//       /**
//        * Use the existing attendance API.
//        *
//        * No new backend timeline API is required.
//        */
//       const response =
//         await axiosInstance.get(
//           `${API_ENDPOINTS.attendance}?date=${today}`,
//         );

//       const responseData =
//         response.data;

//       /**
//        * Backend may return:
//        *
//        * 1. A single attendance object
//        * 2. An array
//        * 3. { records: [...] }
//        * 4. { data: [...] }
//        * 5. { data: { records: [...] } }
//        */
//       let records: any[] = [];

//       if (Array.isArray(responseData)) {
//         records = responseData;
//       } else if (
//         responseData &&
//         Array.isArray(
//           responseData.records,
//         )
//       ) {
//         records =
//           responseData.records;
//       } else if (
//         responseData &&
//         responseData.data &&
//         Array.isArray(
//           responseData.data,
//         )
//       ) {
//         records =
//           responseData.data;
//       } else if (
//         responseData &&
//         responseData.data &&
//         Array.isArray(
//           responseData.data.records,
//         )
//       ) {
//         records =
//           responseData.data.records;
//       } else if (
//         responseData &&
//         typeof responseData ===
//           "object" &&
//         responseData.id != null
//       ) {
//         records = [
//           responseData,
//         ];
//       } else if (
//         responseData &&
//         responseData.data &&
//         typeof responseData.data ===
//           "object" &&
//         responseData.data.id != null
//       ) {
//         records = [
//           responseData.data,
//         ];
//       }

//       /**
//        * Find today's attendance record.
//        */
//       const todayRecord =
//         records.find(
//           (record: any) => {
//             const recordDate =
//               record?.date ??
//               record?.attendance_date ??
//               record?.attendanceDate;

//             return (
//               recordDate &&
//               String(recordDate)
//                 .substring(0, 10) ===
//                 today
//             );
//           },
//         );

//       if (!todayRecord) {
//         return [];
//       }

//       const activities: AttendanceTimelineActivity[] =
//         [];

//       // -----------------------------------------------------------------------
//       // Punch In
//       // -----------------------------------------------------------------------

//       if (todayRecord.punch_in) {
//         activities.push({
//           id: `${todayRecord.id}-PI`,
//           activity: "PI",
//           log: todayRecord.punch_in,
//           address:
//             todayRecord.punch_in_address ??
//             null,
//         });
//       }

//       // -----------------------------------------------------------------------
//       // Break In
//       // -----------------------------------------------------------------------

//       if (todayRecord.last_break_in) {
//         activities.push({
//           id: `${todayRecord.id}-BI`,
//           activity: "BI",
//           log: todayRecord.last_break_in,
//           address: null,
//         });
//       }

//       // -----------------------------------------------------------------------
//       // Break Out
//       // -----------------------------------------------------------------------

//       if (todayRecord.last_break_out) {
//         activities.push({
//           id: `${todayRecord.id}-BO`,
//           activity: "BO",
//           log: todayRecord.last_break_out,
//           address: null,
//         });
//       }

//       // -----------------------------------------------------------------------
//       // Punch Out
//       // -----------------------------------------------------------------------

//       if (todayRecord.punch_out) {
//         activities.push({
//           id: `${todayRecord.id}-PO`,
//           activity: "PO",
//           log: todayRecord.punch_out,
//           address:
//             todayRecord.punch_out_address ??
//             null,
//         });
//       }

//       // -----------------------------------------------------------------------
//       // Always display activities chronologically.
//       // -----------------------------------------------------------------------

//       activities.sort(
//         (a, b) =>
//           new Date(a.log).getTime() -
//           new Date(b.log).getTime(),
//       );

//       return activities;
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }

//   // ===========================================================================
//   // Punch Action
//   // ===========================================================================

//   async executePunchAction(
//     request: PunchActionRequest,
//   ): Promise<PunchActionResponse> {
//     try {
//       const endpoint =
//         ATTENDANCE_ACTION_ENDPOINTS[
//           request.action
//         ];

//       if (!endpoint) {
//         throw new Error(
//           `Unsupported attendance action: ${request.action}`,
//         );
//       }

//       // -----------------------------------------------------------------------
//       // Prepare backend payload
//       // -----------------------------------------------------------------------

//       const payload = {
//         latitude:
//           request.latitude,

//         longitude:
//           request.longitude,

//         accuracy:
//           request.accuracy ?? null,

//         address:
//           request.address ?? null,

//         action_time:
//           request.actionTime ?? null,
//       };

//       // -----------------------------------------------------------------------
//       // Execute attendance action
//       // -----------------------------------------------------------------------

//       const response =
//         await axiosInstance.post(
//           endpoint,
//           payload,
//         );

//       const responseData =
//         this.handleResponse<any>(
//           response,
//         );

//       // -----------------------------------------------------------------------
//       // Backend rejected action
//       // -----------------------------------------------------------------------

//       if (!responseData?.success) {
//         const attendance =
//           this.mapBackendAttendanceToDailyPunchState(
//             responseData?.attendance,
//           );

//         return {
//           ...responseData,

//           action:
//             request.action,

//           attendance,
//         } as PunchActionResponse;
//       }

//       // // -----------------------------------------------------------------------
//       // // IMPORTANT:
//       // //
//       // // After every successful action,
//       // // get the state again from DB.
//       // // -----------------------------------------------------------------------

//       // let latestAttendance:
//       //   | DailyPunchState
//       //   | null = null;

//       // try {
//       //   latestAttendance =
//       //     await this.getTodayAttendance();
//       // } catch (refreshError) {
//       //   console.warn(
//       //     "Attendance action succeeded, but latest attendance state could not be refreshed:",
//       //     refreshError,
//       //   );
//       // }

//       // // -----------------------------------------------------------------------
//       // // Use database state.
//       // // If refresh fails, use action response.
//       // // -----------------------------------------------------------------------

//       // const attendance =
//       //   latestAttendance ??
//       //   this.mapBackendAttendanceToDailyPunchState(
//       //     responseData?.attendance,
//       //   );

//       // -----------------------------------------------------------------------
// // Use the attendance state returned by the successful action itself.
// //
// // Do not immediately call getTodayAttendance() here because the
// // existing GET /attendance/ endpoint can return attendance records
// // belonging to other employees.
// // -----------------------------------------------------------------------
// const attendance =
//   this.mapBackendAttendanceToDailyPunchState(
//     responseData?.attendance,
//   );

//       return {
//         ...responseData,

//         action:
//           request.action,

//         attendance,
//       } as PunchActionResponse;
//     } catch (error) {
//       return this.handleError(error);
//     }
//   }
// }

// // =============================================================================
// // Service Factory
// // =============================================================================

// export const attendanceService: IAttendanceService =
//   USE_MOCK
//     ? new MockAttendanceService()
//     : new ApiAttendanceService();

// // =============================================================================
// // Mock Mode Helper
// // =============================================================================

// export const isUsingMock =
//   USE_MOCK;

// // =============================================================================
// // Testing Exports
// // =============================================================================

// export {
//   MockAttendanceService,
//   ApiAttendanceService,
// };














/**
 * ======================================================
 * Attendance Module - Service Layer
 * ======================================================
 *
 * Uses the real HRMS API when USE_MOCK is false.
 * Attendance history is scoped to the logged-in employee.
 *
 * @module services/attendance.service
 */

import axios, { AxiosResponse } from "axios";
import axiosInstance from "../../../services/axios/axiosInstance";

import type {
  AttendanceRecord,
  AttendanceSummary,
  AttendanceOverviewItem,
  AttendanceFilter,
  AttendanceApiResponse,
  AttendanceExportResponse,
  DailyPunchState,
  PunchActionRequest,
  PunchActionResponse,
  AttendanceAction,
  AttendanceTimelineActivity,
  AttendanceStatus,
} from "../types/attendance.types";

import { API_ENDPOINTS } from "../constants/attendance.constants";
import { attendanceMockData } from "../components/mocks/attendance.mock";

// =============================================================================
// Configuration
// =============================================================================

const USE_MOCK = false;

// =============================================================================
// Backend response types
// =============================================================================

interface BackendDailyRecord {
  id?: number | string;
  emp_id?: number | string;
  date?: string;
  attendance_date?: string;
  attendanceDate?: string;
  status?: string | null;
  attendance_status?: string | null;
  leave_type?: string | null;
  punch_in?: string | null;
  punch_out?: string | null;
  punch_in_time?: string | null;
  punch_out_time?: string | null;
  punchIn?: string | null;
  punchOut?: string | null;
  break_in?: string | null;
  break_out?: string | null;
  last_break_in?: string | null;
  last_break_out?: string | null;
  working_hours?: number | null;
  working_hrs?: number | null;
  working_minutes?: number | null;
  break_minutes?: number | null;
  total_break?: number | null;
  late_minutes?: number | null;
  shift?: string | null;
  shift_name?: string | null;
  patternname?: string | null;
  shift_start_time?: string | null;
  shift_end_time?: string | null;
  shift_start?: string | null;
  shift_end?: string | null;
  holiday_name?: string | null;
  employee_id?: number | string;
  employee_name?: string;
  punch_in_location?: any;
  punch_out_location?: any;
  punch_in_address?: string | null;
  punch_out_address?: string | null;
  last_action_at?: string | null;
  is_pre_joining?: boolean;
}

interface BackendEmployee {
  employee_id?: number | string;
  employee_code?: string;
  employee_name?: string;
  daily_records?: BackendDailyRecord[];
  present?: number;
  week_off?: number;
  public_holiday?: number;
  pl?: number;
  cl?: number;
  co?: number;
  lop?: number;
  late?: number;
  total_days?: number;
  total_working_hours?: number;
  total_break_minutes?: number;
  joining_date?: string | null;
  doj?: string | null;
}

interface BackendHistoryResponse {
  success?: boolean;
  message?: string;
  employees?: BackendEmployee[];
  statistics?: {
    total_employees?: number;
    present?: number;
    week_off?: number;
    public_holiday?: number;
    pl?: number;
    cl?: number;
    co?: number;
    lop?: number;
    late?: number;
    total_working_hours?: number;
    total_break_minutes?: number;
  };
  pagination?: {
    page?: number;
    page_size?: number;
    total_items?: number;
    total_pages?: number;
    has_previous?: boolean;
    has_next?: boolean;
  };
}

interface BackendPunchResponse {
  success?: boolean;
  message?: string;
  attendance?: BackendDailyRecord;
  [key: string]: any;
}

interface BackendLateMark {
  attendance_id: number;
  emp_id: number;
  date: string;
  punch_in?: string | null;
  shift_start?: string | null;
  late_minutes: number;
  is_late: boolean;
}


// =============================================================================
// Punch action endpoints
// =============================================================================

const ATTENDANCE_ACTION_ENDPOINTS: Record<AttendanceAction, string> = {
  PUNCH_IN: "/api/v1/attendance/punch-in",
  BREAK_IN: "/api/v1/attendance/break-in",
  BREAK_OUT: "/api/v1/attendance/break-out",
  PUNCH_OUT: "/api/v1/attendance/punch-out",
};

// =============================================================================
// Service interface
// =============================================================================

export interface IAttendanceService {
  getAttendance(filters?: AttendanceFilter): Promise<AttendanceApiResponse>;
  getAttendanceSummary(filters?: AttendanceFilter): Promise<AttendanceSummary>;
  getAttendanceOverview(year: number, month: number): Promise<AttendanceOverviewItem[]>;
  exportAttendance(filters?: AttendanceFilter): Promise<AttendanceExportResponse>;
  filterAttendance(filters: AttendanceFilter): Promise<AttendanceApiResponse>;
  getTodayAttendance(): Promise<DailyPunchState>;
  getTodayTimeline(): Promise<AttendanceTimelineActivity[]>;
  executePunchAction(request: PunchActionRequest): Promise<PunchActionResponse>;
}

// =============================================================================
// Shared helpers
// =============================================================================

function localDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toTime(value?: string | null): string {
  if (!value) return "";
  const match = value.match(/(?:T|\s)?(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?/);
  return match ? `${match[1]}:${match[2]}` : value;
}

// function mapStatus(value?: string | null): AttendanceStatus {
//   const status = (value ?? "").trim().toUpperCase();

//   if (["PRESENT", "P"].includes(status)) return "Present";
//   if (status === "LATE") return "Late";
//   if (["WO", "WEEKLYOFF", "WEEKLY_OFF"].includes(status)) return "WeeklyOff";
//   if (["PH", "HOLIDAY", "PUBLIC_HOLIDAY"].includes(status)) return "Holiday";

//   // The current frontend type has no dedicated Leave/LOP status.
//   return "Absent";
// }


// function mapStatus(value?: string | null): AttendanceStatus {
//   const status = (value ?? "").trim().toUpperCase();

//   if (["PRESENT", "P"].includes(status)) return "Present";
//   if (status === "LATE") return "Late";
//   if (["WO", "WEEKLYOFF", "WEEKLY_OFF"].includes(status)) {
//     return "WeeklyOff";
//   }
//   if (["PH", "HOLIDAY", "PUBLIC_HOLIDAY"].includes(status)) {
//     return "Holiday";
//   }

//   // Preserve the existing fallback for statuses not supported by the UI.
//   return "Absent";
// }


function mapStatus(value?: string | null): AttendanceStatus {
  const status = (value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[_\s]+/g, ' ');

  const aliases: Record<string, AttendanceStatus> = {
    PRESENT: 'Present',
    P: 'Present',

    ABSENT: 'Absent',
    A: 'Absent',

    LATE: 'Late',

    WO: 'WeeklyOff',
    'WEEKLY OFF': 'WeeklyOff',
    WEEKLYOFF: 'WeeklyOff',

    PH: 'Holiday',
    HOLIDAY: 'Holiday',
    'PUBLIC HOLIDAY': 'Holiday',

    PL: 'PL',
    'PAID LEAVE': 'PL',

    CL: 'CL',
    'CASUAL LEAVE': 'CL',

    CO: 'CO',
    'COMP OFF': 'CO',
    'COMP-OFF': 'CO',
    'COMPENSATORY OFF': 'CO',

    LOP: 'LOP',
    'LOSS OF PAY': 'LOP',

    'HD-PL': 'HD-PL',
    'HD PL': 'HD-PL',
    'HALF DAY PAID LEAVE': 'HD-PL',

    'HD-CL': 'HD-CL',
    'HD CL': 'HD-CL',
    'HALF DAY CASUAL LEAVE': 'HD-CL',

    'HD-CO': 'HD-CO',
    'HD CO': 'HD-CO',
    'HALF DAY COMP OFF': 'HD-CO',
    'HALF DAY COMPENSATORY OFF': 'HD-CO',

    'HD-LOP': 'HD-LOP',
    'HD LOP': 'HD-LOP',
    'HALF DAY LOP': 'HD-LOP',
    'HALF DAY LOSS OF PAY': 'HD-LOP',
  };

  return aliases[status] ?? 'Absent';
}



function unwrapResponse<T>(response: AxiosResponse<T | { data: T }>): T {
  const body: any = response.data;
  if (body && typeof body === "object" && "data" in body) {
    return body.data as T;
  }
  return body as T;
}


// function mapDailyRecord(
//   raw: BackendDailyRecord,
//   employee?: BackendEmployee,
// ): AttendanceRecord {
//   const date = String(raw.date ?? raw.attendance_date ?? raw.attendanceDate ?? "").slice(0, 10);
//   const shiftLabel = raw.shift ?? raw.shift_name;
//   const shiftStart = toTime(raw.shift_start_time ?? raw.shift_start);
//   const shiftEnd = toTime(raw.shift_end_time ?? raw.shift_end);
//   const shift = shiftLabel || (shiftStart && shiftEnd
//     ? `${shiftStart} - ${shiftEnd}${raw.patternname ? ` (${raw.patternname})` : ""}`
//     : "--");

//   return {
//     id: String(raw.id ?? `${employee?.employee_id ?? raw.employee_id ?? "employee"}-${date}`),
//     date,
//     shift,
//     punchIn: toTime(raw.punch_in ?? raw.punch_in_time ?? raw.punchIn),
//     punchOut: toTime(raw.punch_out ?? raw.punch_out_time ?? raw.punchOut),
//     breakIn: raw.break_in ?? raw.last_break_in ?? null,
//     breakOut: raw.break_out ?? raw.last_break_out ?? null,
//     workingHours: Number(raw.working_hours ?? raw.working_hrs ?? 0),
//     breakTime: Number(raw.break_minutes ?? raw.total_break ?? 0),
//     // status: mapStatus(raw.status ?? raw.attendance_status),
//     status: mapStatus(
//   raw.leave_type ??
//   raw.status ??
//   raw.attendance_status
// ),
//     employeeName: employee?.employee_name ?? raw.employee_name,
//     employeeId: employee?.employee_id ?? raw.employee_id,
//   };
// }


function mapDailyRecord(
  raw: BackendDailyRecord,
  employee?: BackendEmployee,
): AttendanceRecord {
  const date = String(
    raw.date ?? raw.attendance_date ?? raw.attendanceDate ?? "",
  ).slice(0, 10);

  const joiningDate = String(
    employee?.joining_date ?? employee?.doj ?? "",
  ).slice(0, 10);

  const isPreJoining =
    raw.is_pre_joining === true ||
    (Boolean(joiningDate) && Boolean(date) && date < joiningDate);

  const id = String(
    raw.id ?? `${employee?.employee_id ?? raw.employee_id ?? "employee"}-${date}`,
  );

  // Keep the date visible, but leave every attendance field blank.
  if (isPreJoining) {
    return {
      id,
      date,
      shift: "",
      punchIn: "",
      punchOut: "",
      breakIn: null,
      breakOut: null,
      workingHours: 0,
      breakTime: 0,
      status: "" as AttendanceStatus,
      isPreJoining: true,
      employeeName: employee?.employee_name ?? raw.employee_name,
      employeeId: employee?.employee_id ?? raw.employee_id,
    };
  }

  const shiftLabel = raw.shift ?? raw.shift_name;
  const shiftStart = toTime(raw.shift_start_time ?? raw.shift_start);
  const shiftEnd = toTime(raw.shift_end_time ?? raw.shift_end);

  const shift =
    shiftLabel ||
    (shiftStart && shiftEnd
      ? `${shiftStart} - ${shiftEnd}${
          raw.patternname ? ` (${raw.patternname})` : ""
        }`
      : "--");

  return {
    id,
    date,
    shift,
    punchIn: toTime(raw.punch_in ?? raw.punch_in_time ?? raw.punchIn),
    punchOut: toTime(raw.punch_out ?? raw.punch_out_time ?? raw.punchOut),
    breakIn: raw.break_in ?? raw.last_break_in ?? null,
    breakOut: raw.break_out ?? raw.last_break_out ?? null,
    workingHours: Number(raw.working_hours ?? raw.working_hrs ?? 0),
    breakTime: Number(raw.break_minutes ?? raw.total_break ?? 0),
    status: mapStatus(
      raw.leave_type ?? raw.status ?? raw.attendance_status,
    ),
    isPreJoining: false,
    employeeName: employee?.employee_name ?? raw.employee_name,
    employeeId: employee?.employee_id ?? raw.employee_id,
  };
}


// =============================================================================
// Logged-in employee resolution
// =============================================================================

/**
 * Use an employee ID already saved by your login/profile flow.
 *
 * IMPORTANT:
 * Do not fall back to an unfiltered all-employee history request.
 * If your project uses a different auth-storage key, add that exact
 * key here after checking your existing authStorage implementation.
 */
let loggedInEmployeeIdPromise: Promise<number> | null = null;

/**
 * Resolve the logged-in employee's database ID using the same profile
 * endpoint used by TopNavbar. `username` stores the employee code, not
 * the numeric employee ID.
 */
async function getLoggedInEmployeeId(): Promise<number> {
  if (loggedInEmployeeIdPromise) {
    return loggedInEmployeeIdPromise;
  }

  loggedInEmployeeIdPromise = (async (): Promise<number> => {
    const empCode = localStorage.getItem("username")?.trim();

    if (!empCode) {
      throw new Error(
        "Could not resolve the logged-in employee: localStorage key 'username' is missing.",
      );
    }

    const response = await axiosInstance.get(
      `/api/v1/employees/profile/${encodeURIComponent(empCode)}`,
    );

    const body: any = response.data;
    const profile =
      body?.data && typeof body.data === "object"
        ? body.data
        : body;

    const candidate =
      profile?.id ??
      profile?.employee_id ??
      profile?.employeeId ??
      profile?.emp_id ??
      profile?.employee?.id ??
      profile?.employee?.employee_id;

    const employeeId = Number(candidate);

    if (!Number.isInteger(employeeId) || employeeId <= 0) {
      throw new Error(
        "The employee profile API did not return a valid numeric employee ID. " +
        "Expected one of: id, employee_id, employeeId, or emp_id.",
      );
    }

    return employeeId;
  })().catch((error) => {
    // Allow retry after a failed profile request.
    loggedInEmployeeIdPromise = null;
    throw error;
  });

  return loggedInEmployeeIdPromise;
}

// =============================================================================
// Mock service
// =============================================================================

class MockAttendanceService implements IAttendanceService {
  private delay(milliseconds = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  private dailyState: DailyPunchState = {
    id: null,
    employeeId: "CURRENT_USER",
    attendanceDate: localDate(new Date()),
    punchIn: null,
    punchOut: null,
    breakIn: null,
    breakOut: null,
    punchState: "NOT_PUNCHED_IN",
    isPunchedIn: false,
    isOnBreak: false,
    isPunchedOut: false,
    workingMinutes: 0,
    breakMinutes: 0,
    punchInLocation: null,
    punchOutLocation: null,
    lastAction: null,
    lastActionAt: null,
  };

  async getAttendance(filters?: AttendanceFilter): Promise<AttendanceApiResponse> {
    await this.delay();

    let records = [...attendanceMockData.records];

    if (filters?.selectedDate) {
      records = records.filter((r) => r.date === filters.selectedDate);
    }
    if (filters?.startDate) {
      records = records.filter((r) => r.date >= filters.startDate!);
    }
    if (filters?.endDate) {
      records = records.filter((r) => r.date <= filters.endDate!);
    }
    if (filters?.status) {
      records = records.filter((r) => r.status === filters.status);
    }
    if (filters?.searchTerm?.trim()) {
      const search = filters.searchTerm.trim().toLowerCase();
      records = records.filter(
        (r) =>
          r.employeeName?.toLowerCase().includes(search) ||
          r.id.toLowerCase().includes(search),
      );
    }

    const present = records.filter((r) => r.status === "Present").length;
    const absent = records.filter((r) => r.status === "Absent").length;
    const late = records.filter((r) => r.status === "Late").length;
    const working = records.filter((r) => ["Present", "Late"].includes(r.status));
    const totalHours = working.reduce((sum, r) => sum + r.workingHours, 0);

    return {
      records,
      summary: {
        totalDays: records.length,
        presentDays: present,
        presentPercentage: records.length ? (present / records.length) * 100 : 0,
        absentDays: absent,
        absentPercentage: records.length ? (absent / records.length) * 100 : 0,
        lateDays: late,
        latePercentage: records.length ? (late / records.length) * 100 : 0,
        averageWorkingHours: working.length ? (totalHours / working.length).toFixed(2) : "--",
      },
      overview: attendanceMockData.overview,
      totalCount: records.length,
      page: 1,
      pageSize: records.length,
    };
  }

  async getAttendanceSummary(filters?: AttendanceFilter): Promise<AttendanceSummary> {
    return (await this.getAttendance(filters)).summary;
  }

  async getAttendanceOverview(year: number, month: number): Promise<AttendanceOverviewItem[]> {
    const prefix = `${year}-${String(month).padStart(2, "0")}`;
    return attendanceMockData.overview.filter((item) => item.date.startsWith(prefix));
  }

  async exportAttendance(): Promise<AttendanceExportResponse> {
    return {
      downloadUrl: "/mock/attendance-export.xlsx",
      fileName: `attendance-${localDate(new Date())}.xlsx`,
    };
  }

  async filterAttendance(filters: AttendanceFilter): Promise<AttendanceApiResponse> {
    return this.getAttendance(filters);
  }

  async getTodayAttendance(): Promise<DailyPunchState> {
    return { ...this.dailyState, attendanceDate: localDate(new Date()) };
  }

  async getTodayTimeline(): Promise<AttendanceTimelineActivity[]> {
    const activities: AttendanceTimelineActivity[] = [];
    const state = this.dailyState;

    if (state.punchIn) activities.push({ id: "mock-PI", activity: "PI", log: state.punchIn });
    if (state.breakIn) activities.push({ id: "mock-BI", activity: "BI", log: state.breakIn });
    if (state.breakOut) activities.push({ id: "mock-BO", activity: "BO", log: state.breakOut });
    if (state.punchOut) activities.push({ id: "mock-PO", activity: "PO", log: state.punchOut });

    return activities.sort((a, b) => new Date(a.log).getTime() - new Date(b.log).getTime());
  }

  async executePunchAction(request: PunchActionRequest): Promise<PunchActionResponse> {
    const timestamp = new Date().toISOString();
    const state = this.dailyState;

    if (request.action === "PUNCH_IN") {
      if (state.isPunchedIn) {
        return {
          success: false, message: "Already punched in.", action: request.action,
          actionStatus: "ALREADY_COMPLETED", attendance: { ...state }, timestamp,
        };
      }
      this.dailyState = {
        ...state,
        punchIn: timestamp,
        punchOut: null,
        breakIn: null,
        breakOut: null,
        punchState: "WORKING",
        isPunchedIn: true,
        isOnBreak: false,
        isPunchedOut: false,
        lastAction: "PUNCH_IN",
        lastActionAt: timestamp,
      };
    } else if (request.action === "BREAK_IN") {
      if (!state.isPunchedIn || state.isOnBreak) {
        return {
          success: false,
          message: !state.isPunchedIn ? "Please Punch In first." : "Already on break.",
          action: request.action,
          actionStatus: !state.isPunchedIn ? "INVALID_STATE" : "ALREADY_COMPLETED",
          attendance: { ...state }, timestamp,
        };
      }
      this.dailyState = {
        ...state, breakIn: timestamp, breakOut: null,
        punchState: "ON_BREAK", isOnBreak: true,
        lastAction: "BREAK_IN", lastActionAt: timestamp,
      };
    } else if (request.action === "BREAK_OUT") {
      if (!state.isPunchedIn || !state.isOnBreak) {
        return {
          success: false,
          message: !state.isPunchedIn ? "Please Punch In first." : "You are not currently on break.",
          action: request.action, actionStatus: "INVALID_STATE",
          attendance: { ...state }, timestamp,
        };
      }
      this.dailyState = {
        ...state, breakOut: timestamp, punchState: "WORKING",
        isOnBreak: false, lastAction: "BREAK_OUT", lastActionAt: timestamp,
      };
    } else {
      if (!state.isPunchedIn || state.isOnBreak) {
        return {
          success: false,
          message: !state.isPunchedIn ? "Please Punch In first." : "Please Break Out before Punch Out.",
          action: request.action, actionStatus: "INVALID_STATE",
          attendance: { ...state }, timestamp,
        };
      }
      this.dailyState = {
        ...state, punchOut: timestamp, punchState: "PUNCHED_OUT",
        isPunchedIn: false, isOnBreak: false, isPunchedOut: true,
        lastAction: "PUNCH_OUT", lastActionAt: timestamp,
      };
    }

    return {
      success: true,
      // message: `${request.action.replaceAll("_", " ")} successful.`,
      message: `${request.action.replace(/_/g, " ")} successful.`,
      action: request.action,
      actionStatus: "SUCCESS",
      attendance: { ...this.dailyState },
      timestamp,
    };
  }
}

// =============================================================================
// Real API service
// =============================================================================

class ApiAttendanceService implements IAttendanceService {
  private getTodayDate(): string {
    return localDate(new Date());
  }

  private async buildQueryParams(filters?: AttendanceFilter): Promise<URLSearchParams> {
    const params = new URLSearchParams();

    // The monthly history endpoint expects `month` and `year`. Sending only
    // `from_date`/`to_date` switches the backend to its separate admin-history
    // response shape, which does not contain employees[].daily_records.
    // Resolve the month from the selected date/range; default to this month.
    const dateForMonth = filters?.selectedDate ?? filters?.startDate ?? localDate(new Date());
    const dateMatch = dateForMonth.match(/^(\d{4})-(\d{2})/);
    const now = new Date();
    const year = dateMatch ? Number(dateMatch[1]) : now.getFullYear();
    const month = dateMatch ? Number(dateMatch[2]) : now.getMonth() + 1;

    params.set("year", String(year));
    params.set("month", String(month));

    if (filters?.searchTerm?.trim()) {
      params.set("search", filters.searchTerm.trim());
    }

    // Scope the report to the authenticated employee's resolved database ID.
    params.set("emp_id", String(await getLoggedInEmployeeId()));
    params.set("page", "1");
    params.set("page_size", "200");

    return params;
  }

  private handleResponse<T>(response: AxiosResponse): T {
    return unwrapResponse<T>(response);
  }

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as any;
      const message =
        data?.message ??
        data?.detail ??
        error.message ??
        "Attendance API request failed.";

      throw new Error(`Attendance API Error: ${message}`);
    }

    if (error instanceof Error) throw error;
    throw new Error("An unexpected attendance error occurred.");
  }

  private createEmptyDailyState(date: string): DailyPunchState {
    return {
      id: null,
      employeeId: "",
      attendanceDate: date,
      punchIn: null,
      punchOut: null,
      breakIn: null,
      breakOut: null,
      punchState: "NOT_PUNCHED_IN",
      isPunchedIn: false,
      isOnBreak: false,
      isPunchedOut: false,
      workingMinutes: 0,
      breakMinutes: 0,
      punchInLocation: null,
      punchOutLocation: null,
      lastAction: null,
      lastActionAt: null,
    };
  }

  private mapBackendAttendanceToDailyPunchState(
    attendance: BackendDailyRecord | null | undefined,
  ): DailyPunchState {
    const date = String(
      attendance?.attendance_date ??
      attendance?.attendanceDate ??
      attendance?.date ??
      this.getTodayDate(),
    ).slice(0, 10);

    const punchIn = attendance?.punch_in ?? attendance?.punchIn ?? null;
    const punchOut = attendance?.punch_out ?? attendance?.punchOut ?? null;
    const breakIn = attendance?.break_in ?? attendance?.last_break_in ?? null;
    const breakOut = attendance?.break_out ?? attendance?.last_break_out ?? null;

    const isPunchedIn = Boolean(punchIn) && !Boolean(punchOut);
    const isPunchedOut = Boolean(punchOut);
    const isOnBreak = Boolean(breakIn) && !Boolean(breakOut) && isPunchedIn;

    let punchState: DailyPunchState["punchState"] = "NOT_PUNCHED_IN";
    if (isPunchedOut) punchState = "PUNCHED_OUT";
    else if (isOnBreak) punchState = "ON_BREAK";
    else if (isPunchedIn) punchState = "WORKING";

    let lastAction: DailyPunchState["lastAction"] = null;
    if (punchOut) lastAction = "PUNCH_OUT";
    else if (breakOut) lastAction = "BREAK_OUT";
    else if (breakIn) lastAction = "BREAK_IN";
    else if (punchIn) lastAction = "PUNCH_IN";

    return {
      id: attendance?.id != null ? String(attendance.id) : null,
      employeeId:
        attendance?.employee_id ??
        attendance?.emp_id ??
        "",
      attendanceDate: date,
      punchIn,
      punchOut,
      breakIn,
      breakOut,
      punchState,
      isPunchedIn,
      isOnBreak,
      isPunchedOut,
      workingMinutes: Number(
        attendance?.working_minutes ??
        attendance?.working_hrs ??
        0,
      ) * (attendance?.working_hrs != null ? 60 : 1),
      breakMinutes: Number(
        attendance?.break_minutes ??
        attendance?.total_break ??
        0,
      ),
      punchInLocation: attendance?.punch_in_location ?? null,
      punchOutLocation: attendance?.punch_out_location ?? null,
      lastAction,
      lastActionAt: attendance?.last_action_at ?? null,
    };
  }

  private normalizeHistoryResponse(
    body: BackendHistoryResponse,
  ): AttendanceApiResponse {
    if (!body?.success) {
      throw new Error(body?.message ?? "Attendance history could not be loaded.");
    }

    const employee = body.employees?.[0];
    const records = (employee?.daily_records ?? []).map((item) =>
      mapDailyRecord(item, employee),
    );

    const stats = body.statistics ?? {};
    // const totalDays = records.length;
//     const eligibleRecords = records.filter(
//       (record) => !record.isPreJoining,
//     );
//     const totalDays = eligibleRecords.length;
//     const present = Number(stats.present ?? employee?.present ?? 0);
//     const absent = Number(stats.lop ?? employee?.lop ?? 0);
//     const late = Number(stats.late ?? employee?.late ?? 0);
//     const workingHours = Number(
//       stats.total_working_hours ?? employee?.total_working_hours ?? 0,
//     );

//     const summary: AttendanceSummary = {
//   totalDays: Number(employee?.total_days ?? totalDays),
//   presentDays: present,
//   presentPercentage: totalDays
//     ? (present / totalDays) * 100
//     : 0,
//   absentDays: absent,
//   absentPercentage: totalDays
//     ? (absent / totalDays) * 100
//     : 0,
//   lateDays: late,
//   latePercentage: totalDays
//     ? (late / totalDays) * 100
//     : 0,
//   averageWorkingHours: present
//     ? (workingHours / present).toFixed(2)
//     : "--",
// };

    const eligibleRecords = records.filter(
  (record) => !record.isPreJoining
);

const totalDays = eligibleRecords.length;

const present = eligibleRecords.filter(
  (record) => record.status === "Present"
).length;

const absent = eligibleRecords.filter(
  (record) =>
    record.status === "Absent" || record.status === "LOP"
).length;

const late = eligibleRecords.filter(
  (record) => record.status === "Late"
).length;

const weeklyOff = eligibleRecords.filter(
  (record) => record.status === "WeeklyOff"
).length;

const holiday = eligibleRecords.filter(
  (record) => record.status === "Holiday"
).length;

const workingDays = totalDays - weeklyOff - holiday;

const workingHours = eligibleRecords.reduce(
  (sum, record) =>
    record.status === "Present" || record.status === "Late"
      ? sum + (Number(record.workingHours) || 0)
      : sum,
  0
);

const summary: AttendanceSummary = {
  totalDays,
  presentDays: present,
  presentPercentage:
    workingDays > 0 ? (present / workingDays) * 100 : 0,
  absentDays: absent,
  absentPercentage:
    workingDays > 0 ? (absent / workingDays) * 100 : 0,
  lateDays: late,
  latePercentage:
    workingDays > 0 ? (late / workingDays) * 100 : 0,
  averageWorkingHours:
    present > 0 ? (workingHours / present).toFixed(2) : "--",
};

    const overview: AttendanceOverviewItem[] = records.map((record) => {
      const [year, month, day] = record.date.split("-").map(Number);
      return {
        date: record.date,
        dayOfWeek: new Date(year, month - 1, day).toLocaleDateString(
          "en-US",
          { weekday: "long" },
        ),
        dayOfMonth: day,
        status: record.status,
      };
    });

    return {
      records,
      summary,
      overview,
      totalCount: Number(body.pagination?.total_items ?? records.length),
      page: Number(body.pagination?.page ?? 1),
      pageSize: Number(body.pagination?.page_size ?? 200),
    };
  }

  async getAttendance(filters?: AttendanceFilter): Promise<AttendanceApiResponse> {
    try {
      const params = await this.buildQueryParams(filters);
      const response = await axiosInstance.get<BackendHistoryResponse>(
        `/api/v1/attendance/history?${params.toString()}`,
      );
      return this.normalizeHistoryResponse(response.data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getAttendanceSummary(filters?: AttendanceFilter): Promise<AttendanceSummary> {
    try {
      const params = await this.buildQueryParams(filters);
      params.delete("page");
      params.delete("page_size");

      const response = await axiosInstance.get<AttendanceSummary>(
        `/api/v1/attendance/summary?${params.toString()}`,
      );
      return this.handleResponse<AttendanceSummary>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getAttendanceOverview(
    year: number,
    month: number,
  ): Promise<AttendanceOverviewItem[]> {
    try {
      const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const lastDate =
        `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

      const params = new URLSearchParams({
        from_date: firstDay,
        to_date: lastDate,
        emp_id: String(await getLoggedInEmployeeId()),
      });

      const response = await axiosInstance.get<BackendHistoryResponse>(
        `/api/v1/attendance/history?${params.toString()}`,
      );

      return this.normalizeHistoryResponse(response.data).overview;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async exportAttendance(
    filters?: AttendanceFilter,
  ): Promise<AttendanceExportResponse> {
    try {
      const params = await this.buildQueryParams(filters);
      params.delete("page");
      params.delete("page_size");

      const response = await axiosInstance.get<Blob>(
        `/api/v1/attendance/export?${params.toString()}`,
        { responseType: "blob" },
      );

      const url = URL.createObjectURL(response.data);
      return {
        downloadUrl: url,
        fileName: `attendance-${this.getTodayDate()}.xlsx`,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async filterAttendance(filters: AttendanceFilter): Promise<AttendanceApiResponse> {
    return this.getAttendance(filters);
  }

  async getTodayAttendance(): Promise<DailyPunchState> {
    try {
      const today = this.getTodayDate();
      const response = await this.getAttendance({ selectedDate: today });
      const record = response.records.find((item) => item.date === today);

      if (!record) return this.createEmptyDailyState(today);

      return this.mapBackendAttendanceToDailyPunchState({
        id: record.id,
        date: record.date,
        status: record.status,
        punch_in: record.punchIn || null,
        punch_out: record.punchOut || null,
        break_in: record.breakIn ?? null,
        break_out: record.breakOut ?? null,
        working_hours: record.workingHours,
        break_minutes: record.breakTime,
        employee_id: record.employeeId,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getTodayTimeline(): Promise<AttendanceTimelineActivity[]> {
    try {
      const today = this.getTodayDate();
      const params = new URLSearchParams({
        from_date: today,
        to_date: today,
        emp_id: String(await getLoggedInEmployeeId()),
      });

      const response = await axiosInstance.get<BackendHistoryResponse>(
        `/api/v1/attendance/history?${params.toString()}`,
      );

      const employee = response.data?.employees?.[0];
      const record = employee?.daily_records?.find(
        (item) => String(item.date ?? "").slice(0, 10) === today,
      );

      if (!record) return [];

      const activities: AttendanceTimelineActivity[] = [];
      const id = String(record.id ?? today);

      const punchIn = record.punch_in ?? record.punchIn;
      const breakIn = record.break_in ?? record.last_break_in;
      const breakOut = record.break_out ?? record.last_break_out;
      const punchOut = record.punch_out ?? record.punchOut;

      if (punchIn) activities.push({ id: `${id}-PI`, activity: "PI", log: punchIn });
      if (breakIn) activities.push({ id: `${id}-BI`, activity: "BI", log: breakIn });
      if (breakOut) activities.push({ id: `${id}-BO`, activity: "BO", log: breakOut });
      if (punchOut) activities.push({ id: `${id}-PO`, activity: "PO", log: punchOut });

      return activities.sort(
        (a, b) => new Date(a.log).getTime() - new Date(b.log).getTime(),
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  async executePunchAction(
    request: PunchActionRequest,
  ): Promise<PunchActionResponse> {
    try {
      const endpoint = ATTENDANCE_ACTION_ENDPOINTS[request.action];

      const payload = {
        action_time: request.actionTime ?? null,
      };

      // This module does not collect or send employee location.
      const response = await axiosInstance.post<BackendPunchResponse>(
        endpoint,
        payload,
      );

      const body = this.handleResponse<BackendPunchResponse>(response);
      const attendance = this.mapBackendAttendanceToDailyPunchState(
        body?.attendance,
      );

      return {
        ...(body as any),
        success: Boolean(body?.success),
        message: body?.message ?? "Attendance action completed.",
        action: request.action,
        actionStatus: body?.success ? "SUCCESS" : "FAILED",
        attendance,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

// =============================================================================
// Service factory
// =============================================================================

export const attendanceService: IAttendanceService =
  USE_MOCK ? new MockAttendanceService() : new ApiAttendanceService();

export const isUsingMock = USE_MOCK;

export { MockAttendanceService, ApiAttendanceService };
