# SPORTIFY 資料庫系統

## 系統架構
系統由以下主要部分組成：


- **資料庫**: 使用 MySQL 存儲所有數據

## 資料庫架構
資料庫包含以下主要資料表：

1. **USERS**: 紀錄使用者信息
2. **COURTS**: 紀錄場地信息
3. **SPORT**: 紀錄運動種類信息
4. **EVENT_LIST**: 紀錄揪團活動信息
5. **SIGNUP_RECORD**: 紀錄報名紀錄
6. **JOIN_RECORD**: 紀錄參與紀錄
7. **EVENT_DISCUSS**: 紀錄揪團討論區留言

### 資料表詳情

#### USERS
| 欄位名稱      | 類型       | 描述                  |
|---------------|------------|-----------------------|
| USERID        | varchar(12)| 使用者ID              |
| NAME          | varchar(10)| 姓名                  |
| SEX           | varchar(2) | 性別                  |
| AGE           | int        | 年齡                  |
| IS_NCCU       | TINYINT | 是否為政大學生        |
| INTRODUCE     | varchar(100)| 自我介紹              |

#### COURTS
| 欄位名稱      | 類型       | 描述                  |
|---------------|------------|-----------------------|
| COURT_LOC     | VARCHAR(10)| 場地位置              |
| COURT_START   | TIME       | 開始時間              |
| COURT_END     | TIME       | 結束時間              |
| IS_RESERVED    | TINYINT | 是否已預約            |
| IS_PAID       | TINYINT | 是否已付款            |

#### SPORT
| 欄位名稱      | 類型       | 描述                  |
|---------------|------------|-----------------------|
| SPORT_CAT     | VARCHAR(8) | 運動種類              |
| PEOPLE_MIN    | INT        | 最少人數              |
| PEOPLE_MAX    | INT        | 最多人數              |

#### EVENT_LIST
| 欄位名稱      | 類型       | 描述                  |
|---------------|------------|-----------------------|
| EVENT_ID      | INT        | 活動ID                |
| EVENT_DATE    | DATE       | 活動日期              |
| EVENT_START_TIME  | TIME   | 活動開始時間          |
| EVENT_END_TIME    | TIME   | 活動結束時間          |
| EVENT_SPORT   | VARCHAR(8)  | 運動種類              |
| EVENT_LOCATION  | VARCHAR(10)| 場地位置              |
| HOST_ID       | VARCHAR(12)| 主辦者ID              |

#### SIGNUP_RECORD
| 欄位名稱      | 類型       | 描述                  |
|---------------|------------|-----------------------|
| SIGN_ID       | INT        | 報名ID                |
| SIGN_USER     | varchar(12)| 使用者ID              |
| SIGN_EVENT    | INT        | 活動ID                |
| SIGN_TIME     | TIMESTAMP  | 報名時間              |

#### JOIN_RECORD
| 欄位名稱      | 類型       | 描述                  |
|---------------|------------|-----------------------|
| JOIN_USER_ID  | VARCHAR(12)| 使用者ID              |
| JOIN_EVENT_ID  | INT       | 活動ID                |
| JOIN_TIME     | TIME       | 加入時間              |
| LEAVE_TIME    | TIME       | 離開時間              |
| IS_ABSENCE    | TINYINT  | 是否缺席             |


#### EVENT_DISCUSS
| 欄位名稱          | 類型         | 描述                  |
|------------------|--------------|-----------------------|
| COMMENT_ID       | INT          | 留言ID                |
| COMMENT_USER_ID  | VARCHAR(12)  | 使用者ID              |
| COMMENT_EVENT    | INT          | 揪團活動ID            |
| COMMENT          | VARCHAR(100) | 留言內容              |
| COMMENT_TIME     | TIMESTAMP    | 留言時間              |