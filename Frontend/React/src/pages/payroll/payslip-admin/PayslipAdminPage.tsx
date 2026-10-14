// // // import React, {
// // //   useCallback,
// // //   useMemo,
// // //   useState,
// // // } from 'react';

// // // import {
// // //   Calculator,
// // //   ChevronLeft,
// // //   ChevronRight,
// // //   ChevronsLeft,
// // //   ChevronsRight,
// // //   LockKeyhole,
// // // } from 'lucide-react';

// // // import {
// // //   PayslipAdminHeader,
// // // } from './components/PayslipAdminHeader/PayslipAdminHeader';

// // // // import {
// // // //   PayslipAdminFilters,
// // // // } from './components/PayslipAdminFilters/PayslipAdminFilters';

// // // // import {
// // // //   PayslipAdminTable,
// // // // } from './components/PayslipAdminTable/PayslipAdminTable';

// // // import {
// // //   PayslipPreview,
// // // } from './components/PayslipPreview/PayslipPreview';

// // // // import {
// // // //   AddSalaryPfModal,
// // // // } from './components/AddSalaryPfModal/AddSalaryPfModal';

// // // import {
// // //   usePayslipAdmin,
// // // } from './hooks/usePayslipAdmin';

// // // import {
// // //   generatePayslip,
// // //   getPayslipById,
// // // } from './services/payslipAdmin.service';

// // // // import {
// // // //   usePayslipFilters,
// // // // } from './hooks/usePayslipFilters';

// // // import type {
// // //   PayslipRecord,
// // //   PayslipDetail,
// // // } from './types/payslipAdmin.types';

// // // // import {
// // // //   getShowingEnd,
// // // //   getShowingStart,
// // // // } from './utils/payslipAdmin.utils';

// // // import './PayslipAdminPage.css';

// // // // type AddSalaryFormData = Parameters<
// // // //   NonNullable<
// // // //     React.ComponentProps<
// // // //       typeof AddSalaryPfModal
// // // //     >['onCreate']
// // // //   >
// // // // >[0];

// // // export const PayslipAdminPage: React.FC = () => {
// // //   // ============================================================
// // //   // PAYSLIP DATA
// // //   // ============================================================

// // //   const {
// // //     payslips,
// // //     isLoading,
// // //     error,
// // //     reload,
// // //   } = usePayslipAdmin();

// // //   // ============================================================
// // //   // FILTERS + PAGINATION
// // //   // ============================================================

// // //   const {
// // //     filters,
// // //     filteredPayslips,
// // //     paginatedPayslips,
// // //     currentPage,
// // //     totalPages,
// // //     setSearch,
// // //     setPageSize,
// // //     setPage,
// // //   } = usePayslipFilters(payslips);

// // //   // ============================================================
// // //   // SELECTED PAYSLIP DETAIL
// // //   // ============================================================

// // //   const [
// // //     selectedPayslip,
// // //     setSelectedPayslip,
// // //   ] = useState<PayslipDetail | null>(null);

// // //   const [
// // //     isPreviewLoading,
// // //     setIsPreviewLoading,
// // //   ] = useState(false);

// // //   // ============================================================
// // //   // ADD SALARY MODAL
// // //   // ============================================================

// // //   // const [
// // //   //   isAddSalaryPfOpen,
// // //   //   setIsAddSalaryPfOpen,
// // //   // ] = useState(false);

// // //   // ============================================================
// // //   // TABLE DISPLAY RANGE
// // //   // ============================================================

// // //   const showingStart = useMemo(
// // //     () =>
// // //       getShowingStart(
// // //         filteredPayslips.length,
// // //         currentPage,
// // //         filters.pageSize,
// // //       ),
// // //     [
// // //       currentPage,
// // //       filteredPayslips.length,
// // //       filters.pageSize,
// // //     ],
// // //   );

// // //   const showingEnd = useMemo(
// // //     () =>
// // //       getShowingEnd(
// // //         filteredPayslips.length,
// // //         currentPage,
// // //         filters.pageSize,
// // //       ),
// // //     [
// // //       currentPage,
// // //       filteredPayslips.length,
// // //       filters.pageSize,
// // //     ],
// // //   );

// // //   // ============================================================
// // //   // VIEW PAYSLIP
// // //   // ============================================================

// // //   const handlePreview = useCallback(
// // //     async (payslip: PayslipRecord) => {
// // //       try {
// // //         setIsPreviewLoading(true);

// // //         // Clear previous payslip details
// // //         setSelectedPayslip(null);

// // //         // Fetch complete payslip details from backend
// // //         const response = await getPayslipById(
// // //           payslip.id,
// // //         );

// // //         setSelectedPayslip(response);
// // //       } catch (previewError) {
// // //         console.error(
// // //           'Failed to fetch payslip details:',
// // //           previewError,
// // //         );

// // //         alert(
// // //           'Unable to load payslip details.',
// // //         );
// // //       } finally {
// // //         setIsPreviewLoading(false);
// // //       }
// // //     },
// // //     [],
// // //   );

// // //   // ============================================================
// // //   // OPEN/CLOSE ADD SALARY MODAL
// // //   // ============================================================

// // //   // const handleOpenAddSalaryPf = useCallback(() => {
// // //   //   setIsAddSalaryPfOpen(true);
// // //   // }, []);

// // //   // const handleCloseAddSalaryPf = useCallback(() => {
// // //   //   setIsAddSalaryPfOpen(false);
// // //   // }, []);

// // //   // ============================================================
// // //   // CLOSE PAYSLIP PREVIEW
// // //   // ============================================================

// // //   const handleClosePreview = useCallback(() => {
// // //     setSelectedPayslip(null);
// // //   }, []);

// // //   // ============================================================
// // //   // GENERATE PAYSLIP
// // //   // ============================================================

// // //   const handleGeneratePayslip = useCallback(
// // //     async (data: AddSalaryFormData) => {
// // //       try {
// // //         const formData = data as unknown as Record<
// // //           string,
// // //           unknown
// // //         >;

// // //         const employeeValue =
// // //           formData.employeeId ??
// // //           formData.employee_id ??
// // //           formData.emp_id ??
// // //           formData.employee;

