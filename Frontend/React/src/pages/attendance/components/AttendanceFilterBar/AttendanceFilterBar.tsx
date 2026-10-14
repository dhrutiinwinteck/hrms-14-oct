// /**
//  * ======================================================
//  * Attendance Module - Filter Bar Component
//  * ======================================================
//  * Enterprise-grade component for filtering attendance records.
//  * Provides date range pickers, status dropdown, and search input.
//  *
//  * Features:
//  * - Date range selection (start date and end date)
//  * - Status filter dropdown
//  * - Search by employee name or ID
//  * - Apply and Reset buttons
//  * - Responsive layout
//  * - Accessibility (ARIA labels, keyboard navigation)
//  * - Clear visual feedback for active filters
//  *
//  * @module components/AttendanceFilterBar
//  */

// import React, { useCallback, useState, useMemo } from 'react';
// import {
//   Calendar,
//   Search,
//   X,
//   Filter,
//   ChevronDown,
// } from 'lucide-react';
// import { AttendanceFilter, AttendanceStatus } from '../../types/attendance.types';
// import {
//   ATTENDANCE_FILTER_STATUS_OPTIONS,
//   // DEFAULT_ATTENDANCE_FILTERS,
// } from '../../constants/attendance.constants';
// // import { getStatusLabel } from '../../utils/attendance.utils';
// import './AttendanceFilterBar.css';

// // -----------------------------------------------------------------------------
// // Component Props Interface
// // -----------------------------------------------------------------------------

// export interface AttendanceFilterBarProps {
//   /** Current filter values. */
//   filters: AttendanceFilter;
//   /** Callback when filters change. */
//   onFilterChange: (newFilters: Partial<AttendanceFilter>) => void;
//   /** Callback to apply filters. */
//   onApply: () => void;
//   /** Callback to reset filters to default. */
//   onReset: () => void;
//   /** Whether the component is in a loading state. */
//   loading?: boolean;
//   /** Additional CSS class names. */
//   className?: string;
// }

// // -----------------------------------------------------------------------------
// // Component Implementation
// // -----------------------------------------------------------------------------

// /**
//  * AttendanceFilterBar component for filtering attendance records.
//  *
//  * @param props - Component props
//  * @returns React component
//  */
// export const AttendanceFilterBar: React.FC<AttendanceFilterBarProps> = ({
//   filters,
//   onFilterChange,
//   onApply,
//   onReset,
//   loading = false,
//   className = '',
// }) => {
//   // ---------------------------------------------------------------------------
//   // Local State
//   // ---------------------------------------------------------------------------

//   /** Whether the filter bar is expanded on mobile. */
//   const [isExpanded, setIsExpanded] = useState<boolean>(false);

//   // ---------------------------------------------------------------------------
//   // Event Handlers
//   // ---------------------------------------------------------------------------

//   /**
//    * Handles changes to date inputs.
//    */
//   const handleDateChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const { name, value } = e.target;
//       if (name === 'startDate') {
//         onFilterChange({ startDate: value || undefined });
//       } else if (name === 'endDate') {
//         onFilterChange({ endDate: value || undefined });
//       }
//     },
//     [onFilterChange]
//   );

//   /**
//    * Handles changes to status dropdown.
//    */
//   const handleStatusChange = useCallback(
//     (e: React.ChangeEvent<HTMLSelectElement>) => {
//       const value = e.target.value;
//       onFilterChange({
//         status: value ? (value as AttendanceStatus) : undefined,
//       });
//     },
//     [onFilterChange]
//   );

//   /**
//    * Handles changes to search input.
//    */
//   const handleSearchChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       onFilterChange({ searchTerm: e.target.value || undefined });
//     },
//     [onFilterChange]
//   );

//   /**
//    * Clears a specific filter value.
//    */
//   const handleClearFilter = useCallback(
//     (key: keyof AttendanceFilter) => {
//       onFilterChange({ [key]: undefined });
//     },
//     [onFilterChange]
//   );

//   /**
//    * Toggles the filter bar on mobile.
//    */
//   const toggleExpand = useCallback(() => {
//     setIsExpanded((prev) => !prev);
//   }, []);

