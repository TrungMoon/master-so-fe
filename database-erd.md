# PhongThuyDB Entity Relationship Diagram

## Entities and Relationships

### Core Entities

1. **Users**
   - Attributes: UserID, Email, Password, FullName, Phone, DateOfBirth, CreatedAt, LastLoginAt, Status
   - Relationships:
     - One User can write many Articles (One-to-Many)
     - One User can write many Comments (One-to-Many)
     - One User can have many CalculationResults (One-to-Many)
     - One User can have one UserProfile (One-to-One)
     - One User can have many UserFavorites (One-to-Many)
     - One User can have many Roles through UserRoles (Many-to-Many)
     - One User can write many Stories (One-to-Many)
     - One User can moderate many Stories (One-to-Many)
     - One User can perform many ModeratorActions (One-to-Many)
     - One User can receive many Notifications (One-to-Many)

2. **Roles**
   - Attributes: RoleID, Name, Description
   - Relationships:
     - One Role can be assigned to many Users through UserRoles (Many-to-Many)
     - One Role can have many Permissions through RolePermissions (Many-to-Many)

3. **Permissions**
   - Attributes: PermissionID, Name, Description
   - Relationships:
     - One Permission can be assigned to many Roles through RolePermissions (Many-to-Many)

4. **Articles**
   - Attributes: ArticleID, Title, Slug, Content, Summary, ImageURL, CategoryID, AuthorID, ViewCount, IsPublished, CreatedAt, UpdatedAt, PublishedAt
   - Relationships:
     - One Article belongs to one Category (Many-to-One)
     - One Article is written by one User (Many-to-One)
     - One Article can have many Comments (One-to-Many)
     - One Article can have many Tags through ArticleTags (Many-to-Many)
     - One Article can be favorited by many Users through UserFavorites (Many-to-Many)

5. **Stories**
   - Attributes: StoryID, Title, Slug, Content, Summary, ImageURL, AuthorID, ViewCount, Status, RejectionReason, ModeratedBy, ModeratedAt, CreatedAt, UpdatedAt, PublishedAt
   - Relationships:
     - One Story is written by one User (Many-to-One)
     - One Story is moderated by one User (Many-to-One)
     - One Story can have many Tags through StoryTags (Many-to-Many)
     - One Story can have many StoryComments (One-to-Many)
     - One Story can be favorited by many Users through UserStoryFavorites (Many-to-Many)
     - One Story can have many ModeratorActions performed on it (One-to-Many)

6. **Categories**
   - Attributes: CategoryID, Name, Slug, Description, ParentCategoryID
   - Relationships:
     - One Category can have many Articles (One-to-Many)
     - One Category can have many child Categories (One-to-Many)
     - One Category can belong to one parent Category (Many-to-One)

7. **Tags**
   - Attributes: TagID, Name, Slug
   - Relationships:
     - One Tag can be assigned to many Articles through ArticleTags (Many-to-Many)
     - One Tag can be assigned to many Stories through StoryTags (Many-to-Many)

8. **Comments**
   - Attributes: CommentID, ArticleID, UserID, Content, CreatedAt, Status
   - Relationships:
     - One Comment belongs to one Article (Many-to-One)
     - One Comment is written by one User (Many-to-One)

9. **StoryComments**
   - Attributes: CommentID, StoryID, UserID, Content, CreatedAt, Status
   - Relationships:
     - One StoryComment belongs to one Story (Many-to-One)
     - One StoryComment is written by one User (Many-to-One)

10. **ModeratorActions**
    - Attributes: ActionID, ModeratorID, ActionType, ContentType, ContentID, Reason, ActionDate
    - Relationships:
      - One ModeratorAction is performed by one User (Many-to-One)
      - One ModeratorAction affects one content item (Story, Comment, etc.)

11. **Notifications**
    - Attributes: NotificationID, UserID, Title, Message, Type, RelatedID, IsRead, CreatedAt
    - Relationships:
      - One Notification belongs to one User (Many-to-One)
      - One Notification can relate to one content item (Story, Comment, etc.)

### Junction Entities

1. **UserRoles**
   - Attributes: UserID, RoleID, AssignedAt
   - Relationships:
     - Many-to-Many relationship between Users and Roles

2. **RolePermissions**
   - Attributes: RoleID, PermissionID
   - Relationships:
     - Many-to-Many relationship between Roles and Permissions

3. **ArticleTags**
   - Attributes: ArticleID, TagID
   - Relationships:
     - Many-to-Many relationship between Articles and Tags

4. **StoryTags**
   - Attributes: StoryID, TagID
   - Relationships:
     - Many-to-Many relationship between Stories and Tags

5. **UserFavorites**
   - Attributes: UserID, ArticleID, CreatedAt
   - Relationships:
     - Many-to-Many relationship between Users and Articles

6. **UserStoryFavorites**
   - Attributes: UserID, StoryID, CreatedAt
   - Relationships:
     - Many-to-Many relationship between Users and Stories

### Supplementary Entities

1. **Proverbs**
   - Attributes: ProverbID, Content, Meaning, Category, CreatedAt
   - Relationships: None (standalone entity)

2. **CalculationResults**
   - Attributes: ResultID, UserID, CalculationType, InputData, ResultData, CreatedAt
   - Relationships:
     - One CalculationResult belongs to one User (Many-to-One)

