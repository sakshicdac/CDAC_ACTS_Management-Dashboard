const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000; // Ensure the port matches your React app setup

// Enable CORS
app.use(cors());

// MySQL Database Connection Setup
const pool = mysql.createPool({
  host: '10.182.4.117',
  user: 'ams_clone_user',
  password: 'cdac',
  database: 'ams_clone',
  port: 3306
});

const promisePool = pool.promise();
console.log('Testing database connection...');
promisePool.query('SELECT 1')
  .then(() => {
    console.log('Database connection successful!');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

// API Endpoints for total students - correct op
app.get('/api/total-students', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT COUNT(*) AS total_students FROM pgd_stu_reg_data');
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching total students' });
  }
});

// API endpoint for total courses - correct op
app.get('/api/total-courses', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT COUNT(DISTINCT pgd_trng_id) AS total_courses FROM pgd_stu_reg_data');
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching total courses' });
  }
});

// API for gender distribution - correct op
app.get('/api/gender-distribution', async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT 
        COALESCE(pgd_stu_gender_id, 'Unknown') AS gender,
        COUNT(*) AS count
      FROM pgd_stu_reg_data
      GROUP BY pgd_stu_gender_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching gender distribution' });
  }
});

// API for city distribution 
app.get("/api/city-distribution", async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
     SELECT 
    m.district_name AS city,
    COUNT(p.pgd_form_no) AS student_count
FROM pgd_stu_reg_data AS p
JOIN pgd_stu_reg_addr AS a ON p.pgd_form_no = a.pgd_form_no
JOIN m_addr_district AS m ON a.pgd_stu_distt_id = m.district_id
WHERE a.pgd_stu_addr_type_id = 'PA'
GROUP BY m.district_name
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching city distribution' });
  }
});

// API for course-wise enrollment - correct -op
app.get("/api/course-enrollment", async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT pgd_trng_id AS course_id, COUNT(*) AS enrollment_count 
      FROM pgd_stu_reg_data
      GROUP BY pgd_trng_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).send('Error fetching course-wise enrollment');
  }
});
//---------
app.get('/api/course-enrollment-distribution', async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT 
        pgd_trng_id AS course_id,
        COUNT(*) AS enrollment_count
      FROM pgd_stu_reg_data
      GROUP BY pgd_trng_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).send('Error fetching course enrollment distribution');
  }
});


// API for highest course enrollment - correct op
app.get("/api/course-highest-enrollment", async (req, res) => {
  try {
    const query = `
      SELECT 
        pgd_trng_id AS course,
        COUNT(*) AS count
      FROM pgd_stu_reg_data
      GROUP BY pgd_trng_id
      ORDER BY COUNT(*) DESC
      LIMIT 1;
    `;
    const [rows] = await promisePool.query(query);
    if (rows.length > 0) {
      res.status(200).json(rows[0]); // This will return the course ID and the count
    } else {
      res.status(404).json({ message: "No courses found" });
    }
  } catch (error) {
    console.error("Error fetching course with highest enrollment:", error);
    res.status(500).json({ error: "Failed to fetch course data" });
  }
});

// API for gender breakdown by course and batch - correct output
app.get('/api/gender-breakdown', async (req, res) => {
  const { course_id, batch_id } = req.query;
  let query = `
    SELECT 
      pgd_trng_id AS course_id,
      pgd_batch_id AS batch_id,
      pgd_stu_gender_id AS gender_id,
      COUNT(*) AS student_count
    FROM pgd_stu_reg_data
    GROUP BY pgd_trng_id, pgd_batch_id, pgd_stu_gender_id
  `;

  if (course_id) {
    query += ` WHERE pgd_trng_id = ?`;
  }
  if (batch_id) {
    query += ` AND pgd_batch_id = ?`;
  }

  query += ` ORDER BY course_id, batch_id, gender_id`;

  try {
    const [rows] = await promisePool.query(query, [course_id, batch_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).send('Error fetching gender breakdown');
  }
});

// API for city-wise student distribution - correct op
app.get('/api/city-wise-distribution', async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT 
    m.district_name AS city,
    COUNT(p.pgd_form_no) AS student_count
FROM 
    pgd_stu_reg_data AS p
JOIN 
    pgd_stu_reg_addr AS a ON p.pgd_form_no = a.pgd_form_no
JOIN 
    m_addr_district AS m ON a.pgd_stu_distt_id = m.district_id
WHERE 
    a.pgd_stu_addr_type_id = 'PA'
GROUP BY 
    m.district_name
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).send('Error fetching state-wise student distribution');
  }
});

