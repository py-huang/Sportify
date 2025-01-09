-- CREATE DATABASE
CREATE DATABASE `SPORTIFY`;

USE SPORTIFY;

-- CREATE TABLE USERS
CREATE TABLE
  `USERS` (
    `USERID` varchar(12) PRIMARY KEY,
    `NAME` varchar(10) NOT NULL,
    `SEX` varchar(2) NOT NULL,
    `AGE` int NOT NULL,
    `IS_NCCU` TINYINT NOT NULL,
    `INTRODUCE` varchar(100)
  );

-- INSERT RECORDS
INSERT INTO
  USERS
VALUES
  (
    'chang_0607',
    '張雨生',
    '男',
    21,
    1,
    '大家好，我是張雨生，平常喜歡打籃球'
  ),
  ('lin_1017', '林依晨', '女', 19, 1, '大家好，我是林依晨，喜歡打羽球'),
  (
    'chen_0307',
    '陳珊妮',
    '女',
    18,
    1,
    '大家好，我是陳珊妮，歡迎找我一起打羽球'
  ),
  ('wu_0905', '吳青峰', '男', 25, 1, NULL),
  ('JC_0628', '周杰倫', '女', 19, 0, '大家好，我是周杰倫，有空來單挑！'),
  ('mai_1228', '張惠妹', '女', 19, 0, NULL),
  ('shaw_0109', '蕭敬騰', '男', 19, 0, '嗨！我是蕭敬騰，喜歡打網球'),
  ('chen_0606', '陳綺貞', '女', 19, 1, '大家好，我是綺貞，喜歡打羽球');

-- CREATE TABLE COURTS
CREATE TABLE
  `COURTS` (
    `COURT_LOC` VARCHAR(10) PRIMARY KEY,
    `COURT_START` TIME NOT NULL,
    `COURT_END` TIME NOT NULL,
    `IS_RESERVED` TINYINT NOT NULL,
    `IS_PAID` TINYINT NOT NULL
  );

INSERT INTO
  COURTS
VALUES
  ('河堤籃球場', '00:00:00', '24:00:00', 0, 0),
  ('河堤棒球場', '00:00:00', '24:00:00', 1, 0),
  ('四維網球場', '6:00:00', '22:00:00', 0, 1),
  ('體育館桌球室', '8:00:00', '22:00:00', 0, 0),
  ('萬興國小羽球場', '18:00:00', '22:00:00', 1, 1),
  ('體育館籃球場', '8:00:00', '22:00:00', 0, 0),
  ('五期排球場', '00:00:00', '22:00:00', 0, 0);

-- CREATE TABLE SPORT
CREATE TABLE
  `SPORT` (
    `SPORT_CAT` VARCHAR(8) PRIMARY KEY,
    `PEOPLE_MIN` INT NOT NULL,
    `PEOPLE_MAX` INT NOT NULL
  );

INSERT INTO
  SPORT
VALUES
  ('籃球(全場)', 10, 20),
  ('籃球(半場)', 2, 20),
  ('羽球', 2, 10),
  ('桌球', 2, 10),
  ('網球', 2, 10),
  ('排球', 12, 18),
  ('足球', 2, 22);

-- CREATE TABLE EVENTLIST
CREATE TABLE
  `EVENT_LIST` (
    `EVENT_ID` INT AUTO_INCREMENT,
    `EVENT_DATE` DATE NOT NULL,
    `EVENT_START_TIME` TIME NOT NULL,
    `EVENT_END_TIME` TIME NOT NULL,
    `EVENT_SPORT` VARCHAR(8) NOT NULL,
    `EVENT_LOCATION` VARCHAR(10) NOT NULL,
    `HOST_ID` VARCHAR(12) NOT NULL,
    PRIMARY KEY (EVENT_ID),
    FOREIGN KEY (HOST_ID) REFERENCES USERS (USERID),
    FOREIGN KEY (EVENT_SPORT) REFERENCES SPORT (SPORT_CAT),
    FOREIGN KEY (EVENT_LOCATION) REFERENCES COURTS (COURT_LOC)
  );

INSERT INTO
  EVENT_LIST
VALUES
  (
    NULL,
    '2024-10-10',
    '17:00:00',
    '19:00:00',
    '籃球(半場)',
    '河堤籃球場',
    'chang_0607'
  ),
  (
    NULL,
    '2024-10-30',
    '14:00:00',
    '16:00:00',
    '網球',
    '四維網球場',
    'shaw_0109'
  ),
  (
    NULL,
    '2024-10-21',
    '18:30:00',
    '21:00:00',
    '籃球(全場)',
    '體育館籃球場',
    'JC_0628'
  ),
  (
    NULL,
    '2024-10-19',
    '20:00:00',
    '22:00:00',
    '羽球',
    '萬興國小羽球場',
    'mai_1228'
  ),
  (
    NULL,
    '2024-10-27',
    '09:00:00',
    '12:00:00',
    '排球',
    '五期排球場',
    'wu_0905'
  );

