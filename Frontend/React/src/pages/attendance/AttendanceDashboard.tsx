
// import React, { useCallback, useMemo, useState } from 'react';

// import { useAttendance } from './hooks/useAttendance';
// import { AttendanceStatistics } from './components/AttendanceStatistics/AttendanceStatistics';
// import { AttendanceOverview } from './components/AttendanceOverview/AttendanceOverview';
// import { AttendanceFilterBar } from './components/AttendanceFilterBar/AttendanceFilterBar';
// import { AttendanceTabs } from './components/AttendanceTabs/AttendanceTabs';
// import { AttendanceTable } from './components/AttendanceTable/AttendanceTable';
// import { AttendanceExport } from './components/AttendanceExport/AttendanceExport';

// import type { AttendanceRecord } from './types/attendance.types';

// import bannerImage from '../../assets/images/attendance/attendance.jpg';
// import './AttendanceDashboard.css';

// type DashboardAttendanceRecord = AttendanceRecord & {
//   isPlaceholder?: boolean;
// };

// /**
//  * Normalize a date into YYYY-MM-DD.
//  */
// const normalizeDate = (value: unknown): string | null => {
//   if (!value) return null;

//   if (value instanceof Date) {
//     if (Number.isNaN(value.getTime())) return null;

//     const year = value.getFullYear();
//     const month = String(value.getMonth() + 1).padStart(2, '0');
//     const day = String(value.getDate()).padStart(2, '0');

//     return `${year}-${month}-${day}`;
//   }

//   const text = String(value).trim();

//   const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);

//   if (isoMatch) {
//     return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
//   }

//   const parsed = new Date(text);

//   if (Number.isNaN(parsed.getTime())) return null;

//   const year = parsed.getFullYear();
//   const month = String(parsed.getMonth() + 1).padStart(2, '0');
//   const day = String(parsed.getDate()).padStart(2, '0');

//   return `${year}-${month}-${day}`;
// };

// /**
//  * Convert a month/date value into YYYY-MM.
//  *
//  * Supported examples:
//  * 2026-01
//  * 2026-01-01
//  * January 2026
//  */
// const getMonthKey = (value: unknown): string | null => {
//   if (!value) return null;

//   if (typeof value === 'object') {
//     const obj = value as Record<string, unknown>;

//     return (
//       getMonthKey(obj.value) ??
//       getMonthKey(obj.month) ??
//       getMonthKey(obj.date) ??
//       getMonthKey(obj.label)
//     );
//   }

//   const text = String(value).trim();

//   const isoMonth = text.match(/^(\d{4})-(\d{2})/);

//   if (isoMonth) {
//     const monthNumber = Number(isoMonth[2]);

//     if (monthNumber >= 1 && monthNumber <= 12) {
//       return `${isoMonth[1]}-${isoMonth[2]}`;
//     }
//   }

//   const parsed = new Date(text);

//   if (!Number.isNaN(parsed.getTime())) {
//     const year = parsed.getFullYear();
//     const month = String(parsed.getMonth() + 1).padStart(2, '0');

//     return `${year}-${month}`;
//   }

//   return null;
// };

// /**
//  * Get the date from an attendance record.
//  */
// const getRecordDate = (record: AttendanceRecord): string | null => {
//   const data = record as AttendanceRecord & {
//     attendanceDate?: string;
//     attendance_date?: string;
//   };

//   return normalizeDate(
//     data.date ?? data.attendanceDate ?? data.attendance_date
//   );
// };

// /**
//  * Identify generated rows.
//  */
// const isPlaceholderRecord = (
//   record: AttendanceRecord | DashboardAttendanceRecord
// ): boolean => {
//   return (
//     'isPlaceholder' in record &&
//     record.isPlaceholder === true
//   );
// };

// /**
//  * Generate one row for every calendar day in the selected month.
//  * Real API records take priority over generated rows.
//  */
// const generateMonthlyAttendance = (
//   records: AttendanceRecord[],
//   monthKey: string
// ): DashboardAttendanceRecord[] => {
//   const [year, month] = monthKey.split('-').map(Number);

