const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const pool = require("../config/db");

//REGISTER USER
const register = async (req,res) =>{
    try{
        const {name,email,password,role = "user"} = req.body;

        //validation
        if(!name || !email || !password ){
            return res.status(400).json({
                message:"Name , email, password are required",
            });
        }

        //check if user already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if(existingUser.rows.length > 0){
            return res.status(409).json({
                message:"User already exists with this email",
            });
        }
        //hash password 
        const hashedPassword = await bcrypt.hash(password,10);

        //Insert user
        const result = await pool.query(
            `INSERT INTO users(name,email,password,role)
            VALUES($1,$2,$3,$4)
            RETURNING id,name,email,role, created_at`,
            [name,email,hashedPassword,role || "user"]
        );
        const user = result.rows[0];

        res.status(201).json({
            message:"User registered successfully",
            user
        });
    } catch(error){
        console.error("Register error:",error);
        res.status(500).json({
            message:"Internal server error",
        });
    }
}
     
    // =======================
// LOGIN
// =======================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =======================
// GET CURRENT USER
// =======================
const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, created_at
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Get user error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};