-- CREATE TABLE SIGNUP
CREATE TABLE
  `SIGNUP_RECORD` (
    `SIGN_ID` INT AUTO_INCREMENT,
    `SIGN_USER` varchar(12) NOT NULL,
    `SIGN_EVENT` INT NOT NULL,
    `SIGN_TIME` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (SIGN_ID),
    FOREIGN KEY (SIGN_USER) REFERENCES USERS (USERID) ON DELETE CASCADE,
    FOREIGN KEY (SIGN_EVENT) REFERENCES EVENT_LIST (EVENT_ID) ON DELETE CASCADE
  );

INSERT INTO
  SIGNUP_RECORD
VALUES
  (NULL, 'wu_0905', 1, '2024-10-03 20:57:00'),
  (NULL, 'JC_0628', 1, '2024-10-06 17:37:00'),
  (NULL, 'JC_0628', 2, '2024-10-29 23:53:00'),
  (NULL, 'shaw_0109', 3, '2024-10-11 20:02:00'),
  (NULL, 'wu_0905', 3, '2024-10-17 13:07:00'),
  (NULL, 'chen_0307', 4, '2024-10-16 20:50:00'),
  (NULL, 'chen_0307', 5, '2024-10-24 12:05:00'),
  (NULL, 'chen_0606', 5, '2024-10-26 19:23:00'),
  (NULL, 'chang_0607', 5, '2024-10-26 19:25:00');

-- CREATE TABLE JOIN_RECORD
CREATE TABLE
  `JOIN_RECORD` (
    `JOIN_USER_ID` VARCHAR(12) NOT NULL,
    `JOIN_EVENT_ID` INT NOT NULL,
    `JOIN_TIME` TIME,
    `LEAVE_TIME` TIME,
    `IS_ABSENCE` TINYINT NOT NULL,
    PRIMARY KEY (`JOIN_USER_ID`, `JOIN_EVENT_ID`),
    FOREIGN KEY (JOIN_USER_ID) REFERENCES USERS (USERID),
    FOREIGN KEY (JOIN_EVENT_ID) REFERENCES EVENT_LIST (EVENT_ID)
  );

INSERT INTO
  JOIN_RECORD
VALUES
  ('chang_0607', 1, '16:55:00', '19:10:00', 0),
  ('wu_0905', 1, '16:58:00', '19:13:00', 0),
  ('JC_0628', 1, NULL, NULL, 1),
  ('JC_0628', 4, '14:05:00', '16:00:00', 0),
  ('shaw_0109', 4, '13:51:00', '15:52:00', 0);

-- CREATE TABLE EVENT_DISCUSS
CREATE TABLE
  `EVENT_DISCUSS` (
    `COMMENT_ID` INT AUTO_INCREMENT,
    `COMMENT_USER_ID` VARCHAR(12) NOT NULL,
    `COMMENT_EVENT_ID` INT NOT NULL,
    `COMMENT` VARCHAR(100) NOT NULL,
    `COMMENT_TIME` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`COMMENT_ID`),
    FOREIGN KEY (COMMENT_USER_ID) REFERENCES USERS (USERID),
    FOREIGN KEY (COMMENT_EVENT_ID) REFERENCES EVENT_LIST (EVENT_ID)
  );

INSERT INTO
  EVENT_DISCUSS
VALUES
  (
    NULL,
    'chang_0607',
    1,
    '有人會帶球嗎？',
    '2024-10-8 19:18:00'
  ),
  (NULL, 'wu_0905', 1, '我可帶', '2024-10-8 21:13:00'),
  (
    NULL,
    'shaw_0109',
    2,
    '有人也是網球新手嗎？',
    '2024-10-25 23:08:00'
  ),
  (
    NULL,
    'JC_0628',
    2,
    '我也剛學不久呵呵',
    '2024-10-29 23:59:00'
  ),
  (
    NULL,
    'JC_0628',
    4,
    'Sorry我可能會遲到一下',
    '2024-10-19 19:37:00'
  ),
  (
    NULL,
    'wu_0905',
    3,
    '有人打完要吃個消夜嗎？',
    '2024-10-17 13:09:00'
  ),
  (
    NULL,
    'shaw_0109',
    3,
    '哪次不吃',
    '2024-10-19 22:03:00'
  ),
  (
    NULL,
    'chang_0607',
    5,
    '有人有多的球拍可以借一下嗎？',
    '2024-10-26 19:28:00'
  ),
  (
    NULL,
    'chen_0307',
    5,
    '新手請多多指教',
    '2024-10-24 12:10:00'
  );