//   if (
//     !year ||
//     !month ||
//     month < 1 ||
//     month > 12
//   ) {
//     return records as DashboardAttendanceRecord[];
//   }

//   const daysInMonth = new Date(year, month, 0).getDate();

//   const recordsByDate = new Map<string, AttendanceRecord>();

//   records.forEach((record) => {
//     const recordDate = getRecordDate(record);

//     if (recordDate && recordDate.startsWith(`${monthKey}-`)) {
//       recordsByDate.set(recordDate, record);
//     }
//   });

//   const result: DashboardAttendanceRecord[] = [];

//   for (let day = 1; day <= daysInMonth; day++) {
//     const date = `${monthKey}-${String(day).padStart(2, '0')}`;
//     const existingRecord = recordsByDate.get(date);

//     if (existingRecord) {
//       result.push({
//         ...existingRecord,
//         isPlaceholder: false,
//       });

//       continue;
//     }

//     /*
//      * Use values compatible with AttendanceRecord:
//      * punchIn and punchOut are strings.
//      * workingHours is a number.
//      * status must be a valid AttendanceStatus.
//      *
//      * isPlaceholder identifies this as a generated row.
//      */
//     const placeholder: DashboardAttendanceRecord = {
//       id: `missing-${date}`,
//       date,
//       shift: '--',
//       punchIn: '',
//       punchOut: '',
//       workingHours: 0,
//       breakTime: 0,
//       status: 'Absent',
//       isPlaceholder: true,
//     };

//     result.push(placeholder);
//   }

//   return result;
// };

// /**
//  * Format YYYY-MM-DD as DD Mon YYYY.
//  */
// const formatDate = (dateString: string): string => {
//   const normalized = normalizeDate(dateString);

//   if (!normalized) return dateString;

//   const [year, month, day] = normalized.split('-').map(Number);

//   return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//   });
// };

// export const AttendanceDashboard: React.FC = () => {
//   const {
//     loading,
//     error,
//     records,
//     summary,
//     overview,
//     filters,
//     setFilters,
//     applyFilters,
//     resetFilters,
//     refresh,
//   } = useAttendance();

//   const [showFilters, setShowFilters] = useState<boolean>(false);

//   const toggleFilters = useCallback(() => {
//     setShowFilters((previous) => !previous);
//   }, []);

//   /**
//    * Determine which month to display:
//    * 1. Selected month/date from filters.
//    * 2. Month of the first available attendance record.
//    * 3. Current month if no record exists.
//    */
//   const selectedMonthKey = useMemo(() => {
//     const filterValues = filters as typeof filters & {
//       selectedMonth?: unknown;
//       month?: unknown;
//       selectedDate?: unknown;
//       date?: unknown;
//     };

//     const filterMonth =
//       getMonthKey(filterValues.selectedMonth) ??
//       getMonthKey(filterValues.month) ??
//       getMonthKey(filterValues.selectedDate) ??
//       getMonthKey(filterValues.date);

//     if (filterMonth) return filterMonth;

//     const firstRecordDate = records
//       .map(getRecordDate)
//       .find((date): date is string => date !== null);

//     if (firstRecordDate) {
//       return firstRecordDate.slice(0, 7);
//     }

//     const today = new Date();

//     return `${today.getFullYear()}-${String(
//       today.getMonth() + 1
//     ).padStart(2, '0')}`;
//   }, [filters, records]);

//   /**
//    * Build all calendar-day rows for the selected month.
//    */
//   const monthlyRecords = useMemo(
//     () => generateMonthlyAttendance(records, selectedMonthKey),
//     [records, selectedMonthKey]
//   );

//   /**
//    * Export only actual attendance records.
//    */
//   const exportRecords = useMemo(
//     () =>
//       monthlyRecords.filter(
//         (record) => !isPlaceholderRecord(record)
//       ),
//     [monthlyRecords]
//   );

