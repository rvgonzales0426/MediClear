# MediClear - AI Coding Agent Instructions

## Project Overview

MediClear is a hospital patient discharge management system built with **Vue 3 + Vite + Vuetify 3** and **Supabase** as the backend. The app manages patient workflows across different healthcare roles (doctors, nurses) with distinct dashboards and permissions.

## Architecture & Key Patterns

### Tech Stack

- **Frontend**: Vue 3 (Composition API), Vuetify 3 (Material Design), Pinia for state management
- **Backend**: Supabase (PostgreSQL + Auth)
- **Build**: Vite with path aliases (`@/` → `src/`)
- **Linting**: Dual-stage with `oxlint` (fast) then `eslint` (comprehensive)

### State Management (Pinia Stores)

All stores use **Composition API pattern** with `defineStore(name, () => {})`:

- `stores/auth.js`: User session (`userSession`), auth listeners (`listenToAuthChanges`), user metadata
- `stores/patient.js`: Patient CRUD operations, status-based computed properties (e.g., `pendingDischarge`, `approvedPatients`)

**Pattern**: Stores return object with `{ states, computeds, actions }` structure. Always call `fetchPatients()` after mutations.

### Component Organization

```
components/
├── layout/         # AppLayout (theme + drawer), GuestLayout, NavigationDrawer
├── auth/           # LoginForm, RegisterForm
└── system/
    ├── doctor/     # Doctor-specific patient management
    └── nurse/      # Nurse-specific patient management
```

**Key Pattern**: Views are thin wrappers that compose `AppLayout` + feature components via named slots:

```vue
<AppLayout>
  <template #content>
    <ManagePatientsForDoctor />
  </template>
</AppLayout>
```

### Composables Pattern

- `composables/useSupabase.js`: Single Supabase client export (`export const supabase`)
- `composables/usePatientOperations.js`: Form logic for patient dialogs (CRUD operations, validation)

**Critical**: Composables use props/emits via `defineProps`/`defineEmits` for reusability across dialogs.

### Authentication Flow

1. Auth state managed via Supabase's `onAuthStateChange` listener (initialized in `AppLayout`)
2. User metadata stored in `userData` (includes role: doctor/nurse)
3. **No route guards implemented yet** - navigation relies on manual checks of `authStore.userSession`

### Patient Status Workflow

Patients transition through statuses: `Admitted` → `Discharge Requested` → `Approved` → `Released`

- Doctors: Can approve discharge requests
- Nurses: Initiate discharge requests and manage patient records
- Each status has computed filter in `patient.js` store

### Validation System

Custom validators in `utils/validators.js` follow pattern: `(value) => boolean | errorMessage`

- Use `requiredValidator`, `emailValidator`, `passwordValidator` for forms
- All validators handle empty values gracefully (`isEmpty` check)
- Vuetify forms validated via `refVForm.validate()` returning `{ valid }`

## Developer Workflows

### Environment Setup

1. Create `.env.local` with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
2. Run `npm install` then `npm run dev` for hot-reload development

### Linting & Formatting

- **Always run linting before commits**: `npm run lint` (runs `oxlint` then `eslint`)
- Format code: `npm run format` (Prettier with `@prettier/plugin-oxc`)
- Oxlint is fast but only checks correctness; ESLint adds Vue-specific rules

### Build & Preview

- Production build: `npm run build` (outputs to `dist/`)
- Preview production: `npm run preview`

## Critical Conventions

### Component Style Guidelines

- **Always use Composition API** (`<script setup>`) - no Options API
- Use Vuetify 3 components (v-card, v-btn, v-data-table, etc.)
- Theme switching via localStorage (`theme` key) - implemented in `AppLayout`
- Drawer state persists to localStorage (`drawer` key)

### Data Fetching Pattern

```javascript
// In store actions
const { data, error } = await supabase.from('patients').select('*')
if (error) console.log(error) // Log errors, don't throw
```

### Form Handling Pattern

1. Use `ref()` for form data with default object
2. Watch props to populate form for edit mode (`watch(() => props.patientData)`)
3. Validate with `refVForm.validate()` before submission
4. Reset form after success: `refVForm.value?.reset()`

### Vuetify Labs Components

`VDateInput` is imported from `vuetify/labs/VDateInput` and registered in `main.js` - use for date fields.

## External Dependencies

- **Supabase**: Real-time database with RLS (Row Level Security) - all queries go through `supabase` client
- **Material Design Icons**: Use `mdi-*` icon names (e.g., `mdi-account`)
- **Axios**: Available but not actively used (Supabase client preferred)

## Known Quirks

- `README.md` has merge conflict markers - ignore them
- `copilot-instructions.md` (root) exists but is empty - this `.github/` version is authoritative
- No TypeScript - plain JavaScript with JSDoc comments where needed
- Theme defaults to value from localStorage (no system preference detection)

## Testing Status

**No test framework configured yet**. When adding tests:

- Consider Vitest (Vite-native) for unit tests
- Vue Test Utils for component testing
- Mock Supabase client for isolated testing
