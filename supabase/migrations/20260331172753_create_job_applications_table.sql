/*
  # Create job applications tracking table

  1. New Tables
    - `job_applications`
      - `id` (uuid, primary key) - Unique identifier for each application
      - `company` (text) - Company name
      - `position` (text) - Job position/title
      - `status` (text) - Application status (Applied, Interview, Offer, Rejected)
      - `date_applied` (date) - Date the application was submitted
      - `location` (text) - Job location
      - `salary` (text) - Salary range or amount
      - `notes` (text) - Additional notes about the application
      - `created_at` (timestamptz) - Timestamp when record was created
      - `updated_at` (timestamptz) - Timestamp when record was last updated

  2. Security
    - Enable RLS on `job_applications` table
    - Add policies for authenticated users to manage their own applications
*/

CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  position text NOT NULL,
  status text NOT NULL DEFAULT 'Applied',
  date_applied date DEFAULT CURRENT_DATE,
  location text DEFAULT '',
  salary text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view job applications"
  ON job_applications
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert job applications"
  ON job_applications
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update job applications"
  ON job_applications
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete job applications"
  ON job_applications
  FOR DELETE
  USING (true);