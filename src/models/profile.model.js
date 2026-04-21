import pool from "../config/database.js";

export const findByName = async (name) => {
  const [rows] = await pool.execute("SELECT * FROM profiles WHERE name = ?", [
    name.toLowerCase(),
  ]);
  return rows[0];
};

export const findById = async (id) => {
  const [rows] = await pool.execute("SELECT * FROM profiles WHERE id = ?", [
    id,
  ]);
  return rows[0];
};

export const save = async (p) => {
  const sql = `INSERT INTO profiles (id, name, gender, gender_probability, sample_size, age, age_group, country_id, country_probability, created_at) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
  
  const params = [
    p.id,
    p.name,
    p.gender,
    p.gender_probability,
    p.sample_size,
    p.age,
    p.age_group,
    p.country_id,
    p.country_probability
  ];
  return await pool.execute(sql, params);
};

export const findAll = async (filters) => {
  const { 
    gender, age_group, country_id, 
    min_age, max_age, min_gender_probability, min_country_probability,
    sort_by = 'created_at', order = 'desc',
    page = 1, limit = 10 
  } = filters;

  // Formatting values to ensure they are numeric
  const pPage = parseInt(page);
  const pLimit = parseInt(limit);
  const pOffset = (pPage - 1) * pLimit;

  let queryBase = " FROM profiles";
  const params = [];
  const clauses = [];

  // Filtering Logic - Ensure exact naming from Requirement #1
  if (gender) { clauses.push("gender = ?"); params.push(gender); }
  if (age_group) { clauses.push("age_group = ?"); params.push(age_group); }
  if (country_id) { clauses.push("country_id = ?"); params.push(country_id); }
  if (min_age) { clauses.push("age >= ?"); params.push(Number(min_age)); }
  if (max_age) { clauses.push("age <= ?"); params.push(Number(max_age)); }
  
  // Specific fix for probability column names
  if (min_gender_probability) { 
    clauses.push("gender_probability >= ?"); 
    params.push(Number(min_gender_probability)); 
  }
  if (min_country_probability) { 
    clauses.push("country_probability >= ?"); 
    params.push(Number(min_country_probability)); 
  }

  if (clauses.length > 0) queryBase += " WHERE " + clauses.join(" AND ");

  const [countResult] = await pool.execute(`SELECT COUNT(*) as total ${queryBase}`, params);
  const total = countResult[0].total;

  const allowedSortFields = ['age', 'created_at', 'gender_probability'];
  const finalSortField = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
  const finalOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  
  // Use .query instead of .execute for LIMIT/OFFSET with variable binding in some MySQL versions
  const finalSql = `SELECT * ${queryBase} ORDER BY ${finalSortField} ${finalOrder} LIMIT ? OFFSET ?`;
  const [rows] = await pool.query(finalSql, [...params, pLimit, pOffset]);
  
  return { data: rows, total };
}