// // //         const monthValue = formData.month;

// // //         const employeeId = Number(
// // //           typeof employeeValue === 'object' &&
// // //           employeeValue !== null
// // //             ? (
// // //                 employeeValue as {
// // //                   id?: number | string;
// // //                 }
// // //               ).id
// // //             : employeeValue,
// // //         );

// // //         if (!employeeId || employeeId <= 0) {
// // //           alert(
// // //             'Please select a valid employee.',
// // //           );

// // //           return;
// // //         }

// // //         if (
// // //           typeof monthValue !== 'string' ||
// // //           !monthValue
// // //         ) {
// // //           alert(
// // //             'Please select a month.',
// // //           );

// // //           return;
// // //         }

// // //         const monthDate = new Date(monthValue);

// // //         const month = Number.isNaN(
// // //           monthDate.getTime(),
// // //         )
// // //           ? monthValue
// // //           : `${monthDate.getFullYear()}-${String(
// // //               monthDate.getMonth() + 1,
// // //             ).padStart(2, '0')}-01`;

// // //         await generatePayslip({
// // //           emp_id: employeeId,
// // //           month,
// // //         });

// // //         await reload();

// // //         handleCloseAddSalaryPf();

// // //         alert(
// // //           'Payslip generated successfully.',
// // //         );
// // //       } catch (generateError) {
// // //         console.error(
// // //           'Generate payslip error:',
// // //           generateError,
// // //         );

// // //         alert(
// // //           generateError instanceof Error
// // //             ? generateError.message
// // //             : 'Unable to generate payslip.',
// // //         );
// // //       }
// // //     },
// // //     [
// // //       reload,
// // //       handleCloseAddSalaryPf,
// // //     ],
// // //   );

// // //   return (
// // //     <main className="payslip-admin-page">
// // //       {/* ========================================================
// // //           PAGE HEADER
// // //       ======================================================== */}

// // //       {/* <PayslipAdminHeader
// // //         onAddSalaryPf={handleOpenAddSalaryPf}
// // //       /> */}

// // //       {/* ========================================================
// // //           PAYSLIP DATA CARD
// // //       ======================================================== */}

// // //       <section className="payslip-admin-page__data-card">
// // //         {error && (
// // //           <div
// // //             className="payslip-admin-page__error"
// // //             role="alert"
// // //           >
// // //             {error}
// // //           </div>
// // //         )}

// // //         {/* ======================================================
// // //             FILTERS
// // //         ====================================================== */}

// // //         {/* <PayslipAdminFilters
// // //           pageSize={filters.pageSize}
// // //           search={filters.search}
// // //           onPageSizeChange={setPageSize}
// // //           onSearchChange={setSearch}
// // //         /> */}

// // //         {/* ======================================================
// // //             TABLE
// // //         ====================================================== */}

// // //         {/* <PayslipAdminTable
// // //           payslips={paginatedPayslips}
// // //           isLoading={isLoading}
// // //           onPreview={handlePreview}
// // //         /> */}

// // //         {/* ======================================================
// // //             TABLE FOOTER + PAGINATION
// // //         ====================================================== */}

// // //         <div className="payslip-admin-page__table-footer">
// // //           <span className="payslip-admin-page__entries-info">
// // //             Showing {showingStart} to {showingEnd} of{' '}
// // //             {filteredPayslips.length} entries
// // //           </span>

// // //           <div
// // //             className="payslip-admin-page__pagination"
// // //             aria-label="Payslip pagination"
// // //           >
// // //             {/* FIRST PAGE */}

// // //             <button
// // //               type="button"
// // //               className="payslip-admin-page__pagination-button"
// // //               onClick={() => setPage(1)}
// // //               disabled={
// // //                 currentPage === 1 ||
// // //                 filteredPayslips.length === 0
// // //               }
// // //               aria-label="First page"
// // //             >
// // //               <ChevronsLeft size={13} />
// // //             </button>

// // //             {/* PREVIOUS PAGE */}

// // //             <button
// // //               type="button"
// // //               className="payslip-admin-page__pagination-button"
// // //               onClick={() =>
// // //                 setPage(currentPage - 1)
// // //               }
// // //               disabled={
// // //                 currentPage === 1 ||
// // //                 filteredPayslips.length === 0
// // //               }
// // //               aria-label="Previous page"
// // //             >
// // //               <ChevronLeft size={13} />
// // //             </button>

// // //             {/* CURRENT PAGE */}

// // //             <button
// // //               type="button"
// // //               className="payslip-admin-page__pagination-button payslip-admin-page__pagination-button--active"
// // //               aria-current="page"
// // //             >
// // //               {currentPage}
// // //             </button>

// // //             {/* NEXT PAGE */}

// // //             <button
// // //               type="button"
// // //               className="payslip-admin-page__pagination-button"
// // //               onClick={() =>
// // //                 setPage(currentPage + 1)
// // //               }
// // //               disabled={
// // //                 currentPage >= totalPages
// // //               }
// // //               aria-label="Next page"
// // //             >
// // //               <ChevronRight size={13} />
// // //             </button>

// // //             {/* LAST PAGE */}

// // //             <button
// // //               type="button"
// // //               className="payslip-admin-page__pagination-button"
// // //               onClick={() =>
// // //                 setPage(totalPages)
// // //               }
// // //               disabled={
// // //                 currentPage >= totalPages ||
// // //                 filteredPayslips.length === 0
// // //               }
// // //               aria-label="Last page"
// // //             >
// // //               <ChevronsRight size={13} />
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </section>

// // //       {/* ========================================================
// // //           INFORMATION CARDS
// // //       ======================================================== */}

// // //       <section className="payslip-admin-page__info-section">
// // //         {/* GENERATE PAYSLIPS CARD */}

// // //         <article className="payslip-admin-page__info-card payslip-admin-page__info-card--ease">
// // //           <div className="payslip-admin-page__info-icon">
// // //             <Calculator size={29} />
// // //           </div>

// // //           <div className="payslip-admin-page__info-content">
// // //             <h3>
// // //               Generate Payslips with Ease
// // //             </h3>

