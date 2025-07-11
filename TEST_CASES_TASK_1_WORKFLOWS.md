# Task 1 UPDATED: Workflow-Based Request Creation Form - Test Cases & Acceptance Criteria

## Feature Overview
A comprehensive workflow form that dynamically generates pharmaceutical-specific fields based on the selected workflow type, enabling precise data collection for regulatory compliance and business tracking.

## Key Updates
- ✅ Request Types → **Workflow Types** (11 pharmaceutical workflows)
- ✅ **Dynamic Field Generation** based on workflow selection
- ✅ **JSONB Storage** for workflow-specific data
- ✅ **Workflow Configuration System** with field definitions
- ✅ **Smart Validation** for workflow-specific required fields

## Available Workflows & Their Fields

### 1. Drug Approval
**Additional Fields:** Compound Name*, Therapeutic Indication*, Dosage Form*, Regulatory Pathway*

### 2. Clinical Trial Protocol  
**Additional Fields:** Protocol Number*, Study Phase*, Target Patient Population*, Study Duration*, Target Enrollment*

### 3. Manufacturing Change Control
**Additional Fields:** Product Name*, Change Type*, Current Process*, Proposed Change*, Change Rationale*

### 4. Quality Deviation Investigation
**Additional Fields:** Deviation Type*, Affected Batch Number(s)*, Discovery Date*, Immediate Actions*, Potential Impact*

### 5. Regulatory Submission
**Additional Fields:** Submission Type*, Regulatory Authority*, Submission Deadline*, Reference Number

### 6. Pharmacovigilance Case
**Additional Fields:** Case Type*, Reporter Type*, Event Onset Date*, Seriousness Criteria

### 7. Supplier Qualification + Other workflows...

## Acceptance Criteria & Test Cases

### AC1: Dynamic Field Generation
**Requirement**: Form must dynamically show workflow-specific fields based on selection

**Test Cases:**
- **TC1.1**: Change workflow type triggers field update
  - **Given**: User selects "Drug Approval" workflow
  - **When**: User changes to "Clinical Trial Protocol"
  - **Then**: Form shows Protocol Number, Study Phase, etc. (Drug Approval fields disappear)
  - **Expected Result**: Workflow data resets, new fields appear

- **TC1.2**: Workflow-specific field validation
  - **Given**: User selects "Manufacturing Change Control"
  - **When**: User submits without filling "Product Name" (required)
  - **Then**: Validation error specifically mentions "Product Name is required"
  - **Expected Result**: Form prevents submission with specific error

### AC2: Workflow Configuration System
**Requirement**: Each workflow must have proper field definitions and descriptions

**Test Cases:**
- **TC2.1**: Workflow description appears
  - **Given**: User selects any workflow type
  - **When**: Workflow is selected
  - **Then**: Description appears below dropdown with info icon
  - **Expected Result**: User understands the workflow purpose

- **TC2.2**: Field types render correctly
  - **Given**: User selects "Quality Deviation Investigation"
  - **When**: Form displays workflow fields
  - **Then**: "Discovery Date" shows date picker, "Deviation Type" shows dropdown
  - **Expected Result**: Appropriate input controls for each field type

### AC3: Data Storage & Retrieval
**Requirement**: Workflow-specific data must be stored in JSONB and retrievable

**Test Cases:**
- **TC3.1**: Workflow data persistence
  - **Given**: User fills Drug Approval form with Compound Name "ABC-456"
  - **When**: User saves as draft
  - **Then**: Database stores workflow_data: {"compound_name": "ABC-456", ...}
  - **Expected Result**: JSONB contains correct workflow data structure

- **TC3.2**: Draft restoration with workflow data
  - **Given**: User has saved Clinical Trial draft with Protocol Number "CT-2024-002"
  - **When**: User loads the draft
  - **Then**: Form shows Clinical Trial workflow with Protocol Number pre-filled
  - **Expected Result**: All workflow-specific data restored correctly

### AC4: Field Type Support
**Requirement**: Support text, textarea, select, date, number, and email field types

**Test Cases:**
- **TC4.1**: Text and number fields
  - **Given**: User is on Clinical Trial workflow
  - **When**: User enters "CT-001" in Protocol Number and "24" in Study Duration
  - **Then**: Text accepts alphanumeric, number field only accepts digits
  - **Expected Result**: Proper input validation per field type

- **TC4.2**: Select dropdown options
  - **Given**: User selects Drug Approval workflow
  - **When**: User opens "Regulatory Pathway" dropdown
  - **Then**: Shows NDA, ANDA, BLA, IND options
  - **Expected Result**: All predefined options available

- **TC4.3**: Date picker functionality
  - **Given**: User is on Pharmacovigilance workflow
  - **When**: User clicks "Event Onset Date"
  - **Then**: Calendar popup allows date selection
  - **Expected Result**: Date properly formatted and stored

### AC5: Enhanced Validation System
**Requirement**: Validate both core fields and workflow-specific required fields

