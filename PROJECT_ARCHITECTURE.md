# BrandCrunch Project Architecture

## Component Structure and Data Flow

```mermaid
graph TD
    A[main.jsx] --> B[App.jsx]
    B --> C[Router]
    
    C --> D[BrandsOverview]
    C --> E[BrandProfile]
    C --> F[NFTContractMetrics]
    C --> G[NFTContractProfile]
    C --> H[NFTBrandCategory]
    
    D --> I[AI Analysis Service]
    E --> I
    F --> I
    G --> I
    
    I --> J[Gemini AI API]
    
    D --> K[Components]
    E --> K
    F --> K
    G --> K
    H --> K
    
    K --> L[ChartControls]
    K --> M[DataGrid]
    K --> N[Loading]
    K --> O[Error]
    
    subgraph Data Flow
        P[User Input] --> Q[Component State]
        Q --> R[API Request]
        R --> S[AI Analysis]
        S --> T[Update UI]
    end
```

## Data Flow Description

1. **Entry Point**
   - `main.jsx` initializes the React application
   - `App.jsx` sets up routing and global state

2. **Main Pages**
   - BrandsOverview: Shows all NFT brands and metrics
   - BrandProfile: Detailed view of a single brand
   - NFTContractMetrics: Contract-level metrics and analysis
   - NFTContractProfile: Detailed contract analysis
   - NFTBrandCategory: Brand categorization

3. **AI Integration**
   - AI Analysis Service processes data
   - Communicates with Gemini AI API
   - Returns structured insights

4. **Components**
   - Shared UI components
   - Chart controls for data visualization
   - Data grids for metric display
   - Loading and error states

5. **Data Flow**
   - User interacts with UI
   - Component state updates
   - API requests triggered
   - AI analysis performed
   - UI updates with results

## State Management

```mermaid
stateDiagram-v2
    [*] --> Initial
    Initial --> Loading: User Action
    Loading --> Success: Data Received
    Loading --> Error: API Error
    Success --> Loading: Refresh
    Error --> Loading: Retry
    Success --> [*]
```

## Component Hierarchy

```mermaid
graph TB
    App --> Router
    Router --> Pages
    Pages --> Components
    Components --> UI
    Components --> Charts
    Components --> Forms
    
    subgraph Pages
        BrandsOverview
        BrandProfile
        NFTContractMetrics
        NFTContractProfile
        NFTBrandCategory
    end
    
    subgraph Components
        UI[UI Elements]
        Charts[Chart Components]
        Forms[Form Controls]
    end
```