//   /**
//    * Calculate the selected month's date range.
//    */
//   const dateRangeText = useMemo(() => {
//     const [year, month] = selectedMonthKey.split('-').map(Number);

//     if (!year || !month) return 'Select a month';

//     const lastDay = new Date(year, month, 0).getDate();

//     const firstDate = `${selectedMonthKey}-01`;

//     const lastDate = `${selectedMonthKey}-${String(lastDay).padStart(
//       2,
//       '0'
//     )}`;

//     return `${formatDate(firstDate)} - ${formatDate(lastDate)}`;
//   }, [selectedMonthKey]);

//   /**
//    * Handle table actions.
//    * Generated rows cannot be edited or downloaded as actual records.
//    */
//   const handleTableAction = useCallback(
//     (
//       action: 'view' | 'edit' | 'download',
//       recordId: string
//     ) => {
//       const record = monthlyRecords.find(
//         (item) => String(item.id) === String(recordId)
//       );

//       if (!record) {
//         console.warn('Attendance record not found:', recordId);
//         return;
//       }

//       if (isPlaceholderRecord(record)) {
//         console.info(
//           'No actual attendance record exists for this date.'
//         );
//         return;
//       }

//       /*
//        * Connect your existing view/edit/download handlers here.
//        */
//       console.log(
//         `Action "${action}" on record ${recordId}`,
//         record
//       );
//     },
//     [monthlyRecords]
//   );

//   /**
//    * Handle table sorting.
//    */
//   const handleSort = useCallback(
//     (field: string, direction: 'asc' | 'desc') => {
//       console.log(`Sorting by ${field} ${direction}`);
//     },
//     []
//   );

//   /**
//    * Handle a date click in the overview.
//    */
//   const handleDayClick = useCallback(
//     (date: string) => {
//       setFilters({ selectedDate: date });
//       applyFilters();
//     },
//     [setFilters, applyFilters]
//   );

//   if (error) {
//     return (
//       <div className="attendance-dashboard">
//         <div className="attendance-dashboard__error">
//           <h2>Unable to load attendance</h2>

//           <p>
//             {typeof error === 'string'
//               ? error
//               : 'An unexpected error occurred while loading attendance data.'}
//           </p>

//           <button type="button" onClick={refresh}>
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="attendance-dashboard">
//       {/* Header */}
//       <div className="attendance-dashboard__header">
//         <div>
//           <h1>Attendance History</h1>
//           <p>{dateRangeText}</p>
//         </div>

//         <div className="attendance-dashboard__header-actions">
//           <button
//             type="button"
//             onClick={toggleFilters}
//             aria-expanded={showFilters}
//           >
//             {showFilters ? 'Hide Filters' : 'Filters'}
//           </button>

//           <AttendanceExport
//             records={exportRecords}
//             loading={loading}
//             size="md"
//           />
//         </div>
//       </div>

//       {/* Banner */}
//       <div className="attendance-dashboard__banner">
//         <img
//           src={bannerImage}
//           alt="Attendance"
//           className="attendance-dashboard__banner-image"
//         />
//       </div>

//       {/* Filters */}
//       <AttendanceFilterBar
//         filters={filters}
//         onFilterChange={setFilters}
//         onApply={applyFilters}
//         onReset={resetFilters}
//         loading={loading}
//         className={showFilters ? 'visible' : ''}
//       />

//       {/* Statistics */}
//       <AttendanceStatistics
//         summary={summary}
//         loading={loading}
//         error={error}
//       />

//       {/* Overview */}
//       <AttendanceOverview
//         data={overview}
//         loading={loading}
//         error={error}
//         onDayClick={handleDayClick}
//       />

//       {/* Attendance table */}
//       <AttendanceTabs activeTab="daily">
//         <AttendanceTable
//           records={monthlyRecords}
//           loading={loading}
//           onAction={handleTableAction}
//           onSort={handleSort}
//           itemsPerPage={10}
//           totalCount={monthlyRecords.length}
//         />
//       </AttendanceTabs>
//     </div>
//   );
// };

