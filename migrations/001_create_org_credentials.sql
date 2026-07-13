-- Create organizations credentials table in Supabase
CREATE TABLE IF NOT EXISTS organization_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id TEXT NOT NULL UNIQUE,
  org_type TEXT NOT NULL, -- 'school', 'hospital', 'police', 'women_org', 'office', 'district'
  org_name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL, -- bcrypt hashed
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Create index for faster lookups
CREATE INDEX idx_org_credentials_username ON organization_credentials(username);
CREATE INDEX idx_org_credentials_org_id ON organization_credentials(org_id);
CREATE INDEX idx_org_credentials_org_type ON organization_credentials(org_type);

-- Create org_sessions table for session/token management
CREATE TABLE IF NOT EXISTS org_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id TEXT NOT NULL,
  username TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX idx_org_sessions_token ON org_sessions(token);
CREATE INDEX idx_org_sessions_org_id ON org_sessions(org_id);