// // //             <p>
// // //               Add salary details and generate
// // //               payslips for your employees in
// // //               just a few clicks.
// // //             </p>
// // //           </div>
// // //         </article>

// // //         {/* SECURITY CARD */}

// // //         <article className="payslip-admin-page__info-card payslip-admin-page__info-card--secure">
// // //           <div className="payslip-admin-page__info-icon">
// // //             <LockKeyhole size={29} />
// // //           </div>

// // //           <div className="payslip-admin-page__info-content">
// // //             <h3>
// // //               Secure &amp; Confidential
// // //             </h3>

// // //             <p>
// // //               Employee salary information is
// // //               encrypted and secure at all times.
// // //             </p>
// // //           </div>
// // //         </article>
// // //       </section>

// // //       {/* ========================================================
// // //           FOOTER
// // //       ======================================================== */}

// // //       <footer className="payslip-admin-page__footer">
// // //         <span>
// // //           © 2026 Inwinteck HRMS. All rights reserved.
// // //         </span>

// // //         <div className="payslip-admin-page__footer-right">
// // //           <span>Help</span>

// // //           <span className="payslip-admin-page__footer-divider">
// // //             |
// // //           </span>

// // //           <span>Privacy</span>

// // //           <span className="payslip-admin-page__footer-divider">
// // //             |
// // //           </span>

// // //           <span>Terms</span>
// // //         </div>
// // //       </footer>

// // //       {/* ========================================================
// // //           PAYSLIP PREVIEW MODAL
// // //       ======================================================== */}

// // //       {isPreviewLoading && (
// // //         <div
// // //           className="payslip-admin-page__preview-loading"
// // //           role="status"
// // //         >
// // //           Loading payslip...
// // //         </div>
// // //       )}

// // //       {selectedPayslip && (
// // //         <PayslipPreview
// // //           payslip={selectedPayslip}
// // //           loading={isPreviewLoading}
// // //           onClose={handleClosePreview}
// // //         />
// // //       )}

// // //       {/* ========================================================
// // //           ADD SALARY (PF) MODAL
// // //       ======================================================== */}

// // //       {/* <AddSalaryPfModal
// // //         isOpen={isAddSalaryPfOpen}
// // //         onClose={handleCloseAddSalaryPf}
// // //         onCreate={handleGeneratePayslip}
// // //       /> */}
// // //     </main>
// // //   );
// // // };

// // // export default PayslipAdminPage;












// // import React, {
// //   useCallback,
// //   useState,
// // } from 'react';

// // import {
// //   PayslipAdminHeader,
// // } from './components/PayslipAdminHeader/PayslipAdminHeader';

// // import {
// //   PayslipAdminFilters,
// // } from './components/PayslipAdminFilters/PayslipAdminFilters';

// // import {
// //   PayslipAdminTable,
// // } from './components/PayslipAdminTable/PayslipAdminTable';

// // import {
// //   PayslipPreview,
// // } from './components/PayslipPreview/PayslipPreview';

// // import {
// //   usePayslipAdmin,
// // } from './hooks/usePayslipAdmin';

// // import {
// //   usePayslipFilters,
// // } from './hooks/usePayslipFilters';

// // import {
// //   getPayslipById,
// // } from './services/payslipAdmin.service';

// // import type {
// //   PayslipRecord,
// //   PayslipDetail,
// // } from './types/payslipAdmin.types';

// // import './PayslipAdminPage.css';

// // export const PayslipAdminPage: React.FC = () => {
// //   const {
// //     payslips,
// //     isLoading,
// //     error,
// //   } = usePayslipAdmin();

// //   const {
// //     filters,
// //     paginatedPayslips,
// //     setSearch,
// //     setPageSize,
// //   } = usePayslipFilters(payslips);

// //   const [
// //     selectedPayslip,
// //     setSelectedPayslip,
// //   ] = useState<PayslipDetail | null>(null);

// //   const [
// //     isPreviewLoading,
// //     setIsPreviewLoading,
// //   ] = useState(false);

// //   const handlePreview = useCallback(
// //     async (payslip: PayslipRecord) => {
// //       try {
// //         setIsPreviewLoading(true);
// //         setSelectedPayslip(null);

// //         const response = await getPayslipById(
// //           payslip.id,
// //         );

// //         setSelectedPayslip(response);
// //       } catch (previewError) {
// //         console.error(
// //           'Failed to fetch payslip details:',
// //           previewError,
// //         );

// //         window.alert(
// //           'Unable to load payslip details.',
// //         );
// //       } finally {
// //         setIsPreviewLoading(false);
// //       }
// //     },
// //     [],
// //   );

// //   const handleClosePreview = useCallback(() => {
// //     setSelectedPayslip(null);
// //   }, []);

// //   return (
// //     <main className="payslip-admin-page">
// //       <PayslipAdminHeader />

// //       {/*
// //         The new AddSalaryPfTable should be rendered here
// //         after its multi-employee props and payroll API
// //         integration are implemented.
// //       */}

// //       <section className="payslip-admin-page__data-card">
// //         {error && (
// //           <div
// //             className="payslip-admin-page__error"
// //             role="alert"
// //           >
// //             {error}
// //           </div>
// //         )}

// //         <PayslipAdminFilters
// //           pageSize={filters.pageSize}
// //           search={filters.search}
// //           onPageSizeChange={setPageSize}
// //           onSearchChange={setSearch}
// //         />

// //         <PayslipAdminTable
// //           payslips={paginatedPayslips}
// //           isLoading={isLoading}
// //           onPreview={handlePreview}
// //         />
// //       </section>

// //       {isPreviewLoading && (
// //         <div
// //           className="payslip-admin-page__preview-loading"
// //           role="status"
// //         >
// //           Loading payslip...
// //         </div>
// //       )}

// //       {selectedPayslip && (
// //         <PayslipPreview
// //           payslip={selectedPayslip}
// //           loading={isPreviewLoading}
// //           onClose={handleClosePreview}
// //         />
// //       )}
// //     </main>
// //   );
// // };

