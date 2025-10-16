# Student Finance Tracker 💰

A simple yet powerful web application designed to help students manage their personal finances effectively. Track expenses, monitor budgets, and gain insights into spending habits - all within a clean, user-friendly interface.
## 📹 Introduction Video

Watch a quick introduction and walkthrough of the Student Finance Tracker:

[![Introduction Video](https://img.shields.io/badge/Watch-Introduction%20Video-blue?style=for-the-badge&logo=loom)](https://www.loom.com/share/50612981222b4ac29fd35f41297e256b?sid=91fe25b7-5dc8-4d20-86e4-787061a20a9d)

## 🌟 Features

🔗 **[Live Demo](https://nwafawad.github.io/Student_Finance_Tracker/#about)** - Try it now!


### Core Functionality
- **Add/Edit/Delete Records**: Manage financial transactions with detailed information (description, amount, category, date)
- **Smart Categorization**: Organize expenses into predefined categories:
  - Food
  - Housing/Utilities
  - Transport
  - Entertainment
  - Fees
  - Other

### Dashboard & Analytics
- **Real-time Statistics**:
  - Monthly budget tracking
  - Weekly spending overview (last 7 days)
  - Current balance calculation
- **Visual Indicators**: Color-coded balance status (positive, warning, negative)
- **Budget Alerts**: Get notified when approaching or exceeding your monthly budget cap

### Advanced Features
- **Search & Filter**: Search records using text or regex patterns with highlighted results
- **Sortable Columns**: Click table headers to sort by date, description, category, or amount
- **Data Persistence**: All data saved to localStorage for seamless experience
- **Import/Export**: Backup and restore your financial data as JSON files
- **Accessibility**: ARIA live regions for screen reader support

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation required!

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nwafawad/Student-finance-tracker.git
   cd Student-finance-tracker
   ```

### First Time Setup

1. The app will automatically load with sample data from `seed.json`
2. Navigate to **Settings** to set your monthly budget cap
3. Start adding your own financial records via the **Add/Edit** section
4. View all records and statistics on the **Dashboard**

## 📖 Usage Guide

### Adding a Record
1. Click on **Add/Edit** in the navigation menu
2. Fill in the form:
   - **Description**: What the expense was for
   - **Amount**: How much you spent (e.g., 12.50)
   - **Date**: When the transaction occurred
   - **Category**: Select the appropriate category
3. Click **Save Record**

### Editing a Record
1. Go to **Records** section
2. Find the record you want to edit
3. Click the **Edit** button
4. Modify the fields and click **Update Record**

### Deleting a Record
1. Go to **Records** section
2. Find the record you want to delete
3. Click the **Delete** button
4. Confirm the deletion

### Searching Records
- Use the search box in the **Records** section
- Enter text or regex patterns to filter records
- Matching text will be highlighted in the results

### Setting a Budget
1. Navigate to **Settings**
2. Enter your monthly budget cap in RWF (Rwandan Francs)
3. The dashboard will automatically update with your budget status

### Import/Export Data
- **Export**: Click "Export Data as JSON" in Settings to download your data
- **Import**: Use "Import Data from JSON File" to restore a previous backup or migrate data

## 🏗️ Project Structure

```
Student_Finance_Tracker/
├── index.html              # Main HTML file
├── README.md              # Project documentation
├── seed.json              # Sample data for first-time users
├── scripts/
│   ├── main.js           # Main application logic and UI
│   ├── state.js          # State management
│   ├── storage.js        # localStorage operations
│   ├── utils.js          # Utility functions (formatting, calculations)
│   ├── validators.js     # Input validation rules
│   ├── search.js         # Search and filter functionality
│   └── charts.js         # Dashboard statistics calculations
└── styles/
    ├── base.css          # Base styles and CSS variables
    └── components.css    # Component-specific styles
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with custom properties
- **Vanilla JavaScript**: No frameworks or dependencies
- **LocalStorage API**: Client-side data persistence
- **File API**: Import/export functionality

## 💡 Key Features Explained

### State Management
The application uses a centralized state object that tracks:
- All financial records
- Current sort configuration
- Budget cap
- Editing mode status

### Validation
Input validation ensures:
- Non-empty descriptions
- Valid numeric amounts
- Valid date formats
- Category selection

### Responsive Design
- Mobile-friendly interface
- Accessible navigation
- Keyboard-friendly interactions

## 🎨 Color Coding

- **Green**: Healthy budget balance
- **Orange**: Warning - approaching budget limit (75-90% used)
- **Red**: Budget exceeded or critically low

## 📊 Dashboard Statistics

- **Monthly Budget**: Your set budget cap
- **Week Spending**: Total expenses in the last 7 days
- **Balance**: Remaining budget (Budget - Monthly Spending)

## 🔒 Privacy & Security

- All data is stored locally in your browser
- No data is sent to external servers
- Clear localStorage to remove all data

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

**Nawaf Ahmed**

- GitHub: [@nwafawad](https://github.com/nwafawad)
- Project Link: [Student Finance Tracker](https://github.com/nwafawad/Student-finance-tracker.git)

## 🙏 Acknowledgments

- Designed for students to develop better financial habits
- Built as a summative assessment project
- Inspired by the need for simple, accessible financial tracking tools


---

**Happy Tracking! 💰✨**