// API for batch enrollment details - correct op
app.get('/api/batch-enrollment', async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT 
        tb.batch_name, 
        COUNT(ad.pgd_form_no) AS total_students
      FROM pgd_stu_reg_data AS ad
      JOIN training_batch AS tb
      ON ad.pgd_batch_id = tb.batch_id
      GROUP BY tb.batch_name
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).send('Error fetching batch enrollment');
  }
});

// New API for batch selection with total students per batch
app.get('/api/batch-selection', async (req, res) => {
  try {
    const query = `
      SELECT
        tb.batch_name,
        COUNT(ad.pgd_form_no) AS total_students
      FROM
        pgd_stu_reg_data ad
      JOIN
        training_batch tb ON ad.pgd_batch_id = tb.batch_id
      GROUP BY
        tb.batch_name
      ORDER BY
        tb.batch_name;
    `;
    const [rows] = await promisePool.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching batch selection details' });
  }
});

// Endpoint to fetch gender classification data
app.get('/api/gender-classification', async (req, res) => {
  const { centre_id, course_id, batch_id } = req.query;

  const query = `
      SELECT 
          a.pgd_trng_centre_id AS centre_id,
          a.pgd_trng_id AS course_id,
          a.pgd_batch_id AS batch_id,
          CASE 
              WHEN a.pgd_stu_gender_id = 'UR_002' THEN 'Male'
              WHEN a.pgd_stu_gender_id = 'UR_001' THEN 'Female'
              ELSE 'Other'
          END AS gender,
          COUNT(DISTINCT a.pgd_form_no) AS gender_count
      FROM 
          pgd_stu_reg_data a
      WHERE 
          a.pgd_stu_reg_is_valid = 1
          AND (? IS NULL OR ? = 'ALL' OR a.pgd_trng_centre_id = ?)
          AND (? IS NULL OR ? = 'ALL' OR a.pgd_trng_id = ?)
          AND (? IS NULL OR ? = 'ALL' OR a.pgd_batch_id = ?)
      GROUP BY 
          a.pgd_trng_centre_id,
          a.pgd_trng_id,
          a.pgd_batch_id,
          gender
      ORDER BY 
          a.pgd_trng_centre_id,
          a.pgd_trng_id,
          a.pgd_batch_id,
          gender_count DESC;
  `;

  try {
      // Execute the query with dynamic filters
      const [rows] = await pool.execute(query, [
          centre_id, centre_id, centre_id,
          course_id, course_id, course_id,
          batch_id, batch_id, batch_id,
      ]);

      res.json(rows); // Respond with the query result
  } catch (err) {
      console.error('Database query error:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API for city coordinates (unchanged)
app.get('/api/city-coordinates', (req, res) => {
  const cityCoordinates = {
    "Himachal Pradesh": { latitude: 32.0841, longitude: 77.1734 },
    Thiruvananthapuram: { latitude: 8.5241, longitude: 76.9366 },
    Kozhikode: { latitude: 11.2588, longitude: 75.7804 },
    Chandigarh: { latitude: 30.7333, longitude: 76.7794 },
    Hassan: { latitude: 13.0032, longitude: 75.6698 },
    Durg: { latitude: 21.1923, longitude: 81.2848 },
    Bangalore: { latitude: 12.9716, longitude: 77.5946 }
  };
  res.json(cityCoordinates);
});

// Start the Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