**Test Cases:**
- **TC5.1**: Combined validation
  - **Given**: User submits Manufacturing Change Control workflow
  - **When**: Title is empty AND Product Name is empty
  - **Then**: Error shows "Title is required, Product Name is required"
  - **Expected Result**: All validation errors displayed together

- **TC5.2**: Optional workflow fields
  - **Given**: User fills Regulatory Submission workflow
  - **When**: User leaves "Reference Number" empty (optional)
  - **Then**: Form submits successfully
  - **Expected Result**: Optional fields don't block submission

### AC6: Workflow Reset Behavior
**Requirement**: Changing workflow type should reset workflow-specific data

**Test Cases:**
- **TC6.1**: Data reset on workflow change
  - **Given**: User fills Clinical Trial fields completely
  - **When**: User changes to Drug Approval workflow
  - **Then**: Previous workflow data is cleared, new fields are empty
  - **Expected Result**: Clean slate for new workflow type

- **TC6.2**: Core fields preserved on workflow change
  - **Given**: User has filled Title, Description, Priority
  - **When**: User changes workflow type
  - **Then**: Core fields remain filled, only workflow fields reset
  - **Expected Result**: User doesn't lose basic form data

### AC7: Complex Field Interactions
**Requirement**: Handle complex field types and dependencies properly

**Test Cases:**
- **TC7.1**: Multi-select and dependent fields
  - **Given**: User selects "Quality Deviation Investigation"
  - **When**: User selects "Out of Specification" deviation type
  - **Then**: Form accepts this selection and stores correctly
  - **Expected Result**: Complex field relationships work

- **TC7.2**: Long text field handling
  - **Given**: User is filling "Current Process Description"
  - **When**: User enters 500+ characters
  - **Then**: Textarea expands and accepts full content
  - **Expected Result**: No character limits on textarea fields

### AC8: User Experience Enhancements
**Requirement**: Provide clear guidance and intuitive workflow selection

**Test Cases:**
- **TC8.1**: Workflow guidance
  - **Given**: User hovers over workflow dropdown
  - **When**: User sees available options
  - **Then**: Each option clearly describes its purpose
  - **Expected Result**: User can easily choose correct workflow

- **TC8.2**: Required field indicators
  - **Given**: User views any workflow-specific section
  - **When**: Required fields are displayed
  - **Then**: Red asterisk (*) indicates required fields
  - **Expected Result**: Clear visual distinction for required fields

### AC9: Database Performance
**Requirement**: JSONB storage should be efficient and queryable

**Test Cases:**
- **TC9.1**: JSONB storage efficiency
  - **Given**: User submits workflow with 10+ additional fields
  - **When**: Form saves to database
  - **Then**: Single database insert with JSONB column
  - **Expected Result**: Efficient storage without multiple table joins

- **TC9.2**: Future queryability
  - **Given**: Multiple requests with different workflow types stored
  - **When**: System needs to filter by workflow-specific fields
  - **Then**: JSONB fields can be queried using PostgreSQL JSON operators
  - **Expected Result**: Structured data remains searchable

### AC10: Workflow Extensibility
**Requirement**: System should easily support new workflow types

**Test Cases:**
- **TC10.1**: New workflow addition
  - **Given**: Developer adds new workflow to WORKFLOW_CONFIGS
  - **When**: Form is loaded
  - **Then**: New workflow appears in dropdown with its fields
  - **Expected Result**: No code changes needed beyond configuration

## Sample Test Data by Workflow

### Drug Approval Example:
```json
{
  "compound_name": "XYZ-789",
  "indication": "Type 2 Diabetes",
  "dosage_form": "tablet",
  "regulatory_pathway": "nda"
}
```

### Clinical Trial Example:
```json
{
  "protocol_number": "CT-2024-003",
  "study_phase": "phase_ii",
  "patient_population": "Adults aged 18-65 with confirmed diagnosis",
  "study_duration": "18",
  "enrollment_target": "250"
}
```

### Manufacturing Change Example:
```json
{
  "product_name": "Aspirin 100mg Tablets",
  "change_type": "equipment",
  "current_process": "Manual tablet pressing using Press-A",
  "proposed_change": "Automated tablet pressing using Press-B",
  "change_rationale": "Increase production capacity and reduce manual errors"
}
```

## Success Metrics:
- ✅ All 10 acceptance criteria pass with workflow-specific tests
- ✅ Dynamic field generation works for all 11+ workflow types
- ✅ JSONB storage handles complex field structures
- ✅ Form validation covers both core and workflow-specific fields
- ✅ User experience guides workflow selection effectively
- ✅ System extensible for future workflow types

## Performance Benchmarks:
- Form renders workflow-specific fields in < 100ms
- Workflow type change completes in < 50ms
- Complex forms with 15+ fields submit in < 1s
- JSONB queries perform efficiently on 1000+ records

## Next Phase Considerations:
1. **Workflow Templates** - Pre-filled forms for common scenarios
2. **Field Dependencies** - Show/hide fields based on other selections
3. **Workflow Versioning** - Handle changes to workflow definitions
4. **Bulk Operations** - Import/export workflow data
5. **Advanced Validation** - Cross-field validation rules