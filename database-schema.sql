-- MariaDB Database Schema for SimoneYoga
-- Run this in your IONOS MariaDB database

CREATE DATABASE IF NOT EXISTS dbs15144294 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE dbs15144294;

-- Pages table
CREATE TABLE IF NOT EXISTS pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  meta_description VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO pages (slug, title, content, meta_description) VALUES
('home', 'Willkommen bei SimoneYoga', '<h1>Herz-Kohärenz-App</h1><p>Die App, die deinen Stress in 5 Minuten reduziert.</p>', 'SimoneYoga - Herz-Kohärenz-App für Stressreduktion'),
('about', 'Über uns', '<h1>Über SimoneYoga</h1><p>Wir helfen dir, deinen Stress zu reduzieren und dein Wohlbefinden zu steigern.</p>', 'Über SimoneYoga'),
('retreat', 'Yoga Retreat - Juni 2026', '<h1>Yoga Retreat</h1><p>Unser Retreat im Juni 2026 bietet dir die Möglichkeit, tief zu entspannen und neue Energie zu tanken.</p>', 'Yoga Retreat Juni 2026');