// // export default PayslipAdminPage;





// import React, {
//   useCallback,
//   useEffect,
//   useState,
// } from 'react';

// import {
//   PayslipAdminHeader,
// } from './components/PayslipAdminHeader/PayslipAdminHeader';

// import {
//   PayslipAdminFilters,
// } from './components/PayslipAdminFilters/PayslipAdminFilters';

// import {
//   PayslipAdminTable,
// } from './components/PayslipAdminTable/PayslipAdminTable';

// import {
//   AddSalaryPfTable,
//   type SalaryPfEmployeeOption,
// } from './components/AddSalaryPfTable/AddSalaryPfTable';

// import type {
//   AddSalaryPfFormData,
// } from './components/AddSalaryPfModal/AddSalaryPfModal';

// import {
//   PayslipPreview,
// } from './components/PayslipPreview/PayslipPreview';

// import {
//   usePayslipAdmin,
// } from './hooks/usePayslipAdmin';

// import {
//   usePayslipFilters,
// } from './hooks/usePayslipFilters';

// import {
//   checkPayslip,
//   generatePayslip,
//   getPayslipById,
//   getPayslipEmployees,
// } from './services/payslipAdmin.service';

// import type {
//   PayslipRecord,
//   PayslipDetail,
// } from './types/payslipAdmin.types';

// import './PayslipAdminPage.css';

// const initialForm: AddSalaryPfFormData = {
//   month: '',
//   employee: '',
//   availedLeave: 0,
//   balanceLeave: 0,
//   salary: 0,
//   daysPaid: 0,
//   lopAbsent: 0,
//   basic: 0,
//   hra: 0,
//   cityCompensatoryAllowance: 0,
//   specialAllowance: 0,
//   otherEarning: 0,
//   nightAllowance: 0,
//   providentFundEmployee: 0,
//   providentFundEmployer: 0,
//   esic: 0,
//   professionalTax: 0,
//   otherDeduction: 0,
// };

// interface SalaryCalculation {
//   Salary?: number;
//   Day_Paid?: number;
//   LOP_Absent?: number;
//   Basic?: number;
//   HRA?: number;
//   Conveyance_Allowance?: number;
//   Special_Allowance?: number;
//   Other_Earning?: number;
//   Night_Allowance?: number;
//   PF?: number;
//   PF_Employer?: number;
//   ESIC?: number;
//   PT?: number;
//   Other_Deduction?: number;
//   Availed_leave?: number;
//   Balance_leave?: number;
// }

// export const PayslipAdminPage: React.FC = () => {
//   const {
//     payslips,
//     isLoading,
//     error,
//     reload,
//   } = usePayslipAdmin();

//   const {
//     filters,
//     paginatedPayslips,
//     setSearch,
//     setPageSize,
//   } = usePayslipFilters(payslips);

//   const [selectedPayslip, setSelectedPayslip] =
//     useState<PayslipDetail | null>(null);

//   const [isPreviewLoading, setIsPreviewLoading] =
//     useState(false);

//   const [form, setForm] =
//     useState<AddSalaryPfFormData>(initialForm);

//   const [employees, setEmployees] =
//     useState<SalaryPfEmployeeOption[]>([]);

//   const [isLoadingEmployees, setIsLoadingEmployees] =
//     useState(false);

//   const [isCheckingSalary, setIsCheckingSalary] =
//     useState(false);

//   const [errorMessage, setErrorMessage] =
//     useState('');

//   const [checkMessage, setCheckMessage] =
//     useState('');

//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     let isMounted = true;

//     const loadEmployees = async () => {
//       try {
//         setIsLoadingEmployees(true);
//         setErrorMessage('');

//         const response = await getPayslipEmployees();

//         if (!isMounted) return;

//         setEmployees(
//           response.map((employee) => ({
//             id: String(employee.emp_id ?? employee.id),
//             name:
//               employee.employee_name ??
//               `${employee.first_name ?? ''} ${
//                 employee.last_name ?? ''
//               }`.trim(),
//             employeeId: String(
//               employee.emp_code ??
//                 employee.emp_id ??
//                 employee.id,
//             ),
//           })),
//         );
//       } catch (loadError) {
//         if (!isMounted) return;

//         setErrorMessage(
//           loadError instanceof Error
//             ? loadError.message
//             : 'Unable to load employees.',
//         );
//       } finally {
//         if (isMounted) {
//           setIsLoadingEmployees(false);
//         }
//       }
//     };

//     void loadEmployees();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const onFieldChange = useCallback(
//     <K extends keyof AddSalaryPfFormData>(
//       field: K,
//       value: AddSalaryPfFormData[K],
//     ) => {
//       setForm((previous) => ({
//         ...previous,
//         [field]: value,
//       }));

//       if (field === 'employee' || field === 'month') {
//         setErrorMessage('');
//         setCheckMessage('');
//       }
//     },
//     [],
//   );

//   useEffect(() => {
//     if (!form.employee || !form.month) {
//       setIsCheckingSalary(false);
//       return;
//     }

//     let isMounted = true;

//     const loadSalaryCalculation = async () => {
//       try {
//         setIsCheckingSalary(true);
//         setErrorMessage('');
//         setCheckMessage('');

//         const [year, month] = form.month.split('-').map(Number);

//         if (!year || !month || month < 1 || month > 12) {
//           return;
//         }

//         const response = await checkPayslip(
//           Number(form.employee),
//           year,
//           month,
//         );

//         if (!isMounted) return;

//         setCheckMessage(response.message ?? '');

//         if (response.res === 'Slip') {
//           setErrorMessage(
//             'Salary is already generated for this month.',
//           );
//           return;
//         }

//         if (
//           response.res === 'NoPayrollSetting' ||
//           response.res === 'NoSalaryFound'
//         ) {
//           setErrorMessage(
//             response.message ??
//               (response.res === 'NoPayrollSetting'
//                 ? 'Payroll setting not found.'
//                 : 'No salary found for this employee.'),
//           );
//           return;
//         }

//         if (response.res !== 'success' || !response.ps) {
//           return;
//         }

//         const calculation = response.ps as SalaryCalculation;

