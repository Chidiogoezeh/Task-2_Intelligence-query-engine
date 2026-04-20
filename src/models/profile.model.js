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
    // Removed p.created_at from here
  ];
  return await pool.execute(sql, params);
};

export const findAll = async (filters) => {
  let sql = "SELECT id, name, gender, age, age_group, country_id FROM profiles";
  const params = [];
  const clauses = [];

  if (filters.gender) {
    clauses.push("LOWER(gender) = LOWER(?)");
    params.push(filters.gender);
  }
  if (filters.country_id) {
    clauses.push("country_id = ?");
    params.push(filters.country_id);
  }
  if (filters.age_group) {
    clauses.push("age_group = ?");
    params.push(filters.age_group);
  }

  if (clauses.length > 0) sql += " WHERE " + clauses.join(" AND ");
  const [rows] = await pool.execute(sql, params);
  return rows;
};

export const deleteById = async (id) => {
  const [result] = await pool.execute("DELETE FROM profiles WHERE id = ?", [
    id,
  ]);
  return result.affectedRows > 0;
};