// export default AttendanceDashboard;






import React, { useCallback, useMemo, useState } from 'react';



import { useAttendance } from './hooks/useAttendance';

import { AttendanceStatistics } from './components/AttendanceStatistics/AttendanceStatistics';

import { AttendanceOverview } from './components/AttendanceOverview/AttendanceOverview';

import { AttendanceFilterBar } from './components/AttendanceFilterBar/AttendanceFilterBar';

import { AttendanceTabs } from './components/AttendanceTabs/AttendanceTabs';

import { AttendanceTable } from './components/AttendanceTable/AttendanceTable';

import { AttendanceExport } from './components/AttendanceExport/AttendanceExport';



import type { AttendanceRecord } from './types/attendance.types';



import bannerImage from '../../assets/images/attendance/attendance.jpg';

import './AttendanceDashboard.css';



type DashboardAttendanceRecord = AttendanceRecord & {

  isPlaceholder?: boolean;

};



/**

 * Normalize a date into YYYY-MM-DD.

 */

const normalizeDate = (value: unknown): string | null => {

  if (!value) return null;



  if (value instanceof Date) {

    if (Number.isNaN(value.getTime())) return null;



    const year = value.getFullYear();

    const month = String(value.getMonth() + 1).padStart(2, '0');

    const day = String(value.getDate()).padStart(2, '0');



    return `${year}-${month}-${day}`;

  }



  const text = String(value).trim();



  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);



  if (isoMatch) {

    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

  }



  const parsed = new Date(text);



  if (Number.isNaN(parsed.getTime())) return null;



  const year = parsed.getFullYear();

  const month = String(parsed.getMonth() + 1).padStart(2, '0');

  const day = String(parsed.getDate()).padStart(2, '0');



  return `${year}-${month}-${day}`;

};



/**

 * Convert a month/date value into YYYY-MM.

 *

 * Supported examples:

 * 2026-01

 * 2026-01-01

 * January 2026

 */

const getMonthKey = (value: unknown): string | null => {

  if (!value) return null;



  if (typeof value === 'object') {

    const obj = value as Record<string, unknown>;



    return (

      getMonthKey(obj.value) ??

      getMonthKey(obj.month) ??

      getMonthKey(obj.date) ??

      getMonthKey(obj.label)

    );

  }



  const text = String(value).trim();



  const isoMonth = text.match(/^(\d{4})-(\d{2})/);



  if (isoMonth) {

    const monthNumber = Number(isoMonth[2]);



    if (monthNumber >= 1 && monthNumber <= 12) {

      return `${isoMonth[1]}-${isoMonth[2]}`;

    }

  }



  const parsed = new Date(text);



  if (!Number.isNaN(parsed.getTime())) {

    const year = parsed.getFullYear();

    const month = String(parsed.getMonth() + 1).padStart(2, '0');



    return `${year}-${month}`;

  }



  return null;

};



/**

 * Get the date from an attendance record.

 */

const getRecordDate = (record: AttendanceRecord): string | null => {

  const data = record as AttendanceRecord & {

    attendanceDate?: string;

    attendance_date?: string;

  };



  return normalizeDate(

    data.date ?? data.attendanceDate ?? data.attendance_date

  );

};



/**

 * Identify generated rows.

 */

const isPlaceholderRecord = (

  record: AttendanceRecord | DashboardAttendanceRecord

): boolean => {

  return (

    'isPlaceholder' in record &&

    record.isPlaceholder === true

  );

};



/**

 * Generate one row for every calendar day in the selected month.

 * Real API records take priority over generated rows.

 */

