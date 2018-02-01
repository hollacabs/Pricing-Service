DROP KEYSPACE IF EXISTS historical_data;

CREATE KEYSPACE historical_data
WITH REPLICATION = { 
                    'class' : 'SimpleStrategy', 
                    'replication_factor' : 3 
                   };

USE historical_data;

CREATE TABLE aggregated_data ( 
  time_interval INT,
  day INT,
  city TEXT,
  avg_surge FLOAT,
  avg_drivers INT, 
  PRIMARY KEY ((day, time_interval, city)));

-- copy aggregated_data from '/Users/shubhra/Desktop/HackReactor/Pricing-Service/file1.txt' with delimiter = ',';
-- copy aggregated_data from '/Users/shubhra/Desktop/HackReactor/Pricing-Service/file2.txt' with delimiter = ',';
-- copy aggregated_data from '/Users/shubhra/Desktop/HackReactor/Pricing-Service/file3.txt' with delimiter = ',';
-- copy aggregated_data from '/Users/shubhra/Desktop/HackReactor/Pricing-Service/file4.txt' with delimiter = ',';
-- copy aggregated_data from '/Users/shubhra/Desktop/HackReactor/Pricing-Service/file5.txt' with delimiter = ',';