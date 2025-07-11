# Task 1: Request Creation Form - Test Cases & Acceptance Criteria

## Feature Overview
A comprehensive form that allows pharmaceutical users to create workflow requests with all necessary fields for regulatory compliance and business tracking.

## Acceptance Criteria & Test Cases

### AC1: Form Fields Validation
**Requirement**: All required fields must be validated before submission

**Test Cases:**
- **TC1.1**: Submit form with empty required fields
  - **Given**: User is on the request creation form
  - **When**: User clicks "Submit Request" without filling required fields
  - **Then**: Form shows validation errors for Title, Description, Request Type, and Justification
  - **Expected Result**: Form does not submit, error messages are displayed

- **TC1.2**: Submit form with all required fields filled
  - **Given**: User has filled Title, Description, Request Type, and Justification
  - **When**: User clicks "Submit Request"
  - **Then**: Form submits successfully and redirects to requests page
  - **Expected Result**: Request is created with status "submitted"

### AC2: Request Types Coverage
**Requirement**: Form must support all pharmaceutical-specific request types

**Test Cases:**
- **TC2.1**: Verify all request types are available
  - **Given**: User opens the Request Type dropdown
  - **When**: User views the available options
  - **Then**: All types are present: Drug Approval, Clinical Trial, Manufacturing Change, Quality Control, Regulatory Submission, Safety Update, Other
  - **Expected Result**: All 7 request types are selectable

- **TC2.2**: Select each request type
  - **Given**: User is creating a request
  - **When**: User selects each request type one by one
  - **Then**: The selected type is properly stored and displayed
  - **Expected Result**: Request type field accepts all valid options

### AC3: Priority Levels
**Requirement**: Users must be able to set appropriate priority levels

**Test Cases:**
- **TC3.1**: Default priority is Medium
  - **Given**: User opens a new request form
  - **When**: User views the Priority field
  - **Then**: Priority is pre-selected as "Medium"
  - **Expected Result**: Default value is "medium"

- **TC3.2**: Change priority levels
  - **Given**: User is creating a request
  - **When**: User selects Low, Medium, High, or Urgent priority
  - **Then**: Selected priority is stored correctly
  - **Expected Result**: All priority levels are selectable and functional

### AC4: Date Selection
**Requirement**: Target completion date should be selectable via calendar

**Test Cases:**
- **TC4.1**: Open calendar picker
  - **Given**: User clicks on Target Completion Date field
  - **When**: Calendar popup appears
  - **Then**: User can navigate and select dates
  - **Expected Result**: Calendar is functional and date selection works

- **TC4.2**: Date is optional
  - **Given**: User creates a request
  - **When**: User leaves Target Completion Date empty
  - **Then**: Form still submits successfully
  - **Expected Result**: Request is created without completion date

### AC5: Draft Functionality
**Requirement**: Users must be able to save requests as drafts

**Test Cases:**
- **TC5.1**: Save incomplete form as draft
  - **Given**: User has partially filled the form
  - **When**: User clicks "Save as Draft"
  - **Then**: Request is saved with status "draft"
  - **Expected Result**: User receives confirmation and can continue later

- **TC5.2**: Load saved draft
  - **Given**: User has a saved draft
  - **When**: User navigates back to edit the draft
  - **Then**: All previously entered data is restored
  - **Expected Result**: Form fields contain saved draft data

### AC6: Role-Based Access
**Requirement**: Only authenticated users with appropriate roles can create requests

**Test Cases:**
- **TC6.1**: Unauthenticated user access
  - **Given**: User is not logged in
  - **When**: User tries to access /requests
  - **Then**: User is prompted to log in
  - **Expected Result**: Access denied, redirect to login

- **TC6.2**: Authenticated user access
  - **Given**: User is logged in with any role (admin, approver, requester)
  - **When**: User navigates to /requests
  - **Then**: User can access the requests page
  - **Expected Result**: Full access to request creation

### AC7: Data Persistence
**Requirement**: Request data must be properly stored in database

**Test Cases:**
- **TC7.1**: Verify database storage
  - **Given**: User submits a complete request
  - **When**: Request is successfully created
  - **Then**: Data is stored in the requests table with correct user ID
  - **Expected Result**: Database contains the request with all fields

- **TC7.2**: Verify timestamps
  - **Given**: User creates and submits a request
  - **When**: Request is saved to database
  - **Then**: created_at and submitted_at timestamps are properly set
  - **Expected Result**: Timestamps reflect correct creation and submission times

### AC8: User Experience
**Requirement**: Form should provide clear feedback and intuitive navigation

**Test Cases:**
- **TC8.1**: Loading states
  - **Given**: User submits a request
  - **When**: Form is processing
  - **Then**: Loading indicators are shown and buttons are disabled
  - **Expected Result**: User understands the system is processing

- **TC8.2**: Success feedback
  - **Given**: User successfully submits a request
  - **When**: Request is created
  - **Then**: Success toast message appears
  - **Expected Result**: User receives clear confirmation

- **TC8.3**: Error handling
  - **Given**: Database error occurs during submission
  - **When**: Request fails to save
  - **Then**: Error message is displayed to user
  - **Expected Result**: User is informed of the error

### AC9: Form Navigation
**Requirement**: Users should be able to navigate between form and requests list

**Test Cases:**
- **TC9.1**: Access form from requests page
  - **Given**: User is on the requests page
  - **When**: User clicks "New Request" or "Create First Request"
  - **Then**: Request creation form is displayed
  - **Expected Result**: Form loads correctly

- **TC9.2**: Return to requests list
  - **Given**: User is on the request creation form
  - **When**: User clicks "Back to Requests"
  - **Then**: User returns to the requests list page
  - **Expected Result**: Navigation works without losing unsaved changes warning

### AC10: Responsive Design
**Requirement**: Form must work on desktop and mobile devices

**Test Cases:**
- **TC10.1**: Desktop layout
  - **Given**: User accesses form on desktop (>768px width)
  - **When**: Form is displayed
  - **Then**: Two-column layout for Priority/Request Type fields
  - **Expected Result**: Optimal desktop layout

- **TC10.2**: Mobile layout
  - **Given**: User accesses form on mobile (<768px width)
  - **When**: Form is displayed
  - **Then**: Single-column layout, all fields stack vertically
  - **Expected Result**: Mobile-friendly responsive design

## Test Data Examples

### Valid Request Data:
```
Title: "New Drug Compound Testing Approval"
Description: "Request approval for Phase II clinical trials of compound XYZ-123 for treatment of hypertension"
Request Type: "Clinical Trial"
Priority: "High"
Target Completion Date: "2024-12-31"
Justification: "Compound shows promising results in Phase I trials with 85% efficacy rate"
Business Impact: "Potential $50M revenue if approved, addresses unmet medical need"
Regulatory Requirements: "FDA IND filing required, GCP compliance mandatory"
```

### Edge Cases to Test:
- Very long text in description fields (>1000 characters)
- Special characters in text fields
- Past dates for target completion
- Rapid form submission (double-click prevention)
- Network interruption during submission

## Success Metrics:
- ✅ All 10 acceptance criteria pass their test cases
- ✅ Form validation prevents invalid submissions
- ✅ Data integrity maintained in database
- ✅ Positive user experience with clear feedback
- ✅ Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- ✅ Mobile responsiveness verified

## Next Steps After Completion:
1. Request List/Dashboard (Task 2)
2. Request Status Management (Task 3)
3. File Attachments (Task 4)
4. Approval Workflow (Task 5)