const generateMonthlyAttendance = (
  records: AttendanceRecord[],
  monthKey: string
): DashboardAttendanceRecord[] => {
  const [year, month] = monthKey.split('-').map(Number);
  if (!year || !month || month < 1 || month > 12) {
    return records as DashboardAttendanceRecord[];
  }

  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const lastVisibleDay = isCurrentMonth ? now.getDate() : daysInMonth;
  const recordsByDate = new Map<string, AttendanceRecord>();

  records.forEach((record) => {
    const recordDate = getRecordDate(record);
    if (recordDate && recordDate.startsWith(`${monthKey}-`)) {
      recordsByDate.set(recordDate, record);
    }
  });

  const result: DashboardAttendanceRecord[] = [];
  for (let day = 1; day <= lastVisibleDay; day++) {
    const date = `${monthKey}-${String(day).padStart(2, '0')}`;
    const existingRecord = recordsByDate.get(date);

    if (existingRecord) {
      result.push({ ...existingRecord, isPlaceholder: false });
      continue;
    }

    result.push({
      id: `missing-${date}`,
      date,
      shift: '--',
      punchIn: '',
      punchOut: '',
      workingHours: 0,
      breakTime: 0,
      status: 'Absent',
      isPlaceholder: true,
    });
  }
  return result;
};

/**

 * Format YYYY-MM-DD as DD Mon YYYY.

 */

const formatDate = (dateString: string): string => {

  const normalized = normalizeDate(dateString);



  if (!normalized) return dateString;



  const [year, month, day] = normalized.split('-').map(Number);



  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {

    day: '2-digit',

    month: 'short',

    year: 'numeric',

  });

};



