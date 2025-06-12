# Annotator - React Text Highlighting & Annotation Library

A powerful React component library that enables users to highlight text, add notes, select colors, apply underline/strikethrough styles, and delete highlights directly on web interfaces. Built with TypeScript, Vite, and modern development standards for easy integration into React projects.

## 🚀 Features

-   **Text Highlighting**: Select and highlight text passages with multiple color options
-   **Note Management**: Add, edit, and delete notes for highlighted sections with answer checking support
-   **Customizable UI**: Show/hide delete, note, color picker, underline, and strikethrough buttons as needed
-   **Interactive Dialog**: Floating menu dialog appears at selection position for quick actions
-   **Modular Architecture**: Clean separation of logic and UI using custom hooks and small components
-   **Import/Export**: Save and restore highlight data with full state persistence
-   **TypeScript Support**: Full type safety and IntelliSense support

## 📋 Requirements

-   React 18.2.0+
-   Node.js 16+
-   Modern browser with ES6+ support

### Development Setup (For Contributors)

```bash
# Clone the repository
git clone https://github.com/ntnam2002/text-annotator.git
cd Annotator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## ⚙️ Component Props

### HighlightDialog Props

| Prop                | Type        | Default  | Description                                         |
| ------------------- | ----------- | -------- | --------------------------------------------------- |
| `children`          | `ReactNode` | Required | Content to be rendered inside the highlighting area |
| `showDelete`        | `boolean`   | `true`   | Show/hide delete button in dialog menu              |
| `showNote`          | `boolean`   | `true`   | Show/hide note button in dialog menu                |
| `showColor`         | `boolean`   | `true`   | Show/hide color picker buttons                      |
| `showUnderline`     | `boolean`   | `true`   | Show/hide underline button                          |
| `showStrikethrough` | `boolean`   | `true`   | Show/hide strikethrough button                      |
| `enableAnswerCheck` | `boolean`   | `true`   | Enable answer checking functionality                |
| `enableHighlight`   | `boolean`   | `true`   | Enable/disable highlighting functionality           |

## 🎨 Available Highlight Colors

The library comes with 4 predefined colors:

-   Light Blue (`#abf7ff`)
-   Light Pink (`#ffd1d9`)
-   Light Green (`#cfffcf`)
-   Yellow (`#ffff00`)

## 📁 Project Structure

```
src/components/Annotator/
├── index.tsx                    # Main component export
├── components/                  # UI components
│   ├── ColorButton.tsx         # Color selection button
│   ├── DeleteButton.tsx        # Delete highlight button
│   ├── HighlightDialogMenu.tsx # Main dialog menu
│   ├── NoteForm.tsx           # Note input form
│   ├── StrikethroughButton.tsx # Strikethrough button
│   └── UnderlineButton.tsx    # Underline button
├── hooks/                      # Custom React hooks
│   ├── useHighlightDialog.ts  # Main highlighting logic
│   └── helpers/
│       └── highlightHelpers.ts # Helper functions
├── utils/                      # Utility functions
│   ├── DialogManager.ts       # Dialog state management
│   ├── highlightUtils.ts      # Core highlight utilities
│   └── ImportExportUtils.ts   # Data import/export
├── types/                      # TypeScript definitions
│   ├── annotator.interface.ts # Main interfaces
│   ├── button.interface.ts    # Button component types
│   ├── importExport.interface.ts # Import/export types
│   └── note.interface.ts      # Note-related types
├── constant/                   # Constants and configuration
│   └── index.ts              # Colors, offsets, styles
└── styles/                     # CSS modules
    ├── button.module.css      # Button styles
    ├── highlight.module.css   # Dialog menu styles
    └── note.module.css        # Note form styles
```

## 🔧 How It Works

1. **Text Selection**: Users select text within the `HighlightDialog` wrapper
2. **Dialog Menu**: A floating menu appears with available actions
3. **Highlighting**: Selected text is wrapped in a styled `<span>` element
4. **Note Management**: Notes are stored in localStorage and displayed inline
5. **State Persistence**: All highlights and notes persist across page reloads

## 🌟 Key Features Detail

### Highlighting

-   Select any text to trigger the highlight dialog
-   Choose from 4 predefined colors
-   Apply underline or strikethrough styles
-   Highlights persist across page reloads

### Note System

-   Add notes to any highlight
-   Edit existing notes by double-clicking
-   Answer checking with correct/incorrect validation
-   Visual indicators for answer states

### Import/Export

-   Export all highlights and notes as JSON
-   Import previously saved highlight data
-   Maintains exact positioning and styling

### For Library Development

```bash
# Clone and setup development environment
git clone <repository-url>
cd Annotator
npm install

# Start development server
npm run dev

# Build the library for distribution
npm run build

# The built files will be in the dist/ directory:
# - dist/annotator.cjs.js (CommonJS)
# - dist/annotator.es.js (ES Modules)
# - dist/types/ (TypeScript definitions)
```

### Publishing to npm

```bash
# Build the library
npm run build

# Publish to npm (requires npm account and proper permissions)
npm publish
```

### Dependencies

**Runtime Dependencies:**

-   `@dnd-kit/core`: Drag and drop functionality
-   `@emotion/css`: CSS-in-JS styling
-   `lucide-react`: Icon components
-   `react`: Core React library (18.2.0+)
-   `react-dom`: React DOM renderer (18.2.0+)

**Development Dependencies:**

-   `typescript`: Type checking and compilation
-   `vite`: Build tool and dev server
-   `vite-plugin-dts`: TypeScript declaration file generation
-   `eslint`: Code linting
-   Various type definitions and plugins

**Package Information:**

-   **Package Name**: `annotator`
-   **Main Entry**: `dist/annotator.cjs.js` (CommonJS)
-   **Module Entry**: `dist/annotator.es.js` (ES Modules)
-   **Types**: `dist/types/index.d.ts` (TypeScript definitions)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Include code examples and steps to reproduce