//   /**
//    * Handles applying filters (also collapses on mobile).
//    */
//   const handleApply = useCallback(() => {
//     onApply();
//     setIsExpanded(false);
//   }, [onApply]);

//   /**
//    * Handles resetting filters (also collapses on mobile).
//    */
//   const handleReset = useCallback(() => {
//     onReset();
//     setIsExpanded(false);
//   }, [onReset]);

//   // ---------------------------------------------------------------------------
//   // Memoized Values
//   // ---------------------------------------------------------------------------

//   /**
//    * Count active filters for badge display.
//    */
//   const activeFilterCount = useMemo(() => {
//     let count = 0;
//     if (filters.startDate) count++;
//     if (filters.endDate) count++;
//     if (filters.status) count++;
//     if (filters.searchTerm) count++;
//     return count;
//   }, [filters]);

//   /**
//    * Selected status label for display.
//    */
//   // const selectedStatusLabel = useMemo(() => {
//   //   if (filters.status) {
//   //     return getStatusLabel(filters.status);
//   //   }
//   //   return 'All Statuses';
//   // }, [filters.status]);

//   // ---------------------------------------------------------------------------
//   // Render
//   // ---------------------------------------------------------------------------

//   return (
//     <div className={`attendance-filter-bar ${className} ${isExpanded ? 'expanded' : ''}`}>
//       {/* Mobile Toggle */}
//       <div className="attendance-filter-bar__toggle">
//         <button
//           className="attendance-filter-bar__toggle-btn"
//           onClick={toggleExpand}
//           aria-expanded={isExpanded}
//           aria-controls="filter-bar-content"
//           disabled={loading}
//         >
//           <Filter size={18} />
//           <span>Filters</span>
//           {activeFilterCount > 0 && (
//             <span className="attendance-filter-bar__badge">{activeFilterCount}</span>
//           )}
//           <ChevronDown
//             size={16}
//             className={`attendance-filter-bar__chevron ${isExpanded ? 'open' : ''}`}
//           />
//         </button>
//       </div>

//       {/* Filter Content */}
//       <div
//         id="filter-bar-content"
//         className="attendance-filter-bar__content"
//         role="search"
//         aria-label="Filter attendance records"
//       >
//         {/* Date Range */}
//         <div className="attendance-filter-bar__group">
//           <label htmlFor="filter-start-date" className="attendance-filter-bar__label">
//             From
//           </label>
//           <div className="attendance-filter-bar__input-wrapper">
//             <Calendar size={16} className="attendance-filter-bar__input-icon" />
//             <input
//               id="filter-start-date"
//               type="date"
//               name="startDate"
//               className="attendance-filter-bar__input"
//               value={filters.startDate || ''}
//               onChange={handleDateChange}
//               disabled={loading}
//               aria-label="Start date"
//             />
//             {filters.startDate && (
//               <button
//                 type="button"
//                 className="attendance-filter-bar__clear-btn"
//                 onClick={() => handleClearFilter('startDate')}
//                 aria-label="Clear start date"
//               >
//                 <X size={14} />
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="attendance-filter-bar__group">
//           <label htmlFor="filter-end-date" className="attendance-filter-bar__label">
//             To
//           </label>
//           <div className="attendance-filter-bar__input-wrapper">
//             <Calendar size={16} className="attendance-filter-bar__input-icon" />
//             <input
//               id="filter-end-date"
//               type="date"
//               name="endDate"
//               className="attendance-filter-bar__input"
//               value={filters.endDate || ''}
//               onChange={handleDateChange}
//               disabled={loading}
//               aria-label="End date"
//             />
//             {filters.endDate && (
//               <button
//                 type="button"
//                 className="attendance-filter-bar__clear-btn"
//                 onClick={() => handleClearFilter('endDate')}
//                 aria-label="Clear end date"
//               >
//                 <X size={14} />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Status */}
//         <div className="attendance-filter-bar__group">
//           <label htmlFor="filter-status" className="attendance-filter-bar__label">
//             Status
//           </label>
//           <div className="attendance-filter-bar__input-wrapper">
//             <select
//               id="filter-status"
//               className="attendance-filter-bar__select"
//               value={filters.status || ''}
//               onChange={handleStatusChange}
//               disabled={loading}
//               aria-label="Filter by status"
//             >
//               {ATTENDANCE_FILTER_STATUS_OPTIONS.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             <ChevronDown size={16} className="attendance-filter-bar__select-icon" />
//             {filters.status && (
//               <button
//                 type="button"
//                 className="attendance-filter-bar__clear-btn"
//                 onClick={() => handleClearFilter('status')}
//                 aria-label="Clear status filter"
//               >
//                 <X size={14} />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Search */}
//         {/* <div className="attendance-filter-bar__group attendance-filter-bar__group--search">
//           <label htmlFor="filter-search" className="attendance-filter-bar__label">
//             Search
//           </label>
//           <div className="attendance-filter-bar__input-wrapper">
//             <Search size={16} className="attendance-filter-bar__input-icon" />
//             <input
//               id="filter-search"
//               type="text"
//               className="attendance-filter-bar__input"
//               placeholder="Search by name or ID..."
//               value={filters.searchTerm || ''}
//               onChange={handleSearchChange}
//               disabled={loading}
//               aria-label="Search employees"
//             />
//             {filters.searchTerm && (
//               <button
//                 type="button"
//                 className="attendance-filter-bar__clear-btn"
//                 onClick={() => handleClearFilter('searchTerm')}
//                 aria-label="Clear search"
//               >
//                 <X size={14} />
//               </button>
//             )}
//           </div>
//         </div> */}

