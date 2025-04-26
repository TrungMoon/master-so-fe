# MasterSo - Phong Thủy Application

A web application focused on Feng Shui (Phong Thủy), Physiognomy (Tướng Số), and other traditional divination methods.

## Project Overview

This application provides users with:
- Articles and information about Phong Thủy, Tướng Số, and Tử Vi
- Tools for calculating personal fortunes like "Cân Xương Tính Lượng"
- User authentication to save results and access premium features

## Technology Stack

### Frontend
- React 19
- TypeScript
- Ant Design 5.x
- React Router DOM 7.x
- Formik & Yup for form handling
- React Query for API data fetching
- Axios for HTTP requests

### Backend (Planned)
- Spring Boot
- SQL Server
- JPA / Hibernate
- Spring Security

## Setup Instructions

### Prerequisites
- Node.js (version 16.x or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/your-username/master-so-fe.git
   cd master-so-fe
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```
   npm start
   # or
   yarn start
   ```

4. The application will be available at `http://localhost:3000`

## Features

### Implemented Features
- User authentication (login/register)
- Home page with featured articles
- Article listing by category
- Cân Xương Tính Lượng calculator
- User profile management

### Upcoming Features
- More calculation tools
- Article commenting
- Favorite articles for logged-in users
- Advanced search functionality
- Daily horoscope

## Project Structure

```
master-so-fe/
├── public/
├── src/
│   ├── assets/
│   │   ├── ArticleCard/
│   │   ├── AuthForm/
│   │   ├── Calculator/
│   │   └── Layout/
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── Article/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Profile/
│   │   ├── Register/
│   │   └── Tools/
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   ├── App.tsx
│   └── index.tsx
├── database-schema.sql
├── database-erd.md
├── package.json
└── tsconfig.json
```

## Database Design

The project uses SQL Server for data storage. The database schema includes:
- Users and UserProfiles tables for authentication
- Articles, Categories, and Tags for content management
- Comments for user interaction
- CalculationResults to store user calculation history
- UserFavorites to track favorite articles

For detailed database schema, see `database-schema.sql` and `database-erd.md`.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