//         setForm((previous) => ({
//           ...previous,
//           salary: Number(calculation.Salary ?? 0),
//           daysPaid: Number(calculation.Day_Paid ?? 0),
//           lopAbsent: Number(calculation.LOP_Absent ?? 0),
//           basic: Number(calculation.Basic ?? 0),
//           hra: Number(calculation.HRA ?? 0),
//           cityCompensatoryAllowance: Number(
//             calculation.Conveyance_Allowance ?? 0,
//           ),
//           specialAllowance: Number(
//             calculation.Special_Allowance ?? 0,
//           ),
//           otherEarning: Number(
//             calculation.Other_Earning ?? 0,
//           ),
//           nightAllowance: Number(
//             calculation.Night_Allowance ?? 0,
//           ),
//           providentFundEmployee: Number(
//             calculation.PF ?? 0,
//           ),
//           providentFundEmployer: Number(
//             calculation.PF_Employer ?? 0,
//           ),
//           esic: Number(calculation.ESIC ?? 0),
//           professionalTax: Number(calculation.PT ?? 0),
//           otherDeduction: Number(
//             calculation.Other_Deduction ?? 0,
//           ),
//           availedLeave: Number(
//             calculation.Availed_leave ?? 0,
//           ),
//           balanceLeave: Number(
//             calculation.Balance_leave ?? 0,
//           ),
//         }));
//       } catch (checkError) {
//         if (!isMounted) return;

//         setErrorMessage(
//           checkError instanceof Error
//             ? checkError.message
//             : 'Unable to check salary details.',
//         );
//       } finally {
//         if (isMounted) {
//           setIsCheckingSalary(false);
//         }
//       }
//     };

//     void loadSalaryCalculation();

//     return () => {
//       isMounted = false;
//     };
//   }, [form.employee, form.month]);

//   const handlePreview = useCallback(
//     async (payslip: PayslipRecord) => {
//       try {
//         setIsPreviewLoading(true);
//         setSelectedPayslip(null);

//         const response = await getPayslipById(payslip.id);

//         setSelectedPayslip(response);
//       } catch (previewError) {
//         console.error(
//           'Failed to fetch payslip details:',
//           previewError,
//         );

//         window.alert('Unable to load payslip details.');
//       } finally {
//         setIsPreviewLoading(false);
//       }
//     },
//     [],
//   );

//   const handleClosePreview = useCallback(() => {
//     setSelectedPayslip(null);
//   }, []);

//   const handleCancel = useCallback(() => {
//     setForm(initialForm);
//     setErrorMessage('');
//     setCheckMessage('');
//   }, []);

//   const handleSave = useCallback(async () => {
//     if (!form.employee || !form.month) {
//       setErrorMessage('Please select an employee and month.');
//       return;
//     }

//     if (errorMessage || isCheckingSalary || isLoadingEmployees) {
//       return;
//     }

//     try {
//       setIsSaving(true);

//       const [year, monthValue] = form.month.split('-').map(Number);

//       const month = `${year}-${String(monthValue).padStart(
//         2,
//         '0',
//       )}-01`;

//       await generatePayslip({
//         emp_id: Number(form.employee),
//         month,
//       });

//       await reload();

//       window.alert('Payslip generated successfully.');
//       handleCancel();
//     } catch (saveError) {
//       console.error('Generate payslip error:', saveError);

//       window.alert(
//         saveError instanceof Error
//           ? saveError.message
//           : 'Unable to generate payslip.',
//       );
//     } finally {
//       setIsSaving(false);
//     }
//   }, [
//     form,
//     errorMessage,
//     isCheckingSalary,
//     isLoadingEmployees,
//     reload,
//     handleCancel,
//   ]);

//   return (
//     <main className="payslip-admin-page">
//       <PayslipAdminHeader />

//       <AddSalaryPfTable
//         form={form}
//         employees={employees}
//         isLoadingEmployees={isLoadingEmployees}
//         isCheckingSalary={isCheckingSalary || isSaving}
//         errorMessage={
//           isSaving ? 'Generating payslip...' : errorMessage
//         }
//         checkMessage={checkMessage}
//         onFieldChange={onFieldChange}
//         onCancel={handleCancel}
//         onSave={handleSave}
//       />

//       <section className="payslip-admin-page__data-card">
//         {error && (
//           <div
//             className="payslip-admin-page__error"
//             role="alert"
//           >
//             {error}
//           </div>
//         )}

//         <PayslipAdminFilters
//           pageSize={filters.pageSize}
//           search={filters.search}
//           onPageSizeChange={setPageSize}
//           onSearchChange={setSearch}
//         />

//         <PayslipAdminTable
//           payslips={paginatedPayslips}
//           isLoading={isLoading}
//           onPreview={handlePreview}
//         />
//       </section>

//       {isPreviewLoading && (
//         <div
//           className="payslip-admin-page__preview-loading"
//           role="status"
//         >
//           Loading payslip...
//         </div>
//       )}

//       {selectedPayslip && (
//         <PayslipPreview
//           payslip={selectedPayslip}
//           loading={isPreviewLoading}
//           onClose={handleClosePreview}
//         />
//       )}
//     </main>
//   );
// };

// export default PayslipAdminPage;



import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PayslipAdminHeader } from './components/PayslipAdminHeader/PayslipAdminHeader';
import { PayslipAdminFilters } from './components/PayslipAdminFilters/PayslipAdminFilters';
import { PayslipAdminTable } from './components/PayslipAdminTable/PayslipAdminTable';
import { AddSalaryPfTable, type SalaryPfEmployeeOption, type SalaryPfRow } from './components/AddSalaryPfTable/AddSalaryPfTable';
import { PayslipPreview } from './components/PayslipPreview/PayslipPreview';
import { usePayslipAdmin } from './hooks/usePayslipAdmin';
import { usePayslipFilters } from './hooks/usePayslipFilters';
import { checkPayslip, generatePayslip, getPayslipById, getPayslipEmployees, sendPayslipEmail, } from './services/payslipAdmin.service';
import type { PayslipRecord, PayslipDetail } from './types/payslipAdmin.types';
import './PayslipAdminPage.css';