//         {/* Actions */}
//         <div className="attendance-filter-bar__actions">
//           <button
//             type="button"
//             className="attendance-filter-bar__btn attendance-filter-bar__btn--apply"
//             onClick={handleApply}
//             disabled={loading}
//             aria-label="Apply filters"
//           >
//             Apply
//           </button>
//           <button
//             type="button"
//             className="attendance-filter-bar__btn attendance-filter-bar__btn--reset"
//             onClick={handleReset}
//             disabled={loading}
//             aria-label="Reset filters"
//           >
//             Reset
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // -----------------------------------------------------------------------------
// // Default Export
// // -----------------------------------------------------------------------------

// export default AttendanceFilterBar;


/**
 * ======================================================
 * Attendance Module - Filter Bar Component
 * ======================================================
 * Enterprise-grade component for filtering attendance records.
 * Uses Month + Year instead of From + To date inputs.
 * Keeps status filtering, Apply/Reset actions, and mobile behavior.
 *
 * @module components/AttendanceFilterBar
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  Calendar,
  X,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { AttendanceFilter, AttendanceStatus } from '../../types/attendance.types';
import { ATTENDANCE_FILTER_STATUS_OPTIONS } from '../../constants/attendance.constants';
import './AttendanceFilterBar.css';

export interface AttendanceFilterBarProps {
  /** Current filter values. */
  filters: AttendanceFilter;
  /** Callback when filters change. */
  onFilterChange: (newFilters: Partial<AttendanceFilter>) => void;
  /** Callback to apply filters. */
  onApply: () => void;
  /** Callback to reset filters to default. */
  onReset: () => void;
  /** Whether the component is in a loading state. */
  loading?: boolean;
  /** Additional CSS class names. */
  className?: string;
}

