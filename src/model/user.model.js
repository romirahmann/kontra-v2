import db from "@/lib/db.config";
import crypto from "crypto";
// USERS
export const getAllUser = async ({ is_active, search }) => {
  let query = db("users as u")
    .select(
      "u.id",
      "u.username",
      "u.fullName",
      "u.email",
      "u.role_id",
      "u.avatar_url",
      "u.is_active",
      "u.created_at",
      "u.updated_at",
      "r.name as roleName"
    )
    .leftJoin("roles as r", "r.id", "u.role_id");

  if (is_active) {
    query.where("u.is_active", is_active);
  }

  if (search) {
    query.andWhere((qb) => {
      qb.where("u.name", "like", `%${search}%`).orWhere(
        "u.email",
        "like",
        `%${search}%`
      );
    });
  }

  return await query;
};

export const getUserByEmail = async (email) => {
  let query = db("users as u")
    .select(
      "u.id",
      "u.username",
      "u.fullName",
      "u.email",
      "u.password_hash",
      "u.role_id",
      "u.avatar_url",
      "u.is_active",
      "u.created_at",
      "u.updated_at",
      "r.name as roleName"
    )
    .leftJoin("roles as r", "r.id", "u.role_id")
    .where("u.email", email)
    .first();

  return await query;
};

export const getUserById = async (id) => {
  let query = db("users as u")
    .select(
      "u.id",
      "u.username",
      "u.fullName",
      "u.email",
      "u.role_id",
      "u.avatar_url",
      "u.is_active",
      "u.created_at",
      "u.updated_at",
      "r.name as roleName"
    )
    .leftJoin("roles as r", "r.id", "u.role_id")
    .where("u.id", id)
    .first();

  return await query;
};

export const getUserByToken = async (token) => {
  const session = await db("sessions as s")
    .where("s.session_token", token)
    .select("s.expires_at", "s.user_id")
    .first();
  const user = db("users as u")
    .select(
      "u.id",
      "u.username",
      "u.fullName",
      "u.email",
      "u.role_id",
      "u.avatar_url",
      "u.is_active",
      "u.created_at",
      "u.updated_at",
      "r.name as roleName"
    )
    .leftJoin("roles as r", "r.id", "u.role_id")
    .where("u.id", session.user_id)
    .first();

  return user;
};

export const insertUser = async (data) => {
  return db("users").insert(data);
};

export const updateUser = async (id, data) => {
  return db("users").where("id", id).update(data);
};

export const deletedUser = async (id) => {
  return db("users").where("id", id).del();
};

// ROLES
export const getAllRole = async () => {
  const query = db("roles").select("*");
  return await query;
};
export const insertRole = async (data) => {
  return db("roles").insert(data);
};

// SESSION
export const generateSessionToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const insertSession = async ({ user_id, expires_at }) => {
  let session_token = generateSessionToken();

  await db("sessions").insert({
    user_id,
    expires_at,
    session_token,
  });

  return session_token;
};

export const getSessionByToken = async (token) => {
  return db("sessions").where("session_token", token).first();
};

export const isSessionExpired = async (token) => {
  const session = await db("sessions as s")
    .where("s.session_token", token)
    .select("s.expires_at", "s.user_id")
    .first();

  if (!session) return true;

  return new Date(session.expires_at) <= new Date();
};

export const deletedSession = async (token) => {
  await db("sessions as s").where("s.session_token", token).del();
};