const emptySalary = {
  availedLeave: 0, balanceLeave: 0, salary: 0, daysPaid: 0, lopAbsent: 0,
  basic: 0, hra: 0, cityCompensatoryAllowance: 0, specialAllowance: 0,
  otherEarning: 0, nightAllowance: 0, providentFundEmployee: 0,
  providentFundEmployer: 0, esic: 0, professionalTax: 0, otherDeduction: 0,
};

interface SalaryCalculation {
  Salary?: number; Day_Paid?: number; LOP_Absent?: number; Basic?: number;
  HRA?: number; Conveyance_Allowance?: number; Special_Allowance?: number;
  Other_Earning?: number; Night_Allowance?: number; PF?: number;
  PF_Employer?: number; ESIC?: number; PT?: number; Other_Deduction?: number;
  Availed_leave?: number; Balance_leave?: number;
}

export const PayslipAdminPage: React.FC = () => {
  const { payslips, isLoading, error, reload } = usePayslipAdmin();
  // const { filters, paginatedPayslips, setSearch, setPageSize } = usePayslipFilters(payslips);
  

  const [selectedPayslip, setSelectedPayslip] = useState<PayslipDetail | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [employees, setEmployees] = useState<SalaryPfEmployeeOption[]>([]);
  const [rows, setRows] = useState<SalaryPfRow[]>([]);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
 
// Filter the lower payslip history table using the selected month.
const monthFilteredPayslips = useMemo(() => {
  return payslips.filter((payslip) => {
    const value = String(payslip.month ?? '').trim();

    if (!value) return false;

    // Supports YYYY-MM and YYYY-MM-DD.
    const isoMatch = value.match(/^(\d{4})-(\d{1,2})/);

    if (isoMatch) {
      const recordMonth =
        `${isoMatch[1]}-${isoMatch[2].padStart(2, '0')}`;

      return recordMonth === month;
    }

    // Supports month labels such as "May 2026".
    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return false;
    }

    const recordMonth =
      `${parsedDate.getFullYear()}-${String(
        parsedDate.getMonth() + 1
      ).padStart(2, '0')}`;

    return recordMonth === month;
  });
}, [payslips, month]);

