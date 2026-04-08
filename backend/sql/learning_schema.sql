-- learning_categories
CREATE TABLE IF NOT EXISTS learning_categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  module_name VARCHAR(50) NOT NULL,
  category_name VARCHAR(50) NOT NULL,
  icon VARCHAR(10) DEFAULT '',
  sort_order INT DEFAULT 0,
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_module_category (module_name, category_name)
);

-- learning_contents
CREATE TABLE IF NOT EXISTS learning_contents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  module_name VARCHAR(50) NOT NULL,
  category_name VARCHAR(50) NOT NULL,
  title VARCHAR(120) NOT NULL,
  summary VARCHAR(255) DEFAULT '',
  content TEXT NOT NULL,
  media_type VARCHAR(20) DEFAULT 'text',
  media_url VARCHAR(255) DEFAULT '',
  duration_minutes INT DEFAULT 0,
  difficulty VARCHAR(20) DEFAULT '基础',
  publish_date DATE NULL,
  is_recommended TINYINT DEFAULT 0,
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_module_category (module_name, category_name),
  KEY idx_publish_date (publish_date)
);

-- learning_records
CREATE TABLE IF NOT EXISTS learning_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  content_id BIGINT NOT NULL,
  progress INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'not_started',
  is_read TINYINT DEFAULT 0,
  is_favorite TINYINT DEFAULT 0,
  last_viewed_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_content (user_id, content_id),
  KEY idx_user_status (user_id, status),
  CONSTRAINT fk_learning_record_content FOREIGN KEY (content_id) REFERENCES learning_contents(id)
);