export const AttendanceDashboard: React.FC = () => {

  const {

    loading,

    error,

    records,

    summary,

    overview,

    filters,

    setFilters,

    applyFilters,

    resetFilters,

    refresh,

  } = useAttendance();



  const [showFilters, setShowFilters] = useState<boolean>(false);



  const toggleFilters = useCallback(() => {

    setShowFilters((previous) => !previous);

  }, []);



  /**

   * Determine which month to display:

   * 1. Selected month/date from filters.

   * 2. Month of the first available attendance record.

   * 3. Current month if no record exists.

   */

  const selectedMonthKey = useMemo(() => {
    const filterValues = filters as typeof filters & {
      selectedMonth?: unknown;
      month?: unknown;
      selectedDate?: unknown;
      date?: unknown;
      startDate?: unknown;
      endDate?: unknown;
    };

    const filterMonth =
      getMonthKey(filterValues.selectedMonth) ??
      getMonthKey(filterValues.month) ??
      getMonthKey(filterValues.selectedDate) ??
      getMonthKey(filterValues.date) ??
      getMonthKey(filterValues.startDate) ??
      getMonthKey(filterValues.endDate);

    if (filterMonth) return filterMonth;

    const today = new Date();
    return `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, '0')}`;
  }, [filters]);

  /**

   * Build all calendar-day rows for the selected month.

   */

  const monthlyRecords = useMemo(() => {
    const filterValues = filters as typeof filters & {
      startDate?: string;
      endDate?: string;
      selectedDate?: string;
      date?: string;
    };

    const selectedDate = filterValues.selectedDate ?? filterValues.date;
    const startDate = selectedDate ?? filterValues.startDate;
    const endDate = selectedDate ?? filterValues.endDate;

    return generateMonthlyAttendance(records, selectedMonthKey).filter((record) => {
      const recordDate = getRecordDate(record);
      if (!recordDate) return false;
      if (startDate && recordDate < startDate) return false;
      if (endDate && recordDate > endDate) return false;
      return true;
    });
  }, [records, selectedMonthKey, filters]);



  /**

   * Export only actual attendance records.

   */

  const exportRecords = useMemo(

    () =>

      monthlyRecords.filter(

        (record) => !isPlaceholderRecord(record)

      ),

    [monthlyRecords]

  );



  /**

   * Calculate the selected month's date range.

   */

  const dateRangeText = useMemo(() => {
    const filterValues = filters as typeof filters & {
      startDate?: string;
      endDate?: string;
      selectedDate?: string;
      date?: string;
    };

    const selectedDate = filterValues.selectedDate ?? filterValues.date;
    const explicitStart = selectedDate ?? filterValues.startDate;
    const explicitEnd = selectedDate ?? filterValues.endDate;

    if (explicitStart || explicitEnd) {
      const start = explicitStart || explicitEnd!;
      const end = explicitEnd || explicitStart!;
      return `${formatDate(start)} - ${formatDate(end)}`;
    }

    const [year, month] = selectedMonthKey.split('-').map(Number);
    if (!year || !month) return 'Select a month';

    const now = new Date();
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
    const lastDay = isCurrentMonth ? now.getDate() : new Date(year, month, 0).getDate();

    return `${formatDate(`${selectedMonthKey}-01`)} - ${formatDate(
      `${selectedMonthKey}-${String(lastDay).padStart(2, '0')}`
    )}`;
  }, [selectedMonthKey, filters]);

  /**

   * Handle table actions.

   * Generated rows cannot be edited or downloaded as actual records.

   */

  const handleTableAction = useCallback(

    (

      action: 'view' | 'edit' | 'download',

      recordId: string

    ) => {

      const record = monthlyRecords.find(

        (item) => String(item.id) === String(recordId)

      );



      if (!record) {

        console.warn('Attendance record not found:', recordId);

        return;

      }



      if (isPlaceholderRecord(record)) {

        console.info(

          'No actual attendance record exists for this date.'

        );

        return;

      }



      /*

       * Connect your existing view/edit/download handlers here.

       */

      console.log(

        `Action "${action}" on record ${recordId}`,

        record

      );

    },

    [monthlyRecords]

  );



  /**

   * Handle table sorting.

   */

  const handleSort = useCallback(

    (field: string, direction: 'asc' | 'desc') => {

      console.log(`Sorting by ${field} ${direction}`);

    },

    []

  );



  /**

   * Handle a date click in the overview.

   */

  const handleDayClick = useCallback(

    (date: string) => {

      setFilters({ selectedDate: date });

      applyFilters();

    },

    [setFilters, applyFilters]

  );



  if (error) {

    return (

      <div className="attendance-dashboard">

        <div className="attendance-dashboard__error">

          <h2>Unable to load attendance</h2>



          <p>

            {typeof error === 'string'

              ? error

              : 'An unexpected error occurred while loading attendance data.'}

          </p>



          <button type="button" onClick={refresh}>

            Retry

          </button>

        </div>

      </div>

    );

  }



  return (

    <div className="attendance-dashboard">

      {/* Header */}

      <div className="attendance-dashboard__header">

        <div>

          <h1>Attendance History</h1>

          <p>{dateRangeText}</p>

        </div>



        <div className="attendance-dashboard__header-actions">

          <button

            type="button"

            onClick={toggleFilters}

            aria-expanded={showFilters}

          >

            {showFilters ? 'Hide Filters' : 'Filters'}

          </button>



          <AttendanceExport

            records={exportRecords}

            loading={loading}

            size="md"

          />

        </div>

      </div>



      {/* Banner */}

      <div className="attendance-dashboard__banner">

        <img

          src={bannerImage}

          alt="Attendance"

          className="attendance-dashboard__banner-image"

        />

      </div>



      {/* Filters */}

      <AttendanceFilterBar

        filters={filters}

        onFilterChange={setFilters}

        onApply={applyFilters}

        onReset={resetFilters}

        loading={loading}

        className={showFilters ? 'visible' : ''}

      />



      {/* Statistics */}

      <AttendanceStatistics

        summary={summary}

        loading={loading}

        error={error}

      />



      {/* Overview */}

      <AttendanceOverview

        data={overview}

        loading={loading}

        error={error}

        onDayClick={handleDayClick}

      />



      {/* Attendance table */}

      <AttendanceTabs activeTab="daily">

        <AttendanceTable

          records={monthlyRecords}

          loading={loading}

          onAction={handleTableAction}

          onSort={handleSort}

          itemsPerPage={10}

          totalCount={monthlyRecords.length}

        />

      </AttendanceTabs>

    </div>

  );

};



export default AttendanceDashboard;