// Keep the lower table's search and pagination functionality.
const {
  filters,
  paginatedPayslips,
  setSearch,
  setPageSize,
} = usePayslipFilters(monthFilteredPayslips);

  const [search, setTableSearch] = useState('');
  const [pageSize, setTablePageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [isCheckingSalary, setIsCheckingSalary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [checkMessage, setCheckMessage] = useState('');
  const [bulkEdit, setBulkEdit] = useState(false);

  // useEffect(() => {
  //   let active = true;
  //   const loadEmployees = async () => {
  //     try {
  //       setIsLoadingEmployees(true);
  //       const response = await getPayslipEmployees();
  //       if (!active) return;
  //       const options: SalaryPfEmployeeOption[] = response.map((employee: any) => ({
  //         id: String(employee.emp_id ?? employee.id),
  //         // name: employee.employee_name ?? `${employee.first_name ?? ''} ${employee.last_name ?? ''}`.trim() || 'Unnamed employee',
  //         name:
  // employee.employee_name ??
  // (`${employee.first_name ?? ''} ${employee.last_name ?? ''}`.trim() ||
  //   'Unnamed employee'),
  //         employeeId: String(employee.emp_code ?? employee.emp_id ?? employee.id),
  //       }));
  //       setEmployees(options);
  //       setRows(options.map((employee) => ({
  //         ...employee,
  //         ...emptySalary,
  //         status: 'loading',
  //         message: '',
  //       })));
  //     } catch (e) {
  //       if (active) setErrorMessage(e instanceof Error ? e.message : 'Unable to load employees.');
  //     } finally {
  //       if (active) setIsLoadingEmployees(false);
  //     }
  //   };
  //   void loadEmployees();
  //   return () => { active = false; };
  // }, []);

  
useEffect(() => {
  let active = true;

  const loadEmployees = async () => {
    try {
      setIsLoadingEmployees(true);
      setErrorMessage("");
      setCheckMessage("");

      const [year, monthNumber] = month
        .split("-")
        .map(Number);

      const response = await getPayslipEmployees(
        year,
        monthNumber,
      );

      if (!active) return;

      const options: SalaryPfEmployeeOption[] =
        response.map((employee) => ({
          id: String(employee.emp_id ?? employee.id),
          name:
            employee.employee_name ??
            `${employee.first_name ?? ""} ${
              employee.last_name ?? ""
            }`.trim() ??
            "Unnamed employee",
          employeeId: String(
            employee.emp_code ??
              employee.emp_id ??
              employee.id,
          ),
        }));

      setEmployees(options);
      setRows(
        options.map((employee) => ({
          ...employee,
          ...emptySalary,
          status: "loading",
          message: "",
        })),
      );

      setSelectedIds([]);
      setPage(1);
    } catch (e) {
      if (active) {
        setErrorMessage(
          e instanceof Error
            ? e.message
            : "Unable to load employees.",
        );
        setEmployees([]);
        setRows([]);
      }
    } finally {
      if (active) {
        setIsLoadingEmployees(false);
      }
    }
  };

  if (month) {
    void loadEmployees();
  }

  return () => {
    active = false;
  };
}, [month]);

  useEffect(() => {
    if (!employees.length || !month) return;
    let active = true;
    const [year, monthNumber] = month.split('-').map(Number);
    const loadAllSalaryDetails = async () => {
      setIsCheckingSalary(true);
      setErrorMessage('');
      setCheckMessage('');
      setRows((previous) => previous.map((row) => ({ ...row, status: 'loading', message: '' })));
      const results = await Promise.all(employees.map(async (employee) => {
        try {
          const response = await checkPayslip(Number(employee.id), year, monthNumber);
          // if (response.res === 'Slip') {
          //   return { id: employee.id, status: 'generated' as const, message: 'Already generated', values: null };
          // }
          
if (response.res === 'Slip') {
  const slip = (response as any).payslip;

  return {
    id: employee.id,
    status: 'generated' as const,
    message: 'Already generated',
    values: slip
      ? {
          salary: Number(slip.salary ?? slip.Salary ?? 0),
          daysPaid: Number(slip.day_paid ?? slip.Day_Paid ?? 0),
          lopAbsent: Number(slip.lop_absent ?? slip.LOP_Absent ?? 0),
          basic: Number(slip.basic ?? slip.Basic ?? 0),
          hra: Number(slip.hra ?? slip.HRA ?? 0),
          cityCompensatoryAllowance: Number(
            slip.conveyance_allowance ??
              slip.Conveyance_Allowance ??
              0
          ),
          specialAllowance: Number(
            slip.special_allowance ?? slip.Special_Allowance ?? 0
          ),
          otherEarning: Number(
            slip.other_earning ?? slip.Other_Earning ?? 0
          ),
          nightAllowance: Number(
            slip.night_allowance ?? slip.Night_Allowance ?? 0
          ),
          providentFundEmployee: Number(slip.pf ?? slip.PF ?? 0),
          providentFundEmployer: Number(
            slip.pf_employer ?? slip.PF_Employer ?? 0
          ),
          esic: Number(slip.esic ?? slip.ESIC ?? 0),
          professionalTax: Number(slip.pt ?? slip.PT ?? 0),
          otherDeduction: Number(
            slip.other_deduction ?? slip.Other_Deduction ?? 0
          ),
          availedLeave: Number(
            slip.availed_leave ?? slip.Availed_leave ?? 0
          ),
          balanceLeave: Number(
            slip.balance_leave ?? slip.Balance_leave ?? 0
          ),
        }
      : null,
  };
}

          if (response.res === 'NoPayrollSetting' || response.res === 'NoSalaryFound') {
            return { id: employee.id, status: 'error' as const, message: response.message ?? (response.res === 'NoPayrollSetting' ? 'Payroll setting not found' : 'No salary found'), values: null };
          }
          if (response.res !== 'success' || !response.ps) {
            return { id: employee.id, status: 'error' as const, message: response.message ?? 'Salary details unavailable', values: null };
          }
          const c = response.ps as SalaryCalculation;
          return {
            id: employee.id, status: 'ready' as const, message: response.message ?? '',
            values: {
              salary: Number(c.Salary ?? 0), daysPaid: Number(c.Day_Paid ?? 0),
              lopAbsent: Number(c.LOP_Absent ?? 0), basic: Number(c.Basic ?? 0),
              hra: Number(c.HRA ?? 0), cityCompensatoryAllowance: Number(c.Conveyance_Allowance ?? 0),
              specialAllowance: Number(c.Special_Allowance ?? 0), otherEarning: Number(c.Other_Earning ?? 0),
              nightAllowance: Number(c.Night_Allowance ?? 0), providentFundEmployee: Number(c.PF ?? 0),
              providentFundEmployer: Number(c.PF_Employer ?? 0), esic: Number(c.ESIC ?? 0),
              professionalTax: Number(c.PT ?? 0), otherDeduction: Number(c.Other_Deduction ?? 0),
              availedLeave: Number(c.Availed_leave ?? 0), balanceLeave: Number(c.Balance_leave ?? 0),
            },
          };
        } catch (e) {
          return { id: employee.id, status: 'error' as const, message: e instanceof Error ? e.message : 'Unable to check salary', values: null };
        }
      }));
      if (active) {
        setRows((previous) => previous.map((row) => {
          const result = results.find((item) => item.id === row.id);
          return result?.values
            ? { ...row, ...result.values, status: result.status, message: result.message }
            : { ...row, status: result?.status ?? 'error', message: result?.message ?? 'Salary unavailable' };
        }));
        const unavailable = results.filter((item) => item.status === 'error').length;
        const generated = results.filter((item) => item.status === 'generated').length;
        setCheckMessage(`${results.length} employees loaded · ${generated} already generated · ${unavailable} need attention`);
        setIsCheckingSalary(false);
      }
    };
    void loadAllSalaryDetails();
    return () => { active = false; };
  }, [employees, month]);

  const updateRow = useCallback((id: string, field: keyof SalaryPfRow, value: number) => {
    setRows((previous) => previous.map((row) => row.id === id ? { ...row, [field]: value } : row));
  }, []);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => !q || row.name.toLowerCase().includes(q) || row.employeeId.toLowerCase().includes(q));
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const visibleRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const toggleSelected = (id: string, checked: boolean) => {
    setSelectedIds((previous) => checked ? [...new Set([...previous, id])] : previous.filter((value) => value !== id));
  };
  const toggleAllVisible = (checked: boolean) => {
    setSelectedIds((previous) => checked
      ? [...new Set([...previous, ...visibleRows.map((row) => row.id)])]
      : previous.filter((id) => !visibleRows.some((row) => row.id === id)));
  };

  const handleSave = useCallback(async () => {
    const targets = rows.filter((row) => selectedIds.length ? selectedIds.includes(row.id) : row.status === 'ready');
    if (!month) { setErrorMessage('Select a month first.'); return; }
    if (!targets.length) { setErrorMessage('Select at least one employee to generate payslips.'); return; }
    const blocked = targets.filter((row) => row.status !== 'ready');
    if (blocked.length) { setErrorMessage('Only employees with available salary details can be generated.'); return; }
    try {
      setIsSaving(true);
      setErrorMessage('');
      const [year, monthNumber] = month.split('-').map(Number);
      const payrollMonth = `${year}-${String(monthNumber).padStart(2, '0')}-01`;
      for (const row of targets) {
        await generatePayslip({ emp_id: Number(row.id), month: payrollMonth });
      }
      await reload();
      setRows((previous) => previous.map((row) => selectedIds.length && !selectedIds.includes(row.id) ? row : { ...row, status: 'generated', message: 'Generated' }));
      setSelectedIds([]);
      window.alert(`Payslip generated for ${targets.length} employee(s).`);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Unable to generate payslips.');
    } finally {
      setIsSaving(false);
    }
  }, [rows, selectedIds, month, reload]);

  
  const handleSaveAndSend = useCallback(async () => {
    const targets = rows.filter((row) =>
      selectedIds.length
        ? selectedIds.includes(row.id)
        : row.status === 'ready'
    );

    if (!month) {
      setErrorMessage('Select a month first.');
      return;
    }

    if (!targets.length) {
      setErrorMessage('Select at least one employee to generate payslips.');
      return;
    }

    const blocked = targets.filter((row) => row.status !== 'ready');

    if (blocked.length) {
      setErrorMessage(
        'Only employees with available salary details can be generated.'
      );
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage('');

      const [year, monthNumber] = month.split('-').map(Number);
      const payrollMonth =
        `${year}-${String(monthNumber).padStart(2, '0')}-01`;

      let generatedCount = 0;
      let emailedCount = 0;
      const emailFailures: string[] = [];

      for (const row of targets) {
        // Step 1: Generate and save the payslip.
        const savedPayslip = await generatePayslip({
          emp_id: Number(row.id),
          month: payrollMonth,
        });

        generatedCount++;

        // Step 2: Use the actual saved payslip ID to send its email.
        if (!savedPayslip?.id || savedPayslip.id <= 0) {
          emailFailures.push(
            `${row.name}: payslip saved, but no valid payslip ID was returned`
          );
          continue;
        }

        try {
          await sendPayslipEmail(savedPayslip.id);
          emailedCount++;
        } catch (emailError) {
          const message =
            emailError instanceof Error
              ? emailError.message
              : 'Email sending failed';

          emailFailures.push(`${row.name}: ${message}`);
        }
      }

      await reload();

      setRows((previous) =>
        previous.map((row) =>
          targets.some((target) => target.id === row.id)
            ? {
                ...row,
                status: 'generated',
                message: 'Generated',
              }
            : row
        )
      );

      setSelectedIds([]);

      if (emailFailures.length > 0) {
        window.alert(
          `Payslips generated: ${generatedCount}\n` +
          `Emails sent: ${emailedCount}\n` +
          `Email failures: ${emailFailures.length}\n\n` +
          emailFailures.join('\n')
        );
      } else {
        window.alert(
          `Successfully generated ${generatedCount} payslip(s) ` +
          `and sent ${emailedCount} email(s).`
        );
      }
    } catch (e) {
      await reload();

      window.alert(
        e instanceof Error
          ? e.message
          : 'Unable to generate payslips.'
      );
    } finally {
      setIsSaving(false);
    }
  }, [rows, selectedIds, month, reload]);

  const exportCsv = () => {
    const headers = ['Employee ID', 'Employee Name', 'Availed Leave', 'Balance Leave', 'Days Paid', 'LOP / Absent', 'Basic', 'HRA', 'CCA', 'Special', 'Other Earning', 'Night Allowance', 'PF Employee', 'PF Employer', 'ESIC', 'Professional Tax', 'Other Deduction', 'Total Earnings', 'Total Deduction', 'Net Payable', 'Status'];
    const csvRows = filteredRows.map((r) => {
      const earnings = r.basic + r.hra + r.cityCompensatoryAllowance + r.specialAllowance + r.otherEarning + r.nightAllowance;
      const deductions = r.providentFundEmployee + r.providentFundEmployer + r.esic + r.professionalTax + r.otherDeduction;
      return [r.employeeId, r.name, r.availedLeave, r.balanceLeave, r.daysPaid, r.lopAbsent, r.basic, r.hra, r.cityCompensatoryAllowance, r.specialAllowance, r.otherEarning, r.nightAllowance, r.providentFundEmployee, r.providentFundEmployer, r.esic, r.professionalTax, r.otherDeduction, earnings, deductions, earnings - deductions, r.status].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',');
    });
    const blob = new Blob([[headers.join(','), ...csvRows].join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `salary-pf-${month || 'payroll'}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handlePreview = useCallback(async (payslip: PayslipRecord) => {
    try {
      setIsPreviewLoading(true);
      setSelectedPayslip(null);
      setSelectedPayslip(await getPayslipById(payslip.id));
    } catch (e) {
      console.error('Failed to fetch payslip details:', e);
      window.alert('Unable to load payslip details.');
    } finally {
      setIsPreviewLoading(false);
    }
  }, []);

  return (
    <main className="payslip-admin-page">
      <PayslipAdminHeader />
      <AddSalaryPfTable
        rows={visibleRows}
        totalRows={filteredRows.length}
        month={month}
        onMonthChange={(value) => { setMonth(value); setPage(1); setSelectedIds([]); }}
        search={search}
        onSearchChange={(value) => { setTableSearch(value); setPage(1); }}
        pageSize={pageSize}
        onPageSizeChange={(value) => { setTablePageSize(value); setPage(1); }}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        selectedIds={selectedIds}
        onToggleRow={toggleSelected}
        onToggleAll={toggleAllVisible}
        isLoading={isLoadingEmployees}
        isCheckingSalary={isCheckingSalary}
        isSaving={isSaving}
        errorMessage={errorMessage}
        checkMessage={checkMessage}
        bulkEdit={bulkEdit}
        onBulkEdit={() => setBulkEdit((value) => !value)}
        onFieldChange={updateRow}
        onExport={exportCsv}
        onCancel={() => { setSelectedIds([]); setErrorMessage(''); }}
        onSave={handleSave}
        onSaveAndSend={handleSaveAndSend}
      />

      <section className="payslip-admin-page__data-card">
        {error && <div className="payslip-admin-page__error" role="alert">{error}</div>}
        <PayslipAdminFilters pageSize={filters.pageSize} search={filters.search} onPageSizeChange={setPageSize} onSearchChange={setSearch} />
        <PayslipAdminTable payslips={paginatedPayslips} isLoading={isLoading} onPreview={handlePreview} />
      </section>

      {isPreviewLoading && <div className="payslip-admin-page__preview-loading" role="status">Loading payslip...</div>}
      {selectedPayslip && <PayslipPreview payslip={selectedPayslip} loading={isPreviewLoading} onClose={() => setSelectedPayslip(null)} />}
    </main>
  );
};

export default PayslipAdminPage;