const MONTH_OPTIONS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export const AttendanceFilterBar: React.FC<AttendanceFilterBarProps> = ({
  filters,
  onFilterChange,
  onApply,
  onReset,
  loading = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const today = new Date();
  const selectedDate = filters.startDate || filters.endDate;
  const selectedMonth = selectedDate
    ? Number(selectedDate.slice(5, 7))
    : today.getMonth() + 1;
  const selectedYear = selectedDate
    ? Number(selectedDate.slice(0, 4))
    : today.getFullYear();

  // Keep a useful year range while retaining a year already selected outside it.
  const yearOptions = useMemo(() => {
    const years = Array.from(
      { length: 11 },
      (_, index) => today.getFullYear() - 5 + index,
    );
    years.push(selectedYear);
    return [...new Set(years)].sort((a, b) => b - a);
  }, [today.getFullYear(), selectedYear]);

  /** Convert the selected month/year into the existing full-month date range. */
  const handleMonthYearChange = useCallback(
    (month: number, year: number) => {
      const monthString = String(month).padStart(2, '0');
      const startDate = `${year}-${monthString}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${monthString}-${String(lastDay).padStart(2, '0')}`;

      onFilterChange({ startDate, endDate });
    },
    [onFilterChange],
  );

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      onFilterChange({
        status: value ? (value as AttendanceStatus) : undefined,
      });
    },
    [onFilterChange],
  );

  const handleClearFilter = useCallback(
    (key: keyof AttendanceFilter) => {
      onFilterChange({ [key]: undefined });
    },
    [onFilterChange],
  );

  const toggleExpand = useCallback(() => {
    setIsExpanded((previous) => !previous);
  }, []);

  const handleApply = useCallback(() => {
    onApply();
    setIsExpanded(false);
  }, [onApply]);

  const handleReset = useCallback(() => {
    onReset();
    setIsExpanded(false);
  }, [onReset]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.startDate || filters.endDate) count++;
    if (filters.status) count++;
    if (filters.searchTerm) count++;
    return count;
  }, [filters]);

  return (
    <div
      className={`attendance-filter-bar ${className} ${isExpanded ? 'expanded' : ''}`.trim()}
    >
      {/* Mobile Toggle */}
      <div className="attendance-filter-bar__toggle">
        <button
          type="button"
          className="attendance-filter-bar__toggle-btn"
          onClick={toggleExpand}
          aria-expanded={isExpanded}
          aria-controls="filter-bar-content"
          disabled={loading}
        >
          <Filter size={18} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="attendance-filter-bar__badge">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown
            size={16}
            className={`attendance-filter-bar__chevron ${isExpanded ? 'open' : ''}`}
          />
        </button>
      </div>

      {/* Filter Content */}
      <div
        id="filter-bar-content"
        className="attendance-filter-bar__content"
        role="search"
        aria-label="Filter attendance records"
      >
        {/* Month */}
        <div className="attendance-filter-bar__group">
          <label htmlFor="filter-month" className="attendance-filter-bar__label">
            Month
          </label>
          <div className="attendance-filter-bar__input-wrapper">
            <Calendar size={16} className="attendance-filter-bar__input-icon" />
            <select
              id="filter-month"
              className="attendance-filter-bar__select"
              value={selectedMonth}
              onChange={(e) =>
                handleMonthYearChange(Number(e.target.value), selectedYear)
              }
              disabled={loading}
              aria-label="Select attendance month"
            >
              {MONTH_OPTIONS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="attendance-filter-bar__select-icon" />
          </div>
        </div>

        {/* Year */}
        <div className="attendance-filter-bar__group">
          <label htmlFor="filter-year" className="attendance-filter-bar__label">
            Year
          </label>
          <div className="attendance-filter-bar__input-wrapper">
            <Calendar size={16} className="attendance-filter-bar__input-icon" />
            <select
              id="filter-year"
              className="attendance-filter-bar__select"
              value={selectedYear}
              onChange={(e) =>
                handleMonthYearChange(selectedMonth, Number(e.target.value))
              }
              disabled={loading}
              aria-label="Select attendance year"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="attendance-filter-bar__select-icon" />
          </div>
        </div>

        {/* Status */}
        <div className="attendance-filter-bar__group">
          <label htmlFor="filter-status" className="attendance-filter-bar__label">
            Status
          </label>
          <div className="attendance-filter-bar__input-wrapper">
            <select
              id="filter-status"
              className="attendance-filter-bar__select"
              value={filters.status || ''}
              onChange={handleStatusChange}
              disabled={loading}
              aria-label="Filter by status"
            >
              {ATTENDANCE_FILTER_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="attendance-filter-bar__select-icon" />
            {filters.status && (
              <button
                type="button"
                className="attendance-filter-bar__clear-btn"
                onClick={() => handleClearFilter('status')}
                aria-label="Clear status filter"
                disabled={loading}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="attendance-filter-bar__actions">
          <button
            type="button"
            className="attendance-filter-bar__btn attendance-filter-bar__btn--apply"
            onClick={handleApply}
            disabled={loading}
            aria-label="Apply filters"
          >
            Apply
          </button>
          <button
            type="button"
            className="attendance-filter-bar__btn attendance-filter-bar__btn--reset"
            onClick={handleReset}
            disabled={loading}
            aria-label="Reset filters"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceFilterBar;