3. **UserProfiles**
   - Attributes: ProfileID, UserID, Avatar, Bio, Location, Gender
   - Relationships:
     - One UserProfile belongs to one User (One-to-One)

## Key Authorization Flow for Stories

1. User creates a Story (Status = 'Pending')
2. Admin/Editor with 'approve_story' permission reviews the Story
3. Admin/Editor approves (Status = 'Approved', PublishedAt = current time) or rejects (Status = 'Rejected', RejectionReason = reason)
4. ModeratorAction is recorded for audit trail
5. Notification is sent to the User about the approval/rejection
6. If approved, the Story is visible to all users
7. If rejected, only the author and admins can view it

## Permission Hierarchy

- **Admin**: Has all permissions
- **Editor**: Can create, edit, approve, and reject stories
- **User**: Can create, edit their own stories, and comment

## Database Diagram

```
Users 1──┐
  │      │
  │      ├──1 UserProfiles
  │      │
  │      ├──* Articles ─────*─┐
  │      │      │            │
  │      │      │            * 
  │      │      *        ArticleTags
  │      │   Comments        │
  │      │                   *
  │      │                  Tags
  │      │
  │      ├──* CalculationResults
  │      │
  *      │
UserFavorites
  *      │
  │      │
  └──────┘

Categories 1──* Articles
     │
     └─────1 ParentCategory
```

## Books Management

### Books Table
- **BookID** INT PK
- **Title** NVARCHAR(200) NOT NULL
- **Slug** NVARCHAR(255) NOT NULL UNIQUE
- **Author** NVARCHAR(100) NOT NULL
- **Publisher** NVARCHAR(100)
- **PublishYear** INT
- **Description** NTEXT
- **CoverImageURL** NVARCHAR(255)
- **FileURL** NVARCHAR(255)
- **CategoryID** INT NOT NULL FK -> Categories.CategoryID
- **Pages** INT
- **ISBN** NVARCHAR(20)
- **IsFree** BIT DEFAULT 0
- **Price** DECIMAL(10, 2) DEFAULT 0
- **AddedByUserID** INT NOT NULL FK -> Users.UserID
- **ViewCount** INT DEFAULT 0
- **DownloadCount** INT DEFAULT 0
- **CreatedAt** DATETIME DEFAULT GETDATE()
- **UpdatedAt** DATETIME DEFAULT GETDATE()
- **IsPublished** BIT DEFAULT 1

### BookTags Table (M:M relationship)
- **BookID** INT NOT NULL FK -> Books.BookID
- **TagID** INT NOT NULL FK -> Tags.TagID
- PK (BookID, TagID)

### BookChapters Table (1:M relationship)
- **ChapterID** INT PK
- **BookID** INT NOT NULL FK -> Books.BookID
- **Title** NVARCHAR(200) NOT NULL
- **ChapterNumber** INT NOT NULL
- **Content** NTEXT
- **IsFree** BIT DEFAULT 0

### UserBookFavorites Table (M:M relationship)
- **UserID** INT NOT NULL FK -> Users.UserID
- **BookID** INT NOT NULL FK -> Books.BookID
- **CreatedAt** DATETIME DEFAULT GETDATE()
- PK (UserID, BookID)

### UserBookDownloads Table
- **DownloadID** INT PK
- **UserID** INT NOT NULL FK -> Users.UserID
- **BookID** INT NOT NULL FK -> Books.BookID
- **DownloadDate** DATETIME DEFAULT GETDATE()

### BookComments Table
- **CommentID** INT PK
- **BookID** INT NOT NULL FK -> Books.BookID
- **UserID** INT NOT NULL FK -> Users.UserID
- **Content** NVARCHAR(1000) NOT NULL
- **Rating** INT
- **CreatedAt** DATETIME DEFAULT GETDATE()
- **Status** NVARCHAR(20) DEFAULT 'Approved'

### BookCategories Table (Tree structure)
- **BookCategoryID** INT PK
- **Name** NVARCHAR(100) NOT NULL
- **Slug** NVARCHAR(100) NOT NULL UNIQUE
- **Description** NVARCHAR(500)
- **ParentCategoryID** INT FK -> BookCategories.BookCategoryID

## Payment System

### UserSubscriptions Table
- **SubscriptionID** INT PK
- **UserID** INT NOT NULL FK -> Users.UserID
- **PlanName** NVARCHAR(50) NOT NULL
- **StartDate** DATETIME NOT NULL
- **EndDate** DATETIME NOT NULL
- **IsActive** BIT DEFAULT 1
- **PaymentStatus** NVARCHAR(20) DEFAULT 'Paid'
- **Amount** DECIMAL(10, 2) NOT NULL
- **PaymentMethod** NVARCHAR(50)

### PaymentTransactions Table
- **TransactionID** INT PK
- **UserID** INT NOT NULL FK -> Users.UserID
- **Amount** DECIMAL(10, 2) NOT NULL
- **Currency** NVARCHAR(3) DEFAULT 'VND'
- **PaymentMethod** NVARCHAR(50) NOT NULL
- **Status** NVARCHAR(20) NOT NULL
- **TransactionDate** DATETIME DEFAULT GETDATE()
- **Description** NVARCHAR(255)
- **ReferenceID** NVARCHAR(100)
- **Type** NVARCHAR(20) NOT NULL
- **RelatedID** INT 