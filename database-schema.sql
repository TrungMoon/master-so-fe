-- Database: PhongThuyDB

-- Users Table - Store user information
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL, -- Hashed password
    FullName NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(20),
    DateOfBirth DATE NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    LastLoginAt DATETIME,
    Status NVARCHAR(20) DEFAULT 'Active' -- Active, Inactive, Suspended
);

-- Roles Table - Store user roles for permission management
CREATE TABLE Roles (
    RoleID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE, -- Admin, User, Editor, etc.
    Description NVARCHAR(255)
);

-- UserRoles Table - Many-to-many relationship between Users and Roles
CREATE TABLE UserRoles (
    UserID INT NOT NULL,
    RoleID INT NOT NULL,
    AssignedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (UserID, RoleID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID) ON DELETE CASCADE
);

-- Permissions Table - Store individual permissions
CREATE TABLE Permissions (
    PermissionID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE, -- create_story, approve_story, delete_story, etc.
    Description NVARCHAR(255)
);

-- RolePermissions Table - Many-to-many relationship between Roles and Permissions
CREATE TABLE RolePermissions (
    RoleID INT NOT NULL,
    PermissionID INT NOT NULL,
    PRIMARY KEY (RoleID, PermissionID),
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID) ON DELETE CASCADE,
    FOREIGN KEY (PermissionID) REFERENCES Permissions(PermissionID) ON DELETE CASCADE
);

-- Categories Table - Store article categories
CREATE TABLE Categories (
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Slug NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(500),
    ParentCategoryID INT,
    FOREIGN KEY (ParentCategoryID) REFERENCES Categories(CategoryID)
);

-- Articles Table - Store article content
CREATE TABLE Articles (
    ArticleID INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Slug NVARCHAR(255) NOT NULL UNIQUE,
    Content NTEXT NOT NULL,
    Summary NVARCHAR(500),
    ImageURL NVARCHAR(255),
    CategoryID INT NOT NULL,
    AuthorID INT NOT NULL,
    ViewCount INT DEFAULT 0,
    IsPublished BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    PublishedAt DATETIME,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID),
    FOREIGN KEY (AuthorID) REFERENCES Users(UserID)
);

-- Stories Table - Store user-submitted stories with moderation status
CREATE TABLE Stories (
    StoryID INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Slug NVARCHAR(255) NOT NULL UNIQUE,
    Content NTEXT NOT NULL,
    Summary NVARCHAR(500),
    ImageURL NVARCHAR(255),
    AuthorID INT NOT NULL,
    ViewCount INT DEFAULT 0,
    Status NVARCHAR(20) DEFAULT 'Pending', -- Pending, Approved, Rejected
    RejectionReason NVARCHAR(500), -- Reason if rejected by admin
    ModeratedBy INT, -- Admin who approved/rejected
    ModeratedAt DATETIME, -- When moderation action was taken
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    PublishedAt DATETIME,
    FOREIGN KEY (AuthorID) REFERENCES Users(UserID),
    FOREIGN KEY (ModeratedBy) REFERENCES Users(UserID)
);

-- StoryTags Table - Many-to-many relationship between Stories and Tags
CREATE TABLE StoryTags (
    StoryID INT NOT NULL,
    TagID INT NOT NULL,
    PRIMARY KEY (StoryID, TagID),
    FOREIGN KEY (StoryID) REFERENCES Stories(StoryID) ON DELETE CASCADE,
    FOREIGN KEY (TagID) REFERENCES Tags(TagID) ON DELETE CASCADE
);

-- StoryComments Table - Store user comments on stories
CREATE TABLE StoryComments (
    CommentID INT IDENTITY(1,1) PRIMARY KEY,
    StoryID INT NOT NULL,
    UserID INT NOT NULL,
    Content NVARCHAR(1000) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(20) DEFAULT 'Approved', -- Approved, Pending, Rejected
    FOREIGN KEY (StoryID) REFERENCES Stories(StoryID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- ModeratorActions Table - Audit log for moderation actions
CREATE TABLE ModeratorActions (
    ActionID INT IDENTITY(1,1) PRIMARY KEY,
    ModeratorID INT NOT NULL,
    ActionType NVARCHAR(50) NOT NULL, -- approve_story, reject_story, delete_story, etc.
    ContentType NVARCHAR(50) NOT NULL, -- story, comment, etc.
    ContentID INT NOT NULL, -- ID of the affected content
    Reason NVARCHAR(500),
    ActionDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ModeratorID) REFERENCES Users(UserID)
);

-- Tags Table - Store tags for articles
CREATE TABLE Tags (
    TagID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Slug NVARCHAR(50) NOT NULL UNIQUE
);

-- ArticleTags Table - Many-to-many relationship between Articles and Tags
CREATE TABLE ArticleTags (
    ArticleID INT NOT NULL,
    TagID INT NOT NULL,
    PRIMARY KEY (ArticleID, TagID),
    FOREIGN KEY (ArticleID) REFERENCES Articles(ArticleID) ON DELETE CASCADE,
    FOREIGN KEY (TagID) REFERENCES Tags(TagID) ON DELETE CASCADE
);

-- Comments Table - Store user comments on articles
CREATE TABLE Comments (
    CommentID INT IDENTITY(1,1) PRIMARY KEY,
    ArticleID INT NOT NULL,
    UserID INT NOT NULL,
    Content NVARCHAR(1000) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(20) DEFAULT 'Approved', -- Approved, Pending, Rejected
    FOREIGN KEY (ArticleID) REFERENCES Articles(ArticleID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Proverbs Table - Store proverbs and sayings related to feng shui and physiognomy
CREATE TABLE Proverbs (
    ProverbID INT IDENTITY(1,1) PRIMARY KEY,
    Content NVARCHAR(500) NOT NULL,
    Meaning NVARCHAR(1000),
    Category NVARCHAR(50), -- e.g., 'PhongThuy', 'NhanTuong', 'TuVi'
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- CalculationResults Table - Store user's calculation history
CREATE TABLE CalculationResults (
    ResultID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    CalculationType NVARCHAR(50) NOT NULL, -- e.g., 'CanXuong', 'NgayTot', 'TuVi'
    InputData NVARCHAR(MAX) NOT NULL, -- JSON format of input data
    ResultData NVARCHAR(MAX) NOT NULL, -- JSON format of result data
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- UserFavorites Table - Store user's favorite articles
CREATE TABLE UserFavorites (
    UserID INT NOT NULL,
    ArticleID INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (UserID, ArticleID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ArticleID) REFERENCES Articles(ArticleID) ON DELETE CASCADE
);

-- UserStoryFavorites Table - Store user's favorite stories
CREATE TABLE UserStoryFavorites (
    UserID INT NOT NULL,
    StoryID INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (UserID, StoryID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (StoryID) REFERENCES Stories(StoryID) ON DELETE CASCADE
);

-- Notifications Table - Store notifications for users
CREATE TABLE Notifications (
    NotificationID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    Title NVARCHAR(100) NOT NULL,
    Message NVARCHAR(500) NOT NULL,
    Type NVARCHAR(50) NOT NULL, -- story_approved, story_rejected, etc.
    RelatedID INT, -- ID of related content
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- UserProfiles Table - Store additional user profile information
CREATE TABLE UserProfiles (
    ProfileID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL UNIQUE,
    Avatar NVARCHAR(255),
    Bio NVARCHAR(500),
    Location NVARCHAR(100),
    Gender NVARCHAR(20),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Insert initial category data
INSERT INTO Categories (Name, Slug, Description) VALUES 
('Phong Thủy', 'phong-thuy', N'Kiến thức về phong thủy và cách ứng dụng vào cuộc sống'),
('Nhân Tướng', 'nhan-tuong', N'Kiến thức về nhân tướng học và cách đọc tướng người'),
('Tử Vi', 'tu-vi', N'Kiến thức về tử vi, chiêm tinh và dự đoán vận mệnh'),
('Chuyện Linh Tinh', 'chuyen-linh-tinh', N'Những câu chuyện, trải nghiệm về phong thủy, tướng số từ cộng đồng');

-- Insert initial roles
INSERT INTO Roles (Name, Description) VALUES
('Admin', N'Quản trị viên có toàn quyền trên hệ thống'),
('User', N'Người dùng thông thường'),
('Editor', N'Biên tập viên có thể viết và duyệt bài');

-- Insert initial permissions
INSERT INTO Permissions (Name, Description) VALUES
('create_story', N'Tạo bài viết mới'),
('edit_own_story', N'Sửa bài viết của chính mình'),
('delete_own_story', N'Xóa bài viết của chính mình'),
('approve_story', N'Duyệt bài viết'),
('reject_story', N'Từ chối bài viết'),
('delete_any_story', N'Xóa bất kỳ bài viết nào'),
('view_pending_stories', N'Xem danh sách bài viết chờ duyệt'),
('comment_story', N'Bình luận trên bài viết'),
('moderate_comments', N'Kiểm duyệt bình luận');

-- Assign permissions to roles
INSERT INTO RolePermissions (RoleID, PermissionID) VALUES
-- Admin permissions (all)
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9),
-- User permissions
(2, 1), (2, 2), (2, 3), (2, 8),
-- Editor permissions
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 7), (3, 8), (3, 9);

-- Insert initial tag data
INSERT INTO Tags (Name, Slug) VALUES 
('Cân Xương Tính Lượng', 'can-xuong-tinh-luong'),
('Nhà Ở', 'nha-o'),
('Văn Phòng', 'van-phong'),
('Tướng Mặt', 'tuong-mat'),
('Tướng Tay', 'tuong-tay'),
('Tử Vi Hàng Ngày', 'tu-vi-hang-ngay'),
('Hôn Nhân', 'hon-nhan'),
('Sự Nghiệp', 'su-nghiep'),
('Trải Nghiệm', 'trai-nghiem'),
('Chia Sẻ', 'chia-se');

-- Insert initial proverb data
INSERT INTO Proverbs (Content, Meaning, Category) VALUES 
(N'Tướng tùy tâm sinh, tâm tùy tướng diệt', N'Tướng mạo thay đổi theo tâm tính, khi tâm thay đổi, tướng mạo cũng sẽ thay đổi theo', 'NhanTuong'),
(N'Nhất động bất như nhất tĩnh', N'Một phần động không bằng một phần tĩnh (trong phong thủy)', 'PhongThuy'),
(N'Nhân phải sinh tờ địa lý, địa lý sinh tờ nhân phải', N'Con người phải sinh ra từ đất đai có khí tốt, đất đai tốt sinh ra con người tốt', 'PhongThuy'); 